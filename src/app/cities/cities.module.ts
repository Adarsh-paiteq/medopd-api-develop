import { Module } from '@nestjs/common';
import { CitiesResolver } from './cities.resolver';
import { CitiesService } from './cities.service';
import { CitiesRepo } from './cities.repo';

@Module({
  providers: [CitiesResolver, CitiesService, CitiesRepo],
  exports: [CitiesRepo],
})
export class CitiesModule {}
