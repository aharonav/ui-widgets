# Deployment Guide - Sellence Widget Proxy Server

## Platform-Specific Deployment Instructions

### 🚀 Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add ALLOWED_ORIGINS
   # Enter: https://yourdomain.com,https://www.yourdomain.com
   ```

4. **Your proxy URL will be:**
   ```
   https://your-project.vercel.app/api/sellence/popup
   ```

---

### 🟦 Netlify

1. **Create `netlify/functions/sellence-proxy.js`**
   ```javascript
   const https = require('https');

   exports.handler = async (event, context) => {
     const headers = {
       'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
       'Access-Control-Allow-Headers': 'Content-Type',
       'Access-Control-Allow-Methods': 'POST, OPTIONS'
     };

     if (event.httpMethod === 'OPTIONS') {
       return { statusCode: 200, headers, body: '' };
     }

     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, headers, body: 'Method Not Allowed' };
     }

     try {
       const { customer_name, phone_number, customer_message } = JSON.parse(event.body);
       
       const postData = JSON.stringify({
         customer_name,
         phone_number,
         customer_message: customer_message || ''
       });

       return new Promise((resolve) => {
         const options = {
           hostname: 'app.sellence.com',
           port: 2083,
           path: '/pop-up/create',
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Content-Length': Buffer.byteLength(postData)
           }
         };

         const req = https.request(options, (res) => {
           let data = '';
           res.on('data', chunk => data += chunk);
           res.on('end', () => {
             resolve({
               statusCode: res.statusCode,
               headers,
               body: JSON.stringify({
                 success: res.statusCode >= 200 && res.statusCode < 300,
                 statusCode: res.statusCode
               })
             });
           });
         });

         req.on('error', (error) => {
           resolve({
             statusCode: 500,
             headers,
             body: JSON.stringify({ error: error.message })
           });
         });

         req.write(postData);
         req.end();
       });
     } catch (error) {
       return {
         statusCode: 500,
         headers,
         body: JSON.stringify({ error: error.message })
       };
     }
   };
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

3. **Your proxy URL will be:**
   ```
   https://your-site.netlify.app/.netlify/functions/sellence-proxy
   ```

---

### 🟪 Heroku

1. **Create Procfile**
   ```
   web: node proxy-server.js
   ```

2. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-app-name
   git push heroku main
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **Your proxy URL will be:**
   ```
   https://your-app-name.herokuapp.com/api/sellence/popup
   ```

---

### ☁️ AWS Lambda (Advanced)

1. **Install Serverless Framework**
   ```bash
   npm install -g serverless
   ```

2. **Create `serverless.yml`**
   ```yaml
   service: sellence-proxy
   
   provider:
     name: aws
     runtime: nodejs18.x
     environment:
       ALLOWED_ORIGINS: ${env:ALLOWED_ORIGINS}
   
   functions:
     proxy:
       handler: handler.proxy
       events:
         - http:
             path: api/sellence/popup
             method: post
             cors: true
   ```

3. **Create `handler.js`**
   ```javascript
   const https = require('https');

   module.exports.proxy = async (event) => {
     // Lambda handler implementation
   };
   ```

4. **Deploy**
   ```bash
   serverless deploy
   ```

---

### 🐳 Docker (Self-Hosted)

1. **Create `Dockerfile`**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3001
   CMD ["node", "proxy-server.js"]
   ```

2. **Create `docker-compose.yml`**
   ```yaml
   version: '3.8'
   services:
     sellence-proxy:
       build: .
       ports:
         - "3001:3001"
       environment:
         - ALLOWED_ORIGINS=https://yourdomain.com
         - NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## 🔧 Post-Deployment Setup

### 1. Update Widget Script

After deploying, update your widget script:

```javascript
// In sellence-button-evinature.js
const API_URL = "https://your-deployed-proxy.com/api/sellence/popup";
```

### 2. Test the Deployment

```bash
curl -X POST https://your-deployed-proxy.com/api/sellence/popup \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "phone_number": "+1 555-123-4567",
    "customer_message": "Test message"
  }'
```

### 3. Configure CORS for Production

Update environment variables:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
NODE_ENV=production
```

---

## 🔍 Monitoring & Logging

### Vercel
- View logs: `vercel logs`
- Monitor: Vercel Dashboard

### Netlify  
- View logs: Netlify Functions tab
- Monitor: Netlify Analytics

### Heroku
- View logs: `heroku logs --tail`
- Monitor: Heroku Metrics

### AWS Lambda
- View logs: CloudWatch Logs
- Monitor: CloudWatch Metrics

---

## 🛡️ Security Checklist

- [ ] Set specific domains in `ALLOWED_ORIGINS` (never use `*` in production)
- [ ] Enable HTTPS only
- [ ] Implement rate limiting if needed
- [ ] Monitor for unusual traffic patterns
- [ ] Set up error alerts
- [ ] Validate input data
- [ ] Keep dependencies updated

---

## 💡 Tips

1. **Use CDN**: Host your widget script on a CDN for faster loading
2. **Environment Variables**: Never hardcode sensitive values
3. **Health Checks**: Most platforms support health check endpoints
4. **Scaling**: Most serverless platforms auto-scale
5. **Costs**: Serverless functions are typically very cost-effective for this use case

---

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json

2. **CORS Issues**
   - Confirm environment variables are set
   - Test with browser dev tools

3. **Function Timeouts**
   - Increase timeout settings in platform config
   - Optimize API call performance

4. **Domain Issues**
   - Verify DNS configuration
   - Check SSL certificate status

### Getting Help

- Platform documentation links
- Support channels for each platform
- Community forums and Stack Overflow 