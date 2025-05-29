const express = require('express');
const router = express.Router();
const { generateTokens, verifyGoogleToken } = require('../services/auth');
const User = require('../models/User');

// Google Login
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    const { uid, email, name } = await verifyGoogleToken(idToken);
    
    // Lưu user vào DB nếu chưa có
    let user = await User.findOne({ firebaseId: uid });
    if (!user) {
      user = new User({ firebaseId: uid, email, name });
      await user.save();
    }

    // Tạo tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Set HTTP-only cookie cho refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    res.json({ accessToken, user: { email, name } });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Refresh Token
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.sendStatus(403);
  }
});

module.exports = router;