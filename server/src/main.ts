import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(require('../firebase-admin.json')),
    });
  }
  const { getFirestore } = require('firebase-admin/firestore');
  getFirestore(admin.app(), 'default').settings({ ignoreUndefinedProperties: true });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();