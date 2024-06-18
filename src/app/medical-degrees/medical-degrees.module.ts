import { Module } from '@nestjs/common';
import { MedicalDegreesService } from './medical-degrees.service';
import { MedicalDegreesResolver } from './medical-degrees.resolver';
import { MedicalDegreesRepo } from './medical-degrees.repo';

@Module({
  providers: [
    MedicalDegreesResolver,
    MedicalDegreesService,
    MedicalDegreesRepo,
  ],
  exports: [MedicalDegreesRepo],
})
export class MedicalDegreesModule {}
