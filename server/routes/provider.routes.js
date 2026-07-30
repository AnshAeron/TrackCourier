import express from "express";

import {
  createProvider,
  getProviders,
  updateProvider,
  deleteProvider,
} from "../controllers/provider.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET Providers
| Admin + Staff
|--------------------------------------------------------------------------
| Staff ko booking create karne ke liye providers ki list chahiye.
*/
router.get("/", verifyToken, authorizeRoles("ADMIN", "STAFF"), getProviders);

/*
|--------------------------------------------------------------------------
| CREATE Provider
| Admin Only
|--------------------------------------------------------------------------
*/
router.post("/", verifyToken, authorizeRoles("ADMIN"), createProvider);

/*
|--------------------------------------------------------------------------
| UPDATE Provider
| Admin Only
|--------------------------------------------------------------------------
*/
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateProvider);

/*
|--------------------------------------------------------------------------
| DELETE Provider
| Admin Only
|--------------------------------------------------------------------------
*/
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteProvider);

export default router;
