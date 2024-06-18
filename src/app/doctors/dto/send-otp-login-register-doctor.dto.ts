import {
  ObjectValue,
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from '@clinics/dto/send-otp-login-register.dto';
import {
  Field,
  HideField,
  ObjectType,
  PartialType,
  registerEnumType,
  ArgsType,
  Float,
} from '@nestjs/graphql';

export const GENDER = {
  male: 'male',
  female: 'female',
  other: 'other',
} as const;

export type Gender = ObjectValue<typeof GENDER>;
registerEnumType(GENDER, {
  name: 'Gender',
});

@ArgsType()
export class SendOTPForLoginAndRegisterDoctorArgs extends SendOTPForLoginAndRegisterArgs {}

@ObjectType()
export class Doctor {
  id: string;
  fullName?: string | null;
  @Field(() => GENDER)
  gender?: Gender | null;
  imageFilePath?: string | null;
  imageId?: string | null;
  imageUrl?: string | null;
  mobileNumber: string;
  countryCode: string;
  cityId?: string | null;
  earningBalance: number;
  @Field(() => Float)
  adminCommission: number;
  @Field(() => Float)
  clinicCommission: number;
  @Field(() => Float)
  bookingCharges: number;
  @HideField()
  otpSecret?: string | null;
  degreeId?: string | null;
  registrationNumber?: string | null;
  state?: string | null;
  councilId?: string | null;
  registrationYear?: string | null;
  isOnboarded: boolean;
  @HideField()
  refreshToken?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export class DoctorUpdateDto extends PartialType(Doctor) {}

@ObjectType()
export class SendOTPForLoginAndRegisterDoctorResponse extends SendOTPForLoginAndRegisterResponse {}
