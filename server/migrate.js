const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
admin.initializeApp({ credential: admin.credential.cert(require('./firebase-admin.json')) });
const db = getFirestore(admin.app(), 'default');

async function migrateBookings() {
    const snaps = await db.collection('bookings').get();
    console.log(`Found ${snaps.docs.length} bookings`);
    let updated = 0;
    for (const doc of snaps.docs) {
      if (!doc.data().tenant_id || !doc.data().tenantId) {
        try {
          await doc.ref.set({ tenant_id: 'org_123', tenantId: 'org_123' }, { merge: true });
          updated++;
          console.log(`Successfully merged ${doc.id}`);
        } catch(e) {
          console.error(`Failed on ${doc.id}:`, e.message);
        }
      }
    }
    console.log(`Updated ${updated} bookings`);
}
migrateBookings().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
