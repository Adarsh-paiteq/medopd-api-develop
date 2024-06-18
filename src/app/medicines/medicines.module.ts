import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesResolver } from './medicines.resolver';
import { MedicinesRepo } from './medicines.repo';

@Module({
  providers: [MedicinesService, MedicinesResolver, MedicinesRepo],
  exports: [MedicinesRepo],
})
export class MedicinesModule {}
