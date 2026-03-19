const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-admin.json');

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app, 'default');
db.settings({ ignoreUndefinedProperties: true });

async function run() {
  try {
    console.log("Attempting write to database ID 'default' without parentheses...");
    const docRef = db.collection('bookings').doc('test12345');
    await docRef.set({ verification: "true" });
    console.log("✅ SUCCESS! The backend has successfully written to the literal 'default' database.");
  } catch(e) {
    console.error("❌ FIRESTORE_ERROR:", e.message);
  }
}
run();
