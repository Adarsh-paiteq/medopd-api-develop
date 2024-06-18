import { Test, TestingModule } from '@nestjs/testing';
import { MedicalSpecialtiesService } from './medical-specialties.service';

describe('MedicalSpecialtiesService', () => {
  let service: MedicalSpecialtiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalSpecialtiesService],
    }).compile();

    service = module.get<MedicalSpecialtiesService>(MedicalSpecialtiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
