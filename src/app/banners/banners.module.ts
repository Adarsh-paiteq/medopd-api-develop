import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersRepo } from './banners.repo';
import { BannersResolver } from './banners.resolver';

@Module({
  providers: [BannersService, BannersRepo, BannersResolver],
  exports: [BannersRepo],
})
export class BannersModule {}
