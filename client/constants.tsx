
import React from 'react';
import { Booking, EventType, Organization, Expense } from './types';

export const INDIAN_CURRENCY_SYMBOL = '₹';

export const SAMPLE_ORGANIZATION: Organization = {
  id: 'org_123',
  name: 'Royal Heritage Grand',
  subdomain: 'royalheritage',
  logo_url: 'https://picsum.photos/200/200?random=1',
  primary_color: '#9d174d', // Rose-800
  secondary_color: '#fdf2f8', // Rose-50
  tagline: 'Crafting Royal Memories Since 1995',
  address: 'S.V. Road, Andheri West, Mumbai, Maharashtra 400058',
  phone: '9999999999',
  gst_number: '27AABCU1234F1Z1',
  preferences: {
    autoGenerateInvoices: true,
    sendSmsReminders: true,
    enableClientPortal: false,
    dailyRevenueEmail: true,
    defaultAdvancePercentage: 20,
    cancellationPolicy: 'Strict',
  },
  expenseCategories: [
    'Catering',
    'Decoration',
    'Staff',
    'Infrastructure',
    'Entertainment',
    'Manpower',
    'Other'
  ],
  bookingFormSchema: [
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      fields: [
        { id: 'hall', label: 'Hall', type: 'select', options: ['Select Option', 'Maharaja Ballroom', 'Pearl Hall', 'Grand Arena', 'Imperial Suite'] },
        { id: 'rooms_ac', label: 'Rooms With AC', type: 'number' },
        { id: 'stage', label: 'Stage', type: 'select', options: ['Select Option', 'Standard', 'Premium', 'Royal'] },
        { id: 'generator', label: 'Generator', type: 'select', options: ['Select Option', '125 KVA', '250 KVA', '500 KVA'] },
        { id: 'round_table', label: 'Round Table', type: 'number' },
        { id: 'chairs', label: 'Chairs', type: 'number' },
        { id: 'chandni', label: 'Chandni', type: 'number' },
        { id: 'gadday', label: 'Gadday', type: 'number' },
        { id: 'xyz', label: 'xyz', type: 'number' },
      ]
    },
    {
      id: 'decoration',
      name: 'Decoration & Entertainment',
      fields: [
        { id: 'artificial_flower', label: 'Artificial Flower', type: 'boolean' },
        { id: 'natural_flower', label: 'Natural Flower', type: 'boolean' },
        { id: 'lighting', label: 'Lighting', type: 'select', options: ['Select Option', 'Basic', 'Standard', 'Premium'] },
        { id: 'stage_theme', label: 'Stage Decoration Theme', type: 'select', options: ['Select Option', 'Floral', 'Traditional', 'Modern', 'Minimalist'] },
        { id: 'entry_gate', label: 'Entry Gate Decoration', type: 'select', options: ['Select Option', 'Floral', 'Traditional', 'Modern', 'Minimalist'] },
        { id: 'table_decor', label: 'Table Decoration/ Centrepieces', type: 'select', options: ['Select Option', 'Floral', 'Candles', 'Lanterns'] },
        { id: 'varmala_stage', label: 'Varmala Stage Setup', type: 'select', options: ['Select Option', 'Standard', 'Premium', 'Royal'] },
        { id: 'bride_groom_entry', label: 'Bride & Groom Entry Theme', type: 'select', options: ['Select Option', 'Standard', 'Premium', 'Royal'] },
        { id: 'led_wall', label: 'LED Wall / Screen', type: 'boolean' },
        { id: 'dj_setup', label: 'DJ Setup', type: 'select', options: ['Select Option', 'Basic', 'Standard', 'Premium'] },
        { id: 'dance_floor', label: 'Dance Floor', type: 'select', options: ['Select Option', 'Standard', 'LED'] },
      ]
    },
    {
      id: 'catering',
      name: 'Catering & Food Counters',
      fields: [
        { id: 'spoon', label: 'Spoon', type: 'number' },
        { id: 'main_course', label: 'Main Course Counters', type: 'number' },
        { id: 'snacks_counter', label: 'Snacks Counter', type: 'number' },
        { id: 'fruits_counter', label: 'Fruits Counter', type: 'boolean' },
        { id: 'ice_cream', label: 'Ice-Cream Parlour', type: 'boolean' },
        { id: 'mocktail', label: 'Mocktail Counter', type: 'boolean' },
        { id: 'coffee_machine', label: 'Coffee Machine', type: 'number' },
        { id: 'beverage_counter', label: 'Beverage Counter / Tea-Coffee Counter', type: 'number' },
        { id: 'crockery_bone_china', label: 'Crockery Plates - Bone China', type: 'number' },
        { id: 'crockery_melamine', label: 'Crockery Plates - Melamine', type: 'number' },
      ]
    },
    {
      id: 'manpower',
      name: 'Manpower',
      fields: [
        { id: 'service_manager', label: 'Service Manager', type: 'number' },
        { id: 'waiters', label: 'Waiters', type: 'number' },
        { id: 'housekeeping', label: 'Housekeeping', type: 'number' },
        { id: 'ut_boys', label: 'UT Boys', type: 'number' },
        { id: 'parking_guards', label: 'Parking Guards', type: 'number' },
        { id: 'electrician', label: 'Electrician', type: 'number' },
      ]
    },
    {
      id: 'halwai_bardana',
      name: 'Halwai Bardana',
      fields: [
        { id: 'tub', label: 'Tub', type: 'number' },
        { id: 'bhigona', label: 'Bhigona', type: 'number' },
        { id: 'parant', label: 'Parant', type: 'number' },
        { id: 'trays_big', label: 'Trays Big', type: 'number' },
        { id: 'trays_small', label: 'Trays Small', type: 'number' },
        { id: 'bhatti', label: 'Bhatti', type: 'number' },
        { id: 'takhat', label: 'Takhat', type: 'number' },
        { id: 'dari', label: 'Dari', type: 'number' },
        { id: 'degg', label: 'Degg', type: 'number' },
        { id: 'donga', label: 'Donga', type: 'number' },
        { id: 'jug', label: 'Jug', type: 'number' },
        { id: 'chamcha', label: 'Chamcha', type: 'number' },
        { id: 'table', label: 'Table', type: 'number' },
        { id: 'bistray', label: 'Bistray', type: 'number' },
        { id: 'burner', label: 'Burner', type: 'number' },
        { id: 'cielling', label: 'Cielling', type: 'number' },
      ]
    },
    {
      id: 'extra_addons',
      name: 'Extra / Add Ons',
      fields: [
        { id: 'cotton_candy', label: 'Cotton Candy', type: 'boolean' },
        { id: 'popcorn', label: 'Popcorn Counter', type: 'boolean' },
        { id: 'kids_play', label: 'Kids Play Area', type: 'boolean' },
        { id: 'live_singer', label: 'Live Singer', type: 'boolean' },
        { id: 'orchestra', label: 'Orchestra', type: 'boolean' },
        { id: 'anchor', label: 'Anchor', type: 'boolean' },
        { id: 'phoolon_chadar', label: 'Phoolon ke Chadar', type: 'boolean' },
        { id: 'counter', label: 'Counter', type: 'number' },
        { id: 'matka_anar', label: 'Matka Anar', type: 'number' },
        { id: 'center_table', label: 'Center Table', type: 'boolean' },
        { id: 'welcome_girls', label: 'Wellcome Girls', type: 'number' },
        { id: 'coolar', label: 'Coolar', type: 'number' },
        { id: 'led_screen_qty', label: 'LED Screen', type: 'number' },
        { id: 'rooms', label: 'Rooms', type: 'number' },
        { id: 'diesel', label: 'Diesel', type: 'number' },
      ]
    }
  ],
  bookingTemplates: [
    {
      id: 'tmpl_gold',
      name: 'Gold Wedding Package',
      package: 'Gold',
      fieldValues: {
        'hall': 'Maharaja Ballroom',
        'stage': 'Royal',
        'lighting': 'Premium',
        'stage_theme': 'Traditional',
        'waiters': 40,
        'service_manager': 2,
        'main_course': 12,
        'snacks_counter': 8,
        'ice_cream': true,
        'mocktail': true
      }
    },
    {
      id: 'tmpl_silver',
      name: 'Silver Sangeet Package',
      package: 'Silver',
      fieldValues: {
        'hall': 'Pearl Hall',
        'stage': 'Standard',
        'lighting': 'Standard',
        'stage_theme': 'Modern',
        'waiters': 20,
        'service_manager': 1,
        'main_course': 8,
        'snacks_counter': 4,
        'ice_cream': false,
        'mocktail': true
      }
    }
  ]
};

export const SAMPLE_BOOKINGS: Booking[] = [];

export const SAMPLE_EXPENSES: Expense[] = [];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'bookings', label: 'All Bookings', icon: 'ClipboardList' },
  { id: 'calendar', label: 'Calendar', icon: 'CalendarDays' },
  { id: 'accounts', label: 'Accounts & GST', icon: 'IndianRupee' },
  { id: 'settings', label: 'Control Center', icon: 'Settings2' },
];

export const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'Yes Bank',
  'IDFC First Bank',
  'Canara Bank',
  'Union Bank of India',
  'Other'
];
