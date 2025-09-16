# 🚀 Complete Microservices Deployment Guide

## 📋 Services Overview

You need to deploy 4 separate services:

1. **API Gateway** (Port 4000) - Main router/proxy
2. **Design Service** (Port 5001) - Design operations + MongoDB
3. **Upload Service** (Port 5002) - File uploads + Cloudinary + AI + MongoDB
4. **Subscription Service** (Port 5003) - Payments + PayPal + MongoDB

## 🎯 Deployment Order

### **Step 1: Set Up Database (MongoDB Atlas)**
1. Create **MongoDB Atlas** account (free tier)
2. Create a **free cluster** (M0 - 512MB)
3. Create database user and get connection string
4. **Connection String Format**: `mongodb+srv://username:password@cluster.mongodb.net/mocka-design`

### **Step 2: Set Up External Services**

#### **Cloudinary (for Upload Service)**
1. Go to [Cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get: `cloud_name`, `api_key`, `api_secret`

#### **Stability AI (for AI Images - Optional)**
1. Go to [Stability AI](https://stability.ai)
2. Get API key for image generation

#### **PayPal (for Subscription Service)**
1. Go to [PayPal Developer](https://developer.paypal.com)
2. Create sandbox app
3. Get: `CLIENT_ID`, `CLIENT_SECRET`

## 🏗️ Deploy Each Service to Railway/Render

### **Service 1: API Gateway**
**Repository**: Your repo, Root Directory: `server/api-gateway`

**Environment Variables**:
```bash
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
GOOGLE_CLIENT_ID=865143657600-ohvp3fnrav83f725kp1a8k56aircomc6.apps.googleusercontent.com

# Service URLs (update after deploying other services)
DESIGN=https://design-service-url.railway.app
UPLOAD=https://upload-service-url.railway.app
SUBSCRIPTION=https://subscription-service-url.railway.app
```

### **Service 2: Design Service**
**Repository**: Your repo, Root Directory: `server/design-service`

**Environment Variables**:
```bash
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mocka-design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
```

### **Service 3: Upload Service**
**Repository**: Your repo, Root Directory: `server/upload-service`

**Environment Variables**:
```bash
PORT=5002
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mocka-design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=

# Cloudinary Configuration
cloud_name=your-cloudinary-cloud-name
api_key=your-cloudinary-api-key
api_secret=your-cloudinary-api-secret

# AI Image Generation (Optional)
STABILITY_API_KEY=your-stability-ai-key
```

### **Service 4: Subscription Service**
**Repository**: Your repo, Root Directory: `server/subscription-service`

**Environment Variables**:
```bash
PORT=5003
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mocka-design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
FRONTEND_URL=https://your-vercel-app.vercel.app

# PayPal Configuration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

## 🔄 Deployment Steps

### **Railway Deployment (Recommended)**

For **each service**, repeat these steps:

1. **Create New Project** in Railway
2. **Deploy from GitHub repo**
3. **Set Root Directory** to the service folder
4. **Add Environment Variables** (see above)
5. **Copy the generated URL**

### **Alternative: Render Deployment**

1. Go to [Render.com](https://render.com)
2. **Create Web Service**
3. **Root Directory**: `server/[service-name]`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`

## 🔗 Update API Gateway URLs

After deploying all services, **update the API Gateway** environment variables:

```bash
DESIGN=https://your-design-service.railway.app
UPLOAD=https://your-upload-service.railway.app  
SUBSCRIPTION=https://your-subscription-service.railway.app
```

## 🌐 Update Frontend

Update your **Vercel** environment variable:
```bash
NEXT_PUBLIC_API_URL=https://your-api-gateway.railway.app
```

## 💰 Cost Breakdown (Free Tiers)

- **Railway**: $5 free credits/month per service (4 services = can fit in free tier)
- **MongoDB Atlas**: 512MB free forever
- **Cloudinary**: 25GB storage + 25GB bandwidth free
- **Vercel**: Unlimited for frontend
- **Total**: $0/month on free tiers! 🎉

## 🎯 Quick Start Order

1. ✅ MongoDB Atlas setup
2. ✅ Deploy Design Service first (basic functionality)
3. ✅ Deploy API Gateway (update with Design Service URL)
4. ✅ Test basic design operations
5. ✅ Deploy Upload Service (for images)
6. ✅ Deploy Subscription Service (for payments)
7. ✅ Update all URLs in API Gateway
8. ✅ Update frontend API URL

## 🚨 Important Notes

1. **Deploy one service at a time** and test each one
2. **Update API Gateway URLs** after each service deployment
3. **Keep track of all URLs** - you'll need them for configuration
4. **Test each service** individually before connecting them

Ready to start? Let's begin with the **Design Service** first! 🚀