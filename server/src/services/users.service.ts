import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UsersService {
  async getUsers() {
    try {
      const listUsersResult = await admin.auth().listUsers();
      return listUsersResult.users.map(u => ({ uid: u.uid, email: u.email, roles: u.customClaims }));
    } catch (e) {
      console.error('Error fetching users:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}