const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('./server/firebase-admin.json')) });
const db = admin.firestore();

async function migrate() {
  const colNames = ['bookings', 'expenses', 'payments'];
  for (const col of colNames) {
    const snaps = await db.collection(col).get();
    for (const doc of snaps.docs) {
      if (!doc.data().tenant_id) {
        await doc.ref.update({ tenant_id: 'org_123', tenantId: 'org_123' });
        console.log(`Updated ${col}/${doc.id}`);
      }
    }
  }
}
migrate().catch(console.error);
