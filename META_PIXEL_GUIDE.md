# Meta Pixel Setup Guide

## What is Meta Pixel?
Meta Pixel (Facebook Pixel) is a tracking code that helps you measure the effectiveness of your Facebook/Instagram ads by tracking visitor actions on your website.

## How to Set Up Meta Pixel

### Step 1: Get Your Pixel ID
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click on "Connect Data Sources" → "Web" → "Meta Pixel"
3. Copy your Pixel ID (it's a 15-16 digit number like `1234567890123456`)

### Step 2: Add Pixel ID to Your Website
1. Open your admin panel: `yourwebsite.com/admin.html`
2. Enter your passcode
3. Go to the "Settings" tab
4. Scroll down to "📊 Meta Pixel (Facebook Ads)" section
5. Paste your Pixel ID in the "Meta Pixel ID" field
6. Check the "Enable Meta Pixel Tracking" checkbox
7. Click "Save Settings"

### Step 3: Verify Pixel is Working
1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) Chrome extension
2. Visit your website
3. Click the extension icon - it should show your Pixel ID is active and firing "PageView" events

## What Does the Pixel Track?
- **PageView**: Automatically tracks every page visit on your website
- This helps Facebook optimize your ads to show them to people more likely to visit your site

## Turning Pixel On/Off
You can enable or disable the pixel anytime from the admin panel Settings tab without removing the Pixel ID. This is useful if you want to pause tracking temporarily.

## Important Notes
- The pixel only works when enabled in settings
- Changes take effect immediately on your website
- You don't need to redeploy your website to change pixel settings
- Keep your Pixel ID private - don't share it publicly

## Troubleshooting
**Pixel not showing in Meta Pixel Helper?**
- Make sure you checked "Enable Meta Pixel Tracking" in settings
- Clear your browser cache and reload the page
- Verify the Pixel ID is correct (no spaces or extra characters)

**Need help?**
Contact your developer or refer to [Facebook Pixel Documentation](https://www.facebook.com/business/help/952192354843755)
