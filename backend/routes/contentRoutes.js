import express from "express";
import { getContent, getAllContent, updateContent, deleteContent } from "../controllers/contentController.js";
import protect from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllContent);
router.get("/:section", getContent);
router.put("/:section", protect, adminOnly, updateContent);
router.delete("/:section", protect, adminOnly, deleteContent);

export default router;
