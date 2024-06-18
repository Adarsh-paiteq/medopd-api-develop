import { Test, TestingModule } from '@nestjs/testing';
import { MedicalDegreesService } from './medical-degrees.service';

describe('MedicalDegreesService', () => {
  let service: MedicalDegreesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalDegreesService],
    }).compile();

    service = module.get<MedicalDegreesService>(MedicalDegreesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
