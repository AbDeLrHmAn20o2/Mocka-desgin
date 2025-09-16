# Mocka Design - Online Design Platform

A modern, full-featured design platform built with Next.js and Node.js microservices architecture.

## 🚀 Features

- **Advanced Design Editor**: Create stunning designs with professional tools
- **Template Library**: Pre-built templates for various design needs
- **Font Management**: Custom font support and typography controls
- **Export Options**: Download designs in multiple formats
- **User Authentication**: Secure login and user management
- **Subscription System**: Premium features and tier management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **Tailwind CSS** - Utility-first CSS framework
- **Fabric.js** - Powerful canvas library for design editing
- **NextAuth.js** - Authentication solution
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **Microservices Architecture**:
  - API Gateway
  - Design Service
  - Subscription Service
  - Upload Service

## 🏗️ Project Structure

```
.
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Backend microservices
│   ├── api-gateway/       # API Gateway service
│   ├── design-service/    # Design management service
│   ├── subscription-service/ # Subscription management
│   └── upload-service/    # File upload service
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbDeLrHmAn20o2/Mocka-desgin.git
   cd Mocka-desgin
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server/api-gateway
   npm install
   
   cd ../design-service
   npm install
   
   cd ../subscription-service
   npm install
   
   cd ../upload-service
   npm install
   ```

4. **Environment Setup**
   Create `.env.local` files in the client directory and `.env` files in each service directory.

5. **Start the services**
   
   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   
   **Backend Services:**
   ```bash
   # Terminal 1 - API Gateway
   cd server/api-gateway
   npm run dev
   
   # Terminal 2 - Design Service
   cd server/design-service
   npm run dev
   
   # Terminal 3 - Subscription Service
   cd server/subscription-service
   npm run dev
   
   # Terminal 4 - Upload Service
   cd server/upload-service
   npm run dev
   ```

## 🌐 Deployment

This application can be deployed on various free platforms:

### Frontend (Vercel - Recommended)
- Vercel provides excellent Next.js support
- Automatic deployments from GitHub
- Built-in environment variable management

### Backend (Railway/Render)
- Railway: Great for microservices
- Render: Reliable and free tier available
- Both support automatic deployments

## 📝 Environment Variables

### Client (.env.local)
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
API_GATEWAY_URL=http://localhost:4000
```

### Server Services (.env)
```
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

Project Link: [https://github.com/AbDeLrHmAn20o2/Mocka-desgin](https://github.com/AbDeLrHmAn20o2/Mocka-desgin)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Fabric.js](http://fabricjs.com/) - Canvas library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components