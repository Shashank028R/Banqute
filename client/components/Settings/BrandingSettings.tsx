import React from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { Palette } from 'lucide-react';

export const BrandingSettings: React.FC = () => {
  const { organization: org, updateOrganization } = useOrganization();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateOrganization({ [name]: value });
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Palette size={20} style={{ color: org.primary_color }} /> Brand Customization
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Primary Brand Color</label>
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input 
                type="color" 
                name="primary_color"
                value={org.primary_color} 
                onChange={handleInputChange}
                className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0" 
              />
              <div className="min-w-0">
                 <span className="font-mono text-sm font-black uppercase text-gray-800 truncate block">{org.primary_color}</span>
                 <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 truncate">Main Theme Color</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Secondary Accent Color</label>
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input 
                type="color" 
                name="secondary_color"
                value={org.secondary_color} 
                onChange={handleInputChange}
                className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0" 
              />
              <div className="min-w-0">
                 <span className="font-mono text-sm font-black uppercase text-gray-800 truncate block">{org.secondary_color}</span>
                 <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 truncate">Highlight & Backgrounds</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex flex-col items-start md:items-center">
           <label className="text-xs font-bold text-gray-400 uppercase w-full text-left md:text-center">Brand Identity Preview</label>
           <div className="w-full aspect-square max-w-[200px] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 overflow-hidden group relative p-6">
              <img src={org.logo_url} className="w-full h-full object-contain mb-4" alt="logo" />
              <button className="absolute inset-0 bg-black/60 text-white text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-2">UPLOAD NEW LOGO</button>
              <div className="text-center w-full">
                 <p className="text-xs font-black text-gray-800 uppercase truncate w-full">{org.name || 'Your Brand'}</p>
                 <div className="flex gap-1 justify-center mt-2">
                    <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: org.primary_color }}></div>
                    <div className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: org.secondary_color }}></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
