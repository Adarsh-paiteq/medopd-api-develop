import { ObjectType } from '@nestjs/graphql';
import { Clinic } from './send-otp-login-register.dto';

@ObjectType()
export class GetClinicsOutput {
  clinics: Clinic[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
