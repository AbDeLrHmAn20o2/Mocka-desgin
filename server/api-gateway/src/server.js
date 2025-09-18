require("dotenv").config();
const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");
const helmet = require("helmet");
const authMiddleware = require("./middleware/auth-middleware");

const app = express();
const PORT = process.env.PORT || 1337;

// Global error handler to prevent crashes
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  // Don't exit the process - keep the server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Promise Rejection at:', promise, 'reason:', reason);
  // Don't exit the process - keep the server running
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('📋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Security and parsing middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "http:"],
    },
  },
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://mocka-desgin.vercel.app",
    "https://mocka-desgin-git-main-abdelrhman20o2s-projects.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'x-request-timestamp',
    'x-request-id',
    'x-gateway-service'
  ]
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`📥 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const statusEmoji = status >= 500 ? '🚨' : status >= 400 ? '⚠️' : '✅';
    console.log(`📤 ${statusEmoji} ${req.method} ${req.originalUrl} - ${status} (${duration}ms)`);
  });
  
  next();
});

// Enhanced proxy options with better error handling
const createProxyOptions = (serviceName) => ({
  proxyReqPathResolver: (req) => {
    const newPath = req.originalUrl.replace(/^\/v1/, "/api");
    console.log(`🔄 Proxying ${serviceName}: ${req.originalUrl} -> ${newPath}`);
    return newPath;
  },
  proxyErrorHandler: (err, res, next) => {
    console.error(`🚨 Proxy error for ${serviceName}:`, err.message);
    
    // Don't crash the gateway - send appropriate error response
    if (!res.headersSent) {
      const statusCode = err.code === 'ECONNREFUSED' ? 503 : 502;
      res.status(statusCode).json({
        error: `${serviceName} service temporarily unavailable`,
        code: 'SERVICE_UNAVAILABLE',
        message: "The service is currently experiencing issues. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        serviceName: serviceName
      });
    }
  },
  timeout: 30000, // 30 second timeout
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    // Add service identification headers
    proxyReqOpts.headers = proxyReqOpts.headers || {};
    proxyReqOpts.headers['x-gateway-service'] = serviceName;
    proxyReqOpts.headers['x-request-id'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return proxyReqOpts;
  }
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    services: {
      design: process.env.DESIGN || 'not configured',
      upload: process.env.UPLOAD || 'not configured', 
      subscription: process.env.SUBSCRIPTION || 'not configured'
    }
  });
});

// Root endpoint for Back4App health checks
app.get('/', (req, res) => {
  res.json({
    message: 'Mocka Design API Gateway',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Service routes with enhanced error handling
try {
  // Only set up proxies for configured services
  if (process.env.DESIGN) {
    app.use(
      "/v1/designs",
      authMiddleware,
      proxy(process.env.DESIGN, createProxyOptions('Design Service'))
    );
  } else {
    console.log('⚠️ DESIGN service not configured - skipping proxy setup');
  }

  if (process.env.UPLOAD) {
    app.use(
      "/v1/media/upload",
      authMiddleware,
      proxy(process.env.UPLOAD, {
        ...createProxyOptions('Upload Service'),
        parseReqBody: false, // Don't parse body for file uploads
      })
    );

    app.use(
      "/v1/media",
      authMiddleware,
      proxy(process.env.UPLOAD, createProxyOptions('Media Service'))
    );
  } else {
    console.log('⚠️ UPLOAD service not configured - skipping proxy setup');
  }

  if (process.env.SUBSCRIPTION) {
    app.use(
      "/v1/subscription", 
      authMiddleware,
      proxy(process.env.SUBSCRIPTION, createProxyOptions('Subscription Service'))
    );
  } else {
    console.log('⚠️ SUBSCRIPTION service not configured - skipping proxy setup');
  }
  
} catch (error) {
  console.error('🚨 Error setting up proxy routes:', error);
}

// Global error handler middleware
app.use((error, req, res, next) => {
  console.error('🚨 Gateway error:', error);
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal gateway error',
      code: 'GATEWAY_ERROR',
      message: 'The API Gateway encountered an unexpected error',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❓ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    message: `The requested route ${req.method} ${req.originalUrl} was not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Gateway is running on port ${PORT}`);
  console.log(`🔗 DESIGN Service: ${process.env.DESIGN || 'NOT CONFIGURED'}`);
  console.log(`🔗 UPLOAD Service: ${process.env.UPLOAD || 'NOT CONFIGURED'}`);
  console.log(`🔗 SUBSCRIPTION Service: ${process.env.SUBSCRIPTION || 'NOT CONFIGURED'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🏥 Health check available at: http://0.0.0.0:${PORT}/health`);
});

server.on('error', (error) => {
  console.error('🚨 Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
});

// Export for testing
module.exports = app;
