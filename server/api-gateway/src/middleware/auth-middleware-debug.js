const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req, res, next) {
  // TEMPORARY BYPASS FOR DEBUGGING - REMOVE IN PRODUCTION
  console.log('🔍 Auth middleware - debugging mode');
  console.log('🔍 Headers:', JSON.stringify(req.headers, null, 2));
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log('🔍 Token present:', !!token);
  console.log('🔍 Token preview:', token ? token.substring(0, 50) + '...' : 'none');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      error: "Access denied! No Token provided",
      debug: "No authorization header or token found"
    });
  }

  try {
    console.log('🔍 Attempting token verification...');
    console.log('🔍 Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    
    // Add more detailed error logging
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
      clockSkew: 600, // 10 minutes
    });

    const payload = ticket.getPayload();
    console.log('✅ Token verified successfully for user:', payload.email);
    console.log('🔍 User ID extracted:', payload.sub);

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    console.log('🔍 req.user set to:', JSON.stringify(req.user, null, 2));
    next();
  } catch (error) {
    console.error('🚨 Token verification failed:', error.message);
    console.error('🚨 Error details:', error);
    
    // More specific error responses
    if (error.message.includes('audience')) {
      return res.status(401).json({
        error: "Token audience mismatch",
        code: "AUDIENCE_MISMATCH",
        details: "Token was issued for a different client ID",
        expected: process.env.GOOGLE_CLIENT_ID,
        debug: error.message
      });
    }
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: "Token has expired",
        code: "TOKEN_EXPIRED",
        details: "Please login again to get a fresh token",
        debug: error.message
      });
    }

    return res.status(401).json({
      error: "Invalid token",
      code: "TOKEN_INVALID",
      details: error.message,
      debug: "Token verification failed"
    });
  }
}

module.exports = authMiddleware;