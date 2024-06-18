import { ArgsType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Clinic } from './send-otp-login-register.dto';

@ArgsType()
export class VerifyClinicOTPArgs {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  otp: string;
}

@ObjectType()
export class GenerateTokens {
  id: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

@ObjectType()
export class ClinicOnboardingScreens {
  isLocationSet: boolean;
  isClinicDetailsSet: boolean;
  isClinicStatus: string;
}

@ObjectType()
export class VerifyClinicOTPResponse extends GenerateTokens {
  onboardingScreens: ClinicOnboardingScreens;
}

export class ClinicUpdateDto extends PartialType(Clinic) {}
