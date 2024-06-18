import { GenerateTokens } from '@clinics/dto/verify-clinic-otp.dto';
import {
  ArgsType,
  Field,
  Float,
  HideField,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ArgsType()
export class AdminLoginArgs {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

@ObjectType()
export class AdminLoginResponse extends GenerateTokens {}

@ObjectType()
export class Admin {
  id: string;
  email: string;
  fullName: string;
  password: string;
  updatedAt: Date;
  createdAt: Date;
  @HideField()
  refreshToken: string | null;
  @Field(() => Float)
  earningBalance: number;
}

export class AdminUpdateDto extends PartialType(Admin) {}
