import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class AddMedicalCouncilArgs {
  @IsNotEmpty()
  @IsString()
  name: string;
}

@ObjectType()
export class AddMedicalCouncilOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
