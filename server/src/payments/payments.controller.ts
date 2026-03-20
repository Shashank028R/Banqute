import { Controller, Get, Post, Body, Query, Put, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  getPayments(@Query('tenantId') tenantId: string) {
    return this.paymentsService.getPayments(tenantId);
  }

  @Post()
  createPayment(@Body() data: any) {
    return this.paymentsService.createPayment(data);
  }

  @Put(':id')
  updatePayment(@Param('id') id: string, @Body() data: any) {
    return this.paymentsService.updatePayment(id, data);
  }
}
