import { Module } from '@nestjs/common';
import { MedicalCouncilsService } from './medical-councils.service';
import { MedicalCouncilsResolver } from './medical-councils.resolver';
import { MedicalCouncilsRepo } from './medical-councils.repo';

@Module({
  providers: [
    MedicalCouncilsResolver,
    MedicalCouncilsService,
    MedicalCouncilsRepo,
  ],
  exports: [MedicalCouncilsRepo],
})
export class MedicalCouncilsModule {}
