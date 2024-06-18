import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Doctor, GENDER, Gender } from './send-otp-login-register-doctor.dto';

@InputType()
export class SetDoctorProfileInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  imageId: string;

  @IsNotEmpty()
  @IsString()
  imageFilePath: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @Field(() => GENDER)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  cityId: string;
}

@ObjectType()
export class SetDoctorProfileResponse extends Doctor {}
