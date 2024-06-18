import { Module } from '@nestjs/common';
import { PatientMedicinesService } from './patient-medicines.service';
import { PatientMedicinesResolver } from './patient-medicines.resolver';
import { PatientMedicinesRepo } from './patient-medicines.repo';
import { PrescriptionsModule } from '@prescriptions/prescriptions.module';
import { MedicinesModule } from '@medicines/medicines.module';

@Module({
  imports: [PrescriptionsModule, MedicinesModule],
  providers: [
    PatientMedicinesService,
    PatientMedicinesResolver,
    PatientMedicinesRepo,
  ],
  exports: [PatientMedicinesRepo],
})
export class PatientMedicinesModule {}
