import { Test, TestingModule } from '@nestjs/testing';
import { MedicalCouncilsResolver } from './medical-councils.resolver';
import { MedicalCouncilsService } from './medical-councils.service';

describe('MedicalCouncilsResolver', () => {
  let resolver: MedicalCouncilsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalCouncilsResolver, MedicalCouncilsService],
    }).compile();

    resolver = module.get<MedicalCouncilsResolver>(MedicalCouncilsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
