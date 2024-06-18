import { Module } from '@nestjs/common';
import { ClinicsResolver } from './clinics.resolver';
import { ClinicsService } from './clinics.service';
import { ClinicsRepo } from './clinics.repo';
import { CoreModule } from '@core/core.module';
import { CitiesModule } from '@cities/cities.module';
import { BannersModule } from '@banners/banners.module';
import { DoctorsModule } from '@doctors/doctors.module';

@Module({
  imports: [CoreModule, CitiesModule, BannersModule, DoctorsModule],
  providers: [ClinicsResolver, ClinicsService, ClinicsRepo],
  exports: [ClinicsRepo],
})
export class ClinicsModule {}
