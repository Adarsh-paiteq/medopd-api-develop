import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PERIOD, Period } from './get-doctor-earnings.dto';
import { PaginationArgs } from '@utils/helpers';
import { BookingDoctorHomepageOutput } from './get-booking-doctor-homepage.dto';

@ArgsType()
export class GetDoctorBookingHistoryArgs extends PaginationArgs {
  @IsOptional()
  @IsEnum(PERIOD)
  @Field(() => PERIOD, { nullable: true, defaultValue: PERIOD.Today })
  period: Period;
}

@ObjectType()
export class GetDoctorBookingHistoryOutput {
  @Field(() => [BookingDoctorHomepageOutput], { nullable: 'items' })
  bookingHistory: BookingDoctorHomepageOutput[];
  hasMore: boolean;
}
