# Admin Panel - Product Management Guide

## Features Added ✅

Your admin panel now has complete product management with Firebase Cloud Storage integration:

### 1. **Add Products**
- Upload product images (stored in Firebase Cloud Storage)
- Set product name, category, price, and description
- Images are automatically uploaded to Firebase Storage
- Real-time image preview before upload

### 2. **Edit Products**
- Click "EDIT" button on any product
- Modify any product details
- Keep existing image or upload a new one
- Changes are saved to Firebase Firestore

### 3. **Delete Products**
- Click "DELETE" button to remove products
- Confirmation dialog prevents accidental deletion
- Automatically removes product from Firestore
- Attempts to clean up image from Firebase Storage

## How to Use

### Access Admin Panel
1. Go to `admin.html`
2. Enter passcode: `fitliving123`
3. You'll see two tabs: **PRODUCTS** and **SETTINGS**

### Add a New Product
1. Go to **PRODUCTS** tab
2. Fill in the form:
   - Product Name (required)
   - Category (required)
   - Price (required)
   - Description (optional)
   - Product Image (required)
3. Click **ADD PRODUCT**
4. Product will appear in the list below

### Edit a Product
1. Find the product in the list
2. Click **EDIT** button
3. Form will populate with current data
4. Make your changes
5. Click **UPDATE PRODUCT**
6. Or click **CANCEL** to discard changes

### Delete a Product
1. Find the product in the list
2. Click **DELETE** button
3. Confirm deletion in the popup
4. Product is permanently removed

## Firebase Storage Structure

Images are stored in Firebase Cloud Storage with this structure:
```
products/
  ├── 1234567890_product1.jpg
  ├── 1234567891_product2.png
  └── ...
```

Each image filename includes a timestamp to ensure uniqueness.

## Technical Details

- **Database**: Firebase Firestore (`products` collection)
- **Storage**: Firebase Cloud Storage (`products/` folder)
- **Image Upload**: Automatic with progress handling
- **Image Preview**: Real-time preview before upload
- **Validation**: Required fields are enforced
- **Error Handling**: User-friendly error messages

## Security Notes

- Admin access requires passcode authentication
- Session-based authentication (cleared on logout)
- Firebase Security Rules should be configured for production
- Recommended: Add Firebase Authentication for better security

## Next Steps (Optional Improvements)

1. **Add Firebase Security Rules** to protect your data
2. **Enable Firebase Authentication** for better admin security
3. **Add product stock management** (quantity tracking)
4. **Add product variants** (sizes, colors, etc.)
5. **Add bulk upload** for multiple products at once
6. **Add image compression** to optimize storage costs

## Support

If you need to change the admin passcode, update this line in `admin.js`:
```javascript
const PASSCODE = "fitliving123";
```

For Firebase configuration issues, check `firebase-config.js`.
