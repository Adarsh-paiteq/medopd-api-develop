import { GenerateTokens } from '@clinics/dto/verify-clinic-otp.dto';
import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class VerifyDoctorOTPArgs {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(4)
  otp: string;
}

@ObjectType()
export class DoctorOnboardingScreens {
  isProfileSet: boolean;
  isSpecailtySet: boolean;
  isEducationSet: boolean;
}

@ObjectType()
export class VerifyDoctorOTPResponse extends GenerateTokens {
  onboardingScreens: DoctorOnboardingScreens;
}
