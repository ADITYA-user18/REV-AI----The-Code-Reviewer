import express from 'express';
import { getAlerts,markAlertRead  } from '../controllers/alertController.js';

const router = express.Router();
router.get('/', getAlerts);
router.patch('/:id/read', markAlertRead);

export default router;