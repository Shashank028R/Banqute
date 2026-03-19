export const cashBookTransactions = [
  {
    id: 'TXN-C-001',
    date: '2024-03-15',
    description: 'Advance payment for wedding',
    bookingId: 'BK-1001',
    customerVendor: 'Rahul Sharma',
    category: 'Booking Payment',
    type: 'Income',
    debit: 50000,
    credit: 0,
    balance: 150000,
    enteredBy: 'Admin',
  },
  {
    id: 'TXN-C-002',
    date: '2024-03-16',
    description: 'Payment to decorator',
    bookingId: '',
    customerVendor: 'A1 Decorators',
    category: 'Decoration',
    type: 'Expense',
    debit: 0,
    credit: 25000,
    balance: 125000,
    enteredBy: 'Admin',
  },
  {
    id: 'TXN-C-003',
    date: '2024-03-17',
    description: 'Final payment for reception',
    bookingId: 'BK-1002',
    customerVendor: 'Amit Verma',
    category: 'Booking Payment',
    type: 'Income',
    debit: 30000,
    credit: 0,
    balance: 155000,
    enteredBy: 'Admin',
  },
];

export const cashBookSummary = {
  openingBalance: 100000,
  totalReceived: 80000,
  totalPaid: 25000,
  closingBalance: 155000,
};

export const bankBookTransactions = [
  {
    id: 'TXN-B-001',
    date: '2024-03-15',
    bankAccount: 'HDFC Bank - 1234',
    description: 'Advance payment via NEFT',
    bookingId: 'BK-1003',
    customerVendor: 'Neha Gupta',
    type: 'Income',
    debit: 150000,
    credit: 0,
    balance: 650000,
  },
  {
    id: 'TXN-B-002',
    date: '2024-03-16',
    bankAccount: 'HDFC Bank - 1234',
    description: 'Catering payment via RTGS',
    bookingId: '',
    customerVendor: 'Royal Caterers',
    type: 'Expense',
    debit: 0,
    credit: 80000,
    balance: 570000,
  },
  {
    id: 'TXN-B-003',
    date: '2024-03-17',
    bankAccount: 'SBI - 5678',
    description: 'Electricity bill payment',
    bookingId: '',
    customerVendor: 'City Power Corp',
    type: 'Expense',
    debit: 0,
    credit: 45000,
    balance: 525000,
  },
];

export const bankBookSummary = {
  openingBalance: 500000,
  totalDeposits: 150000,
  totalWithdrawals: 125000,
  closingBalance: 525000,
};

export const dayBookTransactions = [
  {
    id: 'TXN-D-001',
    date: '2024-03-17',
    time: '10:30 AM',
    type: 'Income',
    description: 'Final payment for reception',
    customerVendor: 'Amit Verma',
    account: 'Cash',
    debit: 30000,
    credit: 0,
    balance: 30000,
  },
  {
    id: 'TXN-D-002',
    date: '2024-03-17',
    time: '02:15 PM',
    type: 'Expense',
    description: 'Electricity bill payment',
    customerVendor: 'City Power Corp',
    account: 'Bank',
    debit: 0,
    credit: 45000,
    balance: -15000,
  },
];

export const dayBookSummary = {
  totalIncomeToday: 30000,
  totalExpensesToday: 45000,
  netBalanceToday: -15000,
};
