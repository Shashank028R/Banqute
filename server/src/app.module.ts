import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
}