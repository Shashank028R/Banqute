const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

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

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [oldKey, newKey] of Object.entries(map)) {
    content = content.split(oldKey).join(newKey);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated schema variables in:', file);
  }
});
