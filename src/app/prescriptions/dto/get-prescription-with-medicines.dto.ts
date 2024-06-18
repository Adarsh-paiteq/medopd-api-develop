import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { AddPatientMedicineOutput } from '@patient-medicines/dto/add-patient-medicine.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetPrescriptionWithMedicinesArgs {
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}

@ObjectType()
export class GetPrescriptionWithMedicinesOutput {
  id: string;
  doctorId: string;
  bookingId: string;
  generalInstruction: string | null;
  createdAt: Date;
  updatedAt: Date;
  @Field(() => [AddPatientMedicineOutput], { nullable: 'items' })
  medicines: AddPatientMedicineOutput[];
}
