import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Chat {
  id: string;
  bookingId: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
}
