/**
 * SIMPLE IMAGE UPLOAD - Store images as base64 in Firestore
 * 
 * This is the simplest solution that works everywhere:
 * - No Firebase Storage needed
 * - No external services
 * - Works on Netlify, Vercel, anywhere
 * - No CORS issues
 * 
 * Limitation: Best for images under 500KB
 */

/**
 * Convert image file to base64 and store in Firestore
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 data URL
 */
async function uploadImageSimple(file) {
    console.log('=== SIMPLE IMAGE UPLOAD START ===');
    console.log('File:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
    
    // Validate file
    if (!file) {
        throw new Error('No file provided');
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP');
    }
    
    // Validate file size (max 1MB for base64 storage)
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 1MB. Please compress your image.');
    }
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const base64Data = e.target.result;
            console.log('✅ Image converted to base64');
            console.log('Base64 size:', (base64Data.length / 1024).toFixed(2), 'KB');
            resolve(base64Data);
        };
        
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            reject(new Error('Failed to read image file'));
        };
        
        // Read file as data URL (base64)
        reader.readAsDataURL(file);
    });
}

/**
 * Compress image before converting to base64
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default 800px)
 * @param {number} quality - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<string>} - Compressed base64 data URL
 */
async function uploadImageCompressed(file, maxWidth = 800, quality = 0.8) {
    console.log('=== COMPRESSED IMAGE UPLOAD START ===');
    console.log('Original file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
    
    // Validate file
    if (!file) {
        throw new Error('No file provided');
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP');
    }
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                // Calculate new dimensions
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                console.log('Original dimensions:', img.width, 'x', img.height);
                console.log('Compressed dimensions:', width, 'x', height);
                
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                // Draw image on canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                console.log('✅ Image compressed and converted to base64');
                console.log('Compressed size:', (compressedBase64.length / 1024).toFixed(2), 'KB');
                console.log('Compression ratio:', ((1 - compressedBase64.length / (file.size * 1.37)) * 100).toFixed(1) + '%');
                
                resolve(compressedBase64);
            };
            
            img.onerror = function() {
                reject(new Error('Failed to load image'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
            reject(new Error('Failed to read image file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Export functions
window.uploadImageSimple = uploadImageSimple;
window.uploadImageCompressed = uploadImageCompressed;

console.log('✅ Simple Image Upload module loaded');
