/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize Fast Refresh
  experimental: {
    optimizeCss: false, // Disable CSS optimization in dev to reduce rebuilds
  },
  
  // Reduce unnecessary rebuilds
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize watch options
      config.watchOptions = {
        poll: false,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
          '**/coverage/**',
          '**/public/**'
        ],
      };
    }
    
    return config;
  },
};

export default nextConfig;
