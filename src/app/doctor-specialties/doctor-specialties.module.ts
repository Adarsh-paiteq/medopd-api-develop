import { Module } from '@nestjs/common';
import { DoctorSpecialtiesResolver } from './doctor-specialties.resolver';
import { DoctorSpecialtiesService } from './doctor-specialties.service';
import { DoctorSpecialtiesRepo } from './doctor-specialties.repo';

@Module({
  providers: [
    DoctorSpecialtiesResolver,
    DoctorSpecialtiesService,
    DoctorSpecialtiesRepo,
  ],
  exports: [DoctorSpecialtiesRepo],
})
export class DoctorSpecialtiesModule {}
