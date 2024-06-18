import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class GetCitiesArgs {
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class GetCitiesOutput {
  @Field(() => [CityOutput], { nullable: 'items' })
  cities: CityOutput[];
}

@ObjectType()
export class CityOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
