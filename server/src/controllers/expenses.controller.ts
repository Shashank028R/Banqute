import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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
}