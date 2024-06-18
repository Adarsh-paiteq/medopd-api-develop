import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Doctor, doctorsTable } from './doctors.schema';
import { DoctorSeedData } from '@seed/data/doctors.data';
import { ulid } from 'ulid';
import { and, count, eq, ilike, sql } from 'drizzle-orm';
import { DoctorUpdateDto } from './dto/send-otp-login-register-doctor.dto';
import { medicalDegreesTable } from '@medical-degrees/medical-degrees.schema';
import { DoctorWithDetailsOutput } from './dto/get-doctorsWithDetails.dto';
import { DoctorSpecialtiesRepo } from '@doctor-specialties/doctor-specialties.repo';
import { medicalCouncilsTable } from '@medical-councils/medical-councils.schema';
import { medicalSpecialtiesTable } from '@medical-specialties/medical-specialties.schema';
import { citiesTable } from '@cities/cities.schema';

@Injectable()
export class DoctorsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      doctorsTable: typeof doctorsTable;
    }>,
    private doctorSpecialtiesRepo: DoctorSpecialtiesRepo,
  ) {}

  async bulkInsertDoctors(doctors: DoctorSeedData[]): Promise<Doctor[]> {
    const [council, degree, specialty, city] = await Promise.all([
      this.db.select().from(medicalCouncilsTable).limit(1),
      this.db.select().from(medicalDegreesTable).limit(1),
      this.db.select().from(medicalSpecialtiesTable).limit(1),
      this.db.select().from(citiesTable).limit(1),
    ]);
    if (
      council.length === 0 ||
      degree.length === 0 ||
      city.length === 0 ||
      specialty.length === 0
    ) {
      throw new NotFoundException(
        'Medical council or Medical degree or MedicalSpecialty or city not found',
      );
    }
    const values = doctors.map<
      Pick<
        Doctor,
        | 'id'
        | 'fullName'
        | 'gender'
        | 'imageFilePath'
        | 'imageId'
        | 'imageUrl'
        | 'mobileNumber'
        | 'countryCode'
        | 'otpSecret'
        | 'degreeId'
        | 'registrationNumber'
        | 'state'
        | 'councilId'
        | 'cityId'
        | 'registrationYear'
        | 'isOnboarded'
      >
    >((doctor) => ({
      id: ulid(),
      fullName: doctor.full_name,
      gender: doctor.gender,
      imageFilePath: doctor.image_file_path,
      imageId: doctor.image_id,
      imageUrl: doctor.image_url,
      mobileNumber: doctor.mobile_number,
      countryCode: doctor.country_code,
      otpSecret: doctor.otp_secret,
      degreeId: degree[0].id,
      registrationNumber: doctor.registration_number,
      state: doctor.state,
      councilId: council[0].id,
      cityId: city[0].id,
      registrationYear: doctor.registration_year,
      isOnboarded: true,
    }));
    const doctorsReponse = await this.db
      .insert(doctorsTable)
      .values(values)
      .returning();
    await Promise.all(
      doctorsReponse.map((doctor) => {
        return this.doctorSpecialtiesRepo.addDoctorSpecialties(
          doctor.id,
          specialty[0].id,
        );
      }),
    );

    return doctorsReponse;
  }

  async getDoctorByMoblieNumber(
    moblieNumber: string,
    countryCode: string,
  ): Promise<Doctor | undefined> {
    const [doctor] = await this.db
      .select()
      .from(doctorsTable)
      .where(
        and(
          eq(doctorsTable.mobileNumber, moblieNumber),
          eq(doctorsTable.countryCode, countryCode),
        ),
      );
    return doctor;
  }

  async registerDoctor(
    moblieNumber: string,
    countryCode: string,
  ): Promise<Doctor> {
    const [result] = await this.db
      .insert(doctorsTable)
      .values({
        id: ulid(),
        mobileNumber: moblieNumber,
        countryCode: countryCode,
      })
      .returning();
    return result;
  }
  async updateDoctorById(
    id: string,
    doctorUpdate: DoctorUpdateDto,
  ): Promise<Doctor | undefined> {
    const fieldsToUpdate = {
      ...doctorUpdate,
      updatedAt: new Date(),
    };
    const [result] = await this.db
      .update(doctorsTable)
      .set(fieldsToUpdate)
      .where(eq(doctorsTable.id, id))
      .returning();
    return result;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    const [result] = await this.db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, id));
    return result;
  }

  async getDoctors(
    page: number,
    limit: number,
    fullName?: string,
  ): Promise<{ doctors: Doctor[]; total: number }> {
    const offset = (page - 1) * limit;
    const commonWhereClause = fullName
      ? and(
          eq(doctorsTable.isOnboarded, true),
          ilike(doctorsTable.fullName, sql.placeholder(`fullName`)),
        )
      : eq(doctorsTable.isOnboarded, true);
    const builderWithPagination = this.db
      .select()
      .from(doctorsTable)
      .where(commonWhereClause)
      .offset(offset)
      .limit(limit);

    const builderWithoutPagination = this.db
      .select({ total: count() })
      .from(doctorsTable)
      .where(commonWhereClause);

    const queryWithPagination = builderWithPagination.prepare('doctors');
    const queryWithoutPagination = builderWithoutPagination.prepare('total');
    const executeOptions: Parameters<typeof queryWithPagination.execute>[0] =
      {};
    if (fullName) {
      executeOptions.fullName = `%${fullName}%`;
    }
    const [doctors, [{ total }]] = await Promise.all([
      queryWithPagination.execute(executeOptions),
      queryWithoutPagination.execute(executeOptions),
    ]);
    return {
      doctors,
      total,
    };
  }

  async getDoctorsWithDetails(
    page: number,
    limit: number,
  ): Promise<DoctorWithDetailsOutput[]> {
    const offset = (page - 1) * limit;
    const doctorsWithoutSpecialties = await this.db
      .select({
        doctorId: doctorsTable.id,
        doctorName: doctorsTable.fullName,
        doctorImageFilePath: doctorsTable.imageFilePath,
        doctorImageId: doctorsTable.imageId,
        doctorImageUrl: doctorsTable.imageUrl,
        doctorDegree: medicalDegreesTable.name,
        doctorRegistrationYear: doctorsTable.registrationYear,
        doctorState: doctorsTable.state,
      })
      .from(doctorsTable)
      .innerJoin(
        medicalDegreesTable,
        eq(doctorsTable.degreeId, medicalDegreesTable.id),
      )
      .where(eq(doctorsTable.isOnboarded, true))
      .offset(offset)
      .limit(limit);

    const doctorsWithDetails = await Promise.all(
      doctorsWithoutSpecialties.map(async (doctor) => {
        const doctorSpecialties =
          await this.doctorSpecialtiesRepo.getDoctorspecialtiesName(
            doctor.doctorId,
          );
        return {
          ...doctor,
          doctorSpecialties,
        };
      }),
    );
    return doctorsWithDetails;
  }
}
