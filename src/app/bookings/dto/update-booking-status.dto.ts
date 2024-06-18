import { ObjectValue } from '@clinics/dto/send-otp-login-register.dto';
import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export const BOOKINGSTATUS = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  PENDING: 'PENDING',
} as const;

export type BookingStatus = ObjectValue<typeof BOOKINGSTATUS>;
registerEnumType(BOOKINGSTATUS, {
  name: 'BookingStatus',
});

@ArgsType()
export class UpdateBookingStatusArgs {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsEnum(BOOKINGSTATUS)
  @Field(() => BOOKINGSTATUS)
  bookingStatus: BookingStatus;
}

@ObjectType()
export class UpdateBookingStatusResponse {
  message: string;
}
