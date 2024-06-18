import { Injectable } from '@nestjs/common';
import { DoctorSpecialtiesRepo } from './doctor-specialties.repo';

@Injectable()
export class DoctorSpecialtiesService {
  constructor(private readonly doctorSpecialtiesRepo: DoctorSpecialtiesRepo) {}
}
