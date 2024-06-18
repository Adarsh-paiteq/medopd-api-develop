import { InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { Doctor } from './send-otp-login-register-doctor.dto';

@InputType()
export class SetDoctorEducationInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  degreeId: string;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  councilId: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  registrationYear: string;
}

@ObjectType()
export class SetDoctorEducationResponse extends Doctor {}
