import { fetchFileDiffs } from '../services/githubservice.js';
import { analyzeCode } from '../services/aiService.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';

export const handleWebhook = async (req, res) => {
  const event = req.headers['x-github-event'];

  // 1. Respond to GitHub immediately
  res.status(200).send('Webhook received');

  if (event === 'push') {
    const { ref, repository, before, after, pusher } = req.body;

    console.log(`\n--- 🚀 New Push Detected: ${repository.full_name} ---`);

    try {
      // 2. Try to find the user in DB
      let accessToken;
      const user = await User.findOne({ username: repository.owner.name });

      if (user) {
        accessToken = user.accessToken;
        console.log(`User found in DB: ${user.username}`);
      } else {
        // Fallback for testing
        console.log(`User not found. Using TEST_GITHUB_TOKEN.`);
        accessToken = process.env.TEST_GITHUB_TOKEN;
      }

      if (!accessToken) {
        console.log('No access token available. Skipping analysis.');
        return;
      }

      // 3. Fetch the specific file changes
      const fileChanges = await fetchFileDiffs(
        repository.owner.name,
        repository.name,
        before,
        after,
        accessToken
      );

      if (!fileChanges || fileChanges.length === 0) {
        console.log('No relevant file changes found.');
        return;
      }

      console.log(`Sending ${fileChanges.length} files to AI for review...`);

      // 4. Send to AI (Returns JSON Object now)
      const aiResult = await analyzeCode(fileChanges);

      // 5. Log the Result
      console.log('\n--- 🤖 AI STATUS ---');
      console.log(aiResult.status?.toUpperCase() || 'UNKNOWN'); 
      console.log('--------------------\n');

      // 6. SAVE TO DB (THE FIXED PART)
      if (user) {
        await Alert.create({
          userId: user._id,
          repoName: repository.full_name,
          aiJson: aiResult, // We save the Object directly
          severity: aiResult.status === 'risk' ? 'high' : 'low', // We check the property, no .toLowerCase() needed
          status: 'unread'
        });
        console.log('✅ Structured Alert saved to Database');
      }

    } catch (error) {
      console.error('Error processing webhook:', error.message);
    }
  }
};