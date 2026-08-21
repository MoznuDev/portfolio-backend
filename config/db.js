import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // DB_URL চেক করা
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not defined.");
    }

    const conn = await mongoose.connect(process.env.DB_URL, {
      // serverSelectionTimeoutMS রাখুন যাতে কানেকশন ফেইল করলে অ্যাপ ঝুলে না থাকে
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;