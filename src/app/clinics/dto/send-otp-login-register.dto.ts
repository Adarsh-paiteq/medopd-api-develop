import {
  ArgsType,
  Field,
  Float,
  HideField,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';
export type ObjectValue<T> = T[keyof T];

export const STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

export type Status = ObjectValue<typeof STATUS>;
registerEnumType(STATUS, {
  name: 'Status',
});

@ArgsType()
export class SendOTPForLoginAndRegisterArgs {
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsNotEmpty()
  @IsMobilePhone()
  mobileNumber: string;
}

@ObjectType()
export class Clinic {
  id: string;
  email: string | null;
  fullName: string | null;
  clinicName: string | null;
  imageFilePath: string | null;
  imageId: string | null;
  imageUrl: string | null;
  mobileNumber: string;
  countryCode: string;
  cityId: string | null;
  earningBalance: number;
  @HideField()
  otpSecret: string | null;
  isMobileVerified: boolean;
  @Field(() => STATUS)
  status: Status;
  address: string | null;
  postalCode: string | null;
  @Field(() => Float, { nullable: true })
  latitude?: number | null;
  @Field(() => Float, { nullable: true })
  longitude?: number | null;
  landmark?: string | null;
  isDeleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  @HideField()
  refreshToken: string | null;
  @Field(() => Float)
  walletBalance: number;
}

@ObjectType()
export class SendOTPForLoginAndRegisterResponse {
  id: string;
}
