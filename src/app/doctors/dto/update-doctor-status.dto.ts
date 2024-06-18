import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@ArgsType()
export class UpdateDoctorStatusArgs {
  @IsBoolean()
  status: boolean;
}

@ObjectType()
export class UpdateDoctorStatusResponse {
  message: string;
}
