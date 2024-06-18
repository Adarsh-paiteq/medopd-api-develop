import { Field, Float, ObjectType } from '@nestjs/graphql';
import { LANGUAGE, Language } from './create-booking.dto';

@ObjectType()
export class BookingDoctorHomepageOutput {
  bookingId: string;
  patientName: string;
  @Field(() => Float)
  doctorEarning: number;
  @Field(() => LANGUAGE)
  language: Language;
}
