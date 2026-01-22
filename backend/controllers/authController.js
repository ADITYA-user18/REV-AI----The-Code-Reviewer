import axios from 'axios';
import User from '../models/User.js';

// @desc    Handle GitHub Login
// @route   POST /api/auth/github
// @access  Public
export const githubLogin = async (req, res) => {
  const { code } = req.body;

  try {
    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to retrieve access token' });
    }

    // 2. Get User Profile
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { id, login, avatar_url } = userResponse.data;

    // 3. Upsert User
    let user = await User.findOne({ githubId: id.toString() });

    if (!user) {
      user = await User.create({
        githubId: id.toString(),
        username: login,
        avatarUrl: avatar_url,
        accessToken: accessToken,
      });
    } else {
      user.accessToken = accessToken;
      await user.save();
    }

    res.json(user);

  } catch (error) {
    console.error('GitHub Auth Error:', error.message);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};