import { Injectable } from '@nestjs/common';
import { MedicinesRepo } from './medicines.repo';

@Injectable()
export class MedicinesService {
  constructor(private readonly medicinesRepo: MedicinesRepo) {}
}
