import { Test, TestingModule } from '@nestjs/testing';
import { MedicalCouncilsService } from './medical-councils.service';

describe('MedicalCouncilsService', () => {
  let service: MedicalCouncilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalCouncilsService],
    }).compile();

    service = module.get<MedicalCouncilsService>(MedicalCouncilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
