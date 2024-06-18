import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingsRepo } from './bookings.repo';
import {
  AddPatientInputDto,
  CreateBookingInput,
  CreateBookingInputDto,
  CreateBookingResponse,
} from './dto/create-booking.dto';
import { PatientsRepo } from '@patients/patients.repo';
import { DoctorsRepo } from '@doctors/doctors.repo';
import { ClinicsRepo } from '@clinics/clinics.repo';
import {
  BOOKINGSTATUS,
  UpdateBookingStatusArgs,
  UpdateBookingStatusResponse,
} from './dto/update-booking-status.dto';
import {
  GetBookingDetialsArgs,
  GetBookingDetialsOutput,
} from './dto/get-booking-detials.dto';
import { CreateChatInputDto } from '@chats/dto/create-chat.dto';
import { ChatsRepo } from '@chats/chats.repo';
import { PaginationArgs } from '@utils/helpers';
import { GetBookingsOutput } from './dto/get-bookings.dto';
import { PrescriptionsRepo } from '@prescriptions/prescriptions.repo';
import { CreatePrescriptionInputDto } from '@prescriptions/dto/create-prescription.dto';
import {
  GetDoctorEarningsArgs,
  GetDoctorEarningsOutput,
  PERIOD,
  Period,
} from './dto/get-doctor-earnings.dto';
import {
  GetDoctorBookingHistoryArgs,
  GetDoctorBookingHistoryOutput,
} from './dto/get-doctor-booking-history.dto';
import {
  GetClinicEarningsArgs,
  GetClinicEarningsOutput,
} from './dto/get-clinic-earnings.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BookingCreateEvent, BookingEvent } from './booking.event';
import { AdminsRepo } from '@admins/admins.repo';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepo: BookingsRepo,
    private readonly patientsRepo: PatientsRepo,
    private readonly doctorsRepo: DoctorsRepo,
    private readonly clinicsRepo: ClinicsRepo,
    private readonly chatsRepo: ChatsRepo,
    private readonly prescriptionsRepo: PrescriptionsRepo,
    private readonly eventemitter: EventEmitter2,
    protected readonly adminsRepo: AdminsRepo,
  ) {}

  async createBooking(
    userId: string,
    input: CreateBookingInput,
  ): Promise<CreateBookingResponse> {
    const {
      fullName,
      mobileNumber,
      patientAge,
      gender,
      doctorId,
      language,
      symptoms,
      otherSymptoms,
      consultType,
      bp,
      pulse,
      oxygenSaturation,
      medicalHistory,
      patientNote,
      abdominalTenderness,
      pedalOedema,
      imageId,
      imageFilePath,
      imageUrl,
    } = input;

    const [doctor, clinic] = await Promise.all([
      this.doctorsRepo.getDoctorById(doctorId),
      this.clinicsRepo.getClinicById(userId),
    ]);

    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }

    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    const { walletBalance } = clinic;
    const { adminCommission, clinicCommission, bookingCharges } = doctor;
    const doctorEarning =
      Number(bookingCharges) -
      Number(adminCommission) -
      Number(clinicCommission);
    if (Number(walletBalance) < Number(bookingCharges)) {
      throw new BadRequestException('Clinic wallet balance is low');
    }
    const patientInput: AddPatientInputDto = {
      fullName: fullName,
      mobileNumber: mobileNumber,
      patientAge: patientAge,
      gender: gender,
    };
    const savedPatient = await this.patientsRepo.addPatient(patientInput);
    const bookingId = Math.floor(1000 + Math.random() * 9000).toString();
    const bookingInput: CreateBookingInputDto = {
      consultType,
      bp,
      language,
      symptoms,
      otherSymptoms,
      pulse,
      oxygenSaturation,
      medicalHistory,
      patientNote,
      abdominalTenderness,
      pedalOedema,
      imageId,
      imageFilePath,
      imageUrl,
      patientId: savedPatient.id,
      clinicId: clinic.id,
      doctorId: doctor.id,
      doctorEarning: doctorEarning,
      adminEarning: adminCommission,
      clinicEarning: clinicCommission,
      bookingId: bookingId,
    };
    const booking = await this.bookingsRepo.createBooking(bookingInput);
    this.eventemitter.emit(
      BookingEvent.BOOKING_CREATED,
      new BookingCreateEvent(booking),
    );
    return {
      message: 'Booking Created Successfully',
    };
  }

  async updateBookingStatus(
    userId: string,
    args: UpdateBookingStatusArgs,
  ): Promise<UpdateBookingStatusResponse> {
    const { bookingId, bookingStatus } = args;
    const booking = await this.bookingsRepo.getBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (
      booking.bookingStatus === BOOKINGSTATUS.ACCEPT ||
      booking.bookingStatus === BOOKINGSTATUS.DECLINE
    ) {
      throw new BadRequestException('Booking already accepted or declined');
    }
    const { clinicId } = booking;
    const [doctor, clinic, admin] = await Promise.all([
      this.doctorsRepo.getDoctorById(userId),
      this.clinicsRepo.getClinicById(clinicId),
      this.adminsRepo.getAdmin(),
    ]);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }
    if (bookingStatus === BOOKINGSTATUS.DECLINE) {
      const updatedBooking = await this.bookingsRepo.updateBookingStatus(
        bookingId,
        bookingStatus,
      );
      if (!updatedBooking) {
        throw new BadRequestException('Booking status not updated');
      }
    } else {
      const { doctorId, clinicId, id, patientId } = booking;
      const chatInput: CreateChatInputDto = {
        clinicId,
        doctorId,
        patientId,
        bookingId: id,
      };
      const prescriptionInput: CreatePrescriptionInputDto = {
        bookingId: id,
        doctorId: doctorId,
      };
      await Promise.all([
        this.chatsRepo.createChat(chatInput),
        this.prescriptionsRepo.createPrescription(prescriptionInput),
        this.bookingsRepo.bookingTransactionCaluculation(
          booking,
          bookingStatus,
        ),
      ]);
    }
    return {
      message: 'Booking status updated successfully',
    };
  }

  async getBookingDetials(
    args: GetBookingDetialsArgs,
  ): Promise<GetBookingDetialsOutput> {
    const { bookingId } = args;
    const bookingDetials = await this.bookingsRepo.getBookingDetials(bookingId);
    if (!bookingDetials) {
      throw new NotFoundException('Booking not found');
    }
    return bookingDetials;
  }

  async getBookings(args: PaginationArgs): Promise<GetBookingsOutput> {
    const { page, limit } = args;
    const { bookings, total } = await this.bookingsRepo.getBookings(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { bookings, total, totalPages, page, limit };
  }

  getStartAndEndDate(period: Period): { startDate: Date; endDate: Date } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Today
    const endToday = new Date(now); // Current date and time
    const startToday = new Date(
      endToday.getFullYear(),
      endToday.getMonth(),
      endToday.getDate(),
    );
    if (period === PERIOD.Today) {
      return { startDate: startToday, endDate: endToday };
    }
    // Last Day
    const endLastDay = new Date(startToday);
    const startLastDay = new Date(endLastDay);
    startLastDay.setDate(startLastDay.getDate() - 1);
    if (period === PERIOD.Yesterday) {
      return { startDate: startLastDay, endDate: endLastDay };
    }
    // This Week
    const endThisWeek = new Date(now);
    const startThisWeek = new Date(today);
    startThisWeek.setDate(startThisWeek.getDate() - startThisWeek.getDay());
    if (period === PERIOD.This_week) {
      return { startDate: startThisWeek, endDate: endThisWeek };
    }
    // Last Week
    const endLastWeek = new Date(startThisWeek);
    const startLastWeek = new Date(endLastWeek);
    startLastWeek.setDate(startLastWeek.getDate() - 7);
    if (period === PERIOD.Last_week) {
      return { startDate: startLastWeek, endDate: endLastWeek };
    }
    // This Month
    const endThisMonth = new Date(now);
    const startThisMonth = new Date(
      endThisMonth.getFullYear(),
      endThisMonth.getMonth(),
      1,
    );
    if (period === PERIOD.This_month) {
      return { startDate: startThisMonth, endDate: endThisMonth };
    }
    // Last Month
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    if (period === PERIOD.Last_month) {
      return { startDate: startLastMonth, endDate: endLastMonth };
    }
    // Last 3 Months
    const endLast3Months = new Date(now);
    const startLast3Months = new Date(
      endLast3Months.getFullYear(),
      endLast3Months.getMonth() - 2,
    );
    if (period === PERIOD.Three_month) {
      return { startDate: startLast3Months, endDate: endLast3Months };
    }
    // Last 6 Months
    const endLast6Months = new Date(now);
    const startLast6Months = new Date(
      endLast6Months.getFullYear(),
      endLast6Months.getMonth() - 5,
    );
    if (period === PERIOD.Six_month) {
      return { startDate: startLast6Months, endDate: endLast6Months };
    }
    // Last Year
    const endLastYear = new Date(now);
    const startLastYear = new Date(
      endLastYear.getFullYear() - 1,
      endLastYear.getMonth(),
      now.getDate(),
    );
    return { startDate: startLastYear, endDate: endLastYear };
  }

  async getDoctorEarnings(
    doctorId: string,
    getDoctorEarningsArgs: GetDoctorEarningsArgs,
  ): Promise<GetDoctorEarningsOutput> {
    const { period, page, limit } = getDoctorEarningsArgs;
    const { startDate, endDate } = this.getStartAndEndDate(period);
    const { totalEarnings, patientsDetails, total } =
      await this.bookingsRepo.getDoctorEarnings(
        doctorId,
        startDate,
        endDate,
        page,
        limit,
      );
    const hasMore = total > page * limit;
    return {
      totalEarnings,
      patientsDetails,
      hasMore,
    };
  }

  async getDoctorBookingHistory(
    doctorId: string,
    args: GetDoctorBookingHistoryArgs,
  ): Promise<GetDoctorBookingHistoryOutput> {
    const { period, page, limit } = args;
    const { startDate, endDate } = this.getStartAndEndDate(period);
    const { bookingHistory, total } =
      await this.bookingsRepo.getDoctorBookingHistory(
        doctorId,
        page,
        limit,
        startDate,
        endDate,
      );
    const hasMore = total > page * limit;
    return {
      bookingHistory,
      hasMore,
    };
  }

  async getClinicEarnings(
    clinicId: string,
    getClinicEarningsArgs: GetClinicEarningsArgs,
  ): Promise<GetClinicEarningsOutput> {
    const { period, page, limit } = getClinicEarningsArgs;
    const { startDate, endDate } = this.getStartAndEndDate(period);
    const { totalEarnings, patientsDetailsClinic, total } =
      await this.bookingsRepo.getClinicEarnings(
        clinicId,
        startDate,
        endDate,
        page,
        limit,
      );
    const hasMore = total > page * limit;
    return {
      totalEarnings,
      patientsDetailsClinic,
      hasMore,
    };
  }
}
