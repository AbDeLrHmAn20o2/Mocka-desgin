# 🚀 Back4App Deployment Guide - Mocka Design Platform

## 🎯 Complete Free Deployment on Back4App

Deploy all 4 microservices to **Back4App** with built-in MongoDB support.

## 📋 What You'll Get

### **Service URLs:**
- **API Gateway**: `https://api-gateway-mocka.back4app.io`
- **Design Service**: `https://design-service-mocka.back4app.io`
- **Upload Service**: `https://upload-service-mocka.back4app.io`
- **Subscription Service**: `https://subscription-service-mocka.back4app.io`

## 🏗️ Step-by-Step Deployment

### **Step 1: Create Back4App Account**
1. Go to [Back4App.com](https://www.back4app.com)
2. **Sign up** with GitHub (recommended)
3. **Verify your email**

### **Step 2: Deploy Each Service**

For **each service**, follow these steps:

#### **2.1 Deploy API Gateway**

**In Back4App Dashboard:**
1. **Create New App** → "Node.js Express"
2. **App Name**: `api-gateway-mocka`
3. **Connect GitHub Repository**: `Mocka-desgin`
4. **Branch**: `main`
5. **Root Directory**: `server/api-gateway`

**Environment Variables:**
```bash
NODE_ENV=production
PORT=1337
FRONTEND_URL=https://mocka-desgin.vercel.app
GOOGLE_CLIENT_ID=865143657600-ohvp3fnrav83f725kp1a8k56aircomc6.apps.googleusercontent.com

# Service URLs (update after deploying other services)
DESIGN=https://design-service-mocka.back4app.io
UPLOAD=https://upload-service-mocka.back4app.io
SUBSCRIPTION=https://subscription-service-mocka.back4app.io
```

#### **2.2 Deploy Design Service**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=1337
# Back4App provides MongoDB automatically
MONGO_URI=mongodb://localhost:27017/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
```

#### **2.3 Deploy Upload Service**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=1337
MONGO_URI=mongodb://localhost:27017/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=

# Cloudinary (sign up at cloudinary.com)
cloud_name=your-cloudinary-cloud-name
api_key=your-cloudinary-api-key
api_secret=your-cloudinary-api-secret

# AI (optional)
STABILITY_API_KEY=your-stability-ai-key
```

#### **2.4 Deploy Subscription Service**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=1337
MONGO_URI=mongodb://localhost:27017/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
FRONTEND_URL=https://mocka-desgin.vercel.app

# PayPal (sign up at developer.paypal.com)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### **Step 3: Update API Gateway URLs**

After all services are deployed, **update API Gateway** environment variables:

```bash
DESIGN=https://design-service-mocka.back4app.io
UPLOAD=https://upload-service-mocka.back4app.io
SUBSCRIPTION=https://subscription-service-mocka.back4app.io
```

### **Step 4: Update Frontend (Vercel)**

**In Vercel** → Environment Variables:
```bash
NEXT_PUBLIC_API_URL=https://api-gateway-mocka.back4app.io
```

### **Step 5: External Services Setup**

#### **Cloudinary (Free Image Storage)**
1. Sign up at [Cloudinary.com](https://cloudinary.com)
2. Get: `cloud_name`, `api_key`, `api_secret`

#### **PayPal Developer (Payments)**
1. Sign up at [PayPal Developer](https://developer.paypal.com)
2. Create sandbox app
3. Get: `CLIENT_ID`, `CLIENT_SECRET`

## 🔧 Back4App Specific Configurations

### **Package.json Requirements**
Each service needs this in `package.json`:

```json
{
  "engines": {
    "node": ">=16.0.0"
  },
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### **Port Configuration**
Back4App uses **port 1337** by default, but your code should use:
```javascript
const PORT = process.env.PORT || 1337;
```

## 💰 Free Tier Limits

- **Back4App**: 25k requests/month per app (4 apps = 100k total)
- **Cloudinary**: 25GB storage + bandwidth
- **Vercel**: Unlimited frontend
- **PayPal**: Free sandbox testing
- **Total Cost**: $0/month! 🎉

## 🎯 Deployment Order

1. ✅ **API Gateway** (basic functionality)
2. ✅ **Design Service** (core features)
3. ✅ **Upload Service** (image handling)
4. ✅ **Subscription Service** (payments)
5. ✅ **Update all URLs**
6. ✅ **Test complete system**

## 🆘 Troubleshooting

### **Port 4000 Error - FIXED! ✅**

**Error Message:**
```
trying to hit the 4000 port using http
it looks that no process is listening to the 4000 port using http
app did not turn healthy after several checks
deployment failed
```

**Solution Applied (commit: 607c22d):**
- ✅ **All services now bind to `0.0.0.0`** (required for cloud deployment)
- ✅ **Health endpoints added to ALL services** (`/` and `/health`)
- ✅ **Proper package.json engines** for all services
- ✅ **App.json configuration** files added

**To Fix Your Deployment:**
1. **Redeploy**: Go to Back4App → Your App → Deploy (it will pull latest code)
2. **Clear Cache**: In deployment settings, try "Clear Cache & Deploy"
3. **Check Logs**: Look for `🚀 [SERVICE] running on port 1337` message

### **Common Issues:**

1. **Build Fails**: Check package.json start script
2. **Database Connection**: Back4App provides MongoDB automatically
3. **Environment Variables**: Set in Back4App dashboard
4. **CORS Issues**: Already fixed in your code

### **Deployment Health Checks:**
- **Root**: `https://your-app.back4app.io/` - Returns app status
- **Health**: `https://your-app.back4app.io/health` - Detailed service info

### **Expected Log Messages:**
```
🚀 API Gateway is running on port 1337
🎨 DESIGN Service running on port 1337
📤 UPLOAD Service running on port 1337
💳 SUBSCRIPTION Service running on port 1337
🏥 Health check available at: http://0.0.0.0:1337/health
```

### **Logs & Debugging:**
- Back4App provides **live logs** in the dashboard
- Check **"Logs"** tab for any errors
- All services now have comprehensive logging

## 🎉 Success!

Your complete **Mocka Design Platform** will be live at:
- **Frontend**: `https://mocka-desgin.vercel.app`
- **API Gateway**: `https://api-gateway-mocka.back4app.io`

**Accessible worldwide, completely free!** 🌍