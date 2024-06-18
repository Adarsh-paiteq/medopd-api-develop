import { Module, forwardRef } from '@nestjs/common';
import { DoctorsResolver } from './doctors.resolver';
import { DoctorsService } from './doctors.service';
import { DoctorsRepo } from './doctors.repo';
import { CitiesModule } from '@cities/cities.module';
import { MedicalDegreesModule } from '@medical-degrees/medical-degrees.module';
import { MedicalCouncilsModule } from '@medical-councils/medical-councils.module';
import { DoctorSpecialtiesModule } from '@doctor-specialties/doctor-specialties.module';
import { MedicalSpecialtiesModule } from '@medical-specialties/medical-specialties.module';
import { BookingsModule } from '@bookings/bookings.module';

@Module({
  imports: [
    forwardRef(() => BookingsModule),
    CitiesModule,
    MedicalDegreesModule,
    MedicalCouncilsModule,
    DoctorSpecialtiesModule,
    MedicalSpecialtiesModule,
  ],
  providers: [DoctorsResolver, DoctorsService, DoctorsRepo],
  exports: [DoctorsRepo],
})
export class DoctorsModule {}
