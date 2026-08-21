// responseHandler.js

export const successResponse = (res, statusCode = 200, message = "Success", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, statusCode = 500, message = "Something went wrong!", error = null) => {
  // ✅ Server-এ পুরো error log করা
  console.error("Error:", error?.stack || error);

  return res.status(statusCode).json({
    success: false,
    message,
    // ✅ Production-এ error details hide রাখা
    error: process.env.NODE_ENV === "development" ? error?.message : null,
  });
};