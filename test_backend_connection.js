// Test script to verify backend connection
// Run this with Node.js to test your backend API

const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function testBackendConnection() {
  console.log("🧪 Testing Backend Connection...\n");

  try {
    // Test 1: Check if server is running
    console.log("1️⃣ Testing server connection...");
    const healthCheck = await axios.get(`${BASE_URL}/api/ads`);
    console.log("✅ Server is running");
    console.log(
      "📊 Services found:",
      healthCheck.data.services?.length || healthCheck.data.length || 0
    );
    console.log("");

    // Test 2: Test packages endpoint
    console.log("2️⃣ Testing packages endpoint...");
    const packagesCheck = await axios.get(`${BASE_URL}/api/packages`);
    console.log("✅ Packages endpoint working");
    console.log(
      "📦 Packages found:",
      packagesCheck.data.packages?.length || packagesCheck.data.length || 0
    );
    console.log("");

    // Test 3: Test vendor dashboard (will fail without auth, but should not be 404)
    console.log("3️⃣ Testing vendor dashboard endpoint...");
    try {
      await axios.get(`${BASE_URL}/api/vendor/dashboard`);
      console.log("❌ Dashboard should require authentication");
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("✅ Dashboard endpoint exists (requires auth)");
      } else if (error.response?.status === 404) {
        console.log("❌ Dashboard endpoint not found");
      } else {
        console.log(
          "✅ Dashboard endpoint exists (status:",
          error.response?.status,
          ")"
        );
      }
    }
    console.log("");

    console.log("🎉 Backend connection test completed successfully!");
    console.log("📝 Make sure to:");
    console.log("   - Start your backend server");
    console.log("   - Check that the routes are properly mounted");
    console.log("   - Verify the API base URL in your frontend");
  } catch (error) {
    console.error("❌ Backend connection test failed:");

    if (error.code === "ECONNREFUSED") {
      console.error("   - Server is not running");
      console.error("   - Check if your backend server is started");
      console.error("   - Verify the port number (default: 5000)");
    } else if (error.response?.status === 404) {
      console.error("   - Endpoint not found");
      console.error("   - Check if routes are properly mounted");
      console.error("   - Verify the API path structure");
    } else {
      console.error("   - Error:", error.message);
      console.error("   - Status:", error.response?.status);
      console.error("   - Response:", error.response?.data);
    }

    console.log("\n🔧 Troubleshooting steps:");
    console.log("   1. Start your backend server: npm start or node server.js");
    console.log("   2. Check server console for any errors");
    console.log("   3. Verify the API routes are mounted correctly");
    console.log("   4. Check if the port matches your frontend configuration");
  }
}

// Run the test
testBackendConnection();
