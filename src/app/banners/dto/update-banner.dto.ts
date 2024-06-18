import { InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { BannerOutput } from './get-banners.dto';

@InputType()
export class UpdateBannerInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageFilePath?: string;

  @IsString()
  @IsOptional()
  imageId?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

@ObjectType()
export class UpdateBannerOutput {
  updatedBanner: BannerOutput;
}
