# 🚀 GitHub Push & Netlify Deploy Guide

## ✅ Git Setup Complete!

Your code is committed and ready to push. Follow these steps:

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/Ankitjha3
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `fitliving` (or any name you want)
4. Keep it **Public** (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

---

## Step 2: Push Your Code

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/Ankitjha3/fitliving.git
git push -u origin main
```

**If it asks for credentials:**
- Username: `Ankitjha3`
- Password: Use a **Personal Access Token** (not your GitHub password)

**To create a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Fitliving Deploy"
4. Check the "repo" scope
5. Click "Generate token"
6. Copy the token and use it as your password

---

## Step 3: Deploy to Netlify

### Option A: Connect GitHub (Recommended)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select the `fitliving` repository
6. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `echo 'No build needed - static site'`
   - Publish directory: `public`
7. Click **"Deploy site"**
8. Done! Your site will be live in 1-2 minutes

### Option B: Drag & Drop (Quick Test)

1. Go to https://app.netlify.com/drop
2. Drag the `public` folder onto the page
3. Instant deploy!

---

## Step 4: After Deployment

1. Your site will get a URL like: `https://random-name-123.netlify.app`
2. Change the site name:
   - Go to Site settings → Site details → Change site name
   - Try: `fitliving-gym` or `fitliving-shop`
3. Test everything:
   - Main site works
   - Products load from Firebase
   - Admin panel at `/admin.html`
   - WhatsApp & Instagram links work

---

## 🔥 Important Notes:

- **Firebase config is public** (in `firebase-config.js`) - this is normal for web apps
- **Admin passcode** protects your admin panel
- **All data** is in Firebase Firestore
- **Images** are stored as base64 in Firestore
- **Meta Pixel** will track if enabled in admin settings

---

## 🎯 Your Site Features:

✅ Static HTML + Firebase (no server needed)
✅ Admin panel with product management
✅ Base64 image storage (no storage issues)
✅ Meta Pixel integration
✅ WhatsApp & Instagram integration
✅ Discount system
✅ Mobile responsive
✅ Two addresses (Jabalpur + Zirakpur)

---

## 🆘 If You Face Issues:

**Push fails?**
- Make sure you created the GitHub repo first
- Use Personal Access Token, not password

**Netlify deploy fails?**
- Check if `public` folder exists
- Check Netlify deploy logs

**Site loads but no products?**
- Check Firebase console for data
- Check browser console for errors

---

## 📱 Next Steps After Deploy:

1. Share your Netlify URL with customers
2. Add products via admin panel
3. Update settings (WhatsApp, UPI, passcode)
4. Enable Meta Pixel if you have Facebook Ads
5. (Optional) Add custom domain in Netlify

---

## 🎉 You're Ready!

Run the commands above and your site will be live in minutes!
