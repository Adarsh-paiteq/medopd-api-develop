import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsRepo } from './patients.repo';
import { PatientsResolver } from './patients.resolver';

@Module({
  providers: [PatientsResolver, PatientsService, PatientsRepo],
  exports: [PatientsRepo],
})
export class PatientsModule {}
