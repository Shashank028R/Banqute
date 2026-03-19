import { Package, AlertTriangle, ArrowDownRight, ArrowUpRight, Truck, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

export const inventoryStats = [
  {
    title: 'Total Inventory Items',
    value: '2,450',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    title: 'Items In Use',
    value: '850',
    change: '+150',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-amber-500',
  },
  {
    title: 'Items Available',
    value: '1,580',
    change: '-100',
    trend: 'down',
    icon: CheckCircle,
    color: 'bg-emerald-500',
  },
  {
    title: 'Damaged Items',
    value: '20',
    change: '+5',
    trend: 'up',
    icon: XCircle,
    color: 'bg-red-500',
  },
  {
    title: 'Low Stock Alerts',
    value: '15',
    change: '+3',
    trend: 'up',
    icon: AlertTriangle,
    color: 'bg-orange-500',
  }
];

export const items = [
  { id: 'ITM001', tenantId: 'org_123', name: 'Premium Chair Covers (White)', category: 'Linens', totalQuantity: 450, availableQuantity: 200, inUse: 240, damaged: 10, unit: 'pcs', purchasePrice: 150, currentValue: 120, location: 'Store Room A', status: 'Available' },
  { id: 'ITM002', tenantId: 'org_123', name: 'Banquet Tables (Round, 6ft)', category: 'Furniture', totalQuantity: 80, availableQuantity: 30, inUse: 48, damaged: 2, unit: 'pcs', purchasePrice: 4500, currentValue: 4000, location: 'Hall 1 Storage', status: 'Available' },
  { id: 'ITM003', tenantId: 'org_123', name: 'Dinner Plates (Gold Rim)', category: 'Crockery', totalQuantity: 1200, availableQuantity: 1200, inUse: 0, damaged: 0, unit: 'pcs', purchasePrice: 250, currentValue: 250, location: 'Kitchen Pantry', status: 'Available' },
  { id: 'ITM004', tenantId: 'org_123', name: 'Water Goblets', category: 'Glassware', totalQuantity: 150, availableQuantity: 20, inUse: 120, damaged: 10, unit: 'pcs', purchasePrice: 180, currentValue: 150, location: 'Kitchen Pantry', status: 'Low Stock' },
  { id: 'ITM005', tenantId: 'org_123', name: 'Chafing Dishes (Stainless Steel)', category: 'Kitchen Equipment', totalQuantity: 25, availableQuantity: 5, inUse: 20, damaged: 0, unit: 'pcs', purchasePrice: 8500, currentValue: 7500, location: 'Kitchen Pantry', status: 'Available' },
  { id: 'ITM006', tenantId: 'org_123', name: 'LED Uplights', category: 'Lighting', totalQuantity: 40, availableQuantity: 10, inUse: 28, damaged: 2, unit: 'pcs', purchasePrice: 3500, currentValue: 3000, location: 'AV Room', status: 'Available' },
  { id: 'ITM007', tenantId: 'org_123', name: 'JBL Speakers', category: 'Sound System', totalQuantity: 8, availableQuantity: 2, inUse: 6, damaged: 0, unit: 'pcs', purchasePrice: 45000, currentValue: 40000, location: 'AV Room', status: 'Available' },
];

export const categories = [
  { id: 'CAT001', name: 'Furniture', description: 'Tables, chairs, sofas, and other seating arrangements.' },
  { id: 'CAT002', name: 'Decoration', description: 'Centerpieces, vases, artificial flowers, drapes.' },
  { id: 'CAT003', name: 'Electronics', description: 'Generators, AC units, fans, heaters.' },
  { id: 'CAT004', name: 'Lighting', description: 'Uplights, chandeliers, fairy lights, spotlights.' },
  { id: 'CAT005', name: 'Kitchen Equipment', description: 'Chafing dishes, serving spoons, warmers.' },
  { id: 'CAT006', name: 'Sound System', description: 'Speakers, microphones, mixers, amplifiers.' },
  { id: 'CAT007', name: 'Outdoor Equipment', description: 'Tents, outdoor heaters, carpets, stage platforms.' },
  { id: 'CAT008', name: 'Crockery', description: 'Plates, bowls, cups, saucers.' },
  { id: 'CAT009', name: 'Glassware', description: 'Water glasses, wine glasses, champagne flutes.' },
  { id: 'CAT010', name: 'Linens', description: 'Tablecloths, chair covers, napkins, runners.' },
];

export const stockIn = [
  { id: 'SI001', tenantId: 'org_123', date: '2024-04-01', itemName: 'Premium Chair Covers (White)', quantityAdded: 100, purchaseCost: 15000, vendor: 'DecorTex India', paymentMode: 'Bank Transfer' },
  { id: 'SI002', tenantId: 'org_123', date: '2024-04-05', itemName: 'Water Goblets', quantityAdded: 50, purchaseCost: 9000, vendor: 'Crystal Clear Glass', paymentMode: 'Credit Card' },
  { id: 'SI003', tenantId: 'org_123', date: '2024-04-10', itemName: 'LED Uplights', quantityAdded: 10, purchaseCost: 35000, vendor: 'Lumina Tech', paymentMode: 'Bank Transfer' },
];

export const stockOut = [
  { id: 'SO001', tenantId: 'org_123', date: '2024-04-12', bookingId: 'BKG-2024-089', eventName: 'Sharma Wedding', item: 'Premium Chair Covers (White)', quantityUsed: 200, returnedQuantity: 200 },
  { id: 'SO002', tenantId: 'org_123', date: '2024-04-12', bookingId: 'BKG-2024-089', eventName: 'Sharma Wedding', item: 'Banquet Tables (Round, 6ft)', quantityUsed: 25, returnedQuantity: 25 },
  { id: 'SO003', tenantId: 'org_123', date: '2024-04-14', bookingId: 'BKG-2024-092', eventName: 'TechCorp Annual Gala', item: 'LED Uplights', quantityUsed: 20, returnedQuantity: 18 },
  { id: 'SO004', tenantId: 'org_123', date: '2024-04-15', bookingId: 'BKG-2024-095', eventName: 'Verma Reception', item: 'JBL Speakers', quantityUsed: 4, returnedQuantity: 4 },
];

export const damageLoss = [
  { id: 'DL001', tenantId: 'org_123', date: '2024-04-13', itemName: 'Premium Chair Covers (White)', quantity: 5, reason: 'Stained beyond repair', responsiblePerson: 'Cleaning Staff' },
  { id: 'DL002', tenantId: 'org_123', date: '2024-04-14', itemName: 'LED Uplights', quantity: 2, reason: 'Broken during transit', responsiblePerson: 'Event Setup Team' },
  { id: 'DL003', tenantId: 'org_123', date: '2024-04-16', itemName: 'Water Goblets', quantity: 10, reason: 'Broken during washing', responsiblePerson: 'Kitchen Staff' },
];

export const suppliers = [
  { id: 'VND001', name: 'DecorTex India', category: 'Linens', contact: '+91 98765 43210' },
  { id: 'VND002', name: 'Crystal Clear Glass', category: 'Glassware', contact: '+91 98765 43211' },
  { id: 'VND003', name: 'Lumina Tech', category: 'Lighting', contact: '+91 98765 43212' },
  { id: 'VND004', name: 'Royal Furniture', category: 'Furniture', contact: '+91 98765 43213' },
];

export const stockItems = items;

export const movements = [
  { id: 'MV001', tenantId: 'org_123', date: '2024-04-01', item: 'Premium Chair Covers (White)', type: 'Stock In', quantity: 100 },
  { id: 'MV002', tenantId: 'org_123', date: '2024-04-12', item: 'Premium Chair Covers (White)', type: 'Event Usage', quantity: 200 },
  { id: 'MV003', tenantId: 'org_123', date: '2024-04-13', item: 'Premium Chair Covers (White)', type: 'Return', quantity: 195 },
  { id: 'MV004', tenantId: 'org_123', date: '2024-04-13', item: 'Premium Chair Covers (White)', type: 'Damage', quantity: 5 },
  { id: 'MV005', tenantId: 'org_123', date: '2024-04-14', item: 'LED Uplights', type: 'Event Usage', quantity: 20 },
  { id: 'MV006', tenantId: 'org_123', date: '2024-04-15', item: 'LED Uplights', type: 'Return', quantity: 18 },
  { id: 'MV007', tenantId: 'org_123', date: '2024-04-15', item: 'LED Uplights', type: 'Damage', quantity: 2 },
];

export const eventAllocations = [
  { id: 'EA001', tenantId: 'org_123', bookingId: 'BKG-2024-105', eventName: 'Gupta Wedding', date: '2024-04-20', status: 'Allocated', items: [
    { item: 'Premium Chair Covers (White)', quantity: 300 },
    { item: 'Banquet Tables (Round, 6ft)', quantity: 40 },
    { item: 'LED Uplights', quantity: 25 }
  ]},
  { id: 'EA002', tenantId: 'org_123', bookingId: 'BKG-2024-108', eventName: 'Corporate Seminar', date: '2024-04-22', status: 'Pending', items: [
    { item: 'Premium Chair Covers (White)', quantity: 150 },
    { item: 'Banquet Tables (Round, 6ft)', quantity: 20 },
    { item: 'JBL Speakers', quantity: 4 }
  ]},
];
