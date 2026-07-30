import express from "express";

import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// ADMIN + STAFF
router.get("/", verifyToken, authorizeRoles("ADMIN", "STAFF"), getBookings);

router.post("/", verifyToken, authorizeRoles("ADMIN", "STAFF"), createBooking);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", "STAFF"),
  updateBooking,
);

router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteBooking);

export default router;
