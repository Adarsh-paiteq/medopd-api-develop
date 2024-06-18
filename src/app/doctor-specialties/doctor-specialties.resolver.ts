import { Resolver } from '@nestjs/graphql';
import { DoctorSpecialtiesService } from './doctor-specialties.service';

@Resolver()
export class DoctorSpecialtiesResolver {
  constructor(
    private readonly doctorSpecialtiesService: DoctorSpecialtiesService,
  ) {}
}
