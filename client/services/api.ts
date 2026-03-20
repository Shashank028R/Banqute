import { Booking, Expense } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getBookings: async (tenantId: string): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings?tenantId=${tenantId}`);
      const bookings = await response.json();
      return bookings.map((b: any) => ({
        ...b,
        tenantId: b.tenantId || b.tenant_id || tenantId,
        eventDate: b.eventDate || b.event_date || new Date().toISOString(),
        createdAt: b.createdAt || b.created_at || new Date().toISOString(),
        clientName: b.clientName || b.customer_name || 'Legacy Client',
        contact: b.contact || b.contactNumber || b.customer_phone || 'N/A',
        eventType: b.eventType || b.event_type || 'Event',
        status: b.status || 'Upcoming',
        payments: b.payments || [],
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createBooking: async (bookingData: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getExpenses: async (tenantId: string): Promise<Expense[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses?tenantId=${tenantId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createExpense: async (expenseData: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      if (!response.ok) throw new Error('Failed to create expense');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPayments: async (tenantId: string): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments?tenantId=${tenantId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  createPayment: async (paymentData: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) throw new Error('Failed to create payment');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updatePayment: async (id: string, data: any): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update payment');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
