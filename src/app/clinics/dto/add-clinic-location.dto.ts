import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

@InputType()
export class AddClinicLocationInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsOptional()
  @IsLatitude()
  @IsNumber()
  @Field(() => Float)
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  @IsNumber()
  @Field(() => Float)
  longitude?: number;

  @IsString()
  @IsOptional()
  landmark?: string;
}

@ObjectType()
export class AddClinicLocationResponse {
  message: string;
}
