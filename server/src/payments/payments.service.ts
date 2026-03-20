import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class PaymentsService {
  async getPayments(tenantId: string) {
    try {
      const db = getFirestore(admin.app(), 'default');
      let query: any = db.collection('payments');
      if (tenantId) query = query.where('tenantId', '==', tenantId);
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching payments:', e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async createPayment(data: any) {
    try {
      const db = getFirestore(admin.app(), 'default');
      const docRef = db.collection('payments').doc();
      const newPayment = { ...data, created_at: new Date().toISOString() };
      await docRef.set(newPayment);
      return { id: docRef.id, ...newPayment };
    } catch (e) {
      console.error('Error creating payment:', e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async updatePayment(id: string, updates: any) {
    try {
      const db = getFirestore(admin.app(), 'default');
      const docRef = db.collection('payments').doc(id);
      await docRef.update({ ...updates, updated_at: new Date().toISOString() });
      return { id, ...updates };
    } catch (e) {
      console.error('Error updating payment:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
