import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import HeroBanner from "./heroBanner.model.js";

const router = express.Router();

// ======================
// Cloudinary Configuration (Global Setup)
// ======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper Function: Stream Upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "hero_banners" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Multer Config (Memory Storage for Serverless)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// -------------------------------------------------------------
// ১. GET Route: Fetch Hero Banner
// -------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: banners,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch hero banner",
    });
  }
});

// -------------------------------------------------------------
// ২. POST Route: Create Hero Banner
// -------------------------------------------------------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      primaryBtnText,
      primaryBtnLink,
      secondaryBtnText,
      secondaryBtnLink,
      imageUrl, // যদি প্লেইন টেক্সট URL হিসেবে পাঠানো হয়
    } = req.body;
    const file = req.file;

    let uploadedImageUrl = imageUrl || "";

    if (file && file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer);
      uploadedImageUrl = cloudinaryResult.secure_url;
    }

    const bannerData = {
      title,
      subtitle,
      description,
      primaryBtnText,
      primaryBtnLink,
      secondaryBtnText,
      secondaryBtnLink,
      imageUrl: uploadedImageUrl,
    };

    const newBanner = await HeroBanner.create(bannerData);

    return res.status(201).json({
      success: true,
      message: "Hero Banner created successfully",
      data: newBanner,
    });
  } catch (error) {
    console.error("Hero Banner Save Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save hero banner",
    });
  }
});

// -------------------------------------------------------------
// ৩. PUT Route: Update Hero Banner
// -------------------------------------------------------------
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      primaryBtnText,
      primaryBtnLink,
      secondaryBtnText,
      secondaryBtnLink,
      imageUrl,
    } = req.body;
    const file = req.file;

    const existingBanner = await HeroBanner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: "Hero Banner not found",
      });
    }

    let uploadedImageUrl = imageUrl || existingBanner.imageUrl || "";

    if (file && file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(file.buffer);
      uploadedImageUrl = cloudinaryResult.secure_url;
    }

    const updatedBanner = await HeroBanner.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        description,
        primaryBtnText,
        primaryBtnLink,
        secondaryBtnText,
        secondaryBtnLink,
        imageUrl: uploadedImageUrl,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Hero Banner updated successfully",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Hero Banner Update Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update hero banner",
    });
  }
});

// -------------------------------------------------------------
// ৪. DELETE Route: Delete Hero Banner
// -------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBanner = await HeroBanner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({
        success: false,
        message: "Hero Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hero Banner deleted successfully",
    });
  } catch (error) {
    console.error("Hero Banner Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete hero banner",
    });
  }
});

export default router;