# 🚀 Deployment Guide - Mocka Design Platform

This guide will help you deploy your Mocka Design Platform to free hosting services so anyone can access it online.

## 📋 Prerequisites

- Your code is already pushed to GitHub: ✅ **Done!**
- GitHub account: Required
- Accounts needed (all free):
  - [Vercel](https://vercel.com) - Frontend hosting
  - [Railway](https://railway.app) - Backend hosting  
  - [MongoDB Atlas](https://www.mongodb.com/atlas) - Database

## 🎯 Deployment Steps

### Step 1: Deploy Database (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up with Google/GitHub
   - Create a new project

2. **Create Free Cluster**
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free forever)
   - Choose your preferred region
   - Create cluster

3. **Setup Database Access**
   - Go to "Database Access"
   - Add new database user
   - Username: `admin`
   - Password: Generate secure password (save it!)
   - Grant "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Save this for later!

### Step 2: Deploy Backend Services (Railway)

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub
   - Connect your GitHub account

2. **Deploy API Gateway**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `Mocka-desgin` repository
   - **Important**: Set root directory to `server/api-gateway`
   - Railway will auto-detect the Dockerfile and deploy

3. **Configure Environment Variables**
   - In your Railway project, go to "Variables"
   - Add these variables:
   ```
   PORT=4000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   ```

4. **Get Your API URL**
   - After deployment, Railway will give you a URL like:
   - `https://your-app-name.up.railway.app`
   - Save this URL - you'll need it for the frontend!

5. **Deploy Other Services (Optional)**
   - Repeat the process for other services if needed:
   - `server/design-service`
   - `server/subscription-service` 
   - `server/upload-service`

### Step 3: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Connect your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import `Mocka-desgin` repository
   - **CRITICAL**: Set "Root Directory" to `client`
   - Framework Preset: Next.js (auto-detected)

3. **Configure Environment Variables**
   - Before deploying, add these environment variables:
   ```
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=https://your-vercel-app.vercel.app
   API_GATEWAY_URL=https://your-railway-backend.up.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://mocka-desgin.vercel.app`

## 🔧 Post-Deployment Configuration

### Update CORS Settings
Your backend needs to allow requests from your frontend domain. Update your API Gateway CORS settings to include your Vercel domain.

### Test Your Application
1. Visit your Vercel URL
2. Try creating a design
3. Test user authentication
4. Verify all features work

## 🌟 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited static deployments
- ✅ 100GB bandwidth/month
- ✅ Custom domains
- ✅ Automatic HTTPS

### Railway (Backend)  
- ✅ $5 free credit/month
- ✅ 512MB RAM per service
- ✅ Automatic deployments
- ✅ Custom domains

### MongoDB Atlas (Database)
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ No time limit

## 🚨 Important Notes

1. **Keep your MongoDB connection string secure**
2. **Use strong passwords for JWT secrets**
3. **Monitor your Railway usage to stay within free limits**
4. **Vercel deployments are automatic from GitHub**

## 🆘 Troubleshooting

### Common Issues:
- **Build fails**: Check your environment variables
- **Database connection fails**: Verify MongoDB Atlas IP whitelist
- **API calls fail**: Check CORS settings and API URLs
- **Authentication fails**: Verify NEXTAUTH_URL matches your domain

### Getting Help:
- Check Railway logs for backend issues
- Check Vercel function logs for frontend issues
- Verify all environment variables are set correctly

## 🎉 Success!

Once deployed, your Mocka Design Platform will be live and accessible to anyone worldwide!

**Frontend URL**: `https://your-app.vercel.app`
**Backend URL**: `https://your-api.up.railway.app`

Share your application with the world! 🌍