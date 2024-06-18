import { ArgsType, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';
import { Doctor } from './send-otp-login-register-doctor.dto';

@ArgsType()
export class GetDoctorsArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  search?: string;
}

@ObjectType()
export class GetDoctorsOutput {
  doctors: Doctor[];
  hasMore: boolean;
}
