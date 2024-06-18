import { ObjectValue } from '@clinics/dto/send-otp-login-register.dto';
import {
  GENDER,
  Gender,
} from '@doctors/dto/send-otp-login-register-doctor.dto';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsMobilePhone,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export const CONSULT_TYPE = {
  Audio: 'Audio',
  Video: 'Video',
} as const;

export type ConsultType = ObjectValue<typeof CONSULT_TYPE>;
registerEnumType(CONSULT_TYPE, {
  name: 'ConsultType',
});

export const SYMPTOMS = {
  Typhoid: 'Typhoid',
  Dengu: 'Dengu',
  Jaundice: 'Jaundice',
  Heart_Attack: 'Heart Attack',
  High_ever: 'High Fever',
} as const;

export type Symptoms = ObjectValue<typeof SYMPTOMS>;
registerEnumType(SYMPTOMS, {
  name: 'Symptoms',
});

export const LANGUAGE = {
  English: 'English',
  Hindi: 'Hindi',
  Bengali: 'Bengali',
  Marathi: 'Marathi',
  Telgu: 'Telgu',
  Tamil: 'Tamil',
  Urdu: 'Urdu',
  kannadda: 'kannadda',
  Punjabi: 'Punjabi',
  Maithili: 'Maithili',
  Odia: 'Odia',
} as const;

export type Language = ObjectValue<typeof LANGUAGE>;
registerEnumType(LANGUAGE, {
  name: 'Language',
});

@InputType()
export class CreateBookingInput {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @IsNotEmpty()
  patientAge: number;

  @IsNotEmpty()
  @IsMobilePhone()
  mobileNumber: string;

  @IsNotEmpty()
  @IsEnum(GENDER)
  @Field(() => GENDER)
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  bp: string;

  @IsOptional()
  @Field(() => SYMPTOMS)
  @IsEnum(SYMPTOMS)
  symptoms?: Symptoms;

  @IsOptional()
  @IsString()
  otherSymptoms?: string;

  @Field(() => CONSULT_TYPE)
  @IsNotEmpty()
  @IsEnum(CONSULT_TYPE)
  consultType: ConsultType;

  @Field(() => LANGUAGE)
  @IsNotEmpty()
  @IsEnum(LANGUAGE)
  language: Language;

  @IsString()
  @IsOptional()
  pulse?: string;

  @IsString()
  @IsOptional()
  oxygenSaturation?: string;

  @IsString()
  @IsOptional()
  medicalHistory?: string;

  @IsBoolean()
  @IsNotEmpty()
  abdominalTenderness: boolean;

  @IsString()
  @IsOptional()
  patientNote?: string;

  @IsBoolean()
  @IsNotEmpty()
  pedalOedema: boolean;

  @ValidateIf((o) => o.pedalOedema === true)
  @IsNotEmpty({
    message: 'imageFilePath is required when pedal oedema is true',
  })
  imageFilePath?: string;

  @ValidateIf((o) => o.pedalOedema === true)
  @IsNotEmpty({ message: 'imageId is required when pedal oedema is true' })
  imageId?: string;

  @ValidateIf((o) => o.pedalOedema === true)
  @IsNotEmpty({ message: 'imageUrl is required when pedal oedema is true' })
  imageUrl?: string;
}

@ObjectType()
export class CreateBookingResponse {
  message: string;
}

export class AddPatientInputDto {
  fullName: string;
  patientAge: number;
  mobileNumber: string;
  gender: Gender;
}

export class CreateBookingInputDto {
  clinicId: string;
  doctorId: string;
  patientId: string;
  bp: string;
  symptoms?: Symptoms;
  otherSymptoms?: string;
  consultType: ConsultType;
  language: Language;
  clinicEarning: number;
  doctorEarning: number;
  adminEarning: number;
  bookingId: string;
  pulse?: string;
  oxygenSaturation?: string;
  medicalHistory?: string;
  abdominalTenderness: boolean;
  patientNote?: string;
  pedalOedema: boolean;
  imageFilePath?: string;
  imageId?: string;
  imageUrl?: string;
}
