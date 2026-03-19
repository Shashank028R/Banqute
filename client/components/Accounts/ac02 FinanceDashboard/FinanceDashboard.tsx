import React from 'react';
import { FinancialKPIs } from './FinancialKPIs';
import { CashAndStatus } from './CashAndStatus';
import { FinancialCharts } from './FinancialCharts';
import { RecentTransactions } from './RecentTransactions';
import { FinancialAlerts } from './FinancialAlerts';

interface FinanceDashboardProps {
  season: string;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ season }) => {
  return (
    <div className="space-y-6 pb-8">
      <FinancialKPIs />
      <CashAndStatus />
      <FinancialCharts />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions />
        <FinancialAlerts />
      </div>
    </div>
  );
};
