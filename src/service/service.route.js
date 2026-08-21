import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Service from "./service.model.js"; // mongoose model ইমপোর্ট (ক্যাপিটাল S দিয়ে)

const router = express.Router();

// Helper Function: Cloudinary Config & Upload
const uploadToCloudinary = (fileBuffer) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "services" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// -------------------------------------------------------------
// ১. GET Route: Fetch All Services
// -------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: services, // ✅ সঠিক ভ্যারিয়েবল পাস করা হয়েছে
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch services",
    });
  }
});

// -------------------------------------------------------------
// ২. POST Route: Create New Service
// -------------------------------------------------------------
router.post("/", upload.single("iconFile"), async (req, res) => {
  try {
    let { title, description, icon, technologies, features, isFeatured } = req.body;
    const file = req.file;

    // Array/JSON string হ্যান্ডলিং (যদি FormData থেকে এরেই পাঠানো হয়)
    if (typeof technologies === "string") {
      try { technologies = JSON.parse(technologies); } catch { technologies = technologies.split(",").map(item => item.trim()); }
    }
    if (typeof features === "string") {
      try { features = JSON.parse(features); } catch { features = features.split(",").map(item => item.trim()); }
    }

    let uploadedIconUrl = icon || "";

    // যদি ফাইলে কোনো ইমেজ আপলোড করা হয়
    if (file && file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer);
      uploadedIconUrl = cloudinaryResult.secure_url;
    }

    const serviceData = {
      title,
      description,
      icon: uploadedIconUrl,
      technologies: Array.isArray(technologies) ? technologies : [],
      features: Array.isArray(features) ? features : [],
      isFeatured: isFeatured !== undefined ? isFeatured : true,
    };

    const newService = await Service.create(serviceData); // ✅ Service.create সঠিক করা হয়েছে

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Service Save Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save Service",
    });
  }
});

// -------------------------------------------------------------
// ৩. PUT Route: Update Service
// -------------------------------------------------------------
router.put("/:id", upload.single("iconFile"), async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, icon, technologies, features, isFeatured } = req.body;
    const file = req.file;

    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Array/JSON string হ্যান্ডলিং
    if (typeof technologies === "string") {
      try { technologies = JSON.parse(technologies); } catch { technologies = technologies.split(",").map(item => item.trim()); }
    }
    if (typeof features === "string") {
      try { features = JSON.parse(features); } catch { features = features.split(",").map(item => item.trim()); }
    }

    let uploadedIconUrl = icon || existingService.icon;

    if (file && file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer);
      uploadedIconUrl = cloudinaryResult.secure_url;
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        title: title || existingService.title,
        description: description || existingService.description,
        icon: uploadedIconUrl,
        technologies: technologies || existingService.technologies,
        features: features || existingService.features,
        isFeatured: isFeatured !== undefined ? isFeatured : existingService.isFeatured,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Service Update Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update Service",
    });
  }
});

// -------------------------------------------------------------
// ৪. DELETE Route: Delete Service
// -------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Service Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete Service",
    });
  }
});

export default router;