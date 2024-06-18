import { InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Clinic } from './send-otp-login-register.dto';

@InputType()
export class UpdateClinicProfilePicInput {
  @IsString()
  @IsNotEmpty()
  imageFilePath: string;

  @IsString()
  @IsNotEmpty()
  imageId: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}

@ObjectType()
export class UpdateClinicProfilePicOutput extends Clinic {}
