// Firebase Data State
let FIREBASE_PRODUCTS = [];
let FIREBASE_SETTINGS = {};

// Default Fallback
let GLOBAL_WHATSAPP = '917223034469';
let GLOBAL_UPI = '9179421434@axl';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Settings
    try {
        const settingsDoc = await db.collection('settings').doc('general').get();
        if (settingsDoc.exists) {
            FIREBASE_SETTINGS = settingsDoc.data();
            GLOBAL_WHATSAPP = FIREBASE_SETTINGS.whatsapp || GLOBAL_WHATSAPP;
            GLOBAL_UPI = FIREBASE_SETTINGS.paymentInfo || GLOBAL_UPI;
        }
    } catch (e) {
        console.warn("Using default settings (Firebase not configured or empty)", e);
    }

    // 2. Fetch Products
    try {
        const prodSnapshot = await db.collection('products').get();
        prodSnapshot.forEach(doc => {
            FIREBASE_PRODUCTS.push({ id: doc.id, ...doc.data() });
        });
    } catch (e) {
        console.warn("Using default products (Firebase not configured or empty)", e);
        // Fallback to local data.js if exists
        if (typeof PRODUCTS !== 'undefined') FIREBASE_PRODUCTS = PRODUCTS;
    }

    // If Firebase was empty, maybe fallback to seeds if we want? 
    // For now, let's assume if FIREBASE_PRODUCTS is empty, we show local PRODUCTS
    if (FIREBASE_PRODUCTS.length === 0 && typeof PRODUCTS !== 'undefined') {
        FIREBASE_PRODUCTS = PRODUCTS;
    }

    // 3. Initialize App
    initializeApp();
});

function initializeApp() {
    // Update Global External Links
    updateGlobalLinks();

    // Meta Pixel Integration
    if (FIREBASE_SETTINGS.isPixelActive && FIREBASE_SETTINGS.pixelId) {
        injectMetaPixel(FIREBASE_SETTINGS.pixelId);
    }

    // Render Home Page Collections
    renderHomeCategories();

    // Render Gym Product Page All Categories
    renderAllCategories();

    // Handle Category Page Logic
    handleCategoryPage();

    // Handle Product Details Page Logic
    handleProductPage();

    // Handle Contact Form
    handleContactForm();

    // Setup Mobile Sidebar
    setupMobileSidebar();
}

function updateGlobalLinks() {
    // Update Floating Button
    let floatBtn = document.querySelector('.floating-whatsapp');
    if (floatBtn) {
        floatBtn.href = `https://wa.me/${GLOBAL_WHATSAPP}`;
    }

    // Update Contact Page Section
    let contactWaNum = document.getElementById('contact-whatsapp-number');
    let contactWaLink = document.getElementById('contact-whatsapp');
    if (contactWaNum && contactWaLink) {
        contactWaNum.innerText = '+' + GLOBAL_WHATSAPP;
        contactWaLink.href = `https://wa.me/${GLOBAL_WHATSAPP}`;
    }
}

function renderHomeCategories() {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
    if (isHomePage) {
        const container = document.querySelector('.categories');
        // Use local CATEGORIES (data.js) for list, as categories are static structure usually
        // If user wants dynamic categories, we would need a 'categories' collection in Firebase too.
        // For now, we assume categories structure is static, but products are dynamic.
        if (container && typeof CATEGORIES !== 'undefined' && typeof HOME_CATEGORIES !== 'undefined') {
            const homeCats = CATEGORIES.filter(c => HOME_CATEGORIES.includes(c.id));
            if (homeCats.length > 0) {
                container.innerHTML = homeCats.map(c => `
                    <a href="category.html?type=${c.id}" class="category-card">
                        <img src="${c.image}" alt="${c.name}">
                        <h3>${c.name}</h3>
                    </a>
                `).join('');
            }
        }
    }
}

function renderAllCategories() {
    const path = window.location.pathname;
    if (path.includes('gym-product.html') || path.includes('gym-product')) {
        const container = document.querySelector('.mart-grid');
        if (container && typeof CATEGORIES !== 'undefined') {
            container.innerHTML = CATEGORIES.map(c => `
                <a href="category.html?type=${c.id}" class="category-card">
                    <img src="${c.image}" alt="${c.name}">
                    <h3>${c.name}</h3>
                </a>
            `).join('');
        }
    }
}

function handleCategoryPage() {
    const path = window.location.pathname;
    if (path.includes('category.html') || path.includes('category')) {
        const params = new URLSearchParams(window.location.search);
        const categoryType = params.get('type');
        const container = document.getElementById('product-list');
        const title = document.getElementById('category-title');
        const searchInput = document.getElementById('category-search');

        if (categoryType && container) {
            const catObj = (typeof CATEGORIES !== 'undefined') ? CATEGORIES.find(c => c.id === categoryType) : null;
            title.innerText = catObj ? catObj.name.toUpperCase() : categoryType.replace('-', ' ').toUpperCase();

            // Filter from FIREBASE_PRODUCTS
            let allCategoryProducts = FIREBASE_PRODUCTS.filter(p => p.category === categoryType);

            const renderProducts = (products) => {
                if (products.length === 0) {
                    container.innerHTML = '<p style="text-align:center; width:100%;">No products found.</p>';
                } else {
                    container.innerHTML = products.map(product => {
                        const discount = product.discount || 0;
                        const originalPrice = product.price;
                        const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
                        
                        let priceHTML = '';
                        if (discount > 0) {
                            priceHTML = `
                                <p class="price">
                                    <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${formatPrice(originalPrice)}</span>
                                    <span style="color: #e74c3c; font-weight: bold;">${formatPrice(discountedPrice)}</span>
                                    <span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.75em; margin-left: 5px;">${discount}% OFF</span>
                                </p>
                            `;
                        } else {
                            priceHTML = `<p class="price">${formatPrice(originalPrice)}</p>`;
                        }
                        
                        return `
                            <a href="product.html?id=${product.id}" class="product-card">
                                <div class="product-img-wrapper">
                                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                                </div>
                                <div class="product-info">
                                    <h3>${product.name}</h3>
                                    ${priceHTML}
                                </div>
                            </a>
                        `;
                    }).join('');
                }
            };

            renderProducts(allCategoryProducts);

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const term = e.target.value.toLowerCase();
                    const filtered = allCategoryProducts.filter(p => p.name.toLowerCase().includes(term));
                    renderProducts(filtered);
                });
            }
        }
    }
}

