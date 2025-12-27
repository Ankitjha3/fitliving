# 🚀 Quick Deploy Commands

## First Time Setup

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. First commit
git commit -m "Initial commit - FitLiving website ready for deployment"

# 4. Create GitHub repo at: https://github.com/new
# Name it: fitliving (or any name)

# 5. Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/fitliving.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

## Deploy to Netlify

### Option A: Via Website (Easiest)
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select your repo
5. Settings:
   - Build command: (leave empty)
   - Publish directory: `public`
6. Click "Deploy site"
7. Done! ✅

### Option B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=public
```

## Future Updates

```bash
# After making any changes:

# 1. Add changes
git add .

# 2. Commit with message
git commit -m "Updated products/features"

# 3. Push to GitHub
git push

# Netlify will auto-deploy! ✅
```

## Quick Commands

```bash
# Check status
git status

# See changes
git diff

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## Netlify Settings

**Publish directory**: `public`
**Build command**: (empty)
**Node version**: (not needed)

## Your Site Structure

```
fitliving/
├── public/              ← This gets deployed
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── images/
├── .gitignore          ← Excludes node_modules
└── package.json        ← Not needed for deployment
```

## Environment Variables (If Needed)

In Netlify Dashboard:
1. Site settings → Environment variables
2. Add variables
3. Redeploy

## Custom Domain

1. Buy domain (GoDaddy, Namecheap, etc.)
2. Netlify → Domain settings
3. Add custom domain
4. Update DNS records
5. Wait for SSL (automatic)

## Troubleshooting

### Deploy failed?
- Check Netlify logs
- Verify `public` directory exists
- Check file paths are correct

### Site shows 404?
- Ensure publish directory is `public`
- Check index.html exists in public/

### Firebase not working?
- Verify firebase-config.js has correct credentials
- Check Firestore rules are published

## Pre-Deploy Checklist

- [ ] Test locally
- [ ] Change admin passcode
- [ ] Verify Firebase config
- [ ] Check all pages work
- [ ] Test on mobile
- [ ] Commit all changes
- [ ] Push to GitHub

## Post-Deploy Checklist

- [ ] Visit live URL
- [ ] Test all pages
- [ ] Test admin panel
- [ ] Add test product
- [ ] Check mobile view
- [ ] Test WhatsApp links
- [ ] Share with client

---

**You're ready to deploy!** 🎉
