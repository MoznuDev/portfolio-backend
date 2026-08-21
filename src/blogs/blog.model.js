import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // ফাস্ট কুয়েরির জন্য
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    author: {
      name: { type: String, default: "MD MOZNUR RAHMAN", trim: true },
      designation: { type: String, default: "Full Stack Developer", trim: true },
      avatar: { type: String, default: "", trim: true },
    },
    readTime: {
      type: String,
      default: "5 min read",
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

// 1. Save এর আগে অটো স্লাগ জেনারেট করার মিডলওয়্যার
blogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// 2. Update এর সময় টাইটেল চেঞ্জ হলে স্লাগ আপডেট করার মিডলওয়্যার
blogSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }
  next();
});

// Serverless Safety Model Export
const Blog =
  mongoose.models && mongoose.models.Blog
    ? mongoose.models.Blog
    : mongoose.model("Blog", blogSchema);

export default Blog;