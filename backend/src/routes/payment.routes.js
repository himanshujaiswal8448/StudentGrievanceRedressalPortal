import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";

import {
  createOrder,
  verifyPayment,
  getMyPayments,
  getAllPayments,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", verifyToken, createOrder);

router.post("/verify", verifyToken, verifyPayment);

router.get("/my", verifyToken, getMyPayments);

router.get(
  "/all",
  verifyToken,
  requireRole("admin", "superAdmin"),
  getAllPayments,
);

export default router;
