import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CityOutput } from './get-cities.dto';

@ArgsType()
export class DeleteCityArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class DeleteCityOutput {
  deletedCity: CityOutput;
}
