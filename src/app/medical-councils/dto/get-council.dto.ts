import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalCouncilOutput } from './get-councils.dto';

@ArgsType()
export class GetMedicalCouncilArgs {
  @IsNotEmpty()
  @IsString()
  councilId: string;
}

@ObjectType()
export class GetMedicalCouncilOutput {
  @Field(() => MedicalCouncilOutput)
  council: MedicalCouncilOutput;
}
