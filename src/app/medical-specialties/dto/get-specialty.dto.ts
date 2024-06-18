import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalSpecialtyOutput } from './get-specialties.dto';

@ArgsType()
export class GetMedicalSpecialtyArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class GetMedicalSpecialtyOutput {
  specialty: MedicalSpecialtyOutput;
}
