
import React, { useState } from 'react';
import { 
  X, Calendar, User, Phone, Users, IndianRupee, 
  PartyPopper, Clock, Package, CreditCard, 
  CheckSquare, RefreshCw, CheckCircle2, ArrowLeft,
  Mail, MapPin, Hash, Info, ShieldCheck,
  ChevronRight, Sparkles, Receipt, Printer, Send, PhoneCall,
  ClipboardList, Copy
} from 'lucide-react';
import { useOrganization } from '../contexts/OrganizationContext';
import { PrintableReservation } from './PrintableReservation';
import { api } from '../services/api';
import { BANKS } from '../constants';
import { DynamicForm } from './DynamicForm';

interface ReservationFormPageProps {
  onClose: () => void;
  season: string;
}

export const ReservationFormPage: React.FC<ReservationFormPageProps> = ({ onClose, season }) => {
  const { organization: org } = useOrganization();
  
  const [formData, setFormData] = useState(() => {
    const initialData: any = {
      // Basic Details
      bookingId: `HG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientName: '',
      contactNumber: '',
      eventDate: '',
      eventType: 'Wedding',
      shift: 'Night',
      expectedGuests: 100,
      package: 'Custom / No Package',
      packageRate: 0,
      addonServices: 0,
      discount: 0,
      advancePayment: 0,
      paymentMode: 'Cash',
      bankName: '',
      paymentMedium: 'UPI',
      referenceNumber: '',
      termsAccepted: false
    };

    // Initialize dynamic fields from schema
    org.bookingFormSchema.forEach(cat => {
      cat.fields.forEach(field => {
        if (field.type === 'boolean') initialData[field.id] = false;
        else if (field.type === 'number') initialData[field.id] = 0;
        else if (field.type === 'select') initialData[field.id] = field.options?.[0] || '';
        else initialData[field.id] = '';

        if (field.hasComment) {
          initialData[`${field.id}_comment`] = '';
        }
      });
    });

    return initialData;
  });

  const subtotal = Number(formData.packageRate) + Number(formData.addonServices);
  const totalRate = subtotal - Number(formData.discount);
  const balanceDue = totalRate - Number(formData.advancePayment);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let val: string | number | boolean = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Capitalize first letter for text inputs
    if (type === 'text' && typeof val === 'string' && val.length > 0) {
      val = val.charAt(0).toUpperCase() + val.slice(1);
    }
    
    // Validate phone number
    if (name === 'contactNumber' && typeof val === 'string') {
      val = val.replace(/\\D/g, '').slice(0, 10);
    }

    // Prevent negative values for number inputs
    if (type === 'number') {
      const numVal = Number(value);
      const minAttr = (e.target as HTMLInputElement).min;
      const minVal = minAttr ? Number(minAttr) : 0;
      val = Math.max(minVal, numVal);
    }
    
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      window.location.reload();
    }
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyTemplate = (templateId: string) => {
    const template = org.bookingTemplates?.find(t => t.id === templateId);
    if (!template) return;

    if (window.confirm(`Apply "${template.name}" template? This will overwrite existing field values.`)) {
      setFormData(prev => ({
        ...prev,
        package: template.package,
        ...template.fieldValues
      }));
    }
  };

  const handleCreateBooking = async () => {
    setIsSubmitting(true);
    try {
      const newBooking = {
        bookingId: formData.bookingId,
        clientName: formData.clientName,
        status: 'Upcoming',
        tier: formData.package?.includes('Gold') ? 'Gold' : formData.package?.includes('Diamond') ? 'Diamond' : 'Silver',
        season: season,
        eventDate: formData.eventDate,
        contact: formData.contactNumber,
        rate: totalRate,
        packageRate: Number(formData.packageRate),
        addOnServices: Number(formData.addonServices),
        discount: Number(formData.discount),
        expenses: 0,
        eventType: formData.eventType,
        guests: Number(formData.expectedGuests),
        shift: formData.shift,
        services: formData,
        payments: formData.advancePayment > 0 ? [{
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            amount: Number(formData.advancePayment),
            method: formData.paymentMode === 'Cash' ? 'Cash' : 'Bank',
            type: 'Received'
        }] : [],
        createdAt: new Date().toISOString()
      };
      await api.createBooking(newBooking);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to save booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${org.primary_color}05` }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center space-y-6 border border-gray-100 animate-in zoom-in duration-300">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${org.primary_color}15`, color: org.primary_color }}
          >
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Booking Created!</h2>
          <p className="text-gray-600">
            The reservation for <span className="font-bold text-gray-900">{formData.clientName}</span> has been successfully registered.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 border border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-bold uppercase">Booking ID:</span>
              <span className="font-mono font-bold">{formData.bookingId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-bold uppercase">Event Date:</span>
              <span className="font-bold">{formData.eventDate}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-bold uppercase">Total Amount:</span>
              <span className="font-bold" style={{ color: org.primary_color }}>₹{totalRate.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest transition-all hover:bg-black shadow-lg"
            >
              <Printer size={18} />
              Print Form
            </button>
            <button 
              onClick={onClose}
              className="py-3 text-white rounded-xl font-bold uppercase tracking-widest transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: org.primary_color }}
            >
              Done
            </button>
          </div>
        </div>
        <PrintableReservation 
          formData={formData} 
          org={org} 
          subtotal={subtotal} 
          totalRate={totalRate} 
          balanceDue={balanceDue} 
        />
      </div>
    );
  }

  const isValid = Boolean(
    formData.clientName && 
    formData.contactNumber && 
    formData.contactNumber.length === 10 &&
    formData.eventDate && 
    formData.shift && 
    formData.eventType && 
    formData.termsAccepted
  );

  return (
    <div className="min-h-full bg-gray-50/50 flex flex-col font-sans text-gray-800 pb-12" style={{ '--brand-primary': org.primary_color, '--brand-secondary': org.secondary_color } as React.CSSProperties}>
      {/* Main Form Container */}
      <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Letterhead Branding */}
        <div 
          className="text-white p-6 lg:p-8 text-center relative overflow-hidden"
          style={{ backgroundColor: org.primary_color }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-1 tracking-tight">{org.name}</h1>
            <p className="text-lg font-medium italic opacity-90 mb-3">"{org.tagline}"</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-lg">
                  <PhoneCall size={14} className="text-white" />
                </div>
                <span>+91 {org.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-lg">
                  <MapPin size={14} className="text-white" />
                </div>
                <span>{org.address}</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Basic Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</label>
              <input 
                type="text" 
                name="bookingId"
                value={formData.bookingId}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-base font-bold text-gray-700 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client Name *</label>
              <input 
                type="text" 
                name="clientName"
                placeholder="Enter client name"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20`, borderColor: '' } as any}
                onFocus={(e) => { e.target.style.borderColor = org.primary_color; e.target.select(); }}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Number *</label>
              <input 
                type="tel" 
                name="contactNumber"
                placeholder="10-digit number"
                maxLength={10}
                minLength={10}
                required
                pattern="[0-9]{10}"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20`, borderColor: '' } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Event Date *</label>
              <input 
                type="date" 
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20`, borderColor: '' } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Event Type</label>
              <select 
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              >
                <option>Wedding</option>
                <option>Engagement</option>
                <option>Reception</option>
                <option>Birthday</option>
                <option>Corporate</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shift *</label>
              <select 
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              >
                <option>Night</option>
                <option>Day</option>
                <option>Full Day</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected Guests</label>
              <input 
                type="number" 
                min="1"
                name="expectedGuests"
                value={formData.expectedGuests}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Copy size={12} className="text-indigo-500" />
                Quick Template
              </label>
              <select 
                onChange={(e) => applyTemplate(e.target.value)}
                className="w-full bg-indigo-50/50 text-indigo-700 border border-indigo-100 rounded-lg px-4 py-2.5 text-base font-bold focus:ring-2 outline-none transition-all"
                value=""
              >
                <option value="" disabled>Pick a preset...</option>
                {org.bookingTemplates?.map(tmpl => (
                  <option key={tmpl.id} value={tmpl.id}>{tmpl.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Package</label>
              <select 
                name="package"
                value={formData.package}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              >
                <option>Custom / No Package</option>
                <option>Gold Package</option>
                <option>Silver Package</option>
                <option>Diamond Package</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Package Rate (₹)</label>
              <input 
                type="number" 
                min="0"
                name="packageRate"
                value={formData.packageRate}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add-on Services (₹)</label>
              <input 
                type="number" 
                min="0"
                name="addonServices"
                value={formData.addonServices}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal (₹)</label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-base font-bold text-gray-700">
                ₹{subtotal.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount (₹)</label>
              <input 
                type="number" 
                min="0"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Rate (₹) *</label>
              <div 
                className="w-full border rounded-lg px-4 py-2.5 text-base font-black"
                style={{ backgroundColor: `${org.primary_color}10`, borderColor: `${org.primary_color}20`, color: org.primary_color }}
              >
                ₹{totalRate.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advance Payment (₹)</label>
              <input 
                type="number" 
                min="0"
                name="advancePayment"
                value={formData.advancePayment}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Mode</label>
              <select 
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                onFocus={(e) => e.target.style.borderColor = org.primary_color}
                onBlur={(e) => e.target.style.borderColor = ''}
              >
                <option>Cash</option>
                <option>Bank/Online</option>
              </select>
            </div>

            {formData.paymentMode === 'Bank/Online' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bank</label>
                  <select 
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                    style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                    onFocus={(e) => e.target.style.borderColor = org.primary_color}
                    onBlur={(e) => e.target.style.borderColor = ''}
                  >
                    <option value="">Select Bank</option>
                    {BANKS.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Medium</label>
                  <select 
                    name="paymentMedium"
                    value={formData.paymentMedium}
                    onChange={handleInputChange}
                    className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                    style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                    onFocus={(e) => e.target.style.borderColor = org.primary_color}
                    onBlur={(e) => e.target.style.borderColor = ''}
                  >
                    <option>UPI</option>
                    <option>Net Banking</option>
                    <option>Debit Card</option>
                    <option>Credit Card</option>
                    <option>Cheque</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reference / Cheque No.</label>
                  <input 
                    type="text" 
                    name="referenceNumber"
                    placeholder="Enter reference number"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:ring-2 outline-none transition-all"
                    style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                    onFocus={(e) => e.target.style.borderColor = org.primary_color}
                    onBlur={(e) => e.target.style.borderColor = ''}
                  />
                </div>
              </>
            )}
          </div>

          {/* Financial Summary Bar */}
          <div 
            className="border rounded-xl p-4"
            style={{ backgroundColor: `${org.primary_color}05`, borderColor: `${org.primary_color}15` }}
          >
            <h4 
              className="text-center text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: org.primary_color }}
            >
              Financial Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Package Rate</p>
                <p className="text-xl font-black" style={{ color: org.primary_color }}>₹{Number(formData.packageRate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Add-on</p>
                <p className="text-xl font-black text-blue-600">₹{Number(formData.addonServices).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Discount</p>
                <p className="text-xl font-black text-red-500">₹{Number(formData.discount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total Rate</p>
                <p className="text-xl font-black" style={{ color: org.primary_color }}>₹{totalRate.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Advance Paid</p>
                <p className="text-xl font-black text-indigo-600">₹{Number(formData.advancePayment).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Balance Due</p>
                <p className="text-xl font-black text-gray-900">₹{balanceDue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Services & Amenities Section */}
          <div className="space-y-6">
            <h3 
              className="text-xl font-black uppercase tracking-tight border-b-2 pb-2"
              style={{ color: org.primary_color, borderBottomColor: `${org.primary_color}20` }}
            >
              Services & Amenities
            </h3>
            
            <DynamicForm 
              schema={org.bookingFormSchema}
              formData={formData}
              onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
            />
          </div>

          {/* Terms & Conditions Section */}
          <div 
            className="border rounded-2xl p-6 space-y-4"
            style={{ backgroundColor: `${org.primary_color}05`, borderColor: `${org.primary_color}15` }}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={20} style={{ color: org.primary_color }} />
              <h3 className="text-lg font-black uppercase tracking-tight" style={{ color: org.primary_color }}>Terms & Conditions</h3>
            </div>
            <div className="bg-white/80 border rounded-xl p-4 h-48 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-3 custom-scrollbar" style={{ borderColor: `${org.primary_color}10` }}>
              <p>• Once a booking is confirmed, it cannot be cancelled. The advance amount is strictly non-refundable.</p>
              <p>• A minimum of 50% advance payment is required at the time of booking. 100% payment must be completed before the commencement of the event/function.</p>
              <p>• Weapons and alcoholic beverages are strictly prohibited within the premises.</p>
              <p>• Fire crackers are strictly prohibited within the premises.</p>
              <p>• Parking is at the owner's risk. Guests must take care of their own valuables and belongings (The management will not be responsible for any loss, damage, or theft.).</p>
              <p>• Additional services and items not included in the selected package (such as generator diesel, coffee machine, LED screen, décor items, etc.) will be charged separately.</p>
              <p>• Any loss or damage to property will be chargeable, and the party must bear the full cost.</p>
              <p>• Outsourcing of any service is not allowed. In exceptional cases, if outsourcing is required, prior permission from management is mandatory; otherwise, outsourced vendors will not be permitted.</p>
              <p>• DJ will stop playing at 10:00 PM as per police department guidelines and local rules & regulations. Music will not be played after this time.</p>
            </div>
            <label className="flex items-center gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="w-6 h-6 rounded focus:ring-offset-0" 
                style={{ color: org.primary_color, borderColor: `${org.primary_color}40` } as any}
              />
              <span className="text-base font-bold text-gray-700 group-hover:text-gray-900 transition-colors">I have read and accept all the above terms and conditions</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end gap-3 pt-6 border-t border-gray-100">
            {!isValid && (
              <div className="text-xs font-bold text-red-500 px-4 py-2 bg-red-50 rounded-lg w-full text-right border border-red-100">
                Please fill out all required fields (*) and accept the Terms & Conditions before creating a booking.
              </div>
            )}
            <div className="flex items-center justify-end gap-4 w-full">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all shadow-sm"
              >
                <RefreshCw size={18} />
                Reset Form
              </button>
              <button 
                onClick={handleCreateBooking}
                disabled={isSubmitting || !isValid}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${
                  !isSubmitting && isValid
                    ? 'text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={!isSubmitting && isValid ? { backgroundColor: org.primary_color } : {}}
              >
                <CheckCircle2 size={18} />
                {isSubmitting ? 'Saving...' : 'Create Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <PrintableReservation 
        formData={formData} 
        org={org} 
        subtotal={subtotal} 
        totalRate={totalRate} 
        balanceDue={balanceDue} 
      />

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fefce8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fde047;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #facc15;
        }
      `}} />
    </div>
  );
};
