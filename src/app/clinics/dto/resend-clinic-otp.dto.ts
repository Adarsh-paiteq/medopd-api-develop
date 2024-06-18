import { ArgsType, ObjectType } from '@nestjs/graphql';
import {
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from './send-otp-login-register.dto';

@ArgsType()
export class ResendClinicOTPArgs extends SendOTPForLoginAndRegisterArgs {}

@ObjectType()
export class ResendClinicOTPResPonse extends SendOTPForLoginAndRegisterResponse {}
