import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ======================
// Routes Import
// ======================
import statsRoute from "./src/stats/stats.route.js";
import userRoute from "./src/users/user.route.js";
import blogRoute from "./src/blogs/blog.route.js";
import heroBannerRoute from "./src/heroBanner/heroBanner.route.js";
import reviewRoute from "./src/review/review.route.js";
import projectRoute from "./src/project/project.route.js";
import contactRoute from "./src/contacts/contact.route.js";
import serviceRoute from "./src/service/service.route.js";
import skillRoute from "./src/skill/skill.route.js";
import testimonialRoute from "./src/testimonials/testimonial.route.js";
import clientRoute from "./src/client/client.route.js";
import resumeRoute from "./src/resumes/resume.route.js";

// ======================
// Dynamic CORS (All Vercel Apps Allowed)
// ======================
const allowedOrigins = [
  "https://portfolio-client-l39a.vercel.app",
  "http://localhost:5173", // Vite default port
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Postman or server-to-server requests
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    // Allow listed domains or any Vercel domain (*.vercel.app)
    const isAllowed =
      allowedOrigins.some((o) => o.replace(/\/$/, "") === cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS Blocked Origin:", origin);
      callback(new Error(`CORS blocked for origin: ${origin}`), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ======================
// Database Connection
// ======================
let cachedPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = mongoose
    .connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 15000,
    })
    .then((m) => {
      console.log("MongoDB Connected Successfully");
      return m;
    })
    .catch((err) => {
      cachedPromise = null;
      console.error("MongoDB Connection Failed:", err.message);
      throw err;
    });

  return cachedPromise;
}

// DB Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        "Database Connection Failure. Please check IP Whitelist (0.0.0.0/0).",
    });
  }
});

// ======================
// Routes Setup
// ======================
// ======================
// Routes Setup (Fixed Singular & Plural Paths)
// ======================
app.use("/api/auth", userRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/hero-banner", heroBannerRoute);

app.use("/api/review", reviewRoute);

// Projects (Both Singular and Plural)
app.use("/api/project", projectRoute);

app.use("/api/contacts", contactRoute);

// Services (Both Singular and Plural)
app.use("/api/service", serviceRoute);

// Skills (Both Singular and Plural)
app.use("/api/skill", skillRoute);

app.use("/api/testimonials", testimonialRoute);

// Clients (Both Singular and Plural)
app.use("/api/client", clientRoute);

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
    message: `Route not found: ${req.originalUrl}`,
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

// Local Development Engine
if (process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("Failed to start local server:", err.message);
    });
}

export default app;
