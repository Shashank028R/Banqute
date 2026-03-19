import React, { useState } from 'react';
import { Building, Palette, CalendarCheck, Bell, LifeBuoy, Settings2 } from 'lucide-react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { GeneralSettings } from './GeneralSettings';
import { BrandingSettings } from './BrandingSettings';
import { BookingSettings } from './BookingSettings';
import { NotificationSettings } from './NotificationSettings';

interface SettingsProps {
  activeSubTab?: string;
}

export const Settings: React.FC<SettingsProps> = ({ activeSubTab = 'settings-general' }) => {
  const { organization: org } = useOrganization();

  const renderContent = () => {
    switch (activeSubTab) {
      case 'settings-general': return <GeneralSettings />;
      case 'settings-branding': return <BrandingSettings />;
      case 'settings-bookings': return <BookingSettings />;
      case 'settings-notifications': return <NotificationSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Control Center</h1>
        <p className="text-gray-500">Manage your banquet organization and system preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
