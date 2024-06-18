import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalDegreeOutput } from './get-degrees.dto';

@ArgsType()
export class UpdateMedicalDegreeArgs {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class UpdateMedicalDegreeOutput {
  updatedDegree: MedicalDegreeOutput;
}
