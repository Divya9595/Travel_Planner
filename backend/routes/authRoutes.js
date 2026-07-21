import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/home", protect,home);
export default router;