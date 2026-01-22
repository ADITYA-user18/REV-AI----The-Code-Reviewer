import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true, // No two users can have the same GitHub ID
  },
  username: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  // We store this token to interact with GitHub API on their behalf
  accessToken: {
    type: String, 
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const User = mongoose.model('User', userSchema);

export default User;