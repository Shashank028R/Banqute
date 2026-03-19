const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-admin.json')),
});

async function run() {
  console.log("--- STARTING FIREBASE CONNECTION TESTS ---");
  
  try {
    console.log("1. Testing Firebase Auth Connection...");
    const users = await admin.auth().listUsers(1);
    console.log("✅ AUTH SUCCESS! Server is fully connected to the utsavpro-banquet project. Users found:", users.users.length);
  } catch(e) {
    console.error("❌ AUTH ERROR:", e.message);
  }

  try {
    console.log("\n2. Testing default Firestore DB...");
    const db = admin.firestore();
    // Use a simple get on an empty document instead of listCollections
    await db.doc('system/ping').get();
    console.log("✅ FIRESTORE (default) SUCCESS!");
  } catch(e) {
    console.error("❌ FIRESTORE (default) ERROR:", e.message);
  }

  try {
    console.log("\n3. Testing alternative named Firestore DB (utsavpro-banquet)...");
    const db2 = admin.firestore({ databaseId: 'utsavpro-banquet' });
    await db2.doc('system/ping').get();
    console.log("✅ FIRESTORE (named) SUCCESS!");
  } catch(e) {
    console.error("❌ FIRESTORE (named) ERROR:", e.message);
  }
}

run();
