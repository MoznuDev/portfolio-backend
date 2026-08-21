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
    },
    content: {
      type: String,
      required: [true, "Blog content is required"],
    },
    excerpt: {
      type: String,
    },
    category: {
      type: String,
      default: "General",
    },
    tags: [String],
    coverImage: {
      type: String,
      default: "",
    },
    author: {
      name: { type: String, default: "MD MOZNUR RAHMAN" },
      designation: { type: String, default: "Full Stack Developer" },
      avatar: { type: String, default: "" },
    },
    readTime: {
      type: String,
      default: "5 min read",
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
  { timestamps: true }
);

// Auto-generate slug before saving
blogSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

// Serverless Safety Check
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;