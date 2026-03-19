export const revenueData = [
  { id: '1', date: '2024-03-01', bookingId: 'BK-102', customer: 'Rahul Sharma', eventType: 'Wedding', amount: 50000, paymentMode: 'Bank Transfer' },
  { id: '2', date: '2024-03-05', bookingId: 'BK-105', customer: 'Amit Verma', eventType: 'Corporate', amount: 120000, paymentMode: 'UPI' },
  { id: '3', date: '2024-03-10', bookingId: 'BK-108', customer: 'Neha Gupta', eventType: 'Birthday', amount: 30000, paymentMode: 'Cash' },
];

export const expenseData = [
  { id: '1', date: '2024-03-02', vendor: 'Flower Decor', category: 'Decoration', description: 'Stage setup', amount: 30000, paymentMode: 'UPI' },
  { id: '2', date: '2024-03-08', vendor: 'Royal Caterers', category: 'Catering', description: 'Food for 500 pax', amount: 150000, paymentMode: 'Bank Transfer' },
  { id: '3', date: '2024-03-12', vendor: 'DJ Soundz', category: 'Entertainment', description: 'DJ and Sound system', amount: 25000, paymentMode: 'Cash' },
];

export const profitLossData = [
  { month: 'Jan', revenue: 500000, expenses: 300000, profit: 200000 },
  { month: 'Feb', revenue: 600000, expenses: 350000, profit: 250000 },
  { month: 'Mar', revenue: 450000, expenses: 200000, profit: 250000 },
  { month: 'Apr', revenue: 800000, expenses: 400000, profit: 400000 },
  { month: 'May', revenue: 750000, expenses: 380000, profit: 370000 },
];

export const vendorPaymentData = [
  { id: '1', date: '2024-03-02', vendor: 'Flower Decor', category: 'Decoration', amountPaid: 30000, paymentMode: 'UPI' },
  { id: '2', date: '2024-03-08', vendor: 'Royal Caterers', category: 'Catering', amountPaid: 150000, paymentMode: 'Bank Transfer' },
  { id: '3', date: '2024-03-12', vendor: 'DJ Soundz', category: 'Entertainment', amountPaid: 25000, paymentMode: 'Cash' },
];

export const customerOutstandingData = [
  { id: '1', customer: 'Rahul Sharma', bookingId: 'BK-102', eventDate: '2024-04-15', totalAmount: 200000, amountPaid: 50000, balanceDue: 150000 },
  { id: '2', customer: 'Priya Singh', bookingId: 'BK-110', eventDate: '2024-05-20', totalAmount: 350000, amountPaid: 100000, balanceDue: 250000 },
  { id: '3', customer: 'Vikram Malhotra', bookingId: 'BK-115', eventDate: '2024-06-10', totalAmount: 150000, amountPaid: 50000, balanceDue: 100000 },
];

export const paymentModeData = [
  { mode: 'Cash', amount: 120000 },
  { mode: 'UPI', amount: 280000 },
  { mode: 'Bank Transfer', amount: 450000 },
  { mode: 'Card', amount: 50000 },
  { mode: 'Cheque', amount: 100000 },
];

export const monthlySummaryData = {
  totalBookings: 45,
  totalRevenue: 1550000,
  totalExpenses: 850000,
  netProfit: 700000,
};

export const expenseCategoryData = [
  { name: 'Catering', value: 400000 },
  { name: 'Decoration', value: 200000 },
  { name: 'Staff', value: 100000 },
  { name: 'Electricity', value: 50000 },
  { name: 'Marketing', value: 100000 },
];
