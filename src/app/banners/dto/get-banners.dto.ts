import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { PaginationArgs } from '@utils/helpers';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetBannersArgs extends PaginationArgs {
  @IsOptional()
  @IsString()
  title?: string;
}

@ObjectType()
export class GetBannersOutput {
  @Field(() => [BannerOutput], { nullable: 'items' })
  banners: BannerOutput[];
}

@ObjectType()
export class BannerOutput {
  id: string;
  title: string;
  description: string;
  imageFilePath: string;
  imageId: string;
  imageUrl: string;
  isDisable: boolean;
  updatedAt: Date;
  createdAt: Date;
}
