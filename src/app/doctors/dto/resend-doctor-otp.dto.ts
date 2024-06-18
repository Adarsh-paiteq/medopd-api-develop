import {
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from '@clinics/dto/send-otp-login-register.dto';
import { ArgsType, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class ResendDoctorOTPArgs extends SendOTPForLoginAndRegisterArgs {}

@ObjectType()
export class ResendDoctorOTPResponse extends SendOTPForLoginAndRegisterResponse {}
