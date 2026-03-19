import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-admin.json'))
});

async function run() {
  try {
    console.log("Connecting to Firestore...");
    const snapshot = await admin.firestore().collection('bookings').get();
    console.log("SUCCESS: Found " + snapshot.docs.length + " bookings");
  } catch (e) {
    console.error("FIRESTORE_ERROR_CAUGHT:", e.message);
  }
}

run();
