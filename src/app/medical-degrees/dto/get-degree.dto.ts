import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalDegreeOutput } from './get-degrees.dto';

@ArgsType()
export class GetMedicalDegreeArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class GetMedicalDegreeOutput {
  @Field(() => MedicalDegreeOutput)
  degree: MedicalDegreeOutput;
}
