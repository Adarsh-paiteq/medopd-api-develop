import { ArgsType, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';
import { MedicalCouncilOutput } from './get-councils.dto';

@ArgsType()
export class GetMedicalCouncilsListArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalCouncilsListOutput {
  councils: MedicalCouncilOutput[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
