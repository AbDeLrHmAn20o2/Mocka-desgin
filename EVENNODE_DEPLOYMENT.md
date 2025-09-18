# 🚀 Evennode Deployment Guide - Mocka Design Platform

## 🎯 Complete Free Deployment Strategy

Deploy all 4 microservices to **Evennode** (free hosting) and connect with **Vercel** frontend.

## 📋 Prerequisites

### **1. Accounts Needed (All Free):**
- ✅ **Evennode Account** - [evennode.com](https://www.evennode.com)
- ✅ **MongoDB Atlas** - [mongodb.com/atlas](https://www.mongodb.com/atlas)
- ✅ **Cloudinary** - [cloudinary.com](https://cloudinary.com)
- ✅ **PayPal Developer** - [developer.paypal.com](https://developer.paypal.com)

### **2. Your GitHub Repository:**
- ✅ Already done: `https://github.com/AbDeLrHmAn20o2/Mocka-desgin.git`

## 🏗️ Services to Deploy

1. **API Gateway** → `api-gateway.mocka-design.evennode.com`
2. **Design Service** → `design-service.mocka-design.evennode.com`  
3. **Upload Service** → `upload-service.mocka-design.evennode.com`
4. **Subscription Service** → `subscription-service.mocka-design.evennode.com`

## 🚀 Step-by-Step Deployment

### **Step 1: Create Evennode Account**
1. Go to [evennode.com](https://www.evennode.com)
2. Click "Sign Up" - **Free Account**
3. Verify your email

### **Step 2: Set Up External Services**

#### **MongoDB Atlas (Database)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create **free cluster** (M0 - 512MB)
3. Create database user: `mocka_user` / `strong_password`
4. **Network Access**: Add `0.0.0.0/0` (allow all IPs)
5. **Get Connection String**: 
   ```
   mongodb+srv://mocka_user:strong_password@cluster.mongodb.net/mocka_design
   ```

#### **Cloudinary (Image Storage)**
1. Go to [Cloudinary](https://cloudinary.com) → Free account
2. Dashboard → **Get credentials**:
   - `cloud_name`: Your cloud name
   - `api_key`: Your API key  
   - `api_secret`: Your API secret

#### **PayPal Developer (Payments)**
1. Go to [PayPal Developer](https://developer.paypal.com)
2. **Create App** (Sandbox for testing)
3. Get credentials:
   - `CLIENT_ID`: Your client ID
   - `CLIENT_SECRET`: Your client secret

### **Step 3: Deploy Services to Evennode**

For **each service**, follow these steps:

#### **3.1 Deploy API Gateway**

**In Evennode Dashboard:**
1. **Create New App** → "API Gateway"
2. **Import from Git** → Your GitHub repo
3. **Branch**: `main`
4. **Root Directory**: `server/api-gateway`
5. **Package.json**: Upload custom (use `evennode-configs/api-gateway-package.json`)

**Environment Variables:**
```bash
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://mocka-desgin.vercel.app
GOOGLE_CLIENT_ID=865143657600-ohvp3fnrav83f725kp1a8k56aircomc6.apps.googleusercontent.com

# Service URLs (update after deploying other services)
DESIGN=https://design-service.mocka-design.evennode.com
UPLOAD=https://upload-service.mocka-design.evennode.com
SUBSCRIPTION=https://subscription-service.mocka-design.evennode.com
```

#### **3.2 Deploy Design Service**

**In Evennode Dashboard:**
1. **Create New App** → "Design Service"
2. **Import from Git** → Your GitHub repo  
3. **Root Directory**: `server/design-service`
4. **Package.json**: Upload custom (use `evennode-configs/design-service-package.json`)

**Environment Variables:**
```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://mocka_user:strong_password@cluster.mongodb.net/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
```

#### **3.3 Deploy Upload Service**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://mocka_user:strong_password@cluster.mongodb.net/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=

# Cloudinary
cloud_name=your-cloudinary-cloud-name
api_key=your-cloudinary-api-key
api_secret=your-cloudinary-api-secret

# AI (Optional)
STABILITY_API_KEY=your-stability-ai-key
```

#### **3.4 Deploy Subscription Service**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://mocka_user:strong_password@cluster.mongodb.net/mocka_design
JWT_SECRET=uqJhOyuWVOBTOryqI+WXH0zwFJxNQEiOi29d98oqbII=
FRONTEND_URL=https://mocka-desgin.vercel.app

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### **Step 4: Update API Gateway URLs**

After all services are deployed, **update API Gateway** environment variables:

```bash
DESIGN=https://design-service.mocka-design.evennode.com
UPLOAD=https://upload-service.mocka-design.evennode.com
SUBSCRIPTION=https://subscription-service.mocka-design.evennode.com
```

### **Step 5: Update Frontend (Vercel)**

**In Vercel Dashboard** → Your project → **Environment Variables**:

**Update:**
```bash
NEXT_PUBLIC_API_URL=https://api-gateway.mocka-design.evennode.com
```

**Redeploy** your Vercel app.

### **Step 6: Update Google OAuth**

**In Google Cloud Console:**
1. **APIs & Services** → **Credentials**
2. **Edit OAuth 2.0 Client**
3. **Add Authorized Origins**:
   - `https://mocka-desgin.vercel.app`
4. **Add Authorized Redirect URIs**:
   - `https://mocka-desgin.vercel.app/api/auth/callback/google`

## ✅ **Testing Your Deployment**

1. **Visit your Vercel app**: `https://mocka-desgin.vercel.app`
2. **Test user registration/login**
3. **Test design creation**
4. **Test image upload**
5. **Test subscription features**

## 🔧 **HTTPS/HTTP Issue Solutions**

✅ **Already Fixed:**
- ✅ CORS configured for HTTPS frontend
- ✅ Helmet security headers updated
- ✅ Multiple origin support added
- ✅ Preflight requests handled

## 💰 **Cost Breakdown**

- **Evennode**: Free tier (4 apps)
- **MongoDB Atlas**: 512MB free
- **Cloudinary**: 25GB free
- **Vercel**: Unlimited frontend
- **PayPal**: Free sandbox testing
- **Total Cost**: $0/month! 🎉

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: 
   - Check frontend URL in environment variables
   - Verify CORS origins in API Gateway

2. **Database Connection**: 
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format

3. **Service Communication**:
   - Ensure all service URLs are HTTPS
   - Check environment variables in API Gateway

4. **Authentication Issues**:
   - Verify Google OAuth redirect URIs
   - Check NextAuth configuration

## 🎉 **Success!**

Your complete **Mocka Design Platform** will be live at:
- **Frontend**: `https://mocka-desgin.vercel.app`
- **API Gateway**: `https://api-gateway.mocka-design.evennode.com`

**Accessible worldwide, completely free!** 🌍
