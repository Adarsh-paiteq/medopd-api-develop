import { ArgsType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { BannerOutput } from './get-banners.dto';

@ArgsType()
export class DeleteBannerArgs {
  @IsNotEmpty()
  @IsString()
  id: string;
}

@ObjectType()
export class DeleteBannerOutput {
  deletedBanner: BannerOutput;
}
