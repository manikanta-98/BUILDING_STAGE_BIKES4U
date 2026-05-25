import { Router } from "express";
import {
  getBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  updateBikeStatus,
} from "../controllers/bikeController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", getBikes);
router.get("/:id", getBikeById);
router.post("/", adminAuth, createBike);
router.put("/:id", adminAuth, updateBike);
router.delete("/:id", adminAuth, deleteBike);
router.patch("/:id/status", adminAuth, updateBikeStatus);

export default router;
