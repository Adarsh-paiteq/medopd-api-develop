import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class DeletePatientMedicineArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class DeletePatientMedicineResponse {
  message: string;
}
