const API_URL = "http://localhost:8084/api";
const CART_KEY = "ecommerce_cart";

const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const refreshBtn = document.getElementById("refreshBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const messageBox = document.getElementById("message");

const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
});

let allProducts = [];
let cart = loadCart();

async function init() {
    await fetchAllProducts();
    renderProducts();
    renderCart();
}

async function fetchAllProducts() {
    const response = await fetch(`${API_URL}/products`);
    allProducts = await response.json();
}

function loadCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getFilteredProducts() {
    const q = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    return allProducts.filter(product => {
        const matchQuery =
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q);

        const matchCategory =
            category === "All" || product.category === category;

        return matchQuery && matchCategory;
    });
}

function renderProducts() {
    const products = getFilteredProducts();

    if (products.length === 0) {
        productsGrid.innerHTML = `<div class="empty">No products found.</div>`;
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.imageUrl}" alt="${product.name}">
            <div class="product-content">
                <span class="badge">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price-row">
                    <span class="price">${money.format(product.price)}</span>
                    <span class="rating">⭐ ${product.rating}</span>
                </div>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join("");
}

function addToCart(productId) {
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, quantity: 1 });
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    renderCart();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.productId !== productId);
    }

    saveCart();
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty">Your cart is empty.</div>`;
        cartCount.textContent = "0";
        cartTotal.textContent = money.format(0);
        return;
    }

    let total = 0;
    let count = 0;

    cartItems.innerHTML = cart.map(item => {
        const product = allProducts.find(p => p.id === item.productId);

        if (!product) return "";

        const lineTotal = product.price * item.quantity;
        total += lineTotal;
        count += item.quantity;

        return `
            <div class="cart-item">
                <img src="${product.imageUrl}" alt="${product.name}">
                <div>
                    <h4>${product.name}</h4>
                    <p>${money.format(product.price)} x ${item.quantity}</p>
                    <p><strong>${money.format(lineTotal)}</strong></p>

                    <div class="qty-controls">
                        <button type="button" onclick="changeQty(${product.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" onclick="changeQty(${product.id}, 1)">+</button>
                    </div>

                    <span class="remove-link" onclick="removeFromCart(${product.id})">Remove</span>
                </div>
            </div>
        `;
    }).join("");

    cartCount.textContent = count;
    cartTotal.textContent = money.format(total);
}

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
}

async function placeOrder(event) {
    event.preventDefault();
    messageBox.textContent = "";
    messageBox.className = "message";

    if (cart.length === 0) {
        messageBox.textContent = "Cart is empty. Add products before checkout.";
        messageBox.classList.add("error");
        return;
    }

    const payload = {
        customerName: document.getElementById("customerName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errMsg = data.message || Object.values(data).join(", ") || "Checkout failed";
            throw new Error(errMsg);
        }

        messageBox.textContent = `Order placed successfully! Order ID: ${data.orderId}, Total: ${money.format(data.totalAmount)}`;
        messageBox.classList.add("success");

        checkoutForm.reset();
        clearCart();
    } catch (error) {
        messageBox.textContent = error.message;
        messageBox.classList.add("error");
    }
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
refreshBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "All";
    renderProducts();
});
clearCartBtn.addEventListener("click", clearCart);
checkoutForm.addEventListener("submit", placeOrder);

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;

init();