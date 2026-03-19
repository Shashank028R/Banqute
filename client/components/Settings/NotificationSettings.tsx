import React from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { Bell, Phone, Mail } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const { organization: org, updateOrganization } = useOrganization();

  const handlePreferenceChange = (key: keyof typeof org.preferences) => {
    updateOrganization({
      preferences: {
        ...org.preferences,
        [key]: !org.preferences[key]
      }
    });
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Bell size={20} style={{ color: org.primary_color }} /> Alerts & Notifications
      </h3>
      
      <div className="space-y-3">
        {[
          { id: 'sendSmsReminders', label: 'Send SMS Reminders', icon: Phone, desc: 'Send automated payment and event reminders to clients via SMS.' },
          { id: 'dailyRevenueEmail', label: 'Daily Revenue Email', icon: Mail, desc: 'Receive a daily summary of collections and new bookings.' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 bg-gray-50 rounded-lg shrink-0 mt-0.5">
                <item.icon size={18} className="text-gray-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 block">{item.label}</span>
                <span className="text-xs text-gray-500 mt-0.5 block">{item.desc}</span>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={org.preferences[item.id as keyof typeof org.preferences] as boolean}
              onChange={() => handlePreferenceChange(item.id as keyof typeof org.preferences)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-offset-0 shrink-0 cursor-pointer mt-1"
              style={{ color: org.primary_color } as any}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
