import express from 'express';
import { getRepositories, setupWebhook} from '../controllers/repoController.js';

const router = express.Router();

// Route to list repositories
router.get('/list', getRepositories);

// Route to create a webhook (POST)
router.post('/webhook', setupWebhook);

export default router;