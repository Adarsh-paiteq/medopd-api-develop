import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddMedicalCouncilOutput } from './add-councils.dto';
@ArgsType()
export class UpdateMedicalCouncilArgs {
  @IsNotEmpty()
  @IsString()
  councilId: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class UpdateMedicalCouncilOutput {
  @Field(() => AddMedicalCouncilOutput)
  council: AddMedicalCouncilOutput;
}
