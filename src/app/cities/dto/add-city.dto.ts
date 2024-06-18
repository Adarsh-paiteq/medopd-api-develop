import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CityOutput } from './get-cities.dto';

@ArgsType()
export class AddCityArgs {
  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class AddCityOutput {
  savedCity: CityOutput;
}
