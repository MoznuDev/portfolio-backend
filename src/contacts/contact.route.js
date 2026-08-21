import express from "express";
import {
  createContact,
  getContacts,
  deleteContact,
} from "./contact.controller.js";

const router = express.Router();

// Base Path: /api/contacts
router.post("/", createContact);
router.get("/", getContacts);
router.delete("/:id", deleteContact);

export default router;