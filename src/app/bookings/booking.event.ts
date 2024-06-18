import { Booking } from './bookings.schema';

export enum BookingEvent {
  BOOKING_CREATED = '[BOOKING] BOOKING_CREATED',
}

export class BookingCreateEvent {
  constructor(public booking: Booking) {}
}
