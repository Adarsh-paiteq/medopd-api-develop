import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CityOutput } from './get-cities.dto';

@ArgsType()
export class UpdateCityArgs {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class UpdateCityOutput {
  updatedCity: CityOutput;
}
