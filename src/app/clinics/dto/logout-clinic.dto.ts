import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LogoutClinicResponse {
  message: string;
}
