import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CityOutput } from './get-cities.dto';

@ArgsType()
export class GetCityArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class GetCityOutput {
  city: CityOutput;
}
