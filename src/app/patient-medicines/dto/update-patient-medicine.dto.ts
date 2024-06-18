import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DURATION,
  Duration,
  FREQUENCY,
  Frequency,
  INSTRUCTION,
  Instruction,
} from './add-patient-medicine.dto';

@InputType()
export class UpdatePatientMedicineInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  morningDosage?: number;

  @IsNumber()
  @IsOptional()
  afternoonDosage?: number;

  @IsNumber()
  @IsOptional()
  nightDosage?: number;

  @IsEnum(FREQUENCY)
  @IsOptional()
  @Field(() => FREQUENCY)
  frequency?: Frequency;

  @IsEnum(DURATION)
  @IsOptional()
  @Field(() => DURATION)
  duration?: Duration;

  @IsEnum(INSTRUCTION)
  @IsOptional()
  @Field(() => INSTRUCTION)
  instruction?: Instruction;
}

@ObjectType()
export class UpdatePatientMedicineResponse {
  message: string;
}
