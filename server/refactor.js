const fs = require('fs');
const path = require('path');

const dirs = [
  'src/controllers',
  'src/services',
  'src/middleware'
];

dirs.forEach(dir => fs.mkdirSync(path.join(__dirname, dir), { recursive: true }));

const files = {
  'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(require('../firebase-admin.json')),
    });
  }
  admin.firestore().settings({ ignoreUndefinedProperties: true });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();`,

  'src/app.module.ts': `import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { UsersController } from './controllers/users.controller';
import { BookingsService } from './services/bookings.service';
import { ExpensesService } from './services/expenses.service';
import { UsersService } from './services/users.service';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [],
  controllers: [BookingsController, ExpensesController, UsersController],
  providers: [BookingsService, ExpensesService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}`,

  'src/middleware/logger.middleware.ts': `import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.originalUrl}\`);
    next();
  }
}`,

  'src/services/bookings.service.ts': `import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class BookingsService {
  async getBookings(tenantId: string) {
    try {
      let query: admin.firestore.Query = admin.firestore().collection('bookings');
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
      const docRef = admin.firestore().collection('bookings').doc();
      const newBooking = { ...data, created_at: new Date().toISOString() };
      await docRef.set(newBooking);
      return { id: docRef.id, ...newBooking };
    } catch (e) {
      console.error('Error creating booking:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}`,

  'src/controllers/bookings.controller.ts': `import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getBookings(@Query('tenant_id') tenantId: string) {
    return this.bookingsService.getBookings(tenantId);
  }

  @Post()
  createBooking(@Body() data: any) {
    return this.bookingsService.createBooking(data);
  }
}`,

  'src/services/expenses.service.ts': `import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ExpensesService {
  async getExpenses(tenantId: string) {
    try {
      let query: admin.firestore.Query = admin.firestore().collection('expenses');
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
      const docRef = admin.firestore().collection('expenses').doc();
      await docRef.set(data);
      return { id: docRef.id, ...data };
    } catch (e) {
      console.error('Error creating expense:', e);
      throw new InternalServerErrorException(e.message);
    }
  }
}`,

  'src/controllers/expenses.controller.ts': `import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExpensesService } from '../services/expenses.service';

@Controller('api/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  getExpenses(@Query('tenant_id') tenantId: string) {
    return this.expensesService.getExpenses(tenantId);
  }

  @Post()
  createExpense(@Body() data: any) {
    return this.expensesService.createExpense(data);
  }
}`,

  'src/services/users.service.ts': `import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}`,

  'src/controllers/users.controller.ts': `import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filepath), content);
}

// Remove old controller
if (fs.existsSync(path.join(__dirname, 'src/app.controller.ts'))) {
  fs.unlinkSync(path.join(__dirname, 'src/app.controller.ts'));
}

console.log('Restructured backend successfully!');
