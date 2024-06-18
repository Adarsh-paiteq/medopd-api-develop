import { Resolver } from '@nestjs/graphql';
import { MedicinesService } from './medicines.service';

@Resolver()
export class MedicinesResolver {
  constructor(private readonly medicinesService: MedicinesService) {}
}
