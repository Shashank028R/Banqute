const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-admin.json')),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });

async function run() {
  try {
    console.log("Attempting to write to Firestore...");
    const docRef = admin.firestore().collection('bookings').doc();
    await docRef.set({ test: "hello", value: undefined });
    console.log("SUCCESS! Firestore is active and accepting writes.");
  } catch (e) {
    console.error("FIRESTORE_ERROR:", e.message);
    console.error("CODE:", e.code);
    console.error("DETAILS:", e.details);
  }
}

run();
