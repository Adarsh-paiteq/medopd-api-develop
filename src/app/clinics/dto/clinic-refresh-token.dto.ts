import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';
import { GenerateTokens } from './verify-clinic-otp.dto';

@ArgsType()
export class ClinicRefreshTokenArgs {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}

@ObjectType()
export class ClinicRefreshTokenResponse extends GenerateTokens {}
