import express from "express";
import { trackShipment } from "../controllers/tracking.controller.js";

const router = express.Router();

router.get("/:consignmentA", trackShipment);

export default router;
