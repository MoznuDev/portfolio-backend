import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      tls: true,
      tlsAllowInvalidCertificates: true, // ISP SSL Inspection bypass করার জন্য
      serverSelectionTimeoutMS: 5000,   // ৫ সেকেন্ডের মধ্যে কানেক্ট না হলে এরর দেবে (অপেক্ষা করাবে না)
    });
    
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log("MongoDB Connection Failed:");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;