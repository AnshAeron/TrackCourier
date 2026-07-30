import express from "express";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("ADMIN"), getUsers);

router.post("/", verifyToken, authorizeRoles("ADMIN"), createUser);

router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateUser);

router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteUser);

export default router;
