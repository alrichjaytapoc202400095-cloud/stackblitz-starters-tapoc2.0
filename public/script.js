const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const cartView = document.getElementById('cart-view');
const trackingView = document.getElementById('tracking-view');
const aboutView = document.getElementById('about-view');
const contactView = document.getElementById('contact-view');
const loginForm = document.getElementById('loginForm');

// Cart storage
let cart = [];

// Handle Login Submit
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const inputs = loginForm.querySelectorAll('input');
    if (inputs[0].value && inputs[1].value) {
        loginView.classList.remove('active-view');
        dashboardView.classList.add('active-view');
    }
});

// Show Dashboard
function showDashboard() {
    cartView.classList.remove('active-view');
    trackingView.classList.remove('active-view');
    aboutView.classList.remove('active-view');
    contactView.classList.remove('active-view');
    dashboardView.classList.add('active-view');
}

// Show Login
function showLogin() {
    dashboardView.classList.remove('active-view');
    cartView.classList.remove('active-view');
    trackingView.classList.remove('active-view');
    aboutView.classList.remove('active-view');
    contactView.classList.remove('active-view');
    loginView.classList.add('active-view');
    loginForm.reset();
    cart = [];
    updateCartCount();
}

// Show Cart
function showCart() {
    dashboardView.classList.remove('active-view');
    aboutView.classList.remove('active-view');
    contactView.classList.remove('active-view');
    cartView.classList.add('active-view');
    renderCart();
}

// Show Tracking
function showTracking() {
    cartView.classList.remove('active-view');
    trackingView.classList.add('active-view');
    initializeTracking();
}

// Show About
function showAbout() {
    dashboardView.classList.remove('active-view');
    cartView.classList.remove('active-view');
    trackingView.classList.remove('active-view');
    contactView.classList.remove('active-view');
    aboutView.classList.add('active-view');
}

// Show Contact
function showContact() {
    dashboardView.classList.remove('active-view');
    cartView.classList.remove('active-view');
    trackingView.classList.remove('active-view');
    aboutView.classList.remove('active-view');
    contactView.classList.add('active-view');
}

// Add to Cart
function addToCart(event) {
    event.preventDefault();
    const card = event.target.closest('.food-card');
    const name = card.querySelector('.food-name').textContent;
    const priceText = card.querySelector('.food-price').textContent;
    const price = parseFloat(priceText.replace('₱', ''));

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification(`${name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.querySelector('.nav-links a:nth-child(4)');
    if (cartLink) {
        cartLink.textContent = `Cart (${totalItems})`;
    }
}

// Render Cart Items
function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Your cart is empty</p>';
        subtotalEl.textContent = '₱0.00';
        totalEl.textContent = '₱2.99';
        return;
    }

    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
                <span style="width: 30px; text-align: center; font-weight: bold;">${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const total = subtotal + deliveryFee;

    subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    totalEl.textContent = `₱${total.toFixed(2)}`;
}

// Increase Quantity
function increaseQty(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity++;
        renderCart();
        updateCartCount();
    }
}

// Decrease Quantity
function decreaseQty(id) {
    const item = cart.find(item => item.id === id);
    if (item && item.quantity > 1) {
        item.quantity--;
        renderCart();
        updateCartCount();
    }
}

// Remove from Cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    showTracking();
}

// Initialize Tracking
function initializeTracking() {
    const orderId = Math.floor(Math.random() * 900000) + 100000;
    document.getElementById('order-id').textContent = orderId;

    const times = ['15', '20', '25', '30'];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    document.getElementById('delivery-time').textContent = randomTime + ' minutes';

    // Simulate order progress
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('active');
        }, index * 1000);
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d62300;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Add event listeners to all Add to Cart buttons
document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', addToCart);
});

// Update cart count on page load
updateCartCount();

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
