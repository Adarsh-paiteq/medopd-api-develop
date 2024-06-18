import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { AddPatientMedicineOutput } from '@patient-medicines/dto/add-patient-medicine.dto';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GeneratePrescriptionArgs {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  generalInstruction: string;
}

export class GeneratePrescriptionOutput {
  id: string;
  clinicId: string;
  chatId: string;
  doctorName: string | null;
  doctorDegree: string | null;
  patientName: string;
  patientAge: number;
  patientGender: string;
  bp: string;
  pulse: string | null;
  complain: string | null;
  doctorRegistrationNumber: string | null;
  clinicName: string | null;
  address: string | null;
  postalCode: string | null;
  patientMobileNumber: string;
  @Field(() => [AddPatientMedicineOutput], { nullable: 'items' })
  medicines: AddPatientMedicineOutput[];
}

export class GeneratePrescriptionData extends GeneratePrescriptionOutput {
  prescriptionDate: string;
  generalInstruction: string;
}

@ObjectType()
export class GeneratePrescriptionResponse {
  message: string;
}
