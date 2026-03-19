export const companyTransactions = [
  { id: 'TXN-001', date: '2024-04-01', description: 'Booking Payment - BK102', debit: 50000, credit: 0, balance: 500000 },
  { id: 'TXN-002', date: '2024-04-02', description: 'Vendor Payment - Royal Caterers', debit: 0, credit: 20000, balance: 480000 },
  { id: 'TXN-003', date: '2024-04-05', description: 'Owner Withdrawal', debit: 0, credit: 50000, balance: 430000 },
];

export const ownerTransactions = [
  { id: 'OWN-001', date: '2024-03-01', type: 'Investment', description: 'Capital Investment', amount: 1000000, balance: 1000000 },
  { id: 'OWN-002', date: '2024-04-05', type: 'Withdrawal', description: 'Personal Use', amount: 50000, balance: 950000 },
  { id: 'OWN-003', date: '2024-04-10', type: 'Withdrawal', description: 'Profit Withdrawal', amount: 100000, balance: 850000 },
];

export const internalTransfers = [
  { id: 'TRF-001', date: '2024-04-05', fromAccount: 'Cash', toAccount: 'Bank', amount: 40000, description: 'Cash deposited to bank' },
  { id: 'TRF-002', date: '2024-04-12', fromAccount: 'Bank', toAccount: 'Cash', amount: 10000, description: 'Petty cash withdrawal' },
];

export const companySummary = {
  totalBalance: 430000,
  cashBalance: 80000,
  bankBalance: 350000,
};

export const ownerSummary = {
  totalWithdrawals: 150000,
  totalInvestments: 1000000,
  currentBalance: 850000,
};
