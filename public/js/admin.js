// --- CONFIG & STATE ---
let PASSCODE = "fitliving123"; // Default passcode
let editingProductId = null;
let currentImageUrl = null;

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('admin-dashboard');

// --- AUTHENTICATION ---

// Load passcode from Firestore on page load
async function loadPasscode() {
    try {
        const doc = await db.collection('settings').doc('general').get();
        if (doc.exists && doc.data().passcode) {
            PASSCODE = doc.data().passcode;
            console.log('Passcode loaded from Firestore');
        }
    } catch (error) {
        console.error('Error loading passcode:', error);
    }
}

// Load passcode before checking session
loadPasscode().then(() => {
    // Check Session on Load
    if (sessionStorage.getItem('auth') === 'true') {
        showDashboard();
    }
});

function checkLogin() {
    const input = document.getElementById('passcode-input').value;
    if (input === PASSCODE) {
        sessionStorage.setItem('auth', 'true');
        showDashboard();
    } else {
        document.getElementById('login-msg').innerText = "Incorrect Passcode!";
    }
}

function logout() {
    sessionStorage.removeItem('auth');
    location.reload();
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    loadProducts();
    loadSettings();
}

// --- TABS LOGIC ---
window.showTab = function (tabName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show selected section
    document.getElementById('tab-' + tabName).classList.add('active');
    event.target.classList.add('active');
}

// --- SETTINGS MANAGEMENT ---
function loadSettings() {
    // Load settings data
    db.collection('settings').doc('general').get().then(doc => {
        if (doc.exists) {
            const d = doc.data();
            document.getElementById('set-whatsapp').value = d.whatsapp || '';
            document.getElementById('set-payment').value = d.paymentInfo || '';
            document.getElementById('set-pixel-id').value = d.pixelId || '';
            document.getElementById('set-pixel-active').checked = d.isPixelActive || false;
            document.getElementById('set-passcode').value = d.passcode || 'fitliving123';
        } else {
            // Set default passcode if no settings exist
            document.getElementById('set-passcode').value = 'fitliving123';
        }
    });
}

window.handleSettingsSubmit = function (e) {
    e.preventDefault();
    
    const newPasscode = document.getElementById('set-passcode').value.trim();
    
    // Validate passcode
    if (!newPasscode || newPasscode.length < 6) {
        alert('Passcode must be at least 6 characters long!');
        return;
    }
    
    const data = {
        whatsapp: document.getElementById('set-whatsapp').value,
        paymentInfo: document.getElementById('set-payment').value,
        pixelId: document.getElementById('set-pixel-id').value.trim(),
        isPixelActive: document.getElementById('set-pixel-active').checked,
        passcode: newPasscode
    };
    
    db.collection('settings').doc('general').set(data, { merge: true })
        .then(() => {
            PASSCODE = newPasscode; // Update in-memory passcode
            
            let message = "Settings Updated! ✅\n\nNew passcode: " + newPasscode + "\n\nRemember this for next login!";
            
            if (data.isPixelActive && data.pixelId) {
                message += "\n\n📊 Meta Pixel is now active on your website!";
            } else if (!data.isPixelActive && data.pixelId) {
                message += "\n\n⚠️ Meta Pixel ID saved but not active. Enable it to start tracking.";
            }
            
            alert(message);
        })
        .catch(err => alert("Error: " + err.message));
}

// --- PRODUCT MANAGEMENT ---

// Store all products for search
let allProducts = [];

// Load and Display Products
function loadProducts() {
    const container = document.getElementById('products-list');
    container.innerHTML = '<p style="text-align: center; color: #999;">Loading products...</p>';

    // Category name mapping
    const categoryNames = {
        'cardio': 'Cardio',
        'strength': 'Strength',
        'spare-parts': 'Spare Parts',
        'accessories': 'Accessories',
        'gym-matting': 'Gym Matting',
        'lighting': 'Lighting',
        'others': 'Others'
    };

    db.collection('products').orderBy('name').get()
        .then(snapshot => {
            if (snapshot.empty) {
                container.innerHTML = '<p style="text-align: center; color: #999;">No products yet. Add your first product!</p>';
                allProducts = [];
                return;
            }

            // Store all products for search
            allProducts = [];
            snapshot.forEach(doc => {
                allProducts.push({ id: doc.id, ...doc.data() });
            });

            // Display all products initially
            displayProducts(allProducts, categoryNames);
        })
        .catch(err => {
            container.innerHTML = '<p style="color: red;">Error loading products: ' + err.message + '</p>';
        });
}

