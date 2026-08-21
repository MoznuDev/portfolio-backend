import express from "express";

import {
  userRegistration,
  loginUser,
  userLogout,
  getAllUsers,
  deleteUser,
  updateUserRole,
  editUserProfile,
  forgotPassword,
} from "./user.controller.js";

const router = express.Router();

// Register
router.post("/register", userRegistration);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", userLogout);

// Users
router.get("/users", getAllUsers);

// Delete User
router.delete("/users/:id", deleteUser);

// Update Role
router.put("/users/:id", updateUserRole);

// Edit Profile
router.patch("/edit-profile/:id", editUserProfile);

// Forgot Password
router.post("/forgot-password", forgotPassword);

export default router;