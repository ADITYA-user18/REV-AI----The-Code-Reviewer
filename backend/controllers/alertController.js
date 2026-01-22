import Alert from '../models/Alert.js'; // <--- THIS WAS MISSING

// @desc    Get alerts for a user
// @route   GET /api/alerts?userId=...
export const getAlerts = async (req, res) => {
  const { userId } = req.query;
  try {
    const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const markAlertRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = 'read'; // Mark as resolved
    await alert.save();

    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};