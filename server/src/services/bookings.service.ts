import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class BookingsService {
  async getBookings(tenantId: string) {
    try {
      const db = getFirestore(admin.app(), 'default');
      let query: any = db.collection('bookings');
      if (tenantId) query = query.where('tenant_id', '==', tenantId);
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching bookings:', e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async createBooking(data: any) {
    try {
      const db = getFirestore(admin.app(), 'default');
      const docRef = db.collection('bookings').doc();
      const newBooking = { ...data, created_at: new Date().toISOString() };
      await docRef.set(newBooking);
      return { id: docRef.id, ...newBooking };
    } catch (e) {
      console.error('Error creating booking:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}