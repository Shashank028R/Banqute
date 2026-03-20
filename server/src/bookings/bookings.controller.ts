import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getBookings(@Query('tenantId') tenantId: string) {
    return this.bookingsService.getBookings(tenantId);
  }

  @Post()
  createBooking(@Body() data: any) {
    return this.bookingsService.createBooking(data);
  }
}