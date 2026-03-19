import React from 'react';
import { MessageSquare } from 'lucide-react';

interface WhatsAppButtonProps {
  phone: string;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phone, className = "" }) => {
  const handleWhatsApp = () => {
    // Remove non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Add country code if not present (assuming India +91 for this app context)
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${finalPhone}`, '_blank');
  };

  return (
    <button 
      onClick={handleWhatsApp}
      title="WhatsApp Message"
      className={`flex flex-col items-center justify-center p-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-900/20 active:scale-95 group ${className}`}
    >
      <div className="flex items-center gap-2">
        <MessageSquare size={16} className="text-white group-hover:rotate-12 transition-transform" />
        <span className="text-[11px] font-black uppercase text-white tracking-widest">WhatsApp</span>
      </div>
    </button>
  );
};
