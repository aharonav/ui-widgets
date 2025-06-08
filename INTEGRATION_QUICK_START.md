# Sellence Widget - Quick Integration Guide

## 🚀 For Non-Technical Users

If you're not comfortable with technical setup, you have two options:

### Option 1: Use Our Hosted Solution (Recommended)
We can host the proxy server for you. Contact us at [support@yourcompany.com] with your domain name.

### Option 2: Ask Your Developer
Forward this guide to your web developer - they'll know what to do!

---

## 🛠️ For Developers

### What You Need
- 5 minutes of setup time
- Basic knowledge of HTML/JavaScript
- Access to deploy a simple Node.js server

### The Problem
The Sellence API doesn't allow direct browser calls due to CORS (Cross-Origin Resource Sharing) restrictions. You need a proxy server.

### The Solution (3 Steps)

#### Step 1: Deploy the Proxy Server
```bash
# 1. Download the files
# 2. Install dependencies
npm install

# 3. Deploy to your preferred platform:
# - Heroku: git push heroku main
# - Vercel: vercel deploy
# - Netlify: netlify deploy
```

#### Step 2: Update Your Widget Script
Change this line in `sellence-button-evinature.js`:
```javascript
// FROM:
const API_URL = "https://app.sellence.com:2083/pop-up/create";

// TO:
const API_URL = "https://your-proxy-domain.com/api/sellence/popup";
```

#### Step 3: Add to Your Website
```html
<script 
  src="https://your-cdn.com/sellence-button-evinature.js" 
  async>
</script>
```

### ✅ That's It!
Your widget will now work without CORS issues.

---

## 🔧 Configuration Options

### Basic Customization
Edit these values in the widget script:

```javascript
const TITLE = "Talk to an Expert 24/7";           // Widget header
const BACKGROUND_COLOR = "#CAAF91";               // Theme color  
const PHONE_NUMBER = "+12137996421";              // Your business number
const EXCLUDED_URLS = ["/checkout", "/admin"];    // Pages to hide widget
```

### Page Targeting
```javascript
// Hide widget on specific pages
const EXCLUDED_URLS = [
  "/checkout",
  "/admin", 
  "/login"
];

// Show widget prominently on specific pages
const ON_TOP_URLS = [
  "/pricing",
  "/contact"
];
```

---

## 🚨 Quick Fixes

### Widget Not Showing?
1. Check browser console for errors
2. Verify script URL is correct
3. Make sure proxy server is running

### Form Not Submitting?
1. Test proxy endpoint directly
2. Check CORS configuration
3. Verify Sellence API is accessible

### CORS Error Still Happening?
1. Confirm widget uses proxy URL (not direct Sellence URL)
2. Check proxy server logs
3. Verify your domain is in CORS allowlist

---

## 📞 Need Help?

### For Customers
- Email: support@yourcompany.com
- Include: Your domain name and error messages

### For Developers  
- Check the full README.md for detailed setup
- Test the proxy endpoint independently
- Review browser network tab for failed requests

---

## 🎯 Quick Test

Test your integration:

```bash
# Test the proxy server
curl -X POST https://your-proxy.com/api/sellence/popup \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","phone_number":"+1 555-123-4567"}'
```

Expected response:
```json
{"success": true, "statusCode": 200}
```

---

**Questions?** The full technical documentation is in README.md 