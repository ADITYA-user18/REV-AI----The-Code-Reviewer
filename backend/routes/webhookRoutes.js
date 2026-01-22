import express from 'express';
import { handleWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// The endpoint GitHub will hit
router.post('/', handleWebhook);

export default router;