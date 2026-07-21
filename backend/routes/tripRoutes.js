import express from 'express';
import { createTrip, getTrips, getTrip, deleteTrip } from '../controllers/tripController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createTrip);
router.get('/', protect, getTrips);
router.get('/:id', protect, getTrip);
router.delete('/:id', protect, deleteTrip);

export default router;
