const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-admin.json')),
});

async function run() {
  console.log("--- STARTING FIREBASE AUTH TEST ---");
  try {
    const users = await admin.auth().listUsers(1);
    console.log("✅ AUTH SUCCESS! Server is fully connected to the utsavpro-banquet project. Users found:", users.users.length);
  } catch(e) {
    console.error("❌ AUTH ERROR:", e.message);
  }
}
run();
