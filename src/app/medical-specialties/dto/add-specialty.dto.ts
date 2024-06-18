import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalSpecialtyOutput } from './get-specialties.dto';

@ArgsType()
export class AddMedicalSpecialtyArgs {
  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class AddMedicalSpecialtyOutput {
  savedSpecialty: MedicalSpecialtyOutput;
}
