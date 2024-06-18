import { ArgsType, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';
import { CityOutput } from './get-cities.dto';

@ArgsType()
export class GetCitesListArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetCitiesListOutput {
  cities: CityOutput[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
