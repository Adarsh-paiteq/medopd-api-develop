import { InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { BannerOutput } from './get-banners.dto';

@InputType()
export class AddBannerInput {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageFilePath: string;

  @IsNotEmpty()
  @IsString()
  imageId: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;
}

@ObjectType()
export class AddBannerOutput {
  savedBanner: BannerOutput;
}
