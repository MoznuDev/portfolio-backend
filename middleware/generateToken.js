import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_jwt_secret_key";

// আর্গুমেন্টটি একটি Object হিসেবে প্যাক করে দেওয়া হলো 
const generateToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn,
  });
};

export default generateToken;