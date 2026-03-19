const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-admin.json');

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

async function run() {
  try {
    const docRef = db.collection('bookings').doc('test1234');
    await docRef.set({ test: "hello" });
    console.log("✅ SUCCESS! Bookings collection written.");
  } catch(e) {
    console.error("❌ FIRESTORE_ERROR:", e.message, e.code, e.details);
  }
}
run();
