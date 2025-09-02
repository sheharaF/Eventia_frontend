const express = require("express");
const router = express.Router();
const Ad = require("../models/Ads");
const EventPackage = require("../models/EventPackage");
const EventPlan = require("../models/EventPlan");
const User = require("../models/User");
const { verifyToken, isVendor } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

// Get vendor dashboard overview
router.get("/dashboard", verifyToken, isVendor, async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Get vendor's services and packages
    const services = await Ad.find({ vendorId }).sort({ createdAt: -1 });
    const packages = await EventPackage.find({ vendorId }).sort({
      createdAt: -1,
    });

    // Get total earnings (from event plans that include this vendor)
    const eventPlans = await EventPlan.find({
      $or: [
        { "selectedVendors.vendorId": vendorId },
        { "selectedPackages.vendorId": vendorId },
      ],
      status: { $in: ["Confirmed", "Completed"] },
    });

    const totalEarnings = eventPlans.reduce((sum, plan) => {
      let planEarnings = 0;

      // Calculate earnings from services
      const vendorServices = plan.selectedVendors.filter(
        (v) => v.vendorId.toString() === vendorId
      );
      planEarnings += vendorServices.reduce(
        (s, service) => s + service.price * (service.quantity || 1),
        0
      );

      // Calculate earnings from packages
      const vendorPackages = plan.selectedPackages.filter(
        (p) => p.vendorId.toString() === vendorId
      );
      planEarnings += vendorPackages.reduce(
        (s, pkg) => s + pkg.price * (pkg.quantity || 1),
        0
      );

      return sum + planEarnings;
    }, 0);

    // Get pending bookings
    const pendingBookings = eventPlans.filter(
      (plan) => plan.status === "Planning"
    );

    // Get approved bookings
    const approvedBookings = eventPlans.filter(
      (plan) => plan.status === "Confirmed"
    );

    // Get completed bookings
    const completedBookings = eventPlans.filter(
      (plan) => plan.status === "Completed"
    );

    res.json({
      services: {
        total: services.length,
        list: services.slice(0, 5), // Show latest 5
      },
      packages: {
        total: packages.length,
        list: packages.slice(0, 5), // Show latest 5
      },
      earnings: {
        total: totalEarnings,
        thisMonth: 0, // TODO: Calculate monthly earnings
      },
      bookings: {
        pending: pendingBookings.length,
        approved: approvedBookings.length,
        completed: completedBookings.length,
        total: eventPlans.length,
      },
      recentActivity: eventPlans.slice(0, 10), // Show latest 10
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all services (for marketplace)
router.get("/ads", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      type = "",
      priceRange = "",
    } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by service type
    if (type && type !== "all") {
      query.serviceType = type;
    }

    // Filter by price range
    if (priceRange && priceRange !== "all") {
      switch (priceRange) {
        case "low":
          query.price = { $lt: 100 };
          break;
        case "medium":
          query.price = { $gte: 100, $lt: 500 };
          break;
        case "high":
          query.price = { $gte: 500 };
          break;
      }
    }

    const services = await Ad.find(query)
      .populate("vendorId", "name businessName rating")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Ad.countDocuments(query);

    res.json({
      services,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalCount: total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post service (matching frontend field names)
router.post("/ads", verifyToken, isVendor, async (req, res) => {
  try {
    const {
      name,
      serviceType,
      description,
      price,
      location,
      image,
      isActive = true,
    } = req.body;

    if (!name || !serviceType || !description || !price || !location) {
      return res.status(400).json({
        error:
          "name, serviceType, description, price, and location are required",
      });
    }

    const newService = new Ad({
      name,
      serviceType,
      description,
      price: parseFloat(price),
      location,
      image,
      isActive,
      vendorId: req.user.id,
    });

    const savedService = await newService.save();

    // Populate vendor info before sending response
    await savedService.populate("vendorId", "name businessName rating");

    res.status(201).json({
      message: "Service posted successfully",
      service: savedService,
    });
  } catch (error) {
    console.error("Post service error:", error);
    res.status(500).json({ error: "Failed to post service" });
  }
});

// Get all packages (for marketplace)
router.get("/packages", async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", priceRange = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by price range
    if (priceRange && priceRange !== "all") {
      switch (priceRange) {
        case "low":
          query.price = { $lt: 100 };
          break;
        case "medium":
          query.price = { $gte: 100, $lt: 500 };
          break;
        case "high":
          query.price = { $gte: 500 };
          break;
      }
    }

    const packages = await EventPackage.find(query)
      .populate("vendorId", "name businessName rating")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await EventPackage.countDocuments(query);

    res.json({
      packages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalCount: total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post package (matching frontend field names)
router.post("/packages", verifyToken, isVendor, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      location,
      packageIncludes,
      image,
      isActive = true,
    } = req.body;

    if (!name || !description || !price || !location || !packageIncludes) {
      return res.status(400).json({
        error:
          "name, description, price, location, and packageIncludes are required",
      });
    }

    // Parse packageIncludes if it's a JSON string
    let includesArray = packageIncludes;
    if (typeof packageIncludes === "string") {
      try {
        includesArray = JSON.parse(packageIncludes);
      } catch (e) {
        // If parsing fails, split by comma
        includesArray = packageIncludes
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }

    const newPackage = new EventPackage({
      name,
      description,
      price: parseFloat(price),
      location,
      packageIncludes: includesArray,
      image,
      isActive,
      vendorId: req.user.id,
    });

    const savedPackage = await newPackage.save();

    // Populate vendor info before sending response
    await savedPackage.populate("vendorId", "name businessName rating");

    res.status(201).json({
      message: "Package posted successfully",
      package: savedPackage,
    });
  } catch (error) {
    console.error("Post package error:", error);
    res.status(500).json({ error: "Failed to post package" });
  }
});

// Get vendor's services with pagination
router.get("/vendor/services", verifyToken, isVendor, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = { vendorId: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    const services = await Ad.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Ad.countDocuments(query);

    res.json({
      services,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalCount: total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor's packages with pagination
router.get("/vendor/packages", verifyToken, isVendor, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    let query = { vendorId: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const packages = await EventPackage.find(query)
      .populate("services", "name description price")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await EventPackage.countDocuments(query);

    res.json({
      packages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalCount: total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
router.put("/vendor/services/:id", verifyToken, isVendor, async (req, res) => {
  try {
    const service = await Ad.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Check if the user owns this service
    if (service.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Access denied. You can only update your own services",
      });
    }

    const updatedService = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update package
router.put("/vendor/packages/:id", verifyToken, isVendor, async (req, res) => {
  try {
    const package = await EventPackage.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Check if the user owns this package
    if (package.vendorId.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Access denied. You can only update your own packages",
      });
    }

    const updatedPackage = await EventPackage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
router.delete(
  "/vendor/services/:id",
  verifyToken,
  isVendor,
  async (req, res) => {
    try {
      const service = await Ad.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Check if the user owns this service
      if (service.vendorId.toString() !== req.user.id) {
        return res.status(403).json({
          error: "Access denied. You can only delete your own services",
        });
      }

      await Ad.findByIdAndDelete(req.params.id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete package
router.delete(
  "/vendor/packages/:id",
  verifyToken,
  isVendor,
  async (req, res) => {
    try {
      const package = await EventPackage.findById(req.params.id);
      if (!package) {
        return res.status(404).json({ error: "Package not found" });
      }

      // Check if the user owns this package
      if (package.vendorId.toString() !== req.user.id) {
        return res.status(403).json({
          error: "Access denied. You can only delete your own packages",
        });
      }

      const updatedPackage = await EventPackage.findByIdAndDelete(
        req.params.id
      );
      res.json({ message: "Package deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get vendor's bookings
router.get("/vendor/bookings", verifyToken, isVendor, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { "selectedVendors.vendorId": req.user.id },
        { "selectedPackages.vendorId": req.user.id },
      ],
    };

    if (status) {
      query.status = status;
    }

    const bookings = await EventPlan.find(query)
      .populate("userId", "name email")
      .populate("selectedVendors.serviceId", "name description")
      .populate("selectedPackages.packageId", "name description")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await EventPlan.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
        totalCount: total,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update vendor profile
router.put("/vendor/profile", verifyToken, isVendor, async (req, res) => {
  try {
    const { name, phone, address, businessRegistration } = req.body;
    const updateData = {};

    if (name?.trim()) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (address !== undefined) updateData.address = address?.trim() || null;
    if (businessRegistration)
      updateData.businessRegistration = businessRegistration;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone || null,
        address: updatedUser.address || null,
        isApproved: updatedUser.isApproved,
        businessRegistration: updatedUser.businessRegistration,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
