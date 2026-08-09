import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import contentRoutes from './routes/contentRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'
import { seedContent } from './config/seedContent.js'
import { scanUpcomingTrips } from './services/notificationService.js'

connectDB().then(() => seedContent());

// Daily scan: send reminder alerts for trips within 14 days with pending reminders (9:00 AM)
cron.schedule('0 9 * * *', async () => {
  try {
    const result = await scanUpcomingTrips();
    console.log(`[notification] daily scan complete: scanned ${result.scanned}, notified ${result.notified}`);
  } catch (error) {
    console.error('[notification] daily scan failed:', error.message);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/weather", weatherRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));