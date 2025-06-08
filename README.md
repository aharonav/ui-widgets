# Sellence Widget Integration Guide

## Overview

The Sellence Widget is a customizable popup form that allows website visitors to contact your business via SMS. This guide covers the integration process and CORS solution for production deployment.

## Table of Contents

- [Quick Start](#quick-start)
- [CORS Solution Setup](#cors-solution-setup)
- [Widget Integration](#widget-integration)
- [Configuration Options](#configuration-options)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Option 1: Direct Integration (Recommended for Production)

1. **Set up the proxy server** (required for CORS handling)
2. **Add the widget script** to your website
3. **Configure widget settings**

### Option 2: CDN Integration (Simple Setup)

```html
<script 
  src="https://your-domain.com/sellence-button-evinature.js" 
  id="sellence-snippet" 
  type="text/javascript" 
  async
  crossorigin="anonymous"
  onerror="console.warn('Sellence widget failed to load')">
</script>
```

## CORS Solution Setup

Due to browser security policies, direct API calls from client-side JavaScript to the Sellence API are blocked by CORS. You need to set up a proxy server.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### 1. Install Dependencies

```bash
npm install express cors
```

### 2. Create Proxy Server

Use the provided `proxy-server.js` file:

```javascript
const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS for your domain(s)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Proxy endpoint for Sellence API
app.post('/api/sellence/popup', async (req, res) => {
  // Proxy implementation (see proxy-server.js for full code)
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
```

### 3. Start the Proxy Server

```bash
# Development
npm run dev

# Production
npm start
```

### 4. Environment Configuration

Create a `.env` file:

```env
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
```

## Widget Integration

### 1. Basic HTML Integration

Add this script tag to your HTML `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Website</title>
    
    <!-- Sellence Widget -->
    <script 
      src="https://your-cdn.com/sellence-button-evinature.js" 
      id="sellence-snippet" 
      type="text/javascript" 
      async
      crossorigin="anonymous"
      onerror="console.warn('Sellence widget failed to load')">
    </script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### 2. Custom Configuration

You can customize the widget by modifying the script constants:

```javascript
// In sellence-button-evinature.js
const TITLE = "Talk to an Expert 24/7";
const PHONE_NUMBER = "+12137996421";
const BACKGROUND_COLOR = "#CAAF91";
const TEXT_COLOR = "#FFFFFF";
```

### 3. Proxy URL Configuration

Update the API URL in your widget script to point to your proxy:

```javascript
// Replace the direct Sellence API URL
const API_URL = "https://your-proxy-server.com/api/sellence/popup";
```

## Configuration Options

### Widget Appearance

| Option | Description | Default |
|--------|-------------|---------|
| `TITLE` | Widget header text | "Talk to an Expert 24/7" |
| `BACKGROUND_COLOR` | Main theme color | "#CAAF91" |
| `TEXT_COLOR` | Text color | "#FFFFFF" |
| `BUTTON_TEXT` | Submit button text | "Send" |

### Widget Behavior

| Option | Description | Default |
|--------|-------------|---------|
| `PHONE_NUMBER` | Business phone number | "+12137996421" |
| `EXCLUDED_URLS` | Pages where widget won't show | `[]` |
| `ON_TOP_URLS` | Pages where widget appears on top | `["localhost:8888"]` |

### Form Validation

The widget includes built-in validation for:
- Required fields (name, phone)
- Phone number format validation
- Multiple US phone number formats supported

## Deployment

### Option 1: Server Deployment (Recommended)

1. **Deploy your proxy server** to a cloud provider:
   - Heroku
   - Vercel
   - AWS EC2/ECS
   - DigitalOcean

2. **Update CORS configuration** for production:
   ```javascript
   app.use(cors({
     origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
     credentials: true
   }));
   ```

3. **Set environment variables**:
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   NODE_ENV=production
   ```

### Option 2: Serverless Deployment

Deploy as a serverless function (Netlify, Vercel Functions):

```javascript
// netlify/functions/sellence-proxy.js
const https = require('https');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Proxy logic here
};
```

### Option 3: CDN Deployment

Host the widget script on a CDN:

1. Upload `sellence-button-evinature.js` to your CDN
2. Update the API URL in the script
3. Reference the CDN URL in your HTML

## Security Considerations

### 1. CORS Configuration

Always specify exact origins in production:

```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],  // Never use '*' in production
  credentials: true
}));
```

### 2. Rate Limiting

Implement rate limiting on your proxy:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/sellence/', limiter);
```

### 3. Input Validation

The proxy server includes basic validation, but consider adding:
- Sanitization of input data
- Additional phone number validation
- Spam detection

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Error**: `Access to fetch at 'https://app.sellence.com:2083/pop-up/create' has been blocked by CORS policy`

**Solution**: 
- Ensure your proxy server is running
- Verify the API URL in your widget points to your proxy
- Check CORS configuration includes your domain

#### 2. Widget Not Loading

**Error**: Widget doesn't appear on the page

**Solution**:
- Check browser console for JavaScript errors
- Verify script URL is accessible
- Ensure script is loaded after DOM elements

#### 3. Form Submission Failures

**Error**: Form doesn't submit or shows errors

**Solution**:
- Check proxy server logs
- Verify Sellence API endpoint is accessible
- Test with valid phone number formats

### Testing

#### 1. Test the Proxy Server

```bash
curl -X POST http://localhost:3001/api/sellence/popup \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","phone_number":"+1 555-123-4567","customer_message":"Test message"}'
```

#### 2. Test Widget Integration

1. Open browser developer tools
2. Check for console errors
3. Test form submission with valid data
4. Verify network requests go to your proxy

### Support

For additional support:

1. Check proxy server logs
2. Verify all environment variables are set
3. Test API endpoints independently
4. Contact support with specific error messages

## API Reference

### Proxy Endpoint

**POST** `/api/sellence/popup`

**Request Body**:
```json
{
  "customer_name": "John Doe",
  "phone_number": "+1 555-123-4567",
  "customer_message": "I'm interested in your services"
}
```

**Response**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": null
}
```

**Error Response**:
```json
{
  "error": "Missing required fields: customer_name and phone_number are required"
}
```

## License

This integration guide and proxy server code are provided as-is for customer implementation. 