import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalSpecialtyOutput } from './get-specialties.dto';

@ArgsType()
export class UpdateMedicalSpecialtyArgs {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class UpdateMedicalSpecialtyOutput {
  updatedSpecialty: MedicalSpecialtyOutput;
}
