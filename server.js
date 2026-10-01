/**
 * Wide City Smart Digital Homes – M-Pesa STK Push Backend
 * Uses Safaricom Daraja API (Lipa Na M-Pesa Online)
 *
 * Setup:
 * 1. npm install
 * 2. Copy .env.example → .env and fill credentials
 * 3. npm start
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const {
  MPESA_ENV = 'sandbox',
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  PORT = 3000
} = process.env;

const BASE_URL = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// ---------- Helpers ----------
function getTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function generatePassword(timestamp) {
  const str = MPESA_SHORTCODE + MPESA_PASSKEY + timestamp;
  return Buffer.from(str).toString('base64');
}

function formatPhone(phone) {
  let p = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
  if (p.startsWith('0')) p = '254' + p.slice(1);
  if (!p.startsWith('254')) p = '254' + p;
  return p;
}

// ---------- Auth Token (cached) ----------
let tokenCache = { token: null, expires: 0 };

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

  const { data } = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  tokenCache = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000 // refresh 1 min early
  };

  return tokenCache.token;
}

// ---------- STK Push Endpoint ----------
app.post('/api/stkpush', async (req, res) => {
  try {
    const { phone, amount, accountReference = 'WCSDH-ORDER', description = 'Payment' } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'phone and amount are required' });
    }

    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
      return res.status(500).json({
        error: 'Server misconfigured. Missing Daraja credentials in .env'
      });
    }

    const formattedPhone = formatPhone(phone);
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);
    const token = await getAccessToken();

    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(Number(amount)),
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL || 'https://example.com/api/callback',
      AccountReference: String(accountReference).slice(0, 12),
      TransactionDesc: String(description).slice(0, 13)
    };

    const { data } = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('STK Push response:', data);
    res.json(data);
  } catch (err) {
    console.error('STK Push error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to initiate STK Push',
      details: err.response?.data || err.message
    });
  }
});

// ---------- Callback (Safaricom posts here after user pays) ----------
app.post('/api/callback', (req, res) => {
  console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

  // Always acknowledge so Safaricom stops retrying
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  // TODO: Update order status in your database using
  // req.body.Body.stkCallback.CheckoutRequestID and ResultCode
});

// ---------- Health check ----------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: MPESA_ENV,
    shortcode: MPESA_SHORTCODE ? 'configured' : 'missing'
  });
});

// ---------- Serve frontend in production (optional) ----------
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Wide City Smart Digital Homes backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${MPESA_ENV}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
