import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get(
  "/stats",
  verifyToken,
  authorizeRoles("ADMIN", "STAFF"),
  getDashboardStats,
);

export default router;
