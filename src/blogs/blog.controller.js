import { v2 as cloudinary } from "cloudinary";
import Blog from "./blog.model.js";

// Cloudinary Global Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Buffer to Cloudinary Upload
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Helper: Slug Generator
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Space & special characters to hyphen
    .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens
};

// -------------------------------------------------------------
// ১. Create Single or Multiple Blogs
// -------------------------------------------------------------
export const createBlog = async (req, res) => {
  try {
    let blogData = req.body;

    // Array (Bulk Upload) নাকি Single Document সেকশন
    if (Array.isArray(blogData)) {
      blogData = blogData.map((item) => ({
        ...item,
        slug: item.slug || generateSlug(item.title),
      }));
      const savedBlogs = await Blog.insertMany(blogData);
      return res.status(201).json({
        success: true,
        message: "Blogs created successfully",
        data: savedBlogs,
      });
    }

    // Single Image File Handling
    if (req.file && req.file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      blogData.coverImage = cloudinaryResult.secure_url;
    }

    // Auto generate slug if missing
    if (!blogData.slug && blogData.title) {
      blogData.slug = generateSlug(blogData.title);
    }

    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: savedBlog,
    });
  } catch (error) {
    // Handling Duplicate Key Error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A blog with this title/slug already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------
// ২. Get All Blogs
// -------------------------------------------------------------
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------
// ৩. Get Blog by Slug
// -------------------------------------------------------------
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------
// ৪. Get Single Blog by ID
// -------------------------------------------------------------
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------
// ৫. Update Blog by ID
// -------------------------------------------------------------
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // File Upload
    if (req.file && req.file.buffer) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      updateData.coverImage = cloudinaryResult.secure_url;
    } else if (
      typeof updateData.coverImage === "string" &&
      updateData.coverImage.trim() === ""
    ) {
      delete updateData.coverImage;
    }

    // Regenerate slug if title is updated
    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A blog with this title/slug already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------
// ৬. Delete Blog by ID
// -------------------------------------------------------------
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};