const jwt = require('jsonwebtoken');
const admin = require('./firebase-admin');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const verifyGoogleToken = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    name: decodedToken.name || 'No Name'
  };
};

module.exports = { generateTokens, verifyGoogleToken };