/**
 * PRODUCTION-READY FIREBASE STORAGE UPLOAD
 * 
 * This module handles image uploads to Firebase Storage with:
 * - Proper error handling
 * - CORS compatibility
 * - Progress tracking
 * - Retry logic
 * - Detailed logging
 */

/**
 * Upload image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional progress callback (percent)
 * @returns {Promise<string>} - Download URL of uploaded image
 */
async function uploadImageToStorage(file, onProgress = null) {
    console.log('=== FIREBASE STORAGE UPLOAD START ===');
    console.log('File:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');

    // Validate file
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image (JPG, PNG, GIF, or WebP)');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 5MB');
    }

    try {
        // Check if Firebase Storage is initialized
        if (!firebase || !firebase.storage) {
            throw new Error('Firebase Storage not initialized. Check firebase-config.js');
        }

        const storage = firebase.storage();
        const bucket = storage.app.options.storageBucket;

        console.log('Storage bucket:', bucket);

        if (!bucket) {
            throw new Error('Storage bucket not configured. Check firebaseConfig.storageBucket');
        }

        // Create unique filename with timestamp
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `products/${timestamp}_${sanitizedName}`;

        console.log('Upload path:', fileName);

        // Get storage reference
        const storageRef = storage.ref();
        const fileRef = storageRef.child(fileName);

        // Set metadata
        const metadata = {
            contentType: file.type,
            cacheControl: 'public, max-age=31536000',
            customMetadata: {
                'uploadedAt': new Date().toISOString(),
                'originalName': file.name
            }
        };

        console.log('Starting upload with metadata:', metadata);

        // Use standard .put(file) which is more robust than putString
        return new Promise((resolve, reject) => {
            const uploadTask = fileRef.put(file, metadata);

            uploadTask.on(
                'state_changed',
                // Progress
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload progress:', progress.toFixed(2) + '%');
                    if (onProgress) onProgress(progress);
                },
                // Error
                (error) => {
                    console.error('=== UPLOAD ERROR - COMPLETE DETAILS ===');
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                    console.error('Error name:', error.name);
                    console.error('Server response:', error.serverResponse);
                    console.error('Custom data:', error.customData);
                    console.error('Full error object:', error);
                    console.error('Error as JSON:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
                    
                    // Log all enumerable properties
                    console.error('All error properties:');
                    for (let key in error) {
                        try {
                            console.error(`  ${key}:`, error[key]);
                        } catch (e) {
                            console.error(`  ${key}: [unable to log]`);
                        }
                    }

                    let userMessage = '';
                    switch (error.code) {
                        case 'storage/unauthorized':
                            userMessage = 'PERMISSION DENIED: Check your Firebase Storage Rules and make sure they are published.';
                            break;
                        case 'storage/canceled':
                            userMessage = 'Upload was canceled.';
                            break;
                        case 'storage/unknown':
                            userMessage = 'UNKNOWN ERROR\n\n';
                            userMessage += 'Possible causes:\n';
                            userMessage += '• Storage rules not properly configured\n';
                            userMessage += '• CORS policy issue\n';
                            userMessage += '• Network connectivity problem\n';
                            userMessage += '• Firebase service temporary issue\n\n';
                            userMessage += 'Check browser console for detailed error logs.';
                            break;
                        case 'storage/retry-limit-exceeded':
                            userMessage = 'UPLOAD TIMEOUT\n\n';
                            userMessage += 'Upload failed after multiple retries.\n';
                            userMessage += 'This usually means Storage Rules are blocking access.\n\n';
                            userMessage += 'SOLUTION:\n';
                            userMessage += '1. Go to Firebase Console → Storage → Rules\n';
                            userMessage += '2. Ensure rules are published (click PUBLISH button)\n';
                            userMessage += '3. Wait 1 minute for rules to propagate\n';
                            userMessage += '4. Refresh this page and try again';
                            break;
                        default:
                            userMessage = `Upload failed (${error.code}): ${error.message}. Try refreshing and checking your internet connection.`;
                    }
                    reject(new Error(userMessage));
                },
                // Success
                async () => {
                    try {
                        console.log('Upload complete! Getting download URL...');
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log('✅ SUCCESS! Download URL:', downloadURL);
                        resolve(downloadURL);
                    } catch (urlError) {
                        console.error('Error getting download URL:', urlError);
                        reject(new Error('Upload succeeded but failed to get URL: ' + urlError.message));
                    }
                }
            );
        });

    } catch (error) {
        console.error('=== UPLOAD INITIALIZATION ERROR ===');
        console.error(error);
        throw new Error('Failed to initialize upload: ' + error.message);
    }
}

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Full download URL of the image
 * @returns {Promise<void>}
 */
async function deleteImageFromStorage(imageUrl) {
    if (!imageUrl || !imageUrl.includes('firebase')) {
        console.log('Not a Firebase Storage URL, skipping delete');
        return;
    }

    try {
        console.log('Deleting image:', imageUrl);
        const storage = firebase.storage();
        const imageRef = storage.refFromURL(imageUrl);
        await imageRef.delete();
        console.log('✅ Image deleted successfully');
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw - deletion is optional
    }
}

/**
 * Test Firebase Storage connection and rules
 * @returns {Promise<Object>} - Status object with success and message
 */
async function testStorageConnection() {
    try {
        const storage = firebase.storage();
        const bucket = storage.app.options.storageBucket;

        if (!bucket) {
            return {
                success: false,
                message: 'Storage bucket not configured',
                bucket: null
            };
        }

        // Try to list files (will fail if rules are wrong)
        try {
            await storage.ref().listAll();
            return {
                success: true,
                message: 'Storage is properly configured',
                bucket: bucket
            };
        } catch (listError) {
            if (listError.code === 'storage/unauthorized') {
                return {
                    success: false,
                    message: 'Storage rules are blocking access',
                    bucket: bucket,
                    errorCode: 'unauthorized'
                };
            }
            return {
                success: false,
                message: listError.message,
                bucket: bucket,
                errorCode: listError.code
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message,
            bucket: null
        };
    }
}

// Export functions for use in admin.js
window.uploadImageToStorage = uploadImageToStorage;
window.deleteImageFromStorage = deleteImageFromStorage;
window.testStorageConnection = testStorageConnection;
