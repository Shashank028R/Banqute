const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-admin.json')),
});

async function run() {
  try {
    const list = await admin.firestore().listCollections();
    console.log("Success! Collections:", list.map(c => c.id));
  } catch (e) {
    console.error("List Errors:", e);
  }
}
run();
