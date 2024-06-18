import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { MedicalCouncilOutput } from './get-councils.dto';

@ArgsType()
export class DeleteMedicalCouncilArgs {
  @IsNotEmpty()
  @IsString()
  councilId: string;
}

@ObjectType()
export class DeleteMedicalCouncilOutput {
  @Field(() => MedicalCouncilOutput)
  council: MedicalCouncilOutput;
}
