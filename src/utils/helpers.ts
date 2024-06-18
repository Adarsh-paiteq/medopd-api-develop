import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page = 1;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit = 10;
}
