const admin = require('firebase-admin'); // Firebase Admin SDK
//const serviceAccount = require('/Users/charvieshukla/Documents/GitHub/course-scraper/firebase/tritonenroll-firebase-adminsdk-q4asq-06ab2ff14b.json'); // service account key JSON file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
admin.initializeApp({
    // Initialize the Firebase Admin SDK
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
// Get a reference to the Firestore database
module.exports = { db, admin };