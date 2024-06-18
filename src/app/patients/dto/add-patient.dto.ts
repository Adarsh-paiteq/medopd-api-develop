import {
  GENDER,
  Gender,
} from '@doctors/dto/send-otp-login-register-doctor.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsMobilePhone,
} from 'class-validator';

@InputType()
export class AddPatientInput {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @IsNotEmpty()
  patientAge: number;

  @IsNotEmpty()
  @IsMobilePhone()
  mobileNumber: string;

  @IsNotEmpty()
  @IsEnum(GENDER)
  @Field(() => GENDER)
  gender: Gender;
}

@ObjectType()
export class AddPatientResponse {
  patient: Patient;
}

@ObjectType()
export class Patient {
  id: string;
  fullName: string;
  @Field(() => GENDER)
  gender: Gender;
  mobileNumber: string;
  patientAge: number;
  updatedAt: Date;
  createdAt: Date;
}
