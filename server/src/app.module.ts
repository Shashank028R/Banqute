import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { ExpensesModule } from './expenses/expenses.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [BookingsModule, ExpensesModule, UsersModule, PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}