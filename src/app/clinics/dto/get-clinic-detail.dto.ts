import { ArgsType, ObjectType } from '@nestjs/graphql';
import { Clinic } from './send-otp-login-register.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetClinicDetailArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class GetClinicDetailResponse {
  clinic: Clinic;
}
