import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class UpdateBookingChargesInput {
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @Field(() => Float)
  bookingCharges: number;

  @Field(() => Float)
  adminCommission: number;

  @Field(() => Float)
  clinicCommission: number;
}

@ObjectType()
export class UpdateBookingChargesResponse {
  message: string;
}
