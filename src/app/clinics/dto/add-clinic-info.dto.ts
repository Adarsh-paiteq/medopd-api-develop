import { InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUrl, IsEmail } from 'class-validator';

@InputType()
export class AddClinicInfoInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  imageId: string;

  @IsString()
  @IsNotEmpty()
  imageFilePath: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  clinicName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cityId: string;
}

@ObjectType()
export class AddClinicInfoResponse {
  message: string;
}
