import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js'
import repoRoutes from './routes/repoRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

// Load environment variables
dotenv.config();
connectDB();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());


//routes
app.use('/api/auth',authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/alerts', alertRoutes);



// Basic Route to Test Server
app.get('/', (req, res) => {
  res.send('API is running (ES6 Mode)...');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});