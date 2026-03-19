import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Users, IndianRupee, PartyPopper, Clock, Package, CreditCard, CheckSquare, RefreshCw, CheckCircle2, Printer, LayoutTemplate } from 'lucide-react';
import { useOrganization } from '../contexts/OrganizationContext';
import { EventType, BookingTemplate } from '../types';
import { PrintableReservation } from './PrintableReservation';
import { BANKS } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  season: string;
}

const Letterhead: React.FC<{ org: any }> = ({ org }) => (
  <div className="flex flex-col items-center text-center pb-8 border-b-4 border-double border-gray-100 mb-8">
    <div className="flex items-center gap-6 mb-4">
      <img src={org.logo_url} alt={org.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg" referrerPolicy="no-referrer" />
      <div className="text-left">
        <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase" style={{ color: org.primary_color }}>{org.name}</h1>
        <p className="text-sm font-black text-gray-400 tracking-[0.3em] uppercase mt-1">{org.tagline}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-xs font-bold text-gray-500">
      <div className="flex items-center gap-2 justify-center md:justify-end">
        <span className="uppercase tracking-widest text-[10px] text-gray-400">Address:</span>
        <span>{org.address}</span>
      </div>
      <div className="flex items-center gap-2 justify-center md:justify-start">
        <span className="uppercase tracking-widest text-[10px] text-gray-400">GSTIN:</span>
        <span className="text-gray-900">{org.gst_number}</span>
      </div>
    </div>
  </div>
);

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, season }) => {
  const { organization: org } = useOrganization();
  
  const initialFormState = {
    clientName: '',
    contact: '',
    eventType: EventType.WEDDING,
    eventDate: '',
    shift: 'Night',
    guests: '',
    package: 'Custom / No Package',
    package_rate: 0,
    addon_services: 0,
    discount: 0,
    advance: 0,
    payment_mode: 'Cash',
    bank_name: '',
    payment_medium: 'UPI',
    reference_number: '',
    amenities: {} as Record<string, string | number | boolean>,
    accepted_terms: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  // Initialize amenities based on schema
  useEffect(() => {
    if (isOpen && org.bookingFormSchema) {
      const initialAmenities: Record<string, string | number | boolean> = {};
      org.bookingFormSchema.forEach(category => {
        category.fields.forEach(field => {
          if (field.type === 'boolean') initialAmenities[field.id] = false;
          else if (field.type === 'number') initialAmenities[field.id] = 0;
          else if (field.type === 'text') initialAmenities[field.id] = '';
          else if (field.type === 'select') initialAmenities[field.id] = field.options?.[0] || '';
        });
      });
      setFormData(prev => ({ ...prev, amenities: initialAmenities }));
    }
  }, [isOpen, org.bookingFormSchema]);

  if (!isOpen) return null;

  const subtotal = Number(formData.package_rate) + Number(formData.addon_services);
  const total_rate = subtotal - Number(formData.discount);
  const balance_due = total_rate - Number(formData.advance);

  const capitalizeFirstLetter = (val: string) => {
    if (val.length > 0) {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    return val;
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSelectedTemplateId('');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      handleReset();
      return;
    }

    const template = org.bookingTemplates?.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        package: template.package,
        package_rate: template.fieldValues.package_rate as number || 0,
        eventType: (template.fieldValues.eventType as EventType) || prev.eventType,
        shift: (template.fieldValues.shift as string) || prev.shift,
        guests: (template.fieldValues.guests as string) || prev.guests,
        addon_services: (template.fieldValues.addon_services as number) || prev.addon_services,
        discount: (template.fieldValues.discount as number) || prev.discount,
        advance: (template.fieldValues.advance as number) || prev.advance,
        amenities: {
          ...prev.amenities,
          ...template.fieldValues
        }
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accepted_terms) {
      alert("Please accept the terms and conditions.");
      return;
    }
    // In a real app, this would save to the database
    console.log('New Booking Data:', { ...formData, total_rate, balance_due, season });
    onClose();
    handleReset();
  };

  const handleAmenityChange = (id: string, value: string | number | boolean) => {
    let val = value;
    if (typeof value === 'number' && value < 0) {
      val = 0;
    }
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [id]: val
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-gray-900">+ Reservation</h2>
              <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">New Entry</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mt-1">Booking ID: <span className="text-gray-900">HG-2026-26-008</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10">
          <Letterhead org={org} />
          
          {/* Template Selection */}
          {org.bookingTemplates && org.bookingTemplates.length > 0 && (
            <div className="mb-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <LayoutTemplate size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider">Quick Templates</h3>
                  <p className="text-xs font-bold text-indigo-600">Select a pre-configured package</p>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-bold text-indigo-900 appearance-none cursor-pointer"
                >
                  <option value="">Custom / No Template</option>
                  {org.bookingTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.packageName})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <Package size={16} />
                </div>
              </div>
            </div>
          )}

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Basic Information */}
            <section>
              <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-100 pb-2 mb-6 inline-block" style={{ borderColor: org.primary_color }}>Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Client Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input onFocus={(e) => e.target.select()} type="text" required value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: capitalizeFirstLetter(e.target.value)})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} placeholder="Enter client name" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Contact Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="tel" required pattern="[0-9]{10}" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} placeholder="10-digit number" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Event Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="date" required value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Event Type</label>
                  <div className="relative">
                    <PartyPopper className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value as EventType})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}>
                      {Object.values(EventType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Shift *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}>
                      <option value="Morning">Morning</option>
                      <option value="Night">Night</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Expected Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="number" min="1" value={formData.guests} onChange={(e) => setFormData({...formData, guests: Math.max(1, Number(e.target.value))})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} placeholder="100" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Select Package</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select value={formData.package} onChange={(e) => setFormData({...formData, package: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}>
                      <option value="Custom / No Package">Custom / No Package</option>
                      <option value="Silver Package">Silver Package</option>
                      <option value="Gold Package">Gold Package</option>
                      <option value="Platinum Package">Platinum Package</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Financials & Summary */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-100 pb-2 inline-block" style={{ borderColor: org.primary_color }}>Financial Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Package Rate (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" min="0" value={formData.package_rate} onChange={(e) => setFormData({...formData, package_rate: Math.max(0, Number(e.target.value))})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Add-on Services (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" min="0" value={formData.addon_services} onChange={(e) => setFormData({...formData, addon_services: Math.max(0, Number(e.target.value))})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Subtotal (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" disabled value={subtotal} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Discount (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" min="0" value={formData.discount} onChange={(e) => setFormData({...formData, discount: Math.max(0, Number(e.target.value))})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Total Rate (₹) *</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" disabled value={total_rate} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-900" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Advance Payment (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="number" min="0" value={formData.advance} onChange={(e) => setFormData({...formData, advance: Math.max(0, Number(e.target.value))})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Payment Mode</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <select value={formData.payment_mode} onChange={(e) => setFormData({...formData, payment_mode: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}>
                        <option value="Cash">Cash</option>
                        <option value="Bank/Online">Bank/Online</option>
                      </select>
                    </div>
                  </div>

                  {formData.payment_mode === 'Bank/Online' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Bank</label>
                        <select 
                          value={formData.bank_name} 
                          onChange={(e) => setFormData({...formData, bank_name: e.target.value})} 
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" 
                          style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                        >
                          <option value="">Select Bank</option>
                          {BANKS.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Payment Medium</label>
                        <select value={formData.payment_medium} onChange={(e) => setFormData({...formData, payment_medium: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}>
                          <option value="UPI">UPI</option>
                          <option value="Net Banking">Net Banking</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Reference / Cheque No.</label>
                        <input type="text" value={formData.reference_number} onChange={(e) => setFormData({...formData, reference_number: capitalizeFirstLetter(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium" style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties} placeholder="Enter reference number" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Financial Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-fit sticky top-0">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Financial Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Package Rate</span>
                    <span className="font-bold text-gray-900">₹{formData.package_rate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Add-on</span>
                    <span className="font-bold text-gray-900">₹{formData.addon_services.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">-₹{formData.discount.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between">
                    <span className="font-black text-gray-900">Total Rate</span>
                    <span className="font-black text-gray-900">₹{total_rate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-medium">Advance Paid</span>
                    <span className="font-bold">₹{formData.advance.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between text-lg">
                    <span className="font-black text-gray-900">Balance Due</span>
                    <span className="font-black text-rose-600">₹{balance_due.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Dynamic Services & Amenities */}
            <section>
              <h3 className="text-lg font-black text-gray-900 border-b-2 border-gray-100 pb-2 mb-6 inline-block" style={{ borderColor: org.primary_color }}>Services & Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {org.bookingFormSchema?.map(category => (
                  <div key={category.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4">{category.name}</h4>
                    <div className="space-y-4">
                      {category.fields.map(field => (
                        <div key={field.id} className="flex items-center justify-between gap-4">
                          <label className="text-sm font-medium text-gray-600 flex-1">
                            {field.label}
                            {field.required && <span className="text-rose-500 ml-1">*</span>}
                          </label>
                          <div className="w-40 shrink-0">
                            {field.type === 'boolean' ? (
                              <button
                                type="button"
                                onClick={() => handleAmenityChange(field.id, !formData.amenities[field.id])}
                                className={`w-full py-1.5 rounded-lg text-sm font-bold transition-colors border ${
                                  formData.amenities[field.id] 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {formData.amenities[field.id] ? 'Yes' : 'No'}
                              </button>
                            ) : field.type === 'select' ? (
                              <select
                                value={String(formData.amenities[field.id] || '')}
                                onChange={(e) => handleAmenityChange(field.id, e.target.value)}
                                className="w-full py-1.5 px-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium appearance-none"
                                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                              >
                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            ) : field.type === 'number' ? (
                              <input
                                type="number"
                                min="0"
                                value={Number(formData.amenities[field.id] || 0)}
                                onChange={(e) => handleAmenityChange(field.id, Math.max(0, Number(e.target.value)))}
                                className="w-full py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium text-center"
                                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                              />
                            ) : (
                              <input
                                type="text"
                                required={field.required}
                                value={String(formData.amenities[field.id] || '')}
                                onChange={(e) => handleAmenityChange(field.id, e.target.value)}
                                className="w-full py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm font-medium"
                                style={{ '--tw-ring-color': `${org.primary_color}50` } as React.CSSProperties}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Terms & Conditions */}
            <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                📜 Terms & Conditions
              </h3>
              <ul className="list-disc list-inside space-y-2 text-xs font-medium text-amber-800/80 mb-6">
                <li>Once a booking is confirmed, it cannot be cancelled. The advance amount is strictly non-refundable.</li>
                <li>A minimum of 50% advance payment is required at the time of booking. 100% payment must be completed before the commencement of the event/function.</li>
                <li>Weapons and alcoholic beverages are strictly prohibited within the premises.</li>
                <li>Fire crackers are strictly prohibited within the premises.</li>
                <li>Parking is at the owner's risk. Guests must take care of their own valuables and belongings (The management will not be responsible for any loss, damage, or theft.).</li>
                <li>Additional services and items not included in the selected package (such as generator diesel, coffee machine, LED screen, décor items, etc.) will be charged separately.</li>
                <li>Any loss or damage to property will be chargeable, and the party must bear the full cost.</li>
                <li>Outsourcing of any service is not allowed. In exceptional cases, if outsourcing is required, prior permission from management is mandatory; otherwise, outsourced vendors will not be permitted.</li>
                <li>DJ will stop playing at 10:00 PM as per police department guidelines and local rules & regulations. Music will not be played after this time.</li>
              </ul>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.accepted_terms}
                    onChange={(e) => setFormData({...formData, accepted_terms: e.target.checked})}
                  />
                  <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${formData.accepted_terms ? 'bg-amber-600 border-amber-600' : 'border-amber-300 bg-white group-hover:border-amber-400'}`}>
                    {formData.accepted_terms && <CheckSquare size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-900 select-none">
                  I have read and accept all the above terms and conditions
                </span>
              </label>
            </section>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-gray-500 hover:bg-gray-100 transition-colors uppercase tracking-widest w-full sm:w-auto justify-center"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-100 transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="booking-form"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-white text-sm font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: org.primary_color, boxShadow: `0 10px 20px -10px ${org.primary_color}80` }}
              disabled={!formData.accepted_terms}
            >
              <CheckCircle2 size={18} /> Confirm Reservation
            </button>
          </div>
        </div>
      </div>
      
      <PrintableReservation 
        formData={formData} 
        org={org} 
        subtotal={subtotal} 
        totalRate={total_rate} 
        balanceDue={balance_due} 
      />
    </div>
  );
};
