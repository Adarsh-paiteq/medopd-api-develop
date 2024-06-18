import { Test, TestingModule } from '@nestjs/testing';
import { MedicalSpecialtiesResolver } from './medical-specialties.resolver';
import { MedicalSpecialtiesService } from './medical-specialties.service';

describe('MedicalSpecialtiesResolver', () => {
  let resolver: MedicalSpecialtiesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalSpecialtiesResolver, MedicalSpecialtiesService],
    }).compile();

    resolver = module.get<MedicalSpecialtiesResolver>(MedicalSpecialtiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
