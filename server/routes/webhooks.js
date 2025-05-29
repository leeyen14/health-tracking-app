// server/routes/webhooks.js
const express = require('express');
const router = express.Router();

router.post('/fitbit', (req, res) => {
  const signature = req.headers['x-fitbit-signature'];
  if (!verifyFitbitSignature(signature, req.body)) {
    return res.status(403).send('Invalid signature');
  }
  // Xử lý dữ liệu real-time từ Fitbit
  console.log('Webhook received:', req.body);
  res.sendStatus(200);
});

module.exports = router;