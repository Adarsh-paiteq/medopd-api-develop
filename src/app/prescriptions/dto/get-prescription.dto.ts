import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPrescriptionOutput {
  id: string;
  doctorId: string;
  bookingId: string;
  generalInstruction: string;
  updatedAt: Date;
  createdAt: Date;
}
