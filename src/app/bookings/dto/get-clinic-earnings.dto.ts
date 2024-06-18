import { ArgsType, Field, Float, ObjectType } from '@nestjs/graphql';
import { SYMPTOMS, Symptoms } from './create-booking.dto';
import { PaginationArgs } from '@utils/helpers';
import { IsEnum, IsOptional } from 'class-validator';
import { PERIOD, Period } from './get-doctor-earnings.dto';

@ArgsType()
export class GetClinicEarningsArgs extends PaginationArgs {
  @IsOptional()
  @IsEnum(PERIOD)
  @Field(() => PERIOD, { nullable: true, defaultValue: PERIOD.Today })
  period: Period;
}

@ObjectType()
export class PatientDetailsClinic {
  bookingId: string;
  patientId: string;
  patientName: string;
  @Field(() => SYMPTOMS)
  symptoms?: Symptoms | null;
  @Field(() => Float)
  clinicEarning: number;
  earningDate: Date;
}

@ObjectType()
export class GetClinicEarningsOutput {
  @Field(() => Float)
  totalEarnings: number;
  @Field(() => [PatientDetailsClinic])
  patientsDetailsClinic: PatientDetailsClinic[];
  hasMore: boolean;
}
