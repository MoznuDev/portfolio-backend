import mongoose from "mongoose";

// ১. রিভিউ এর জন্য আলাদা সাব-স্কিমা
const reviewSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // এটি রিভিউর সাথে createdAt ও updatedAt সেভ করবে
  }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    projectImage: {
      type: String,
      trim: true,
      default: "",
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    category: {
      type: String,
      enum: ["Full Stack", "Frontend", "Backend", "Mobile App"],
      default: "Full Stack",
      trim: true,
    },

    // আলাদা ক্লায়েন্ট ও সার্ভার রিপোজিটরির সুবিধার জন্য
    githubClient: {
      type: String,
      trim: true,
      default: "",
    },

    githubServer: {
      type: String,
      trim: true,
      default: "",
    },

    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["completed", "ongoing", "planned"],
      default: "completed",
    },

    order: {
      type: Number,
      default: 0,
    },

    // 👈 ২. প্রতিটি প্রজেক্টের নির্দিষ্ট রিভিউ সেভ রাখতে এই ফিল্ডটি যুক্ত করা হলো
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

// Serverless Deployment (Vercel/Next.js) Safety Check
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;