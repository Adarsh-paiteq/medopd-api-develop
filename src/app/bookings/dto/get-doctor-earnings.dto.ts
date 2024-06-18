import {
  ArgsType,
  Field,
  Float,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { SYMPTOMS, Symptoms } from './create-booking.dto';
import { ObjectValue } from '@clinics/dto/send-otp-login-register.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationArgs } from '@utils/helpers';

export const PERIOD = {
  Today: 'Today',
  Yesterday: 'Yesterday',
  This_week: 'This week',
  Last_week: 'Last week',
  This_month: 'This month',
  Last_month: 'Last month',
  Three_month: '3 month',
  Six_month: '6 month',
  Yearly: 'Yearly',
} as const;

export type Period = ObjectValue<typeof PERIOD>;
registerEnumType(PERIOD, {
  name: 'Period',
});

@ArgsType()
export class GetDoctorEarningsArgs extends PaginationArgs {
  @IsOptional()
  @IsEnum(PERIOD)
  @Field(() => PERIOD, { nullable: true, defaultValue: PERIOD.Today })
  period: Period;
}

@ObjectType()
export class PatientDetails {
  bookingId: string;
  patientId: string;
  patientName: string;
  @Field(() => SYMPTOMS)
  symptoms?: Symptoms | null;
  @Field(() => Float)
  doctorEarning: number;
  earningDate: Date;
}

@ObjectType()
export class GetDoctorEarningsOutput {
  @Field(() => Float)
  totalEarnings: number;
  @Field(() => [PatientDetails])
  patientsDetails: PatientDetails[];
  hasMore: boolean;
}
