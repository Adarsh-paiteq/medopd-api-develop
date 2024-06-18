import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalDegreeOutput } from './get-degrees.dto';

@ArgsType()
export class DeleteMedicalDegreeArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class DeleteMedicalDegreeOutput {
  deletedDegree: MedicalDegreeOutput;
}
