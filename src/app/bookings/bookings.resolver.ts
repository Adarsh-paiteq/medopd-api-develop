import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import {
  CreateBookingInput,
  CreateBookingResponse,
} from './dto/create-booking.dto';
import { Role } from '@core/decorators/roles.decorator';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@core/services/auth.service';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import {
  UpdateBookingStatusArgs,
  UpdateBookingStatusResponse,
} from './dto/update-booking-status.dto';
import {
  GetBookingDetialsArgs,
  GetBookingDetialsOutput,
} from './dto/get-booking-detials.dto';
import { GetBookingsOutput } from './dto/get-bookings.dto';
import { PaginationArgs } from '@utils/helpers';
import {
  GetDoctorEarningsArgs,
  GetDoctorEarningsOutput,
} from './dto/get-doctor-earnings.dto';
import {
  GetDoctorBookingHistoryArgs,
  GetDoctorBookingHistoryOutput,
} from './dto/get-doctor-booking-history.dto';
import {
  GetClinicEarningsArgs,
  GetClinicEarningsOutput,
} from './dto/get-clinic-earnings.dto';

@Resolver()
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @Mutation(() => CreateBookingResponse, { name: 'createBooking' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createBooking(
    @GetUser() user: LoggedInUser,
    @Args('input') input: CreateBookingInput,
  ): Promise<CreateBookingResponse> {
    return await this.bookingsService.createBooking(user.id, input);
  }

  @Mutation(() => UpdateBookingStatusResponse, {
    name: 'updateBookingStatusById',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateBookingStatus(
    @GetUser() user: LoggedInUser,
    @Args() args: UpdateBookingStatusArgs,
  ): Promise<UpdateBookingStatusResponse> {
    return await this.bookingsService.updateBookingStatus(user.id, args);
  }

  @Query(() => GetBookingDetialsOutput, { name: 'getBookingDetials' })
  @Role(Roles.DOCTOR, Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBookingDetials(
    @Args() args: GetBookingDetialsArgs,
  ): Promise<GetBookingDetialsOutput> {
    return await this.bookingsService.getBookingDetials(args);
  }

  @Query(() => GetBookingsOutput, { name: 'getBookings' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBookings(@Args() args: PaginationArgs): Promise<GetBookingsOutput> {
    return await this.bookingsService.getBookings(args);
  }

  @Query(() => GetDoctorEarningsOutput, { name: 'getDoctorEarnings' })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctorEarnings(
    @GetUser() user: LoggedInUser,
    @Args() args: GetDoctorEarningsArgs,
  ): Promise<GetDoctorEarningsOutput> {
    return await this.bookingsService.getDoctorEarnings(user.id, args);
  }

  @Query(() => GetDoctorBookingHistoryOutput, {
    name: 'getDoctorBookingHistory',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctorBookingHistory(
    @GetUser() user: LoggedInUser,
    @Args() args: GetDoctorBookingHistoryArgs,
  ): Promise<GetDoctorBookingHistoryOutput> {
    return await this.bookingsService.getDoctorBookingHistory(user.id, args);
  }

  @Query(() => GetClinicEarningsOutput, { name: 'getClinicEarnings' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClinicEarnings(
    @GetUser() user: LoggedInUser,
    @Args() args: GetClinicEarningsArgs,
  ): Promise<GetClinicEarningsOutput> {
    return await this.bookingsService.getClinicEarnings(user.id, args);
  }
}
