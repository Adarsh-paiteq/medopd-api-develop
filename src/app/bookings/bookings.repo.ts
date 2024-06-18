import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Booking, bookingsTable } from './bookings.schema';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { CreateBookingInputDto } from './dto/create-booking.dto';
import { ulid } from 'ulid';
import { BOOKINGSTATUS, BookingStatus } from './dto/update-booking-status.dto';
import { GetBookingDetialsOutput } from './dto/get-booking-detials.dto';
import { patientsTable } from '@patients/patients.schema';
import { and, between, count, desc, eq, sql } from 'drizzle-orm';
import { BookingDoctorHomepageOutput } from './dto/get-booking-doctor-homepage.dto';
import { doctorsTable } from '@doctors/doctors.schema';
import { clinicsTable } from '@clinics/clinics.schema';
import { BookingOutput } from './dto/get-bookings.dto';
import { PatientDetails } from './dto/get-doctor-earnings.dto';
import { PatientDetailsClinic } from './dto/get-clinic-earnings.dto';
import { adminsTable } from '@admins/admins.schema';

@Injectable()
export class BookingsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      bookingsTable: typeof bookingsTable;
    }>,
  ) {}

  async createBooking(createBooking: CreateBookingInputDto): Promise<Booking> {
    const [result] = await this.db
      .insert(bookingsTable)
      .values({
        ...createBooking,
        id: ulid(),
      })
      .returning();
    return result;
  }

  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    const [booking] = await this.db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId));
    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus,
  ): Promise<Booking | undefined> {
    const [booking] = await this.db
      .update(bookingsTable)
      .set({ bookingStatus: status, updatedAt: new Date() })
      .where(eq(bookingsTable.id, bookingId))
      .returning();
    return booking;
  }
  async getBookingDetials(
    bookingId: string,
  ): Promise<GetBookingDetialsOutput | undefined> {
    const [bookingDetials] = await this.db
      .select({
        patietId: bookingsTable.bookingId,
        patientName: patientsTable.fullName,
        gender: patientsTable.gender,
        patientAge: patientsTable.patientAge,
        bookingId: bookingsTable.id,
        bp: bookingsTable.bp,
        patientMobileNumber: patientsTable.mobileNumber,
        language: bookingsTable.language,
        symptoms: bookingsTable.symptoms,
        otherSymptoms: bookingsTable.otherSymptoms,
        doctorEarning: bookingsTable.doctorEarning,
        pulse: bookingsTable.pulse,
        oxygenSaturation: bookingsTable.oxygenSaturation,
        medicalHistory: bookingsTable.medicalHistory,
        abdominalTenderness: bookingsTable.abdominalTenderness,
        patientNote: bookingsTable.patientNote,
        pedalOedema: bookingsTable.pedalOedema,
        imageFilePath: bookingsTable.imageFilePath,
        imageId: bookingsTable.imageId,
        imageUrl: bookingsTable.imageUrl,
      })
      .from(bookingsTable)
      .innerJoin(patientsTable, eq(bookingsTable.patientId, patientsTable.id))
      .where(eq(bookingsTable.id, bookingId));

    return bookingDetials;
  }

  async getBookingsDoctorHomepage(
    doctorId: string,
    page: number,
    limit: number,
  ): Promise<{
    bookings: BookingDoctorHomepageOutput[];
    todayEarning: number;
    total: number;
  }> {
    const offset = (page - 1) * limit;
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const [bookings, [{ todayEarning }], [{ total }]] = await Promise.all([
      this.db
        .select({
          bookingId: bookingsTable.id,
          patientName: patientsTable.fullName,
          doctorEarning: bookingsTable.doctorEarning,
          language: bookingsTable.language,
        })
        .from(bookingsTable)
        .innerJoin(patientsTable, eq(bookingsTable.patientId, patientsTable.id))
        .where(
          and(
            eq(bookingsTable.doctorId, doctorId),
            eq(bookingsTable.bookingStatus, BOOKINGSTATUS.PENDING),
          ),
        )
        .offset(offset)
        .limit(limit)
        .orderBy(desc(bookingsTable.createdAt)),
      this.db
        .select({
          todayEarning: sql<number>`cast(sum(${bookingsTable.doctorEarning}) as float)`,
        })
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.doctorId, doctorId),
            between(bookingsTable.createdAt, startOfToday, today),
            eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
          ),
        ),
      this.db
        .select({ total: count() })
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.doctorId, doctorId),
            eq(bookingsTable.bookingStatus, BOOKINGSTATUS.PENDING),
          ),
        ),
    ]);
    return { bookings, todayEarning: todayEarning ? todayEarning : 0, total };
  }

  async getBookings(
    page: number,
    limit: number,
  ): Promise<{ bookings: BookingOutput[]; total: number }> {
    const offset = (page - 1) * limit;
    const [bookings, [{ total }]] = await Promise.all([
      this.db
        .select({
          id: bookingsTable.id,
          clinic: {
            id: clinicsTable.id,
            name: clinicsTable.clinicName,
            mobileNumber: clinicsTable.mobileNumber,
          },
          patient: {
            id: patientsTable.id,
            name: patientsTable.fullName,
            mobileNumber: patientsTable.mobileNumber,
          },
          doctor: {
            id: doctorsTable.id,
            name: doctorsTable.fullName,
            mobileNumber: doctorsTable.mobileNumber,
          },
          bp: bookingsTable.bp,
          bookingId: bookingsTable.bookingId,
          symptoms: bookingsTable.symptoms,
          otherSymptoms: bookingsTable.otherSymptoms,
          bookingStatus: bookingsTable.bookingStatus,
          consultType: bookingsTable.consultType,
          language: bookingsTable.language,
          clinicEarning: bookingsTable.clinicEarning,
          doctorEarning: bookingsTable.doctorEarning,
          adminEarning: bookingsTable.adminEarning,
          createdAt: bookingsTable.createdAt,
          updatedAt: bookingsTable.updatedAt,
          pulse: bookingsTable.pulse,
          oxygenSaturation: bookingsTable.oxygenSaturation,
          medicalHistory: bookingsTable.medicalHistory,
          abdominalTenderness: bookingsTable.abdominalTenderness,
          patientNote: bookingsTable.patientNote,
          pedalOedema: bookingsTable.pedalOedema,
          imageFilePath: bookingsTable.imageFilePath,
          imageId: bookingsTable.imageId,
          imageUrl: bookingsTable.imageUrl,
        })
        .from(bookingsTable)
        .innerJoin(patientsTable, eq(bookingsTable.patientId, patientsTable.id))
        .innerJoin(doctorsTable, eq(bookingsTable.doctorId, doctorsTable.id))
        .innerJoin(clinicsTable, eq(bookingsTable.clinicId, clinicsTable.id))
        .offset(offset)
        .limit(limit),
      this.db.select({ total: count() }).from(bookingsTable),
    ]);
    return { bookings, total };
  }

  async getDoctorEarnings(
    doctorId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{
    totalEarnings: number;
    patientsDetails: PatientDetails[];
    total: number;
  }> {
    const [[{ totalEarnings }], patientsDetails, [{ total }]] =
      await Promise.all([
        this.db
          .select({
            totalEarnings: sql<number>`cast(sum(${bookingsTable.doctorEarning}) as float)`,
          })
          .from(bookingsTable)
          .where(
            and(
              eq(bookingsTable.doctorId, doctorId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          ),
        this.db
          .select({
            bookingId: bookingsTable.id,
            patientId: patientsTable.id,
            patientName: patientsTable.fullName,
            symptoms: bookingsTable.symptoms,
            doctorEarning: bookingsTable.doctorEarning,
            earningDate: bookingsTable.updatedAt,
          })
          .from(bookingsTable)
          .innerJoin(
            patientsTable,
            eq(bookingsTable.patientId, patientsTable.id),
          )
          .where(
            and(
              eq(bookingsTable.doctorId, doctorId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          )
          .offset((page - 1) * limit)
          .limit(limit)
          .orderBy(desc(bookingsTable.updatedAt)),
        this.db
          .select({ total: count() })
          .from(bookingsTable)
          .where(
            and(
              eq(bookingsTable.doctorId, doctorId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          ),
      ]);
    return {
      totalEarnings: totalEarnings ? totalEarnings : 0,
      patientsDetails,
      total,
    };
  }

  async getDoctorBookingHistory(
    doctorId: string,
    page: number,
    limit: number,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    bookingHistory: BookingDoctorHomepageOutput[];
    total: number;
  }> {
    const offset = (page - 1) * limit;
    const [bookingHistory, [{ total }]] = await Promise.all([
      this.db
        .select({
          bookingId: bookingsTable.id,
          patientName: patientsTable.fullName,
          doctorEarning: bookingsTable.doctorEarning,
          language: bookingsTable.language,
        })
        .from(bookingsTable)
        .innerJoin(patientsTable, eq(bookingsTable.patientId, patientsTable.id))
        .where(
          and(
            eq(bookingsTable.doctorId, doctorId),
            eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
            between(bookingsTable.updatedAt, startDate, endDate),
          ),
        )
        .offset(offset)
        .limit(limit)
        .orderBy(desc(bookingsTable.createdAt)),
      this.db
        .select({ total: count() })
        .from(bookingsTable)
        .where(
          and(
            eq(bookingsTable.doctorId, doctorId),
            eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
            between(bookingsTable.updatedAt, startDate, endDate),
          ),
        ),
    ]);
    return { bookingHistory, total };
  }

  async getClinicEarnings(
    clinicId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<{
    totalEarnings: number;
    patientsDetailsClinic: PatientDetailsClinic[];
    total: number;
  }> {
    const [[{ totalEarnings }], patientsDetails, [{ total }]] =
      await Promise.all([
        this.db
          .select({
            totalEarnings: sql<number>`cast(sum(${bookingsTable.clinicEarning}) as float)`,
          })
          .from(bookingsTable)
          .where(
            and(
              eq(bookingsTable.clinicId, clinicId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          ),
        this.db
          .select({
            bookingId: bookingsTable.id,
            patientId: patientsTable.id,
            patientName: patientsTable.fullName,
            symptoms: bookingsTable.symptoms,
            clinicEarning: bookingsTable.clinicEarning,
            earningDate: bookingsTable.updatedAt,
          })
          .from(bookingsTable)
          .innerJoin(
            patientsTable,
            eq(bookingsTable.patientId, patientsTable.id),
          )
          .where(
            and(
              eq(bookingsTable.clinicId, clinicId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          )
          .offset((page - 1) * limit)
          .limit(limit)
          .orderBy(desc(bookingsTable.updatedAt)),
        this.db
          .select({ total: count() })
          .from(bookingsTable)
          .where(
            and(
              eq(bookingsTable.clinicId, clinicId),
              eq(bookingsTable.bookingStatus, BOOKINGSTATUS.ACCEPT),
              between(bookingsTable.updatedAt, startDate, endDate),
            ),
          ),
      ]);
    return {
      totalEarnings: totalEarnings ? totalEarnings : 0,
      patientsDetailsClinic: patientsDetails,
      total,
    };
  }

  async bookingTransactionCaluculation(
    booking: Booking,
    bookingStatus: BookingStatus,
  ): Promise<Booking> {
    const bookingCharges =
      Number(booking.doctorEarning) +
      Number(booking.clinicEarning) +
      Number(booking.adminEarning);
    const updatedBooking = await this.db.transaction(async (tx) => {
      const [{ walletBalance }] = await tx
        .select({ walletBalance: clinicsTable.walletBalance })
        .from(clinicsTable)
        .where(eq(clinicsTable.id, booking.clinicId));
      if (walletBalance < bookingCharges) {
        throw new BadRequestException('Insufficient balance in wallet');
      }
      await tx
        .update(clinicsTable)
        .set({
          walletBalance: sql`${clinicsTable.walletBalance} - ${bookingCharges}`,
        })
        .where(eq(clinicsTable.id, booking.clinicId));
      await tx
        .update(clinicsTable)
        .set({
          earningBalance: sql`${clinicsTable.earningBalance}+${booking.clinicEarning}`,
        })
        .where(eq(clinicsTable.id, booking.clinicId));
      await tx.update(adminsTable).set({
        earningBalance: sql`${adminsTable.earningBalance}+${booking.adminEarning}`,
      });
      await tx
        .update(doctorsTable)
        .set({
          earningBalance: sql`${doctorsTable.earningBalance}+${booking.doctorEarning}`,
        })
        .where(eq(doctorsTable.id, booking.doctorId));
      const [updatedBooking] = await tx
        .update(bookingsTable)
        .set({ bookingStatus: bookingStatus, updatedAt: new Date() })
        .where(eq(bookingsTable.id, booking.id))
        .returning();
      if (!updatedBooking) {
        tx.rollback();
      }
      return updatedBooking;
    });
    if (!updatedBooking) {
      throw new BadRequestException('Booking status not updated');
    }
    return updatedBooking;
  }
}
