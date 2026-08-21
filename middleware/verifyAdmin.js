import { errorResponse } from "../utilis/responsHandler.js";

const verifyAdmin = (req, res, next) => {
  // 💡 req.role অথবা req.user.role - যেকোনো জায়গা থেকে রোল সংগ্রহ
  const userRole = req.role || req.user?.role;

  if (!userRole || userRole !== 'admin') {
    return errorResponse(res, 403, "Forbidden access! Admin role required.");
  }

  next();
};

export default verifyAdmin;