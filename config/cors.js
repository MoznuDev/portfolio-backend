import cors from "cors";

// ১. Client URL তালিকা প্রস্তুত করা (Trailing slash সরিয়ে)
const allowedOrigins = [
  "https://portfolio-client-ycup.vercel.app",
  "http://localhost:5173", // Vite React-এর ডিফল্ট পোর্ট
  "http://localhost:3000",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Postman, Mobile App বা Server-to-Server রিকোয়েস্টের জন্য (Origin না থাকলে)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    // Origin ম্যাচ করছে কি না চেক করা
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app"); // Vercel-এর যেকোনো প্রিভিউ ডোমেইন এলাউ করবে

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      // new Error দিয়ে দিলে ব্রাউজার স্পষ্টভাবে CORS Error নির্দেশ করবে
      callback(
        new Error(`CORS policy does not allow access from ${origin}`),
        false,
      );
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200, // পুরানো ব্রাউজার বা প্রক্সি সার্ভারের সামঞ্জস্যতার জন্য
};

export default cors(corsOptions);
