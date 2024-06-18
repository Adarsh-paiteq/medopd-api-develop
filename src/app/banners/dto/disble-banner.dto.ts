import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { BannerOutput } from './get-banners.dto';

@ArgsType()
export class DisableBannerArgs {
  @IsString()
  @IsNotEmpty()
  id: string;
}

@ObjectType()
export class DisableBannerOutput {
  disabledBanner: BannerOutput;
}
