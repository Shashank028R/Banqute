const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const map = {
  'tenant_id': 'tenantId',
  'customer_name': 'clientName',
  'customer_phone': 'contact',
  'event_type': 'eventType',
  'event_date': 'eventDate',
  'guest_count': 'guests',
  'total_amount': 'rate',
  'advance_paid': 'advance'
};

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Specifically skip types.ts if we hit it
      if (entry.name === 'types.ts') continue;
      
      for (const [oldKey, newKey] of Object.entries(map)) {
        content = content.replace(new RegExp(oldKey, 'g'), newKey);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated schema variables in:', fullPath);
      }
    }
  }
}

processDir(componentsDir);
// Also scan services/api.ts
processDir(path.join(__dirname, 'services'));
processDir(path.join(__dirname, 'lib'));
