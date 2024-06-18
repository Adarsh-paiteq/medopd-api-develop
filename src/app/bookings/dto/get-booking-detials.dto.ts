import {
  GENDER,
  Gender,
} from '@doctors/dto/send-otp-login-register-doctor.dto';
import { ArgsType, Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { SYMPTOMS, Symptoms } from './create-booking.dto';

@ArgsType()
export class GetBookingDetialsArgs {
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}

@ObjectType()
export class GetBookingDetialsOutput {
  patietId: string;
  patientName: string;
  @Field(() => GENDER)
  gender: Gender;
  patientAge: number;
  bookingId: string;
  bp: string;
  patientMobileNumber: string;
  language: string;
  @Field(() => SYMPTOMS)
  symptoms?: Symptoms | null;
  otherSymptoms?: string | null;
  @Field(() => Float)
  doctorEarning: number;
  pulse?: string | null;
  oxygenSaturation?: string | null;
  medicalHistory?: string | null;
  abdominalTenderness: boolean;
  patientNote?: string | null;
  pedalOedema: boolean;
  imageFilePath?: string | null;
  imageId?: string | null;
  imageUrl?: string | null;
}
