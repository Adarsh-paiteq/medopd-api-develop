import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class StartVideoCallArgs {
  @IsNotEmpty()
  @IsString()
  chatId: string;
}

@ObjectType()
export class StartVideoCallResponse {
  token: string;
}

export class InsertVideoCallDto {
  clinicId: string;
  bookingId: string;
  doctorId: string;
  roomId: string;
}
