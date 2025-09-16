/**
 * Test Token Management System
 * Run this in your browser console to test the improvements
 */

// Test 1: Logger functionality
console.log("🧪 Testing Logger...");
import("../src/utils/logger.js").then(({ logger, LOG_CATEGORIES }) => {
  logger.info(LOG_CATEGORIES.TOKEN, "Test log entry", { testData: "success" });
  logger.warn(LOG_CATEGORIES.AUTH, "Test warning", { warning: true });
  logger.error(LOG_CATEGORIES.API, "Test error", { error: true });
  
  // Performance test
  logger.startPerformanceTracking("test_operation");
  setTimeout(() => {
    logger.endPerformanceTracking("test_operation", { result: "completed" });
    console.log("✅ Logger test completed");
  }, 100);
});

// Test 2: Token Store functionality
console.log("🧪 Testing Token Store...");
import("../src/store/token-store.js").then(({ useTokenStore }) => {
  const store = useTokenStore.getState();
  
  // Test token expiry logic
  store.setTokens({
    accessToken: "test_token",
    refreshToken: "test_refresh",
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  
  console.log("Token expires soon:", store.isTokenExpiringSoon());
  console.log("Token expired:", store.isTokenExpired());
  console.log("Time until expiry:", store.getTimeUntilExpiration() / 1000, "seconds");
  
  console.log("✅ Token Store test completed");
});

// Test 3: Error Handler functionality
console.log("🧪 Testing Error Handler...");
import("../src/services/error-handler.js").then(({ errorHandler }) => {
  // Test error categorization
  const networkError = { code: "ECONNABORTED" };
  const authError = { response: { status: 401 } };
  const serverError = { response: { status: 500 } };
  
  console.log("Network error category:", errorHandler.categorizeError(networkError));
  console.log("Auth error category:", errorHandler.categorizeError(authError));
  console.log("Server error category:", errorHandler.categorizeError(serverError));
  
  console.log("✅ Error Handler test completed");
});

// Test 4: Emergency cleanup simulation
console.log("🧪 Testing Emergency Cleanup...");
import("../src/utils/auth-cleanup.js").then(({ checkForStaleSession }) => {
  const isStale = checkForStaleSession();
  console.log("Stale session detected:", isStale);
  console.log("✅ Emergency cleanup test completed");
});

console.log("🎯 All tests initiated. Check console output above for results.");

// Development helper functions
window.debugTokens = {
  // Get token status
  status: () => {
    import("../src/store/token-store.js").then(({ useTokenStore }) => {
      const store = useTokenStore.getState();
      console.table({
        "Has Token": !!store.accessToken,
        "Is Refreshing": store.isRefreshing,
        "Is Expired": store.isTokenExpired(),
        "Expires Soon": store.isTokenExpiringSoon(),
        "Refresh Attempts": store.refreshAttempts,
        "Time Until Expiry": `${Math.floor(store.getTimeUntilExpiration() / 1000)}s`
      });
    });
  },
  
  // Get recent logs
  logs: (category = null, count = 20) => {
    import("../src/utils/logger.js").then(({ logger }) => {
      const logs = logger.getRecentLogs(count, category);
      console.table(logs);
    });
  },
  
  // Force refresh token
  refresh: () => {
    import("../src/services/token-manager.js").then(({ tokenManager }) => {
      tokenManager.refreshToken();
    });
  },
  
  // Clear all data and force login
  reset: () => {
    import("../src/utils/auth-cleanup.js").then(({ emergencyAuthCleanup }) => {
      emergencyAuthCleanup();
    });
  }
};

console.log("🛠️ Debug helpers available:");
console.log("- debugTokens.status() - Get current token status");
console.log("- debugTokens.logs() - Get recent logs");
console.log("- debugTokens.refresh() - Force token refresh");
console.log("- debugTokens.reset() - Emergency cleanup");