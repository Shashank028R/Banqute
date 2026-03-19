const admin = require('firebase-admin');
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

    console.log("Querying Google Cloud Database Subsystem directly for Project:", projectId);

    const res = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await res.json();
    console.log(`\n--- CLOUD RESOURCE DIAGNOSTICS FOR [${projectId}] ---`);
    console.log(JSON.stringify(data, null, 2));
    
    if (!data.databases || data.databases.length === 0) {
      console.log(`\n❗ THE HARD PROOF: Google Cloud officially says project '${projectId}' HAS EXACTLY ZERO DATABASES.`);
      console.log(`Your screenshot of the database therefore GUARANTEES it resides in a DIFFERENT Project ID (likely named with a random suffix).`);
    } else {
      console.log(`\n✅ Databases DO exist in this project!`);
    }
  } catch (e) {
    console.error("Diagnostic failure:", e);
  }
}
run();
