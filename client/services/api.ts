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
      if (!response.ok) return [];
      return await response.json();
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
  }
};
