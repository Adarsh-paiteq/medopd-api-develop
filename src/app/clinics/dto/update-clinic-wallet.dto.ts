import { ArgsType, Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ArgsType()
export class UpdateClinicWalletArgs {
  @IsString()
  @IsNotEmpty()
  clinicId: string;

  @Field(() => Float)
  @IsNumber()
  amount: number;
}

@ObjectType()
export class UpdateClinicWalletResponse {
  message: string;
}
