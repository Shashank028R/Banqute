const fs = require('fs');
const path = './components/ReservationFormPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/className="border border-gray-200/g, 'className="bg-white text-gray-900 border border-gray-200');

// Remove duplicate bg-white and text-gray-900 if any
content = content.replace(/bg-white text-gray-900 bg-white/g, 'bg-white text-gray-900');
content = content.replace(/bg-white text-gray-900 text-gray-900/g, 'bg-white text-gray-900');

fs.writeFileSync(path, content);
console.log('Done');
