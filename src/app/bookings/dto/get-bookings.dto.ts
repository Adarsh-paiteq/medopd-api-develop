import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
  CONSULT_TYPE,
  ConsultType,
  LANGUAGE,
  Language,
  SYMPTOMS,
  Symptoms,
} from './create-booking.dto';
import { BOOKINGSTATUS, BookingStatus } from './update-booking-status.dto';

@ObjectType()
export class Info {
  id: string;
  name: string | null;
  mobileNumber: string;
}

@ObjectType()
export class BookingOutput {
  id: string;
  @Field(() => Info)
  clinic: Info;
  @Field(() => Info)
  patient: Info;
  @Field(() => Info)
  doctor: Info;
  bp: string;
  bookingId: string;
  @Field(() => SYMPTOMS)
  symptoms?: Symptoms | null;
  otherSymptoms?: string | null;
  @Field(() => BOOKINGSTATUS)
  bookingStatus: BookingStatus;
  @Field(() => CONSULT_TYPE)
  consultType: ConsultType;
  @Field(() => LANGUAGE)
  language: Language;
  @Field(() => Float)
  clinicEarning: number;
  @Field(() => Float)
  doctorEarning: number;
  @Field(() => Float)
  adminEarning: number;
  pulse?: string | null;
  oxygenSaturation?: string | null;
  medicalHistory?: string | null;
  abdominalTenderness: boolean;
  patientNote?: string | null;
  pedalOedema: boolean;
  imageFilePath?: string | null;
  imageId?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType()
export class GetBookingsOutput {
  @Field(() => [BookingOutput])
  bookings: BookingOutput[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
