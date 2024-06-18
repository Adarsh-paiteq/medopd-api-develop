import { ArgsType, ObjectType } from '@nestjs/graphql';
import { Doctor } from './send-otp-login-register-doctor.dto';
import { GetDoctorsArgs } from './get-doctors.dto';

@ArgsType()
export class GetDoctorsListArgs extends GetDoctorsArgs {}

@ObjectType()
export class GetDoctorsListOutput {
  doctors: Doctor[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
