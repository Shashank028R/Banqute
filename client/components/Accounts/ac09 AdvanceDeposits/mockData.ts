export const bookingAdvances = [
  { id: 'ADV-001', date: '2024-04-10', bookingId: 'BK102', customerName: 'Rahul Sharma', eventDate: '2024-05-15', advanceAmount: 50000, paymentMode: 'UPI', referenceNumber: 'UPI123456789', status: 'Advance Received' },
  { id: 'ADV-002', date: '2024-04-12', bookingId: 'BK105', customerName: 'Priya Patel', eventDate: '2024-06-20', advanceAmount: 25000, paymentMode: 'Bank Transfer', referenceNumber: 'NEFT987654321', status: 'Partially Paid' },
  { id: 'ADV-003', date: '2024-04-15', bookingId: 'BK108', customerName: 'Amit Kumar', eventDate: '2024-07-10', advanceAmount: 0, paymentMode: '-', referenceNumber: '-', status: 'Pending Advance' },
];

export const bookingAdvancesSummary = {
  totalAdvancesReceived: 75000,
  advancesReceivedThisMonth: 75000,
  numberOfAdvanceBookings: 2,
};

export const securityDeposits = [
  { id: 'DEP-001', date: '2024-04-01', bookingId: 'BK105', customerName: 'Priya Patel', depositAmount: 20000, refundStatus: 'Deposit Held', refundDate: '-', remarks: 'Equipment usage' },
  { id: 'DEP-002', date: '2024-03-15', bookingId: 'BK087', customerName: 'Neha Gupta', depositAmount: 15000, refundStatus: 'Refunded', refundDate: '2024-04-05', remarks: 'Property damage deposit' },
  { id: 'DEP-003', date: '2024-04-10', bookingId: 'BK102', customerName: 'Rahul Sharma', depositAmount: 25000, refundStatus: 'Pending Refund', refundDate: '-', remarks: 'Extra cleaning' },
];

export const securityDepositsSummary = {
  totalDepositsHeld: 45000,
  depositsRefunded: 15000,
  activeDeposits: 2,
};
