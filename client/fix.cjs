const fs = require('fs');
const path = './components/ReservationFormPage.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"/g, 'className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"');

content = content.replace(/className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all bg-white"/g, 'className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"');

content = content.replace(/onBlur={\(e\) => e\.target\.style\.borderColor = '#e5e7eb'}/g, "onBlur={(e) => e.target.style.borderColor = ''}");

content = content.replace(/borderColor: 'initial'/g, "borderColor: ''");

fs.writeFileSync(path, content);
console.log('Done');
