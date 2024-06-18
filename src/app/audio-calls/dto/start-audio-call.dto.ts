import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class StartAudioCallArgs {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}

@ObjectType()
export class StartAudioCallResponse {
  message: string;
}

export class InsertAudioCallDto {
  clinicId: string;
  bookingId: string;
  doctorId: string;
  sid: string;
}
