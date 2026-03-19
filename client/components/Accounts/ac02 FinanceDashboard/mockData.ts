export const revenueData = [
  { name: 'Jan', amount: 500000 },
  { name: 'Feb', amount: 600000 },
  { name: 'Mar', amount: 800000 },
  { name: 'Apr', amount: 400000 },
  { name: 'May', amount: 750000 },
  { name: 'Jun', amount: 900000 },
];

export const expenseData = [
  { name: 'Jan', amount: 300000 },
  { name: 'Feb', amount: 350000 },
  { name: 'Mar', amount: 450000 },
  { name: 'Apr', amount: 200000 },
  { name: 'May', amount: 400000 },
  { name: 'Jun', amount: 500000 },
];

export const recentTransactions = [
  { id: 1, date: '2024-03-15', type: 'Advance Received', booking: 'Rahul Sharma Wedding', amount: 150000, mode: 'Bank Transfer', status: 'success' },
  { id: 2, date: '2024-03-14', type: 'Vendor Payment', booking: 'Royal Caterers', amount: 80000, mode: 'UPI', status: 'expense' },
  { id: 3, date: '2024-03-14', type: 'Final Payment', booking: 'Amit Verma Reception', amount: 200000, mode: 'Cheque', status: 'success' },
  { id: 4, date: '2024-03-13', type: 'Expense Added', booking: 'Electricity Bill', amount: 45000, mode: 'Bank Transfer', status: 'expense' },
  { id: 5, date: '2024-03-12', type: 'Advance Received', booking: 'Neha Gupta Birthday', amount: 50000, mode: 'Cash', status: 'success' },
];

export const alerts = [
  { id: 1, type: 'warning', message: 'Payment of ₹1,20,000 due tomorrow for Sharma Wedding.' },
  { id: 2, type: 'danger', message: 'Vendor bill (DJ Sound) ₹40,000 is overdue by 3 days.' },
  { id: 3, type: 'info', message: 'Cash balance is running low (₹15,000).' },
  { id: 4, type: 'warning', message: '3 bookings have pending payments this week.' },
];
