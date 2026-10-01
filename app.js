// ============================================
// Wide City Smart Digital Homes - Main App
// HCI: Visibility of system status, feedback,
// error prevention, consistency, user control
// ============================================

// Cart state (persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('wcsdh_cart') || '[]');
let currentFilter = 'all';
let currentSearch = '';

// DOM references
const productsGrid = document.getElementById('products-grid');
const resultsInfo = document.getElementById('results-info');
const cartCountEl = document.getElementById('cart-count');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const toastEl = document.getElementById('toast');
const checkoutModal = document.getElementById('checkout-modal');
const paymentStatusEl = document.getElementById('payment-status');

// ---------- Utility ----------
function saveCart() {
  localStorage.setItem('wcsdh_cart', JSON.stringify(cart));
  updateCartUI();
}

function showToast(message, type = 'default') {
  toastEl.textContent = message;
  toastEl.className = 'toast show' + (type === 'success' ? ' success' : '');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2800);
}

function formatPrice(price) {
  return `KSh ${Number(price).toLocaleString('en-KE')}`;
}

// ---------- Render Products ----------
function renderProducts() {
  let list = products;

  if (currentSearch) {
    list = searchProducts(currentSearch);
  } else if (currentFilter !== 'all') {
    list = getProductsByCategory(currentFilter);
  }

  resultsInfo.textContent = list.length === 0
    ? 'No products found. Try a different search or category.'
    : `Showing ${list.length} product${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search or filter.</p>
      </div>`;
    return;
  }

  productsGrid.innerHTML = list.map(p => {
    const categoryLabel = {
      'home-kitchen': 'Home & Kitchen',
      'computer': 'Computer Accessories',
      'electronics': 'Electronics'
    }[p.category] || p.category;

    return `
      <article class="product-card" data-id="${p.id}">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'">
        <div class="product-body">
          <div class="product-category">${categoryLabel}</div>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="add-to-cart-btn" onclick="addToCart(${p.id})" ${p.stock < 1 ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i>
              ${p.stock < 1 ? 'Out of stock' : 'Add'}
            </button>
          </div>
        </div>
      </article>`;
  }).join('');
}

// ---------- Cart Operations ----------
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock < 1) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty >= product.stock) {
      showToast('Maximum available stock reached');
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart();
  showToast(`${product.name} added to cart`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removed from cart');
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  const product = products.find(p => p.id === productId);
  item.qty += delta;
  if (item.qty < 1) {
    removeFromCart(productId);
    return;
  }
  if (item.qty > product.stock) {
    item.qty = product.stock;
    showToast('Maximum stock reached');
  }
  saveCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function updateCartUI() {
  // Badge
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = totalItems;
  cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';

  // Sidebar content
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart" style="font-size:2.5rem;opacity:0.4;margin-bottom:0.75rem;"></i>
        <p>Your cart is empty</p>
        <p style="font-size:0.85rem;margin-top:0.4rem;">Browse products and add items you love.</p>
      </div>`;
    checkoutBtn.disabled = true;
  } else {
    cartItemsEl.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'">
          <div class="cart-item-details">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${formatPrice(p.price)} each</div>
            <div class="cart-item-actions">
              <button class="qty-btn" onclick="updateQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" onclick="updateQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
              <button class="remove-item" onclick="removeFromCart(${p.id})">Remove</button>
            </div>
          </div>
        </div>`;
    }).join('');
    checkoutBtn.disabled = false;
  }

  cartTotalEl.textContent = formatPrice(getCartTotal());
}

// ---------- Cart Sidebar ----------
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ---------- Checkout & M-Pesa STK Push ----------
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();

  // Populate order summary
  const summaryEl = document.getElementById('order-summary-list');
  summaryEl.innerHTML = cart.map(item => {
    const p = products.find(prod => prod.id === item.id);
    return `<div class="summary-row"><span>${p.name} × ${item.qty}</span><span>${formatPrice(p.price * item.qty)}</span></div>`;
  }).join('') + `
    <div class="summary-row summary-total">
      <span>Total</span>
      <span>${formatPrice(getCartTotal())}</span>
    </div>`;

  // Reset form & status
  document.getElementById('phone-input').value = '';
  document.getElementById('checkout-form').style.display = 'block';
  paymentStatusEl.style.display = 'none';
  paymentStatusEl.className = 'payment-status';

  checkoutModal.classList.add('open');
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
}

