
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Bookings } from './components/Bookings';
import { Accounts } from './components/Accounts/ac01 Accounts';
import { Inventory } from './components/Inventory/Inventory';
import { Settings } from './components/Settings/Settings';
import { CalendarSection } from './components/CalendarSection';
import { ReservationFormPage } from './components/ReservationFormPage';
import { OrganizationProvider, useOrganization } from './contexts/OrganizationContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { Login } from './components/ui/Login';

const AppContent: React.FC = () => {
  const { loading, user } = useOrganization();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSeason, setSelectedSeason] = useState('2024-25');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading UtsavPro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    if (activeTab.startsWith('settings')) {
      return <Settings activeSubTab={activeTab} />;
    }

    if (activeTab.startsWith('accounts')) {
      return <Accounts season={selectedSeason} activeSubTab={activeTab} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard season={selectedSeason} onNewReservation={() => setActiveTab('new-reservation')} />;
      case 'calendar':
        return <CalendarSection season={selectedSeason} onNewReservation={() => setActiveTab('new-reservation')} />;
      case 'bookings':
        return <Bookings season={selectedSeason} onNewReservation={() => setActiveTab('new-reservation')} />;
      case 'accounts':
        return <Accounts season={selectedSeason} />;
      case 'inventory':
        return <Inventory season={selectedSeason} />;
      case 'new-reservation':
        return <ReservationFormPage season={selectedSeason} onClose={() => setActiveTab('bookings')} />;
      default:
        return <Dashboard season={selectedSeason} onNewReservation={() => setActiveTab('new-reservation')} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      selectedSeason={selectedSeason}
      setSelectedSeason={setSelectedSeason}
    >
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <OrganizationProvider>
      <FontSizeProvider>
        <AppContent />
      </FontSizeProvider>
    </OrganizationProvider>
  );
};

export default App;
