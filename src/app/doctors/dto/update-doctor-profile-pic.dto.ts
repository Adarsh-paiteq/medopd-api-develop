import { InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Doctor } from './send-otp-login-register-doctor.dto';

@InputType()
export class UpdateDoctorProfilePicInput {
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
export class UpdateDoctorProfilePicOutput extends Doctor {}
