import express from 'express';
import { chat, getAttractions, generateItineraryFromAttractions } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/attractions', getAttractions);
router.post('/generate-itinerary', generateItineraryFromAttractions);

export default router;
