import cors from "cors";

// ১. Client URL তালিকা প্রস্তুত করা (Trailing slash সরিয়ে)
const allowedOrigins = [
  "https://portfolio-client-one-tau.vercel.app",
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

    // Origin ম্যাচ করছে কি না বা Vercel Preview URL কি না চেক
    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      // new Error() না দিয়ে false দিলে ব্রাউজার নিজেই পরিষ্কার CORS Error দেখাবে, Express Server 500 দিয়ে ক্র্যাশ করবে না।
      callback(null, false);
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
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
