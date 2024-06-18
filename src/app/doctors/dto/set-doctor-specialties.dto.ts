import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SetDoctorSpecialtiesInput {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsArray()
  @ArrayMinSize(1)
  specialtyIds: string[];
}

@ObjectType()
export class DoctorSpecialty {
  id: string;
  doctorId: string;
  specialtyId: string;
  updatedAt: Date;
  createdAt: Date;
}

@ObjectType()
export class SetDoctorSpecialtiesResponse {
  @Field(() => [DoctorSpecialty], { nullable: 'items' })
  doctorSpecialties: DoctorSpecialty[];
}
