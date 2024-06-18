import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutDoctorResponse {
  message: string;
}
