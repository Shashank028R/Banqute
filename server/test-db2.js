const admin = require('firebase-admin');
const fs = require('fs');
const key = require('./firebase-admin.json');

const app = admin.initializeApp({
  credential: admin.credential.cert(key),
});

async function run() {
  try {
    const cred = app.options.credential;
    const tokenObj = await cred.getAccessToken();
    const token = tokenObj.access_token;

    const projectId = key.project_id;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await res.json();
    fs.writeFileSync('db-response.json', JSON.stringify(data, null, 2));
    console.log("Wrote to db-response.json");
  } catch (e) {
    console.error("Diagnostic failure:", e);
  }
}
run();
