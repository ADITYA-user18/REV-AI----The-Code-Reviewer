import axios from 'axios';
import User from '../models/User.js';

// @desc    Get user's GitHub repositories
// @route   GET /api/repos/list?userId=...
export const getRepositories = async (req, res) => {
  const { userId } = req.query; // We will pass userId in the URL

  try {
    // 1. Find user to get the access token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Fetch repos from GitHub using the user's token
    // We sort by 'updated' to show recent projects first
    const response = await axios.get('https://api.github.com/user/repos?sort=updated&per_page=100&type=all', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    // 3. Return the list
    res.json(response.data);

  } catch (error) {
    console.error('Repo Fetch Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
};






// @desc    Create a Webhook for a specific repository
// @route   POST /api/repos/webhook
export const setupWebhook = async (req, res) => {
  const { userId, owner, repo } = req.body;

  try {
    // 1. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Define the Webhook URL (Where GitHub will send data)
    // NOTE: For local development, we will use a tool like Ngrok later.
    // For now, we rely on an environment variable.
    const webhookUrl = `${process.env.BASE_URL}/api/webhook`;

    // 3. Create the Webhook via GitHub API
    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/hooks`,
      {
        name: 'web',
        active: true,
        events: ['push'], // We only care about PUSH events
        config: {
          url: webhookUrl,
          content_type: 'json',
          insecure_ssl: '0', // Ensure SSL is used
        },
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    res.json({ message: 'Webhook created successfully', hookId: response.data.id });

  } catch (error) {
    // Handle specific error: Hook already exists
    if (error.response && error.response.status === 422) {
      return res.json({ message: 'Webhook already exists (or validation failed)' });
    }
    console.error('Webhook Creation Error:', error.message);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
};