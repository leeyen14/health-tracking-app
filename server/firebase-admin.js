const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Tải từ Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;