import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  repoName: {
    type: String,
    required: true
  },
  // --- UPDATED FIELD ---
  aiJson: {
    type: Object, // Stores the full JSON response from AI
    required: true
  },
  // --------------------
  severity: {
    type: String,
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread'
  }
}, { timestamps: true });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;