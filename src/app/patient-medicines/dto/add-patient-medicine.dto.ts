import { ObjectValue } from '@clinics/dto/send-otp-login-register.dto';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export const FREQUENCY = {
  Daily: 'Daily',
  Weekly: 'Weekly',
} as const;

export type Frequency = ObjectValue<typeof FREQUENCY>;
registerEnumType(FREQUENCY, {
  name: 'Frequency',
});

export const DURATION = {
  one_day: '1 Day',
  two_days: '2 Days',
  three_days: '3 Days',
  four_days: '4 Days',
  five_days: '5 Days',
  six_days: '6 Days',
  one_week: '1 Week',
  two_weeks: '2 Weeks',
  three_weeks: '3 Weeks',
  four_weeks: '4 Weeks',
} as const;

export type Duration = ObjectValue<typeof DURATION>;
registerEnumType(DURATION, {
  name: 'Duration',
});

export const INSTRUCTION = {
  Before_meal: 'Before meal',
  After_meal: 'After meal',
  Others: 'Others',
} as const;

export type Instruction = ObjectValue<typeof INSTRUCTION>;
registerEnumType(INSTRUCTION, {
  name: 'Instruction',
});

@InputType()
export class AddPatientMedicineInput {
  @IsNotEmpty()
  @IsString()
  prescriptionId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  morningDosage: number;

  @IsNotEmpty()
  @IsNumber()
  afternoonDosage: number;

  @IsNotEmpty()
  @IsNumber()
  nightDosage: number;

  @IsEnum(FREQUENCY)
  @Field(() => FREQUENCY)
  frequency: Frequency;

  @IsEnum(DURATION)
  @Field(() => DURATION)
  duration: Duration;

  @IsEnum(INSTRUCTION)
  @Field(() => INSTRUCTION)
  instruction: Instruction;
}

@ObjectType()
export class AddPatientMedicineOutput {
  id: string;
  name: string;
  morningDosage: number;
  afternoonDosage: number;
  nightDosage: number;
  @Field(() => FREQUENCY)
  frequency: Frequency;
  @Field(() => DURATION)
  duration: Duration;
  @Field(() => INSTRUCTION)
  instruction: Instruction;
  bookingId: string;
  prescriptionId: string;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}
