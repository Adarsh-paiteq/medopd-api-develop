import { DoctorSpecialtyNameOutput } from '@doctor-specialties/dto/get-doctorSpecialtiesName.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DoctorWithDetailsOutput {
  doctorId: string | null;
  doctorName: string | null;
  doctorImageFilePath: string | null;
  doctorImageId: string | null;
  doctorImageUrl: string | null;
  doctorDegree: string | null;
  doctorRegistrationYear: string | null;
  doctorState: string | null;
  @Field(() => [DoctorSpecialtyNameOutput])
  doctorSpecialties: DoctorSpecialtyNameOutput[];
}
