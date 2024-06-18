import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { STATUS, Status } from './send-otp-login-register.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class UpdateClinicStatusInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @Field(() => STATUS)
  status: Status;
}

@ObjectType()
export class UpdateClinicStatusResponse {
  message: string;
}
