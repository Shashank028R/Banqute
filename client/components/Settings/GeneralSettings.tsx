import React from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { Building } from 'lucide-react';

export const GeneralSettings: React.FC = () => {
  const { organization: org, updateOrganization } = useOrganization();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let val = value;
    if (val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    updateOrganization({ [name]: val });
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building size={20} style={{ color: org.primary_color }} /> General Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Banquet Name</label>
          <input onFocus={(e) => e.target.select()} 
            type="text" 
            name="name"
            value={org.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}33` } as React.CSSProperties}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">GST Number</label>
          <input 
            type="text" 
            name="gst_number"
            value={org.gst_number}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}33` } as React.CSSProperties}
          />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Tagline / Motto</label>
          <input 
            type="text" 
            name="tagline"
            value={org.tagline}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}33` } as React.CSSProperties}
          />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase">Registered Address</label>
          <textarea 
            rows={3}
            name="address"
            value={org.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 outline-none transition-all"
            style={{ '--tw-ring-color': `${org.primary_color}33` } as React.CSSProperties}
          />
        </div>
      </div>
    </section>
  );
};
