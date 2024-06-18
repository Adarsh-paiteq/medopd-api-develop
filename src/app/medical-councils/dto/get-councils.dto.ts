import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetMedicalCouncilsArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalCouncilsOutput {
  @Field(() => [MedicalCouncilOutput], { nullable: 'items' })
  councils: MedicalCouncilOutput[];
}

@ObjectType()
export class MedicalCouncilOutput {
  id: string;
  name: string;
}
