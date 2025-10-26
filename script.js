// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('.menu-icon');
        icon.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
    });
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Update icon based on theme
    const sunSvg = `<svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>`;
    const moonSvg = `<svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark' ? moonSvg : sunSvg;
    }

    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cart.length;
    }
}

// Add to cart - use event delegation so dynamically created buttons work (e.g. collections page)
document.addEventListener('click', (e) => {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;
    e.preventDefault();

    const productCard = button.closest('.product-card');
    if (!productCard) return;

    const productNameEl = productCard.querySelector('.product-name');
    const productPriceEl = productCard.querySelector('.product-price');
    const productImgEl = productCard.querySelector('.product-image img');

    const productName = productNameEl ? productNameEl.textContent.trim() : 'Product';
    const productPrice = productPriceEl ? productPriceEl.textContent.trim() : '';
    const productImage = productImgEl ? productImgEl.src : '';

    const cartItem = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();

    // Show feedback on the button
    const originalHtml = button.innerHTML;
    button.textContent = 'Added!';
    setTimeout(() => {
        // restore original content (if originalHtml exists)
        if (originalHtml && originalHtml.trim().length > 0) {
            button.innerHTML = originalHtml;
        } else {
            button.textContent = 'Add to Cart';
        }
    }, 1500);
});

// Search functionality
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = prompt('Search for Jewellery:');
        if (query) {
            window.location.href = `collections.html?search=${encodeURIComponent(query)}`;
        }
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('.newsletter-input').value;
        alert(`Thank you for subscribing with ${email}!`);
        newsletterForm.reset();
    });
}

// Initialize
updateCartBadge();

// Cart dropdown
const cartBtn = document.querySelector('.cart-btn');
let cartDropdownVisible = false;
let cartDropdownEl = null;

function formatPrice(priceStr) {
    return priceStr;
}

function renderCartDropdown() {
    if (cartDropdownEl) cartDropdownEl.remove();

    cartDropdownEl = document.createElement('div');
    cartDropdownEl.className = 'cart-dropdown';
    cartDropdownEl.style.position = 'absolute';
    cartDropdownEl.style.minWidth = '320px';
    cartDropdownEl.style.maxWidth = '420px';
    // Use CSS for background, border and shadow so dark-mode styles can apply
    cartDropdownEl.style.borderRadius = '8px';
    cartDropdownEl.style.padding = '0.5rem';
    cartDropdownEl.style.zIndex = 2000;

    const list = document.createElement('div');
    list.style.maxHeight = '320px';
    list.style.overflow = 'auto';

    if (!cart || cart.length === 0) {
        const empty = document.createElement('div');
        empty.style.padding = '1rem';
        empty.textContent = 'Your cart is empty.';
        list.appendChild(empty);
    } else {
        cart.forEach(item => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '0.5rem';
            row.style.padding = '0.5rem';
            row.style.borderBottom = '1px solid rgba(0,0,0,0.04)';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.style.width = '56px';
            img.style.height = '56px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '6px';

            const info = document.createElement('div');
            info.style.flex = '1';
            // Use semantic classes instead of inline colors so theme CSS can control contrast
            info.innerHTML = `<div class="cart-item-name" style="font-weight:600">${item.name}</div><div class="cart-item-meta">${formatPrice(item.price)} · Qty: ${item.quantity}</div>`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.background = 'transparent';
            removeBtn.style.border = 'none';
            removeBtn.style.color = '#c00';
            removeBtn.style.cursor = 'pointer';

            removeBtn.addEventListener('click', () => {
                cart = cart.filter(ci => ci.id !== item.id);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                renderCartDropdown();
            });

            row.appendChild(img);
            row.appendChild(info);
            row.appendChild(removeBtn);

            list.appendChild(row);
        });
    }

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.gap = '0.5rem';
    footer.style.padding = '0.5rem';

    const viewCart = document.createElement('a');
    viewCart.href = 'cart.html';
    viewCart.textContent = 'View Cart';
    viewCart.className = 'btn btn-outline';
    viewCart.style.display = 'inline-flex';
    viewCart.style.alignItems = 'center';
    viewCart.style.justifyContent = 'center';

    const checkout = document.createElement('a');
    checkout.href = 'checkout.html';
    checkout.textContent = 'Checkout';
    checkout.className = 'btn btn-primary';
    checkout.style.display = 'inline-flex';
    checkout.style.alignItems = 'center';
    checkout.style.justifyContent = 'center';

    footer.appendChild(viewCart);
    footer.appendChild(checkout);

    cartDropdownEl.appendChild(list);
    cartDropdownEl.appendChild(footer);

    document.body.appendChild(cartDropdownEl);

    // position it near the cart button
    if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        cartDropdownEl.style.top = `${rect.bottom + window.scrollY + 8}px`;
        cartDropdownEl.style.left = `${rect.right + window.scrollX - cartDropdownEl.offsetWidth}px`;
    }
}

function toggleCartDropdown() {
    cartDropdownVisible = !cartDropdownVisible;
    if (cartDropdownVisible) {
        renderCartDropdown();
    } else {
        if (cartDropdownEl) cartDropdownEl.remove();
        cartDropdownEl = null;
    }
}

if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCartDropdown();
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!cartDropdownVisible) return;
    if (!cartDropdownEl) return;
    const target = e.target;
    if (cartDropdownEl.contains(target) || (cartBtn && cartBtn.contains(target))) return;
    // click outside
    cartDropdownVisible = false;
    cartDropdownEl.remove();
    cartDropdownEl = null;
});

// Product view modal (for .product-image .btn-icon)
let viewModal = null;
function openViewModal(imgSrc, title) {
    if (viewModal) viewModal.remove();
    viewModal = document.createElement('div');
    viewModal.style.position = 'fixed';
    viewModal.style.inset = '0';
    viewModal.style.background = 'rgba(0,0,0,0.6)';
    viewModal.style.display = 'flex';
    viewModal.style.alignItems = 'center';
    viewModal.style.justifyContent = 'center';
    viewModal.style.zIndex = 3000;

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.padding = '1rem';
    box.style.borderRadius = '8px';
    box.style.maxWidth = '90%';
    box.style.maxHeight = '90%';
    box.style.overflow = 'auto';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title || '';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    const caption = document.createElement('div');
    caption.style.marginTop = '0.5rem';
    caption.style.fontWeight = '600';
    caption.textContent = title || '';

    box.appendChild(img);
    box.appendChild(caption);
    viewModal.appendChild(box);

    viewModal.addEventListener('click', (ev) => {
        if (ev.target === viewModal) {
            viewModal.remove();
            viewModal = null;
        }
    });

    document.body.appendChild(viewModal);
}

// Attach view handlers
document.querySelectorAll('.product-image .btn-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('.product-card');
        const img = productCard.querySelector('.product-image img');
        const titleEl = productCard.querySelector('.product-name');
        openViewModal(img.src, titleEl ? titleEl.textContent : '');
    });
});

// keyboard ESC to close modals/dropdowns
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (viewModal) { viewModal.remove(); viewModal = null; }
        if (cartDropdownEl) { cartDropdownEl.remove(); cartDropdownEl = null; cartDropdownVisible = false; }
    }
});