function handleProductPage() {
    const path = window.location.pathname;
    if (path.includes('product.html') || path.includes('product')) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (productId) {
            // Find in FIREBASE_PRODUCTS
            const product = FIREBASE_PRODUCTS.find(p => p.id === productId);
            if (product) {
                const discount = product.discount || 0;
                const originalPrice = product.price;
                const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
                const finalPrice = discountedPrice;
                
                document.getElementById('product-img').src = product.image || 'https://via.placeholder.com/500?text=No+Image';
                document.getElementById('product-name').innerText = product.name;
                
                // Display price with discount
                const priceElement = document.getElementById('product-price');
                if (discount > 0) {
                    priceElement.innerHTML = `
                        <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${formatPrice(originalPrice)}</span>
                        <span style="color: #e74c3c; font-weight: bold; font-size: 1.2em;">${formatPrice(discountedPrice)}</span>
                        <span style="background: #e74c3c; color: white; padding: 4px 10px; border-radius: 5px; font-size: 0.8em; margin-left: 10px;">${discount}% OFF</span>
                    `;
                } else {
                    priceElement.innerText = formatPrice(originalPrice);
                }
                
                document.getElementById('product-desc').innerText = product.description;

                // WhatsApp Button Link
                const message = `Hi, I am interested in ${product.name}. Please provide more details.`;
                const whatsappUrl = `https://wa.me/${GLOBAL_WHATSAPP}?text=${encodeURIComponent(message)}`;
                document.getElementById('whatsapp-btn').href = whatsappUrl;

                // Payment Logic - use final discounted price
                const upiId = GLOBAL_UPI;
                const upiName = 'FitLiving';
                const upiUri = `upi://pay?pa=${upiId}&pn=${upiName}&am=${finalPrice}&cu=INR`;
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(upiUri)}&size=250x250`;

                const qrImg = document.getElementById('payment-qr');
                if (qrImg) qrImg.src = qrUrl;

                const displayUpi = document.getElementById('display-upi-id');
                if (displayUpi) displayUpi.innerText = `UPI ID: ${upiId}`;

                // Payment SS Button - use final discounted price
                const ssMessage = `Hi, I've just paid ${formatPrice(finalPrice)} for ${product.name}. Here is the payment screenshot for confirmation.`;
                const ssWhatsappUrl = `https://wa.me/${GLOBAL_WHATSAPP}?text=${encodeURIComponent(ssMessage)}`;
                const ssBtn = document.getElementById('payment-ss-btn');
                if (ssBtn) {
                    ssBtn.href = ssWhatsappUrl;
                }
            } else {
                // Product not found logic
                document.getElementById('product-name').innerText = "Product Not Found";
            }
        }
    }
}

function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            const waMessage = `Hi, I am ${name}. ${message}`;
            const whatsappUrl = `https://wa.me/${GLOBAL_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
            window.location.href = whatsappUrl;
        });
    }
}

function setupMobileSidebar() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileMenuToggle && mobileSidebar && sidebarOverlay) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileSidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeSidebar) closeSidebar.addEventListener('click', closeMenu);
        sidebarOverlay.addEventListener('click', closeMenu);

        const sidebarLinks = mobileSidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => link.addEventListener('click', closeMenu));
    }
}

// Helper: Format Price to INR
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(price);
};

function injectMetaPixel(id) {
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', id);
    fbq('track', 'PageView');
}

// Load Offer Banner (Homepage Only)
function loadOfferBanner() {
    const banner = document.getElementById('offer-banner');
    if (!banner) return;

    const text = document.getElementById('offer-text');
    const link = document.getElementById('offer-link');

    // Make sure FIREBASE_SETTINGS is loaded
    if (FIREBASE_SETTINGS && FIREBASE_SETTINGS.offerText && FIREBASE_SETTINGS.offerText.trim() !== '') {
        text.innerText = FIREBASE_SETTINGS.offerText;

        if (FIREBASE_SETTINGS.offerProductId) {
            link.href = `product.html?id=${FIREBASE_SETTINGS.offerProductId}`;
            link.style.display = 'inline-block';
        } else {
            link.style.display = 'none';
        }

        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}


// Load Offer Banner (Homepage Only)
function loadOfferBanner() {
    const banner = document.getElementById('offer-banner');
    if (!banner) return;

    const text = document.getElementById('offer-text');
    const link = document.getElementById('offer-link');

    // Check if settings are loaded and banner text exists
    if (FIREBASE_SETTINGS && FIREBASE_SETTINGS.offerText && FIREBASE_SETTINGS.offerText.trim() !== '') {
        text.innerText = FIREBASE_SETTINGS.offerText;

        if (FIREBASE_SETTINGS.offerProductId) {
            link.href = `product.html?id=${FIREBASE_SETTINGS.offerProductId}`;
            link.style.display = 'inline-block';
        } else {
            link.style.display = 'none';
        }

        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}
