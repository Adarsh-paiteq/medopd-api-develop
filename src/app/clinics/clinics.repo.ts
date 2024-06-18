import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Clinic, clinicsTable } from './clinics.schema';
import { eq, and, sql, count } from 'drizzle-orm';
import { ulid } from 'ulid';
import { ClinicUpdateDto } from './dto/verify-clinic-otp.dto'; // Add this line
import { ClinicSeedData } from '@seed/data/clinics.data';

@Injectable()
export class ClinicsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      clinicsTable: typeof clinicsTable;
    }>,
  ) {}

  async getClinicByMobileNumber(
    mobileNumber: string,
    countryCode: string,
  ): Promise<Clinic | undefined> {
    const [result] = await this.db
      .select()
      .from(clinicsTable)
      .where(
        and(
          eq(clinicsTable.mobileNumber, mobileNumber),
          eq(clinicsTable.countryCode, countryCode),
        ),
      );
    return result;
  }

  async registerClinic(
    mobileNumber: string,
    countryCode: string,
  ): Promise<Clinic> {
    const [result] = await this.db
      .insert(clinicsTable)
      .values({
        mobileNumber: mobileNumber,
        countryCode: countryCode,
        id: ulid(),
      })
      .returning();
    return result;
  }

  async getClinicById(id: string): Promise<Clinic | undefined> {
    const [result] = await this.db
      .select()
      .from(clinicsTable)
      .where(eq(clinicsTable.id, id));
    return result;
  }

  async updateOTPById(id: string, code: string): Promise<Clinic | undefined> {
    const [result] = await this.db
      .update(clinicsTable)
      .set({ otpSecret: code, updatedAt: new Date() })
      .where(eq(clinicsTable.id, id))
      .returning();
    return result;
  }

  async updateClinicById(
    clinicId: string,
    clinicUpdate: ClinicUpdateDto,
  ): Promise<Clinic | undefined> {
    const fieldsToUpdate = {
      ...clinicUpdate,
    };
    const [result] = await this.db
      .update(clinicsTable)
      .set(fieldsToUpdate)
      .where(eq(clinicsTable.id, clinicId))
      .returning();
    return result;
  }

  async getClinicByName(clinicName: string): Promise<Clinic | undefined> {
    const formattedName = clinicName.toLowerCase().replace(/\s+/g, '');
    const [result] = await this.db
      .select()
      .from(clinicsTable)
      .where(
        sql`LOWER(REPLACE(${clinicsTable.clinicName}, ' ', '')) = ${formattedName}`,
      );

    return result;
  }

  async getClinicByEmail(email: string): Promise<Clinic | undefined> {
    const formattedEmail = email.toLowerCase().replace(/\s+/g, '');
    const [result] = await this.db
      .select()
      .from(clinicsTable)
      .where(
        sql`LOWER(REPLACE(${clinicsTable.email}, ' ', '')) = ${formattedEmail}`,
      );

    return result;
  }

  async bulkInsertClinics(clinics: ClinicSeedData[]): Promise<Clinic[]> {
    const values = clinics.map<
      Pick<
        Clinic,
        | 'id'
        | 'countryCode'
        | 'mobileNumber'
        | 'email'
        | 'fullName'
        | 'clinicName'
        | 'imageFilePath'
        | 'imageId'
        | 'imageUrl'
        | 'cityId'
        | 'otpSecret'
        | 'address'
        | 'postalCode'
        | 'latitude'
        | 'longitude'
        | 'landmark'
      >
    >((clinic) => ({
      id: ulid(),
      email: clinic.email,
      fullName: clinic.full_name,
      clinicName: clinic.clinic_name,
      imageFilePath: clinic.image_file_path,
      imageId: clinic.image_id,
      imageUrl: clinic.image_url,
      mobileNumber: clinic.mobile_number,
      countryCode: clinic.country_code,
      cityId: clinic.cityId,
      otpSecret: clinic.otp_secret,
      address: clinic.address,
      postalCode: clinic.postal_code,
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      landmark: clinic.landmark,
    }));
    return await this.db
      .insert(clinicsTable)
      .values(values)
      .onConflictDoNothing({
        target: clinicsTable.clinicName,
      })
      .returning();
  }

  async getClinics(
    page: number,
    limit: number,
  ): Promise<{ clinics: Clinic[]; total: number }> {
    const offset = (page - 1) * limit;
    const queryWithPagination = this.db
      .select()
      .from(clinicsTable)
      .orderBy(sql`${clinicsTable.createdAt} DESC NULLS FIRST`)
      .limit(limit)
      .offset(offset);

    const queryWithoutPagination = this.db
      .select({ total: count() })
      .from(clinicsTable);

    const [clinics, [{ total }]] = await Promise.all([
      queryWithPagination,
      queryWithoutPagination,
    ]);
    return { clinics, total };
  }

  async updateClinicWalletById(
    clinicId: string,
    amount: number,
  ): Promise<Clinic | undefined> {
    const [result] = await this.db
      .update(clinicsTable)
      .set({
        walletBalance: sql`${clinicsTable.walletBalance} + ${amount}`,
      })
      .where(eq(clinicsTable.id, clinicId))
      .returning();
    return result;
  }
}