// Display products (used by both load and search)
function displayProducts(products, categoryNames) {
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No products found.</p>';
        return;
    }

    let html = '';
    products.forEach(product => {
        const categoryDisplay = categoryNames[product.category] || product.category || 'N/A';
        const discount = product.discount || 0;
        const originalPrice = product.price;
        const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice;
        
        let priceDisplay = `₹${originalPrice}`;
        if (discount > 0) {
            priceDisplay = `<span style="text-decoration: line-through; color: #999;">₹${originalPrice}</span> <span style="color: #e74c3c; font-weight: bold;">₹${discountedPrice.toFixed(0)}</span> <span style="background: #e74c3c; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${discount}% OFF</span>`;
        }
        
        html += `
            <div class="product-item">
                <img src="${product.image || 'images/logo.jpg'}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p><strong>Category:</strong> ${categoryDisplay}</p>
                    <p><strong>Price:</strong> ${priceDisplay}</p>
                    <p style="font-size: 13px;">${product.description || 'No description'}</p>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> EDIT
                    </button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}', '${product.image}')">
                        <i class="fas fa-trash"></i> DELETE
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Search products
function searchProducts(searchTerm) {
    const categoryNames = {
        'cardio': 'Cardio',
        'strength': 'Strength',
        'spare-parts': 'Spare Parts',
        'accessories': 'Accessories',
        'gym-matting': 'Gym Matting',
        'lighting': 'Lighting',
        'others': 'Others'
    };

    if (!searchTerm || searchTerm.trim() === '') {
        // Show all products if search is empty
        displayProducts(allProducts, categoryNames);
        return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Filter products by name, category, or price
    const filtered = allProducts.filter(product => {
        const name = (product.name || '').toLowerCase();
        const category = (categoryNames[product.category] || product.category || '').toLowerCase();
        const price = (product.price || '').toString();
        const description = (product.description || '').toLowerCase();
        
        return name.includes(term) || 
               category.includes(term) || 
               price.includes(term) ||
               description.includes(term);
    });

    displayProducts(filtered, categoryNames);
}

// Add search event listener
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
});

// Handle Product Form Submit (Add or Edit)
window.handleProductSubmit = async function (e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerText = 'SAVING...';

    try {
        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const discount = parseFloat(document.getElementById('product-discount').value) || 0;
        const description = document.getElementById('product-description').value.trim();
        const imageFile = document.getElementById('product-image').files[0];

        let imageUrl = currentImageUrl; // Keep existing image if editing

        // Upload new image if selected
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }

        // Validate required fields
        if (!name || !category || !price) {
            alert('Please fill all required fields!');
            submitBtn.disabled = false;
            submitBtn.innerText = editingProductId ? 'UPDATE PRODUCT' : 'ADD PRODUCT';
            return;
        }

        if (!imageUrl && !editingProductId) {
            alert('Please select a product image!');
            submitBtn.disabled = false;
            submitBtn.innerText = 'ADD PRODUCT';
            return;
        }

        // Validate discount
        if (discount < 0 || discount > 100) {
            alert('Discount must be between 0 and 100%');
            submitBtn.disabled = false;
            submitBtn.innerText = editingProductId ? 'UPDATE PRODUCT' : 'ADD PRODUCT';
            return;
        }

        const productData = {
            name,
            category,
            price,
            discount: discount || 0,
            description,
            image: imageUrl,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (editingProductId) {
            // Update existing product
            await db.collection('products').doc(editingProductId).update(productData);
            alert('Product updated successfully! ✅');
        } else {
            // Add new product
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
            alert('Product added successfully! ✅');
        }

        // Reset form and reload
        resetProductForm();
        loadProducts();
        loadSettings(); // Refresh product dropdown in settings

    } catch (error) {
        alert('Error: ' + error.message);
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = editingProductId ? 'UPDATE PRODUCT' : 'ADD PRODUCT';
    }
}

// Upload Image to Firebase Storage
async function uploadImage(file) {
    // Use simple base64 upload (no Firebase Storage needed!)
    // This works everywhere - Netlify, Vercel, localhost
    return await uploadImageCompressed(file, 800, 0.8);
}

// Edit Product
window.editProduct = function (productId) {
    editingProductId = productId;
    
    db.collection('products').doc(productId).get()
        .then(doc => {
            if (!doc.exists) {
                alert('Product not found!');
                return;
            }

            const p = doc.data();
            currentImageUrl = p.image;

            // Fill form
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-discount').value = p.discount || 0;
            document.getElementById('product-description').value = p.description || '';

            // Show current image
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${p.image}" alt="Current Image">`;
            document.getElementById('current-image-text').style.display = 'block';

            // Update UI
            document.getElementById('form-title').innerText = 'Edit Product';
            document.getElementById('submit-btn').innerText = 'UPDATE PRODUCT';
            document.getElementById('cancel-btn').style.display = 'block';
            document.getElementById('product-image').removeAttribute('required');

            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(err => alert('Error: ' + err.message));
}

// Cancel Edit
window.cancelEdit = function () {
    resetProductForm();
}

// Reset Product Form
function resetProductForm() {
    editingProductId = null;
    currentImageUrl = null;
    
    document.getElementById('product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('current-image-text').style.display = 'none';
    
    document.getElementById('form-title').innerText = 'Add New Product';
    document.getElementById('submit-btn').innerText = 'ADD PRODUCT';
    document.getElementById('cancel-btn').style.display = 'none';
    document.getElementById('product-image').setAttribute('required', 'required');
}

// Delete Product
window.deleteProduct = function (productId, imageUrl) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }

    // Delete from Firestore
    // Note: Images are stored as base64 in Firestore, so no separate image deletion needed
    db.collection('products').doc(productId).delete()
        .then(() => {
            alert('Product deleted successfully! ✅');
            loadProducts();
            loadSettings(); // Refresh product dropdown in settings
        })
        .catch(err => alert('Error deleting product: ' + err.message));
}

// Image Preview on Selection
document.getElementById('product-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('image-preview').innerHTML = 
                `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
});
