import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

@Injectable()
export class ExpensesService {
  async getExpenses(tenantId: string) {
    try {
      const db = getFirestore(admin.app(), 'default');
      let query: any = db.collection('expenses');
      if (tenantId) query = query.where('tenant_id', '==', tenantId);
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching expenses:', e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async createExpense(data: any) {
    try {
      const db = getFirestore(admin.app(), 'default');
      const docRef = db.collection('expenses').doc();
      await docRef.set(data);
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('Error creating expense:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}