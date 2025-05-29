// server/routes/fitbit.js
const express = require('express');
const router = express.Router();
const FitbitService = require('../services/fitbitService');
const authenticate = require('../middleware/auth');

router.get('/heart-rate', authenticate, async (req, res) => {
  try {
    const { fitbitAccessToken } = req.user; // Lưu token Fitbit khi user kết nối
    const data = await FitbitService.getHeartRate(fitbitAccessToken);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Fitbit data' });
  }
});
module.exports = router;