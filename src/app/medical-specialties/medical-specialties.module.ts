import { Module } from '@nestjs/common';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import { MedicalSpecialtiesResolver } from './medical-specialties.resolver';
import { MedicalSpecialtiesRepo } from './medical-specialties.repo';

@Module({
  providers: [
    MedicalSpecialtiesResolver,
    MedicalSpecialtiesService,
    MedicalSpecialtiesRepo,
  ],
  exports: [MedicalSpecialtiesRepo],
})
export class MedicalSpecialtiesModule {}
