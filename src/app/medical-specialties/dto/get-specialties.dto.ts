import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetMedicalSpecialtiesArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalSpecialtiesOutput {
  @Field(() => [MedicalSpecialtyOutput])
  specialties: MedicalSpecialtyOutput[];
}

@ObjectType()
export class MedicalSpecialtyOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
