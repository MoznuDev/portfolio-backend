import express from "express";
import { getClients, createClient } from "./client.Controller.js";

const router = express.Router();
router.get("/", getClients);
router.post("/", createClient);

export default router;