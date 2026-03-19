const fs = require('fs');
const path = './components/ReservationFormPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm w-40 bg-white/g, 'bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm w-40');

fs.writeFileSync(path, content);
console.log('Done');
