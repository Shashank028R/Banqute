/**
 * Heritage Grand Event Management System
 * Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout the application.
 * Follow strict typing to ensure type safety and better IDE support.
 */

export type Tab = 'dashboard' | 'bookings' | 'new-booking' | 'calendar' | 'expenses' | 'analytics' | 'control-center' | 'accounts';

export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type BookingTier = 'Silver' | 'Gold' | 'Diamond';
export type Shift = 'Day' | 'Night';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Bank';
export type UserRole = 'admin' | 'manager' | 'receptionist' | 'viewer';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: string; 
    lastLogin?: string; 
}

export interface CompanyInfo {
    name: string; 
    tagline: string; 
    phone: string; 
    email: string; 
    address: string; 
}

export interface CategoryConfig {
    key: string; 
    displayName: string; 
    order: number; 
    bg: string; 
    border: string; 
    text: string; 
    icon: string; 
}

export interface TermsConfig {
    terms: string[]; 
    lastUpdated?: string; 
    updatedBy?: string; 
}

export interface Payment {
    id: string; 
    bookingId?: string;
    tenantId?: string;
    date: string; 
    amount: number; 
    method: PaymentMethod; 
    type: 'Received' | 'Reverted'; 
    notes?: string; 
    bankName?: string;
    paymentMedium?: string;
    reference?: string;
    recordedBy?: string; 
    isReverted?: boolean; 
    revertedDate?: string; 
    revertReason?: string; 
}

export interface Booking {
    id?: string; // Firebase doc ID
    bookingId: string; 
    clientName: string; 
    status: BookingStatus; 
    tier: BookingTier; 
    season: string; 
    eventDate: string; 
    contact: string; 
    rate: number; 
    packageRate?: number; 
    addOnServices?: number; 
    packageId?: string; 
    payments: Payment[]; 
    discount?: number; 
    expenses: number; 
    eventType: string; 
    guests: number; 
    shift: Shift; 
    services: Record<string, boolean | string | number>; 
    refundAmount?: number; 
    createdAt?: string; 
    updatedAt?: string; 
    createdBy?: string; 
}

export interface ExpenseCategory {
    id: string; 
    name: string; 
    requiresManpower: boolean; 
}

export interface Vendor {
    id: string; 
    name: string; 
    categoryId: string; 
}

export interface Expense {
    id: string; 
    bookingId?: string; 
    expenseDate: string; 
    category: string; 
    vendor: string; 
    amount: number; 
    paymentMethod: PaymentMethod; 
    type: 'Paid' | 'Reverted'; 
    notes?: string; 
    manpowerCount?: number; 
    ratePerPerson?: number; 
    recordedBy?: string; 
}

export interface Transaction {
    date: string; 
    description: string; 
    bookingId?: string; 
    type: 'Income' | 'Expense'; 
    amount: number; 
    paymentMethod?: PaymentMethod; 
    vendor?: string; 
    category?: string; 
}

export interface Service {
    id: string; 
    name: string; 
    type: 'checkbox' | 'dropdown' | 'number'; 
    options?: string[]; 
    min?: number; 
    max?: number; 
}

export type ServiceUIType = keyof ServiceConfig;

export interface ServiceConfig {
    infrastructure: Service[];
    decoration: Service[];
    labour: Service[];
    halwai: Service[];
    extra: Service[];
    [key: string]: Service[]; 
}

export interface Package {
    id: string; 
    name: string; 
    price: number; 
    tier: BookingTier; 
    services: Record<string, boolean | string | number>; 
}

export interface Toast {
    id: number; 
    message: string; 
    type: 'success' | 'error' | 'warning' | 'info'; 
}

export interface AuditLog {
    id: string; 
    action: 'create' | 'update' | 'delete' | 'login' | 'logout'; 
    targetCollection: 'bookings' | 'expenses' | 'settings' | 'auth'; 
    targetId?: string; 
    performedBy: string; 
    timestamp: string; 
    details: string; 
    oldValue?: any; 
    newValue?: any; 
}

export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface NewBookingFormState {
    eventDate: string;
    shift: Shift | '';
    clientName: string;
    contact: string;
    eventType: string;
    guests: number;
    packageId: string;
    packagePrice: number;
    addOnAmount: number;
    rate: number; 
    discount: number;
    advance: number;
    services: Record<string, boolean | string | number>;
    initialPaymentMode: 'Cash' | 'Bank';
    initialPaymentMedium: 'UPI' | 'Cheque' | 'Card' | 'Other';
    initialPaymentRef: string;
}

export const isBookingStatus = (value: any): value is BookingStatus => {
    return ['Upcoming', 'Completed', 'Cancelled'].includes(value);
};

export const isBookingTier = (value: any): value is BookingTier => {
    return ['Silver', 'Gold', 'Diamond'].includes(value);
};

export const isPaymentMethod = (value: any): value is PaymentMethod => {
    return ['Cash', 'Card', 'UPI', 'Bank'].includes(value);
};

export const isUserRole = (value: any): value is UserRole => {
    return ['admin', 'manager', 'receptionist', 'viewer'].includes(value);
};

export const isShift = (value: any): value is Shift => {
    return ['Day', 'Night'].includes(value);
};

export const FINANCIAL_YEAR_START_MONTH = 3; 
export const FINANCIAL_YEAR_END_MONTH = 2; 

export const BOOKING_ID_PREFIX = 'HG';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Legacy bindings to prevent extreme context crashes
export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  tagline: string;
  address: string;
  phone: string;
  gst_number: string;
  preferences: any;
  bookingFormSchema: any[];
  bookingTemplates?: any[];
  expenseCategories?: string[];
}

export enum EventType {
  WEDDING = 'Wedding',
  SANGEET = 'Sangeet',
  MEHENDI = 'Mehendi',
  RECEPTION = 'Reception',
  BIRTHDAY = 'Birthday',
  CORPORATE = 'Corporate',
  ANNIVERSARY = 'Anniversary',
  RELIGIOUS = 'Religious',
  ENGAGEMENT = 'Engagement'
}

export interface BookingTemplate {
  id: string;
  name: string;
  package: string;
  fieldValues: Record<string, any>;
}

export interface BookingFormCategory {
  id: string;
  name: string;
  fields: BookingFormField[];
  conditionalVisibility?: { fieldId: string; value: string; };
}

export interface BookingFormField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'boolean' | 'text';
  required?: boolean;
  options?: string[];
  hasComment?: boolean;
  conditionalVisibility?: { fieldId: string; value: string; };
}
