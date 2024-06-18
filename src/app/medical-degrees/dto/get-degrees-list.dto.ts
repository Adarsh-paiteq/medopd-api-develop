import { ArgsType, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';
import { MedicalDegreeOutput } from './get-degrees.dto';

@ArgsType()
export class GetMedicalDegreesListArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalDegreesListOutput {
  degrees: MedicalDegreeOutput[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