async function initiateSTKPush(event) {
  event.preventDefault();

  const phoneInput = document.getElementById('phone-input');
  let phone = phoneInput.value.trim().replace(/\s+/g, '');

  // Basic validation (Kenyan format)
  if (!/^(0|254|\+254)?[17]\d{8}$/.test(phone)) {
    showToast('Please enter a valid Kenyan phone number (e.g. 0712345678)');
    phoneInput.focus();
    return;
  }

  // Normalize to 254...
  if (phone.startsWith('0')) phone = '254' + phone.slice(1);
  if (phone.startsWith('+')) phone = phone.slice(1);

  const amount = getCartTotal();
  const payBtn = document.getElementById('pay-btn');
  const originalBtnHtml = payBtn.innerHTML;

  payBtn.disabled = true;
  payBtn.innerHTML = '<span class="spinner"></span> Sending STK Push...';

  // Try real backend first, fall back to demo mode
  const backendUrl = window.MPESA_BACKEND_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${backendUrl}/api/stkpush`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        amount,
        accountReference: 'WCSDH-' + Date.now(),
        description: 'Wide City Smart Digital Homes Order'
      })
    });

    if (!res.ok) throw new Error('Backend not available');

    const data = await res.json();

    // Show success / pending UI
    document.getElementById('checkout-form').style.display = 'none';
    paymentStatusEl.style.display = 'block';
    paymentStatusEl.className = 'payment-status pending';
    paymentStatusEl.innerHTML = `
      <div class="icon"><i class="fas fa-mobile-alt"></i></div>
      <h3>Check your phone</h3>
      <p>An M-Pesa prompt has been sent to <strong>${phone}</strong>.</p>
      <p style="margin-top:0.75rem;">Enter your M-Pesa PIN to complete the payment of <strong>${formatPrice(amount)}</strong>.</p>
      <p style="margin-top:1rem;font-size:0.85rem;color:#6c757d;">CheckoutRequestID: ${data.CheckoutRequestID || 'N/A'}</p>
      <button class="pay-btn" style="margin-top:1.5rem;background:var(--primary);" onclick="finishOrder()">I have paid</button>
    `;
  } catch (err) {
    // DEMO MODE – simulates STK Push when backend is not running
    console.warn('Backend unreachable – running in demo mode:', err.message);

    document.getElementById('checkout-form').style.display = 'none';
    paymentStatusEl.style.display = 'block';
    paymentStatusEl.className = 'payment-status pending';
    paymentStatusEl.innerHTML = `
      <div class="icon"><i class="fas fa-mobile-alt"></i></div>
      <h3>Demo Mode – STK Push Simulated</h3>
      <p>A payment request would be sent to <strong>${phone}</strong> for <strong>${formatPrice(amount)}</strong>.</p>
      <p style="margin-top:0.75rem;font-size:0.9rem;">To enable real M-Pesa payments, start the backend server and add your Daraja credentials. See README.md.</p>
      <div style="margin-top:1.5rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
        <button class="pay-btn" style="width:auto;padding:0.7rem 1.5rem;" onclick="simulateSuccess()">Simulate Success</button>
        <button class="pay-btn" style="width:auto;padding:0.7rem 1.5rem;background:var(--medium-gray);" onclick="closeCheckout()">Cancel</button>
      </div>
    `;
  } finally {
    payBtn.disabled = false;
    payBtn.innerHTML = originalBtnHtml;
  }
}

function simulateSuccess() {
  paymentStatusEl.className = 'payment-status success';
  paymentStatusEl.innerHTML = `
    <div class="icon"><i class="fas fa-check-circle"></i></div>
    <h3>Payment Successful!</h3>
    <p>Thank you for shopping with Wide City Smart Digital Homes.</p>
    <p style="margin-top:0.5rem;">Your order is being processed.</p>
    <button class="pay-btn" style="margin-top:1.5rem;" onclick="finishOrder()">Continue Shopping</button>
  `;
}

function finishOrder() {
  cart = [];
  saveCart();
  closeCheckout();
  showToast('Order completed! Thank you for your purchase.', 'success');
}

// ---------- Event Listeners ----------
document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', openCheckout);
document.getElementById('close-checkout').addEventListener('click', closeCheckout);
document.getElementById('checkout-form').addEventListener('submit', initiateSTKPush);

// Search with debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = e.target.value;
    currentFilter = 'all';
    filterBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    renderProducts();
  }, 300);
});

// Category filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    currentSearch = '';
    searchInput.value = '';
    renderProducts();
  });
});

// Close modal on overlay click
checkoutModal.addEventListener('click', (e) => {
  if (e.target === checkoutModal) closeCheckout();
});

// Keyboard: Escape closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
    closeCheckout();
  }
});

// ---------- Init ----------
renderProducts();
updateCartUI();
