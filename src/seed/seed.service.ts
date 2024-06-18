import { MedicalCouncilsRepo } from '@medical-councils/medical-councils.repo';
import { medicalCouncilsSeedData } from './data/medical-councils.data';
import { Command, CommandRunner } from 'nest-commander';
import { Inject, Logger } from '@nestjs/common';
import {
  DATABASE_PROVIDER,
  DatabaseConnection,
} from '@core/providers/database.provider';
import { MedicalDegreesRepo } from '@medical-degrees/medical-degrees.repo';
import { medicalDegreesSeedData } from './data/medical-degrees.data';
import { MedicalSpecialtiesRepo } from '@medical-specialties/medical-specialties.repo';
import { medicalSpecialtiesSeedData } from './data/medical-specialties.data';
import { CitiesRepo } from '@cities/cities.repo';
import { citiesSeedData } from './data/cities.data';
import { BannersRepo } from '@banners/banners.repo';
import { bannersSeedData } from './data/banners.data';
import { ClinicsRepo } from '@clinics/clinics.repo';
import { clinicSeedData } from './data/clinics.data';
import { AdminsRepo } from '@admins/admins.repo';
import { adminsSeedData } from './data/admins.data';
import { DoctorsRepo } from '@doctors/doctors.repo';
import { doctorsSeedData } from './data/doctors.data';

export const SEED_TYPE = {
  councils: 'councils',
  all: 'all',
  degrees: 'degress',
  specialties: 'specialties',
  cities: 'cities',
  banners: 'banners',
  clinics: 'clinics',
  admins: 'admins',
  doctors: 'doctors',
} as const;

@Command({ name: 'run', description: 'A parameter parse' })
export class SeedService extends CommandRunner {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private readonly medicalCouncilsRepo: MedicalCouncilsRepo,
    private readonly medicalDegreesRepo: MedicalDegreesRepo,
    private readonly medicalSpecialtiesRepo: MedicalSpecialtiesRepo,
    private readonly citiesRepo: CitiesRepo,
    private readonly bannersRepo: BannersRepo,
    private readonly clinicsRepo: ClinicsRepo,
    private readonly adminsRepo: AdminsRepo,
    private readonly doctorsRepo: DoctorsRepo,
    @Inject(DATABASE_PROVIDER) private readonly database: DatabaseConnection,
  ) {
    super();
  }
  async run(passedParams: string[]): Promise<void> {
    const [seedType] = passedParams;
    switch (seedType) {
      case SEED_TYPE.councils:
        await this.seedCouncils();
        break;
      case SEED_TYPE.degrees:
        await this.seedDegress();
        break;
      case SEED_TYPE.specialties:
        await this.seedSpecialties();
        break;
      case SEED_TYPE.cities:
        await this.seedCities();
        break;
      case SEED_TYPE.banners:
        await this.seedBanners();
        break;
      case SEED_TYPE.clinics:
        await this.seedClinics();
        break;
      case SEED_TYPE.admins:
        await this.seedAdmins();
        break;
      case SEED_TYPE.doctors:
        await this.seedDoctors();
        break;
      case SEED_TYPE.all:
        await this.seedAll();
        break;
      default:
        this.logger.warn(
          `Please pass a seed type. available seedTypes are ${Object.keys(SEED_TYPE).toString()}`,
        );
        break;
    }
    await this.database.end();
  }

  async seedAll(): Promise<void> {
    this.logger.log(`Seeding all`);
    await Promise.all([
      this.seedCouncils(),
      this.seedDegress(),
      this.seedSpecialties(),
      this.seedCities(),
      this.seedBanners(),
      this.seedClinics(),
      this.seedAdmins(),
      this.seedDoctors(),
    ]);
  }
  async seedCouncils(): Promise<void> {
    this.logger.log(`Seeding councils`);
    await this.medicalCouncilsRepo.BulkInsertCouncil(medicalCouncilsSeedData);
  }
  async seedSpecialties(): Promise<void> {
    this.logger.log(`Seeding Specialties`);
    await this.medicalSpecialtiesRepo.BulkInsertSpecialties(
      medicalSpecialtiesSeedData,
    );
  }
  async seedDegress(): Promise<void> {
    this.logger.log(`Seeding Degress`);
    await this.medicalDegreesRepo.BulkInsertDegrees(medicalDegreesSeedData);
  }

  async seedCities(): Promise<void> {
    this.logger.log(`Seeding Cities`);
    await this.citiesRepo.bulkInsertCities(citiesSeedData);
  }

  async seedBanners(): Promise<void> {
    this.logger.log(`Seeding Banners`);
    await this.bannersRepo.bulkInsertBanners(bannersSeedData);
  }

  async seedClinics(): Promise<void> {
    this.logger.log(`Seeding Clinics`);
    await this.clinicsRepo.bulkInsertClinics(clinicSeedData);
  }

  async seedAdmins(): Promise<void> {
    this.logger.log(`Seeding Admins`);
    await this.adminsRepo.bulkInsertAdmins(adminsSeedData);
  }

  async seedDoctors(): Promise<void> {
    this.logger.log(`Seeding Doctors`);
    await this.doctorsRepo.bulkInsertDoctors(doctorsSeedData);
  }
}
