import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetMedicalDegreesArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetMedicalDegreesOutput {
  @Field(() => [MedicalDegreeOutput], { nullable: 'items' })
  degrees: MedicalDegreeOutput[];
}

@ObjectType()
export class MedicalDegreeOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
