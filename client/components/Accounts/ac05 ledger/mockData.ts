export const customerLedgerTransactions = [
  {
    id: 'TXN-CUST-001',
    date: '2024-03-01',
    transactionId: 'TXN-1001',
    bookingId: 'BK-102',
    description: 'Advance Payment',
    debit: 50000,
    credit: 0,
    balance: 50000,
  },
  {
    id: 'TXN-CUST-002',
    date: '2024-03-10',
    transactionId: 'TXN-1045',
    bookingId: 'BK-102',
    description: 'Final Payment',
    debit: 150000,
    credit: 0,
    balance: 200000,
  },
  {
    id: 'TXN-CUST-003',
    date: '2024-03-15',
    transactionId: 'TXN-1089',
    bookingId: 'BK-102',
    description: 'Refund for unused services',
    debit: 0,
    credit: 10000,
    balance: 190000,
  }
];

export const customerLedgerSummary = {
  totalBookingAmount: 250000,
  totalPaid: 200000,
  remainingBalance: 50000,
};

export const vendorLedgerTransactions = [
  {
    id: 'TXN-VEND-001',
    date: '2024-03-05',
    transactionId: 'TXN-2001',
    description: 'Decoration Advance Payment',
    debit: 30000,
    credit: 0,
    balance: 30000,
  },
  {
    id: 'TXN-VEND-002',
    date: '2024-03-12',
    transactionId: 'TXN-2045',
    description: 'Decoration Final Payment',
    debit: 70000,
    credit: 0,
    balance: 100000,
  },
  {
    id: 'TXN-VEND-003',
    date: '2024-03-18',
    transactionId: 'TXN-2089',
    description: 'Adjustment for delayed setup',
    debit: 0,
    credit: 5000,
    balance: 95000,
  }
];

export const vendorLedgerSummary = {
  totalAmountPayable: 120000,
  totalPaid: 100000,
  outstandingAmount: 20000,
};

export const categoryLedgerTransactions = [
  {
    id: 'TXN-CAT-001',
    date: '2024-03-05',
    transactionId: 'TXN-2001',
    description: 'Decoration Advance Payment',
    vendor: 'Flower Decor',
    debit: 30000,
    credit: 0,
    balance: 30000,
  },
  {
    id: 'TXN-CAT-002',
    date: '2024-03-12',
    transactionId: 'TXN-2045',
    description: 'Decoration Final Payment',
    vendor: 'Flower Decor',
    debit: 70000,
    credit: 0,
    balance: 100000,
  },
  {
    id: 'TXN-CAT-003',
    date: '2024-03-15',
    transactionId: 'TXN-2060',
    description: 'Extra lighting setup',
    vendor: 'Bright Lights Co.',
    debit: 15000,
    credit: 0,
    balance: 115000,
  }
];

export const categoryLedgerSummary = {
  totalExpenseInCategory: 115000,
  monthlyExpense: 115000,
  averageExpense: 38333,
};
