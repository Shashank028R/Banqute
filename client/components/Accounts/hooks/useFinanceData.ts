import { useContext } from 'react';
import { FinanceDataContext } from '../contexts/FinanceDataContext';

export const useFinanceData = () => {
  const context = useContext(FinanceDataContext);
  if (!context) {
    throw new Error('useFinanceData must be used within a FinanceDataProvider');
  }
  return context;
};
