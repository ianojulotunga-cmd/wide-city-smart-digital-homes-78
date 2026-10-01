# Wide City Smart Digital Homes

**E-Commerce platform for Home & Kitchen Appliances, Computer Accessories and Electronics.**  
Pay securely with **M-Pesa STK Push** (Safaricom Daraja API).

Designed with **Human-Centered Design** and **HCI principles**:
- Visibility of system status (cart badge, toasts, payment feedback)
- Consistency & standards (clear navigation, familiar e-commerce patterns)
- Error prevention (phone validation, stock checks)
- Recognition rather than recall (search + category filters)
- Aesthetic and minimalist design (predominantly white with soft blue/purple accents)
- Flexibility & efficiency of use (responsive, keyboard support)
- Help users recover from errors (clear empty states, cancel options)

---

## Quick Start (Frontend only – Demo mode)

The website works fully offline for browsing, searching, cart and simulated checkout.

1. Download / clone this repository
2. Open `index.html` in any modern browser  
   **or** serve it with a simple static server:

```bash
# Using Python
python -m http.server 8080

# Using Node (npx)
npx serve .
```

3. Visit `http://localhost:8080`

You can search products, filter by category, add to cart and go through the checkout flow.  
When the backend is not running it automatically falls back to **Demo Mode**.

---

## Full Setup with Real M-Pesa STK Push

### 1. Get Daraja API credentials (free)

1. Go to [https://developer.safaricom.co.ke/](https://developer.safaricom.co.ke/)
2. Create an account and a new App
3. Enable **Lipa Na M-Pesa Online** (STK Push)
4. Note your:
   - Consumer Key
   - Consumer Secret
   - Passkey (Lipa Na M-Pesa Online Passkey)
   - Shortcode (Sandbox uses `174379`)

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env and paste your credentials
npm install
npm start
```

Backend runs on `http://localhost:3000`.

### 3. Point the frontend to the backend (optional)

In production you can set a global variable before the scripts load, or host both on the same domain (the Express server already serves the static files).

For local testing the frontend tries `http://localhost:3000` by default.

### 4. Expose callback URL for testing

Safaricom needs a publicly reachable URL for payment callbacks.

```bash
# Install ngrok (or use Cloudflare Tunnel)
ngrok http 3000
```

Copy the HTTPS URL and set it in `.env`:

```
MPESA_CALLBACK_URL=https://xxxx.ngrok-free.app/api/callback
```

Restart the backend.

### 5. Test payment

- Use a real Safaricom number registered for M-Pesa
- In Sandbox you can also use the test numbers provided in the Daraja portal
- Amounts are whole Kenyan Shillings (no decimals)

---

## Project Structure

```
wide-city-smart-digital-homes/
├── index.html              # Main page
├── css/
│   └── styles.css          # Clean white + accent design
├── js/
│   ├── products.js         # Product catalog + helpers
│   └── app.js              # Cart, search, checkout, STK logic
├── backend/
│   ├── package.json
│   ├── server.js           # Express + Daraja STK Push
│   └── .env.example        # Credentials template
├── .gitignore
└── README.md
```

---

## Features

| Feature                    | Status |
|---------------------------|--------|
| Product browsing          | ✅     |
| Category filters          | ✅     |
| Real-time search          | ✅     |
| Add to cart / quantity    | ✅     |
| Persistent cart (localStorage) | ✅ |
| Responsive design         | ✅     |
| M-Pesa STK Push           | ✅ (with backend) |
| Demo mode fallback        | ✅     |
| Accessibility (ARIA, focus, keyboard) | ✅ |

---

## Hosting / Deploy to GitHub + Live Link

### Option A – GitHub Pages (frontend only)

1. Create a new repository on GitHub
2. Push this folder
3. Settings → Pages → Deploy from `main` branch / root
4. Your site will be live at `https://yourusername.github.io/repo-name/`

### Option B – Full stack (recommended for real payments)

| Service     | Use for          | Notes                              |
|-------------|------------------|------------------------------------|
| Vercel / Netlify | Frontend     | Drag & drop or connect GitHub      |
| Railway / Render / Fly.io | Backend | Deploy the `backend/` folder       |
| Or single Node host | Both        | The Express server already serves static files |

Remember to set environment variables on your hosting platform and update `MPESA_CALLBACK_URL` to the public backend URL.

---

## Color Palette (HCI Aesthetic)

- Background: Clean white / off-white (`#ffffff`, `#f8f9fa`)
- Primary accent: Soft blue (`#0d6efd`)
- Secondary accent: Soft purple (`#6610f2`)
- Success / M-Pesa: Green (`#198754`)
- Text: Near-black (`#212529`)

---

## Product Categories

- **Home & Kitchen**: Microwave, Blender, Kettle, Coffee Maker, Air Fryer, Refrigerator
- **Computer Accessories**: Mouse, Keyboard, USB Hub, Laptop Stand, SSD, Webcam, Laptop
- **Electronics**: Headphones, Smart TV, Bluetooth Speaker, Earbuds, Power Bank, Smart Watch

Images are sourced from Unsplash (free commercial use under the Unsplash License).

---

## License

This project is provided as a starter template. Feel free to use and modify for your own store.

**© 2025 Wide City Smart Digital Homes**
