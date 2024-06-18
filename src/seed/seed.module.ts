import { Global, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@core/configs/env.config';
import { DrizzleProvider } from '@core/providers/drizzle.provider';
import { DatabaseProvider } from '@core/providers/database.provider';
import { MedicalCouncilsModule } from '@medical-councils/medical-councils.module';
import { MedicalDegreesModule } from '@medical-degrees/medical-degrees.module';
import { MedicalSpecialtiesModule } from '@medical-specialties/medical-specialties.module';
import { CitiesModule } from '@cities/cities.module';
import { BannersModule } from '@banners/banners.module';
import { ClinicsModule } from '@clinics/clinics.module';
import { AdminsModule } from '@admins/admins.module';
import { DoctorsModule } from '@doctors/doctors.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MedicalCouncilsModule,
    MedicalDegreesModule,
    MedicalSpecialtiesModule,
    CitiesModule,
    BannersModule,
    ClinicsModule,
    AdminsModule,
    DoctorsModule,
  ],
  providers: [DatabaseProvider, DrizzleProvider, SeedService],
  exports: [DatabaseProvider, DrizzleProvider],
})
export class SeedModule {}
