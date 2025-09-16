import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { errorHandler } from "./error-handler";
import { tokenManager } from "./token-manager";
import { useTokenStore } from "@/store/token-store";
import { toast } from "sonner";
import { emergencyAuthCleanup } from "@/utils/auth-cleanup";
import { logger, LOG_CATEGORIES } from "@/utils/logger";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds timeout

// Global state to prevent duplicate error handling
let isHandlingTokenError = false;
let tokenErrorPromise = null;

// Add axios interceptor to handle token errors globally
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only handle auth-related errors
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      console.log(`🔍 Intercepted 401 error with code: ${errorCode}`);

      // Prevent multiple simultaneous error handlers
      if (isHandlingTokenError && tokenErrorPromise) {
        console.log("⏳ Token error handling already in progress, waiting...");
        try {
          await tokenErrorPromise;
        } catch (e) {
          console.error("❌ Token error handler failed:", e);
        }
        // Don't retry the original request if error handling failed
        return Promise.reject(error);
      }

      if (errorCode === "TOKEN_EXPIRED" || errorCode === "TOKEN_EXTREMELY_STALE") {
        console.log("🚨 Token expired/stale detected, attempting recovery...");
        
        // Mark as handling and create promise for coordination
        isHandlingTokenError = true;
        tokenErrorPromise = handleTokenRecovery(error, errorCode);
        
        try {
          const shouldRetry = await tokenErrorPromise;
          
          if (shouldRetry) {
            console.log("✅ Token recovered, retrying request...");
            
            // Get fresh session and retry
            const freshSession = await getSession();
            if (freshSession?.idToken) {
              const originalRequest = error.config;
              originalRequest.headers.Authorization = `Bearer ${freshSession.idToken}`;
              return axios(originalRequest);
            }
          }
        } catch (recoveryError) {
          console.error("❌ Token recovery failed:", recoveryError);
        } finally {
          // Reset state
          isHandlingTokenError = false;
          tokenErrorPromise = null;
        }
        
        return Promise.reject(error);
      }

      if (errorCode === "TOKEN_TOO_EARLY") {
        // Show user-friendly message for clock sync issues
        toast.error("Clock Sync Issue", {
          id: "clock-sync-error", // Prevent duplicates
          description: "Please check your system time and try again.",
          duration: 5000,
        });
        return Promise.reject(error);
      }

      if (errorCode === "INVALID_TOKEN" || errorCode === "INVALID_AUDIENCE") {
        console.log("🚨 Invalid token detected, forcing cleanup...");
        
        if (!isHandlingTokenError) {
          isHandlingTokenError = true;
          emergencyAuthCleanup();
          
          setTimeout(() => {
            isHandlingTokenError = false;
          }, 5000);
        }
        
        return Promise.reject(error);
      }
    }

    // For non-auth errors, pass through to error handler
    if (error.response?.status >= 500) {
      console.log(`🚨 Server error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
    }

    return Promise.reject(error);
  }
);

// Handle token recovery with proper coordination
async function handleTokenRecovery(originalError, errorCode) {
  try {
    logger.warn(LOG_CATEGORIES.TOKEN, "Starting token recovery process", {
      errorCode,
      originalStatus: originalError.response?.status,
      endpoint: originalError.config?.url
    });
    
    // Clear potentially stale session data first
    const tokenStore = useTokenStore.getState();
    tokenStore.clearTokens();
    
    // For extremely stale tokens, force emergency cleanup immediately
    if (errorCode === "TOKEN_EXTREMELY_STALE") {
      logger.critical(LOG_CATEGORIES.TOKEN, "Extremely stale token detected - forcing emergency cleanup", {
        errorCode,
        url: originalError.config?.url
      });
      emergencyAuthCleanup();
      return false;
    }
    
    // Try to get a completely fresh session
    const freshSession = await getSession();
    
    if (freshSession && freshSession.idToken) {
      logger.info(LOG_CATEGORIES.TOKEN, "Fresh session obtained successfully", {
        hasIdToken: !!freshSession.idToken,
        hasRefreshToken: !!freshSession.refreshToken,
        expires: freshSession.expires
      });
      
      // Update token store with fresh session
      tokenStore.setTokens({
        accessToken: freshSession.idToken,
        refreshToken: freshSession.refreshToken,
        expiresAt: freshSession.expires
          ? new Date(freshSession.expires).getTime()
          : Date.now() + 60 * 60 * 1000,
      });
      
      return true; // Indicate recovery was successful
    } else {
      throw new Error("No fresh session available after cleanup");
    }
  } catch (recoveryError) {
    logger.critical(LOG_CATEGORIES.TOKEN, "Token recovery failed completely", {
      originalErrorCode: errorCode,
      recoveryError: recoveryError.message,
      endpoint: originalError.config?.url
    }, recoveryError);
    
    emergencyAuthCleanup();
    return false;
  }
}

export async function fetchWithAuth(endpoint, options = {}) {
  const context = {
    endpoint,
    retryKey: `${options.method || "GET"}_${endpoint}`,
    ...options.context,
  };

  return errorHandler.retryWithBackoff(async () => {
    console.log(`🔄 Making authenticated request to: ${endpoint}`);
    
    // Always get fresh session for reliable token
    const session = await getSession();

    if (!session) {
      console.error("❌ No session available");
      throw new Error("Not authenticated");
    }

    // Check if we have a valid ID token
    if (!session.idToken) {
      console.error("❌ No ID token available in session");
      throw new Error("No ID token available in session");
    }

    const tokenStore = useTokenStore.getState();

    // Update token store with current session data
    tokenStore.setTokens({
      accessToken: session.idToken,
      refreshToken: session.refreshToken,
      expiresAt: session.expires
        ? new Date(session.expires).getTime()
        : Date.now() + 60 * 60 * 1000,
    });

    // Handle token expiry proactively
    if (tokenStore.isTokenExpired()) {
      console.log("⚠️ Token is expired, attempting recovery...");
      
      const recovered = await tokenManager.handleTokenExpired();
      if (!recovered) {
        console.error("❌ Failed to recover from token expiry");
        throw new Error("Failed to refresh expired token");
      }
      
      // Get session again after recovery
      const refreshedSession = await getSession();
      if (!refreshedSession?.idToken) {
        console.error("❌ No token available after recovery");
        throw new Error("No token available after recovery");
      }
    } else if (tokenStore.isTokenExpiringSoon() && !tokenStore.isRefreshing) {
      // Start silent refresh in background for tokens expiring soon
      console.log("ℹ️ Token expiring soon, starting background refresh...");
      tokenManager.refreshTokenSilently().catch(err => {
        console.warn("⚠️ Background refresh failed:", err.message);
      });
    }

    const requestConfig = {
      url: `${API_URL}${endpoint}`,
      method: options.method || "GET",
      headers: {
        Authorization: `Bearer ${session.idToken}`,
        "Content-Type": "application/json",
        "x-request-timestamp": new Date().toISOString(),
        ...options.headers,
      },
      data: options.body,
      params: options.params,
      timeout: options.timeout || 30000,
    };

    console.log(`📤 Request: ${requestConfig.method} ${requestConfig.url}`);
    
    const response = await axios(requestConfig);
    
    console.log(`📥 Response: ${response.status} for ${endpoint}`);
    return response.data;
  }, context);
}

// Fallback function for non-authenticated requests
export async function fetchWithoutAuth(endpoint, options = {}) {
  const context = {
    endpoint,
    retryKey: `public_${options.method || "GET"}_${endpoint}`,
    ...options.context,
  };

  return errorHandler.retryWithBackoff(async () => {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      data: options.body,
      params: options.params,
      timeout: options.timeout || 30000,
    });

    return response.data;
  }, context);
}
