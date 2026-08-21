import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ======================
// Routes Import (ESM Syntax)
// ======================
import statsRoute from "./src/stats/stats.route.js";
import userRoute from "./src/users/user.route.js";
import blogRoute from "./src/blogs/blog.route.js";
import heroBannerRoute from "./src/heroBanner/heroBanner.route.js";
import reviewRoute from "./src/reviews/review.route.js";
import projectRoute from "./src/projects/project.route.js";
import contactRoute from "./src/contacts/contact.route.js";
import serviceRoute from "./src/service/service.route.js";
import skillRoute from "./src/skills/skill.route.js";
import testimonialRoute from "./src/testimonials/testimonial.route.js";
import clientRoute from "./src/client/client.route.js";
import resumeRoute from "./src/resumes/resume.route.js";

// ======================
// Dynamic Allowed Origins for CORS (Fixed)
// ======================
const allowedOrigins = [
  "https://portfolio-client-one-tau.vercel.app",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Postman, cURL বা Server-to-Server রিকোয়েস্টের জন্য
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    const isAllowed = allowedOrigins.some(
      (o) => o.replace(/\/$/, "") === cleanOrigin,
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      // ❌ Error না পাঠিয়ে false পাঠালে Express crash বা next error দেবে না
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
// Payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ======================
// Database Connection (Vercel & Local Cached Pattern)
// ======================
let cachedPromise = null;

async function connectDB() {
  // ১. যদি ইতোমধ্যে কানেক্টেড থাকে, তবে সরাসরি রিটার্ন করুন
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // ২. যদি কনেকশন প্রসেসিংয়ে থাকে, তবে নতুন করে কল না করে প্রমিজ রিইউজ করুন
  if (cachedPromise) {
    return cachedPromise;
  }

  // ৩. প্রথমবার কানেকশন ট্রাই
  cachedPromise = mongoose
    .connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 15000, // ১৫ সেকেন্ড টাইমআউট
    })
    .then((m) => {
      console.log("MongoDB Connected Successfully");
      return m;
    })
    .catch((err) => {
      cachedPromise = null; // ফেল করলে ক্যাশ ক্লিয়ার করুন
      console.error("MongoDB Connection Failed:", err.message);
      throw err;
    });

  return cachedPromise;
}

// DB Connection Middleware (Serverless/Vercel Safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database Connection Failure. Please check IP Whitelist.",
    });
  }
});

// ======================
// Routes Setup
// ======================
app.use("/api/auth", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/hero-banner", heroBannerRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/projects", projectRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/services", serviceRoute);
app.use("/api/skill", skillRoute);
app.use("/api/testimonials", testimonialRoute);
app.use("/api/clients", clientRoute);
app.use("/api/stats", statsRoute);
app.use("/api/resumes", resumeRoute);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio Server API is running",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Log:", err.stack || err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Local Development vs Vercel
if (process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error(
        "Failed to start local server due to DB connection:",
        err.message,
      );
    });
}

export default app;
