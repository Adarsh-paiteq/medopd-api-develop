import { Test, TestingModule } from '@nestjs/testing';
import { MedicalDegreesResolver } from './medical-degrees.resolver';
import { MedicalDegreesService } from './medical-degrees.service';

describe('MedicalDegreesResolver', () => {
  let resolver: MedicalDegreesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalDegreesResolver, MedicalDegreesService],
    }).compile();

    resolver = module.get<MedicalDegreesResolver>(MedicalDegreesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
