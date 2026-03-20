import React from 'react';
import { Organization } from '../types';

interface PrintableReservationProps {
  formData: any;
  org: Organization;
  subtotal: number;
  totalRate: number;
  balanceDue: number;
  advancePaid?: number;
}

export const PrintableReservation: React.FC<PrintableReservationProps> = ({ 
  formData, 
  org, 
  subtotal, 
  totalRate, 
  balanceDue,
  advancePaid
}) => {
  // Helper to check if a value is "filled"
  const isFilled = (val: any) => {
    if (typeof val === 'boolean') return val === true;
    if (typeof val === 'number') return val > 0;
    if (typeof val === 'string') return val !== '' && val !== 'Select Option' && val !== '0' && val !== 'Select Bank';
    return false;
  };

  // Normalize data between ReservationFormPage and BookingModal
  const clientName = formData.clientName || formData.clientName || '';
  const contactNumber = formData.contactNumber || formData.contact || '';
  const eventDate = formData.eventDate || formData.eventDate || '';
  const eventType = formData.eventType || formData.eventType || '';
  const shift = formData.shift || '';
  const expectedGuests = formData.expectedGuests || formData.guests || 0;
  const bookingId = formData.bookingId || 'HG-2026-TEMP';
  const paymentMode = formData.paymentMode || formData.payment_mode || '';
  const bankName = formData.bankName || formData.bank_name || '';
  const referenceNumber = formData.referenceNumber || formData.reference_number || '';
  const discount = formData.discount || 0;
  const advancePayment = advancePaid !== undefined 
    ? advancePaid 
    : formData.payments?.reduce((s, p) => s + (p.type === 'Received' ? (Number(p.amount) || 0) : -(Number(p.amount) || 0)), 0) || Number(formData.advance) || 0;

  // Group fields for printing
  const sections: { title: string; fields: { label: string; value: any }[] }[] = [];

  if (formData.amenities) {
    // Handling BookingModal dynamic schema
    org.bookingFormSchema?.forEach(category => {
      const fields = category.fields
        .map(f => ({ label: f.label, value: formData.amenities[f.id] }))
        .filter(f => isFilled(f.value));
      
      if (fields.length > 0) {
        sections.push({ title: category.category, fields });
      }
    });
  } else {
    // Handling ReservationFormPage fixed structure
    const fixedSections = [
      {
        title: 'Infrastructure',
        fields: [
          { label: 'Hall', value: formData.hall },
          { label: 'Rooms with AC', value: formData.roomsWithAC },
          { label: 'Stage', value: formData.stage },
          { label: 'Generator', value: formData.generator },
          { label: 'Round Table', value: formData.roundTable },
          { label: 'Chairs', value: formData.chairs },
          { label: 'Chandni', value: formData.chandni },
          { label: 'Gadday', value: formData.gadday },
        ]
      },
      {
        title: 'Decoration & Entertainment',
        fields: [
          { label: 'Artificial Flower', value: formData.artificialFlower ? 'Yes' : '' },
          { label: 'Natural Flower', value: formData.naturalFlower ? 'Yes' : '' },
          { label: 'Lighting', value: formData.lighting },
          { label: 'Stage Decoration Theme', value: formData.stageDecorationTheme ? 'Yes' : '' },
          { label: 'Entry Gate Decoration', value: formData.entryGateDecoration ? 'Yes' : '' },
          { label: 'Table Decoration', value: formData.tableDecoration ? 'Yes' : '' },
          { label: 'Varmala Stage Setup', value: formData.varmalaStageSetup ? 'Yes' : '' },
          { label: 'Bride Groom Entry Theme', value: formData.brideGroomEntryTheme ? 'Yes' : '' },
          { label: 'LED Wall Screen', value: formData.ledWallScreen ? 'Yes' : '' },
          { label: 'DJ Setup', value: formData.djSetup },
          { label: 'Dance Floor', value: formData.danceFloor },
        ]
      },
      {
        title: 'Catering Services',
        fields: [
          { label: 'Spoon', value: formData.spoon },
          { label: 'Main Course Counters', value: formData.mainCourseCounters },
          { label: 'Snacks Counter', value: formData.snacksCounter },
          { label: 'Fruits Counter', value: formData.fruitsCounter ? 'Yes' : '' },
          { label: 'Ice Cream Parlour', value: formData.iceCreamParlour ? 'Yes' : '' },
          { label: 'Mocktail Counter', value: formData.mocktailCounter ? 'Yes' : '' },
          { label: 'Coffee Machine', value: formData.coffeeMachine },
          { label: 'Beverage Counter', value: formData.beverageCounter },
          { label: 'Crockery (Bone China)', value: formData.crockeryBoneChina },
          { label: 'Crockery (Melamine)', value: formData.crockeryMelamine },
        ]
      },
      {
        title: 'Manpower',
        fields: [
          { label: 'Service Manager', value: formData.serviceManager },
          { label: 'Waiters', value: formData.waiters },
          { label: 'Housekeeping', value: formData.housekeeping },
          { label: 'UT Boys', value: formData.utBoys },
          { label: 'Parking Guards', value: formData.parkingGuards },
          { label: 'Electrician', value: formData.electrician },
        ]
      },
      {
        title: 'Halwai Bardana',
        fields: [
          { label: 'Tub', value: formData.tub },
          { label: 'Bhigona', value: formData.bhigona },
          { label: 'Parant', value: formData.parant },
          { label: 'Trays Big', value: formData.traysBig },
          { label: 'Trays Small', value: formData.traysSmall },
          { label: 'Bhatti', value: formData.bhatti },
          { label: 'Takhat', value: formData.takhat },
          { label: 'Dari', value: formData.dari },
          { label: 'Degg', value: formData.degg },
          { label: 'Donga', value: formData.donga },
          { label: 'Jug', value: formData.jug },
          { label: 'Chamcha', value: formData.chamcha },
          { label: 'Table', value: formData.table },
          { label: 'Bistray', value: formData.bistray },
          { label: 'Burner', value: formData.burner },
          { label: 'Cielling', value: formData.cielling },
        ]
      },
      {
        title: 'Extra / Add-Ons',
        fields: [
          { label: 'Cotton Candy', value: formData.cottonCandy ? 'Yes' : '' },
          { label: 'Popcorn Counter', value: formData.popcornCounter ? 'Yes' : '' },
          { label: 'Kids Play Area', value: formData.kidsPlayArea ? 'Yes' : '' },
          { label: 'Live Singer', value: formData.liveSinger ? 'Yes' : '' },
          { label: 'Orchestra', value: formData.orchestra ? 'Yes' : '' },
          { label: 'Anchor', value: formData.anchor ? 'Yes' : '' },
          { label: 'Phoolon Ke Chadar', value: formData.phoolonKeChadar ? 'Yes' : '' },
          { label: 'Extra Counter', value: formData.extraCounter },
          { label: 'Matka Anar', value: formData.matkaAnar },
          { label: 'Center Table', value: formData.centerTable ? 'Yes' : '' },
          { label: 'Wellcome Girls', value: formData.wellcomeGirls },
          { label: 'Coolar', value: formData.coolar },
          { label: 'LED Screen', value: formData.ledScreen },
          { label: 'Rooms', value: formData.rooms },
          { label: 'Diesel', value: formData.diesel },
        ]
      }
    ];
    fixedSections.forEach(s => {
      const fields = s.fields.filter(f => isFilled(f.value));
      if (fields.length > 0) sections.push({ title: s.title, fields });
    });
  }

  // If no sections were populated (e.g. for simple SAMPLE_BOOKINGS), add a summary section
  if (sections.length === 0) {
    sections.push({
      title: 'Booking Summary',
      fields: [
        { label: 'Hall Name', value: formData.hall_name || 'Main Hall' },
        { label: 'Shift', value: formData.shift || 'N/A' },
        { label: 'Status', value: formData.status || 'Confirmed' },
        { label: 'Season', value: formData.season || 'N/A' },
      ].filter(f => isFilled(f.value))
    });
  }

  return (
    <div id="printable-area" className="hidden print:block p-8 bg-white text-black font-sans min-h-screen">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-tighter">{org.name}</h1>
        <p className="text-sm italic font-medium">{org.tagline}</p>
        <div className="flex justify-center gap-4 mt-2 text-xs font-bold">
          <span>{org.address}</span>
          <span>•</span>
          <span>Ph: +91 {org.phone}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 bg-gray-100 p-3 rounded border border-black">
        <h2 className="text-xl font-black uppercase">Reservation Voucher</h2>
        <div className="text-right">
          <p className="text-xs font-bold">Booking ID: <span className="font-mono">{bookingId}</span></p>
          <p className="text-xs font-bold">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
        <div className="flex justify-between border-b border-gray-300 pb-1">
          <span className="font-bold uppercase text-[10px] text-gray-600">Client Name:</span>
          <span className="font-bold">{clientName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1">
          <span className="font-bold uppercase text-[10px] text-gray-600">Contact:</span>
          <span className="font-bold">{contactNumber}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1">
          <span className="font-bold uppercase text-[10px] text-gray-600">Event Date:</span>
          <span className="font-bold">{eventDate}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-1">
          <span className="font-bold uppercase text-[10px] text-gray-600">Event Type:</span>
          <span className="font-bold">{eventType}</span>
        </div>
        {shift && (
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-bold uppercase text-[10px] text-gray-600">Shift:</span>
            <span className="font-bold">{shift}</span>
          </div>
        )}
        <div className="flex justify-between border-b border-gray-300 pb-1">
          <span className="font-bold uppercase text-[10px] text-gray-600">Expected Guests:</span>
          <span className="font-bold">{expectedGuests}</span>
        </div>
      </div>

      {/* Dynamic Sections - Only show filled fields */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="break-inside-avoid">
            <h3 className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 mb-2 inline-block">
              {section.title}
            </h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx} className="flex justify-between border-b border-gray-100 pb-0.5">
                  <span className="text-gray-600">{field.label}:</span>
                  <span className="font-bold">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Summary */}
      <div className="mt-8 border-t-2 border-black pt-4 break-inside-avoid">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1 text-xs">
            {formData.package && (
              <div className="flex justify-between">
                <span className="font-bold">Package:</span>
                <span>{formData.package}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold">Payment Mode:</span>
              <span>{paymentMode} {bankName ? `(${bankName})` : ''}</span>
            </div>
            {referenceNumber && (
              <div className="flex justify-between">
                <span className="font-bold">Ref No:</span>
                <span className="font-mono">{referenceNumber}</span>
              </div>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="font-bold uppercase text-[10px]">Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="font-bold uppercase text-[10px]">Discount:</span>
              <span>- ₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-black pt-1 text-lg font-black">
              <span className="uppercase text-xs">Total Amount:</span>
              <span>₹{totalRate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-700 font-bold">
              <span className="uppercase text-[10px]">Advance Paid:</span>
              <span>₹{advancePayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-double border-black pt-1 text-xl font-black">
              <span className="uppercase text-xs">Balance Due:</span>
              <span>₹{balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-16 grid grid-cols-2 gap-20 text-center text-xs font-bold uppercase tracking-widest">
        <div className="border-t border-black pt-2">Client Signature</div>
        <div className="border-t border-black pt-2">Authorized Signatory</div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[9px] text-gray-400 italic">
        This is a computer generated document. No signature is required unless specified.
      </div>
    </div>
  );
};
