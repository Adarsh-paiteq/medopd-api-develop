import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DoctorSpecialtyNameOutput {
  specialtyName: string;
}
