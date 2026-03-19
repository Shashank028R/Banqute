import React, { useState } from 'react';
import { Download, ChevronRight } from 'lucide-react';
import { FinanceDashboard } from './ac02 FinanceDashboard/FinanceDashboard';
import { Income } from './ac03 Transactions/Income';
import { Expenses } from './ac03 Transactions/Expenses';
import { CashBook } from './ac04 Bookkeeping/CashBook';
import { BankBook } from './ac04 Bookkeeping/BankBook';
import { DayBook } from './ac04 Bookkeeping/DayBook';
import { CustomerLedger } from './ac05 ledger/CustomerLedger';
import { VendorLedger } from './ac05 ledger/VendorLedger';
import { CategoryLedger } from './ac05 ledger/CategoryLedger';
import { InvoicesReceipts } from './ac06 InvoicesReceipts/InvoicesReceipts';
import { Reports } from './ac07 Reports/Reports';
import { OwnerCompanyAccounts } from './ac08 OwnerCompanyAccounts/OwnerCompanyAccounts';
import { AdvanceDeposits } from './ac09 AdvanceDeposits/AdvanceDeposits';

interface AccountsProps {
  season: string;
  activeSubTab?: string;
}

export const Accounts: React.FC<AccountsProps> = ({ season, activeSubTab = 'accounts-dashboard' }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'accounts-dashboard': return <FinanceDashboard season={season} />;
      case 'accounts-income': return <Income />;
      case 'accounts-expenses': return <Expenses />;
      case 'accounts-cash': return <CashBook />;
      case 'accounts-bank': return <BankBook />;
      case 'accounts-day': return <DayBook />;
      case 'accounts-customer': return <CustomerLedger />;
      case 'accounts-vendor': return <VendorLedger />;
      case 'accounts-category': return <CategoryLedger />;
      case 'accounts-invoices': return <InvoicesReceipts />;
      case 'accounts-reports': return <Reports />;
      case 'accounts-owner': return <OwnerCompanyAccounts />;
      case 'accounts-advance': return <AdvanceDeposits />;
      default: return <FinanceDashboard season={season} />;
    }
  };
  
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Accounts & Finance</h1>
          <p className="text-gray-500 text-sm">Manage your finances, ledgers, and reports for Season {season}.</p>
        </div>
        <button className="bg-pink-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-pink-900 transition-colors">
          <Download size={16} className="mr-2" /> Export Report
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
