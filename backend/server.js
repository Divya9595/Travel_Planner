import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base Route
// app.get('/api/status', (req, res) => {
//   res.status(200).json({ status: 'active', message: 'Travel API operational' });
// });
app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/trips", tripRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));