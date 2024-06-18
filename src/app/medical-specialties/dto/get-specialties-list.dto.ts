import { ArgsType, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';
import { MedicalSpecialtyOutput } from './get-specialties.dto';

@ArgsType()
export class GetMedicalSpecialtiesListArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalSpecialtiesListOutput {
  specialties: MedicalSpecialtyOutput[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
