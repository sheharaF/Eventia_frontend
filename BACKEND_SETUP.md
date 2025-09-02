# Backend Setup Guide for Vendor Services

This guide will help you set up the backend to support the vendor service posting functionality.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install express mongoose multer cors dotenv jsonwebtoken bcryptjs
```

### 2. Update Your Main Server File

Make sure your main server file (e.g., `server.js` or `app.js`) includes the vendor routes:

```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./routes/authRoutes");

// Mount routes
app.use("/api/vendor", vendorRoutes);
app.use("/api/auth", authRoutes);

// Add these new routes for the marketplace
app.use("/api", vendorRoutes); // This will handle /api/ads and /api/packages

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Update Your Vendor Routes File

Replace your existing vendor routes with the corrected version from `backend_routes_fix.js`.

## 📁 Required Models

### Ads Model (`models/Ads.js`)

```javascript
const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "catering",
        "photography",
        "decor",
        "venue",
        "music",
        "transportation",
        "planning",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ad", adSchema);
```

### EventPackage Model (`models/EventPackage.js`)

```javascript
const mongoose = require("mongoose");

const eventPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    packageIncludes: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventPackage", eventPackageSchema);
```

## 🔐 Authentication Middleware

### Auth Middleware (`middleware/authMiddleware.js`)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const isVendor = (req, res, next) => {
  if (req.user.role !== "Vendor") {
    return res
      .status(403)
      .json({ error: "Access denied. Vendor role required." });
  }
  next();
};

module.exports = { verifyToken, isVendor };
```

## 🧪 Testing the Backend

### 1. Run the Test Script

```bash
node test_backend_connection.js
```

### 2. Test with Postman or Similar Tool

- **GET** `/api/ads` - Should return all services
- **POST** `/api/ads` - Should create a new service (requires auth)
- **GET** `/api/packages` - Should return all packages
- **POST** `/api/packages` - Should create a new package (requires auth)

### 3. Test Protected Endpoints

- **GET** `/api/vendor/dashboard` - Should require vendor authentication
- **GET** `/api/vendor/services` - Should return vendor's services

## 🔧 Common Issues & Solutions

### Issue: 404 Error on `/api/ads`

**Solution**: Make sure the vendor routes are mounted at `/api` in your main server file.

### Issue: Authentication Errors

**Solution**: Verify your JWT_SECRET is set in your environment variables.

### Issue: CORS Errors

**Solution**: Ensure CORS middleware is properly configured.

### Issue: Database Connection Errors

**Solution**: Check your MongoDB connection string and ensure the database is running.

## 📋 Environment Variables

Create a `.env` file in your backend root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventia
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

## 🚀 Starting the Server

```bash
# Development
npm run dev

# Production
npm start

# Or directly with Node
node server.js
```

## 📱 Frontend Integration

Once your backend is running, the frontend should be able to:

1. **Post Services**: Navigate to `/post-service` as a vendor
2. **View Services**: Visit `/services` to see the marketplace
3. **Manage Services**: Use the vendor dashboard at `/vendor/dashboard`

## 🔍 Debugging

### Check Server Logs

Look for any error messages in your server console.

### Verify Routes

Use the test script to verify all endpoints are accessible.

### Check Database

Ensure your MongoDB collections exist and have the correct schema.

### Test Authentication

Verify that JWT tokens are being generated and validated correctly.

## 📞 Support

If you encounter issues:

1. Check the server console for error messages
2. Verify all routes are properly mounted
3. Test individual endpoints with Postman
4. Check the database connection and schema
5. Verify environment variables are set correctly

The vendor service posting system should now work end-to-end! 🎉
