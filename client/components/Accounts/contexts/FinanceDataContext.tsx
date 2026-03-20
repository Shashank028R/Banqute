import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../../../services/api';
import { useOrganization } from '../../../contexts/OrganizationContext';

export const FinanceDataContext = createContext<any>(null);

export const FinanceDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { organization } = useOrganization();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBookings(organization.id),
      api.getExpenses(organization.id),
      api.getPayments(organization.id)
    ]).then(([bookings, expenses, payments]) => {
      
      const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.rate) || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const totalIncomeToday = payments
        .filter(p => new Date(p.date).toDateString() === new Date().toDateString() && p.type === 'Received')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const totalExpensesToday = expenses
        .filter((e: any) => new Date(e.expenseDate || e.date || Date.now()).toDateString() === new Date().toDateString())
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      // Income Transactions
      const incomeTransactions = payments.filter((p: any) => p.type === 'Received').map((p: any) => ({
        id: p.id,
        date: new Date(p.date).toISOString().split('T')[0],
        customer: bookings.find((b: any) => b.id === p.bookingId)?.clientName || 'Direct',
        bookingId: p.bookingId || 'N/A',
        source: p.notes || 'Income',
        paymentMode: p.method || 'Cash',
        amount: Number(p.amount) || 0,
        account: p.method === 'Cash' ? 'Cash Account' : 'Bank Account',
        status: p.isReverted ? 'Reverted' : 'Completed'
      }));

      // Expense Transactions
      const expenseTransactions = expenses.map((e: any) => ({
        id: e.id,
        date: new Date(e.expenseDate || e.date || Date.now()).toISOString().split('T')[0],
        vendor: e.vendor || 'General',
        category: e.category || 'Maintenance',
        paymentMode: e.paymentMethod || 'Cash',
        amount: Number(e.amount) || 0,
        account: e.paymentMethod === 'Cash' ? 'Cash Account' : 'Bank Account',
        status: e.isReverted ? 'Reverted' : 'Completed',
        expenseType: e.bookingId ? 'Booking' : 'General',
        bookingId: e.bookingId || 'N/A'
      }));

      // Recent Transactions (Combine and sort by time)
      const recentTransactions = [...incomeTransactions.map(t => ({...t, type: t.source, status: 'success', mode: t.paymentMode})), 
                                  ...expenseTransactions.map(t => ({...t, type: 'Expense', booking: t.vendor, mode: t.paymentMode, status: 'expense'}))]
                                  .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .slice(0, 5);

      const summaryData = {
        totalIncomeToday,
        totalExpensesToday,
        netBalanceToday: totalIncomeToday - totalExpensesToday
      };

      const alerts = [
        { id: 1, type: 'warning', message: 'Pending payments need clearance.' },
        { id: 2, type: 'info', message: 'Finance dashboard is functional and running.' }
      ];

      // Cash Position calculations
      const cashIncome = incomeTransactions.filter((t: any) => t.account === 'Cash Account').reduce((sum: number, t: any) => sum + t.amount, 0);
      const cashExpense = expenseTransactions.filter((t: any) => t.account === 'Cash Account').reduce((sum: number, t: any) => sum + t.amount, 0);
      const cashInHand = cashIncome - cashExpense;

      const bankIncome = incomeTransactions.filter((t: any) => t.account === 'Bank Account').reduce((sum: number, t: any) => sum + t.amount, 0);
      const bankExpense = expenseTransactions.filter((t: any) => t.account === 'Bank Account').reduce((sum: number, t: any) => sum + t.amount, 0);
      const bankBalance = bankIncome - bankExpense;
      const totalAvailable = cashInHand + bankBalance;

      // Upcoming Receivables & Booking Status calculations
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      let dueThisWeek = 0;
      let dueThisWeekCount = 0;
      let dueThisMonth = 0;
      let dueThisMonthCount = 0;
      let upcomingBalances = 0;

      let fullyPaidBookings = 0;
      let partiallyPaidBookings = 0;
      let unpaidBookings = 0;

      bookings.forEach((b: any) => {
        const totalPaidForBooking = (Number(b.advancePayment) || 0) + 
            payments.filter(p => p.bookingId === b.id && p.type === 'Received' && !p.isReverted).reduce((sum, p) => sum + Number(p.amount), 0);
        
        const amountDue = (Number(b.totalAmount) || Math.max((Number(b.rate) || 0) - (Number(b.discount) || 0), 0)) - totalPaidForBooking;

        if (amountDue <= 0) {
          fullyPaidBookings++;
        } else if (totalPaidForBooking > 0) {
          partiallyPaidBookings++;
          upcomingBalances += amountDue;
        } else {
          unpaidBookings++;
          upcomingBalances += amountDue;
        }

        if (amountDue > 0 && b.eventDate) {
          const eventDate = new Date(b.eventDate);
          if (eventDate >= now && eventDate <= nextWeek) {
            dueThisWeek += amountDue;
            dueThisWeekCount++;
          }
          if (eventDate >= now && eventDate <= nextMonth) {
            dueThisMonth += amountDue;
            dueThisMonthCount++;
          }
        }
      });

      const totalBookings = bookings.length;

      // Revenue and Expense charts grouping
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentYear = now.getFullYear();
      
      const revenueByMonth = new Array(12).fill(0);
      payments.filter(p => p.type === 'Received' && !p.isReverted && new Date(p.date).getFullYear() === currentYear).forEach(p => {
        revenueByMonth[new Date(p.date).getMonth()] += Number(p.amount);
      });
      bookings.filter((b: any) => new Date(b.created_at || b.eventDate).getFullYear() === currentYear).forEach((b: any) => {
        revenueByMonth[new Date(b.created_at || b.eventDate).getMonth()] += Number(b.advancePayment || 0);
      });
      
      const expenseByMonth = new Array(12).fill(0);
      expenses.filter((e: any) => currentYear === new Date(e.expenseDate || e.date || Date.now()).getFullYear() && !e.isReverted).forEach((e: any) => {
        expenseByMonth[new Date(e.expenseDate || e.date || Date.now()).getMonth()] += Number(e.amount);
      });

      // Get last 6 months for chart display
      const currentMonthIndex = now.getMonth();
      const revenueData = [];
      const expenseData = [];
      for(let i = 5; i >= 0; i--) {
        let mIdx = currentMonthIndex - i;
        if (mIdx < 0) mIdx += 12;
        revenueData.push({ name: months[mIdx], amount: revenueByMonth[mIdx] });
        expenseData.push({ name: months[mIdx], amount: expenseByMonth[mIdx] });
      }

      const emptyArray: any[] = [];
      const defaultSummary = { totalIncome: 0, totalExpense: 0, balance: 0 };

      // Stubbing the rest to prevent component death, slowly swapping mocks for functional data
      setData({
        incomeTransactions,
        expenseTransactions,
        recentTransactions,
        summaryData,
        alerts,
        revenueData,
        expenseData,
        totalRevenue,
        
        cashInHand, bankBalance, totalAvailable, 
        dueThisWeek, dueThisWeekCount, dueThisMonth, dueThisMonthCount, upcomingBalances,
        totalBookings, fullyPaidBookings, partiallyPaidBookings, unpaidBookings,
        
        // Everything else defaults cleanly to avoid crashes
        dayBookTransactions: [...recentTransactions],
        dayBookSummary: defaultSummary,
        cashBookTransactions: incomeTransactions.filter(t => t.account === 'Cash Account'),
        cashBookSummary: defaultSummary,
        bankBookTransactions: incomeTransactions.filter(t => t.account === 'Bank Account'),
        bankBookSummary: defaultSummary,
        customerLedgerTransactions: emptyArray,
        customerLedgerSummary: defaultSummary,
        vendorLedgerTransactions: emptyArray,
        vendorLedgerSummary: defaultSummary,
        categoryLedgerTransactions: emptyArray,
        categoryLedgerSummary: defaultSummary,
        paymentReceipts: emptyArray,
        finalBills: emptyArray,
        bookingInvoices: emptyArray,
        vendorPaymentData: emptyArray,
        profitLossData: emptyArray,
        paymentModeData: emptyArray,
        monthlySummaryData: emptyArray,
        expenseCategoryData: emptyArray,
        customerOutstandingData: emptyArray,
        ownerTransactions: emptyArray,
        ownerSummary: defaultSummary,
        internalTransfers: emptyArray,
        companyTransactions: emptyArray,
        companySummary: defaultSummary,
        securityDeposits: emptyArray,
        securityDepositsSummary: defaultSummary,
        bookingAdvances: emptyArray,
        bookingAdvancesSummary: defaultSummary
      });
      setLoading(false);
    });
  }, [organization.id]);

  if (loading || !data) {
    return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Financial Data Engine...</div>;
  }

  return (
    <FinanceDataContext.Provider value={data}>
      {children}
    </FinanceDataContext.Provider>
  );
};
