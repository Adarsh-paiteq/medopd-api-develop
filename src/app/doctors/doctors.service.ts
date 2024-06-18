import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DoctorsRepo } from './doctors.repo';
import {
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from '@clinics/dto/send-otp-login-register.dto';
import {
  DoctorOnboardingScreens,
  VerifyDoctorOTPArgs,
  VerifyDoctorOTPResponse,
} from './dto/verify-dto-otp.dto';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '@core/configs/env.config';
import { AuthService, Roles } from '@core/services/auth.service';
import {
  SetDoctorProfileInput,
  SetDoctorProfileResponse,
} from './dto/set-doctor-profile.dto';
import {
  DoctorRefreshTokenArgs,
  DoctorRefreshTokenResponse,
} from './dto/doctor-refresh-token.dto';
import {
  ResendDoctorOTPArgs,
  ResendDoctorOTPResponse,
} from './dto/resend-doctor-otp.dto';
import { CitiesRepo } from '@cities/cities.repo';
import {
  SetDoctorEducationInput,
  SetDoctorEducationResponse,
} from './dto/set-doctor-education.dto';
import { MedicalDegreesRepo } from '@medical-degrees/medical-degrees.repo';
import { MedicalCouncilsRepo } from '@medical-councils/medical-councils.repo';
import { DoctorSpecialtiesRepo } from '@doctor-specialties/doctor-specialties.repo';
import { DoctorSpecialty } from '@doctor-specialties/doctor-specialties.schema';
import { Doctor } from './dto/send-otp-login-register-doctor.dto';
import {
  SetDoctorSpecialtiesInput,
  SetDoctorSpecialtiesResponse,
} from './dto/set-doctor-specialties.dto';
import { MedicalSpecialtiesRepo } from '@medical-specialties/medical-specialties.repo';
import { GetDoctorsArgs, GetDoctorsOutput } from './dto/get-doctors.dto';
import { GetDoctorHomepageOutput } from './dto/get-doctor-homepage.dto';
import { BookingsRepo } from '@bookings/bookings.repo';
import { PaginationArgs } from '@utils/helpers';
import {
  GetDoctorsListArgs,
  GetDoctorsListOutput,
} from './dto/get-doctors-list.dto';
import {
  UpdateBookingChargesInput,
  UpdateBookingChargesResponse,
} from './dto/update-booking-charges.dto';
import {
  UpdateDoctorStatusArgs,
  UpdateDoctorStatusResponse,
} from './dto/update-doctor-status.dto';
import { SMSService } from '@core/services/sms.service';
import { LogoutDoctorResponse } from './dto/logout-doctor.dto';
import {
  UpdateDoctorProfilePicInput,
  UpdateDoctorProfilePicOutput,
} from './dto/update-doctor-profile-pic.dto';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorsRepo: DoctorsRepo,
    private readonly citiesRepo: CitiesRepo,
    private readonly medicalDegreesRepo: MedicalDegreesRepo,
    private readonly medicalCouncilsRepo: MedicalCouncilsRepo,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly doctorSpecialtiesRepo: DoctorSpecialtiesRepo,
    private readonly medicalSpecialtiesRepo: MedicalSpecialtiesRepo,
    private readonly bookingsRepo: BookingsRepo,
    private readonly smsService: SMSService,
  ) {}

  private async sendDoctorOTPToMobileNumber(
    args: SendOTPForLoginAndRegisterArgs,
  ): Promise<void> {
    const mobile = `${args.countryCode}${args.mobileNumber}`;
    const result = await this.smsService.sendOTP(mobile);
    if (result.type === 'error') {
      throw new BadRequestException(result.message);
    }
  }

  private async verifyDoctorMobileNumber(
    input: SendOTPForLoginAndRegisterArgs & { otp: string },
  ): Promise<void> {
    const mobile = `${input.countryCode}${input.mobileNumber}`;
    const result = await this.smsService.verifyOTP(input.otp, mobile);
    if (result.type === 'error') {
      throw new BadRequestException(`Invaild OTP`);
    }
  }

  checkTestUser(
    countryCode: string,
    mobileNumber: string,
    otp?: string,
  ): boolean {
    const testMobileNumber = this.configService.get(
      EnvironmentVariable.TEST_CLINIC_MOBILE_NUMBER,
    ) as string;
    const testOtp = this.configService.get(
      EnvironmentVariable.TEST_CLINIC_MOBILE_NUMBER_OTP,
    ) as string;
    if (otp) {
      return mobileNumber === testMobileNumber && otp === testOtp;
    }
    return mobileNumber === testMobileNumber;
  }

  async sendOTPForLoginAndRegisterDoctor(
    args: SendOTPForLoginAndRegisterArgs,
  ): Promise<SendOTPForLoginAndRegisterResponse> {
    const { mobileNumber, countryCode } = args;
    let doctor = await this.doctorsRepo.getDoctorByMoblieNumber(
      mobileNumber,
      countryCode,
    );
    if (!doctor) {
      doctor = await this.doctorsRepo.registerDoctor(mobileNumber, countryCode);
    }
    const isTestUser = this.checkTestUser(countryCode, mobileNumber);
    if (!isTestUser) {
      await this.sendDoctorOTPToMobileNumber(args);
    }
    return { id: doctor.id };
  }

  getDoctorOnboardingScreens(
    doctor: Doctor,
    doctorSpecialties: DoctorSpecialty[],
  ): DoctorOnboardingScreens {
    const {
      fullName,
      gender,
      imageFilePath,
      imageId,
      imageUrl,
      cityId,
      degreeId,
      registrationNumber,
      state,
      councilId,
      registrationYear,
    } = doctor;

    const isProfileSet =
      !!imageFilePath &&
      !!imageId &&
      !!imageUrl &&
      !!fullName &&
      !!gender &&
      !!cityId;
    const isEducationSet =
      !!degreeId &&
      !!registrationNumber &&
      !!registrationNumber &&
      !!state &&
      !!councilId &&
      !!registrationYear;
    const isSpecailtySet = !!doctorSpecialties.length;
    const screens = {
      isProfileSet,
      isSpecailtySet,
      isEducationSet,
    };
    return screens;
  }

  private async generateTestUserCredentials(
    doctor: Doctor,
  ): Promise<VerifyDoctorOTPResponse> {
    const tokens = await this.authService.getTokens({
      id: doctor.id,
      role: Roles.DOCTOR,
    });
    await this.doctorsRepo.updateDoctorById(doctor.id, {
      refreshToken: tokens.refreshToken,
    });
    const doctorSpecialties =
      await this.doctorSpecialtiesRepo.getSpecialtyByDoctorId(doctor.id);
    const onboardingScreens = this.getDoctorOnboardingScreens(
      doctor,
      doctorSpecialties,
    );
    return {
      ...tokens,
      onboardingScreens: onboardingScreens,
    };
  }

  async verfiyDoctorOTP(
    args: VerifyDoctorOTPArgs,
  ): Promise<VerifyDoctorOTPResponse> {
    const { id, otp } = args;
    const doctor = await this.doctorsRepo.getDoctorById(id);
    if (!doctor) {
      throw new NotFoundException(`doctor not found`);
    }
    const { countryCode, mobileNumber } = doctor;
    const isTestUser = this.checkTestUser(countryCode, mobileNumber, otp);
    if (isTestUser) {
      return this.generateTestUserCredentials(doctor);
    }
    await this.verifyDoctorMobileNumber({
      countryCode,
      mobileNumber,
      otp,
    });
    const doctorSpecialties =
      await this.doctorSpecialtiesRepo.getSpecialtyByDoctorId(doctor.id);
    const onboardingScreens = this.getDoctorOnboardingScreens(
      doctor,
      doctorSpecialties,
    );
    const tokens = await this.authService.getTokens({
      id: doctor.id,
      role: Roles.DOCTOR,
    });
    await this.doctorsRepo.updateDoctorById(doctor.id, {
      refreshToken: tokens.refreshToken,
    });
    return {
      ...tokens,
      onboardingScreens: onboardingScreens,
    };
  }

  async setDoctorProfile(
    input: SetDoctorProfileInput,
  ): Promise<SetDoctorProfileResponse> {
    const { id, ...updates } = input;
    const [city, doctor] = await Promise.all([
      this.citiesRepo.getCity(updates.cityId),
      this.doctorsRepo.getDoctorById(id),
    ]);
    if (!city) {
      throw new NotFoundException(`City not found`);
    }
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(id, updates);
    if (!updatedDoctor) {
      throw new BadRequestException(`Failed to update doctor profile`);
    }
    return updatedDoctor;
  }

  async doctorRefreshToken(
    args: DoctorRefreshTokenArgs,
  ): Promise<DoctorRefreshTokenResponse> {
    const { token } = args;
    const { data, error } = await this.authService.verifyRefreshToken(token);
    if (error) {
      throw new UnauthorizedException(`Token expired`);
    }
    const doctor = await this.doctorsRepo.getDoctorById(data.id);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const isInvalid = String(doctor.refreshToken) !== String(token);
    if (isInvalid) {
      throw new UnauthorizedException(`Invaild token`);
    }

    const tokens = await this.authService.getTokens({
      id: doctor.id,
      role: Roles.DOCTOR,
    });

    await this.doctorsRepo.updateDoctorById(doctor.id, {
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async resendDoctorOTP(
    args: ResendDoctorOTPArgs,
  ): Promise<ResendDoctorOTPResponse> {
    const { countryCode, mobileNumber } = args;
    const doctor = await this.doctorsRepo.getDoctorByMoblieNumber(
      mobileNumber,
      countryCode,
    );
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    await this.sendDoctorOTPToMobileNumber(args);
    return { id: doctor.id };
  }

  async updateIsOnboarded(doctorId: string): Promise<Doctor> {
    const doctor = await this.doctorsRepo.updateDoctorById(doctorId, {
      isOnboarded: true,
    });
    if (!doctor) {
      throw new BadRequestException(`Failed to update doctor onboarded status`);
    }
    return doctor;
  }

  async setDoctorEducation(
    input: SetDoctorEducationInput,
  ): Promise<SetDoctorEducationResponse> {
    const { id, ...updates } = input;
    const [doctor, degree, council] = await Promise.all([
      this.doctorsRepo.getDoctorById(id),
      this.medicalDegreesRepo.getDegree(updates.degreeId),
      this.medicalCouncilsRepo.getMedicalCouncilById(updates.councilId),
    ]);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    if (!degree) {
      throw new NotFoundException(`Degree not found`);
    }
    if (!council) {
      throw new NotFoundException(`Council not found`);
    }
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(id, updates);
    if (!updatedDoctor) {
      throw new BadRequestException(`Failed to update doctor education`);
    }
    await this.updateIsOnboarded(id);
    return updatedDoctor;
  }

  async setDoctorSpecialties(
    input: SetDoctorSpecialtiesInput,
  ): Promise<SetDoctorSpecialtiesResponse> {
    const { doctorId, specialtyIds } = input;
    // Retrieve the doctor from the database
    const doctor = await this.doctorsRepo.getDoctorById(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    // Check if all specialties exist
    const getSpecialtiesByIds = specialtyIds.map((specialtyId) =>
      this.medicalSpecialtiesRepo.getSpecialtyById(specialtyId),
    );
    const existingSpecialties = await Promise.all(getSpecialtiesByIds);
    const existingSpecialtyIds = existingSpecialties.map(
      (specialty) => specialty?.id,
    );
    const missingSpecialtyIds = specialtyIds.filter(
      (specialtyId) => !existingSpecialtyIds.includes(specialtyId),
    );
    if (missingSpecialtyIds.length > 0) {
      throw new NotFoundException(
        `Specialties not found with ids: ${missingSpecialtyIds.join(', ')}`,
      );
    }

    // Add doctor specialties in parallel
    const addSpecialtyPromises = specialtyIds.map((specialty) =>
      this.doctorSpecialtiesRepo.addDoctorSpecialties(doctorId, specialty),
    );
    const doctorSpecialties = await Promise.all(addSpecialtyPromises);
    return { doctorSpecialties };
  }

  async getDoctors(args: GetDoctorsArgs): Promise<GetDoctorsOutput> {
    const { search, page, limit } = args;
    const { doctors, total } = await this.doctorsRepo.getDoctors(
      page,
      limit,
      search,
    );
    const hasMore = page * limit < total;
    return {
      doctors,
      hasMore,
    };
  }

  async getDoctorHomepage(
    doctorId: string,
    args: PaginationArgs,
  ): Promise<GetDoctorHomepageOutput> {
    const { page, limit } = args;
    const [doctor, { bookings, todayEarning, total }] = await Promise.all([
      this.doctorsRepo.getDoctorById(doctorId),
      this.bookingsRepo.getBookingsDoctorHomepage(doctorId, page, limit),
    ]);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    const hasMore = page * limit < total;
    const homepageOutput: GetDoctorHomepageOutput = {
      id: doctor.id,
      name: doctor.fullName,
      imageFilePath: doctor.imageFilePath,
      imageId: doctor.imageId,
      imageUrl: doctor.imageUrl,
      mobileNumber: doctor.mobileNumber,
      todayEarning: todayEarning,
      isActive: doctor.isActive,
      newCases: bookings,
      hasMore,
    };
    return homepageOutput;
  }

  async getDoctorsList(
    args: GetDoctorsListArgs,
  ): Promise<GetDoctorsListOutput> {
    const { search, page, limit } = args;
    const { doctors, total } = await this.doctorsRepo.getDoctors(
      page,
      limit,
      search,
    );
    const totalPages = Math.ceil(total / limit);
    return {
      doctors,
      total,
      totalPages,
      page,
      limit,
    };
  }

  async updateBookingCharges(
    input: UpdateBookingChargesInput,
  ): Promise<UpdateBookingChargesResponse> {
    const { doctorId, ...updates } = input;
    const doctor = await this.doctorsRepo.getDoctorById(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(
      doctorId,
      updates,
    );
    if (!updatedDoctor) {
      throw new BadRequestException(`Failed to update doctor booking charges`);
    }
    return { message: 'Booking charges updated successfully' };
  }

  async updateDoctorStatus(
    doctorId: string,
    status: UpdateDoctorStatusArgs,
  ): Promise<UpdateDoctorStatusResponse> {
    const doctor = await this.doctorsRepo.getDoctorById(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    if (doctor.isActive === status.status) {
      throw new BadRequestException(
        `Doctor is already ${status.status ? 'active' : 'inactive'}`,
      );
    }
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(doctorId, {
      isActive: status.status,
    });
    if (!updatedDoctor) {
      throw new BadRequestException(`Failed to update doctor status`);
    }
    return {
      message: `Doctor is now ${status.status ? 'active' : 'inactive'}`,
    };
  }

  async logoutDoctor(id: string): Promise<LogoutDoctorResponse> {
    const doctor = await this.doctorsRepo.getDoctorById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor not found`);
    }
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(id, {
      refreshToken: '',
    });
    if (!updatedDoctor) {
      throw new BadRequestException(`Logout failed`);
    }
    return { message: 'Doctor logout successfully' };
  }

  async updateDoctorProfilePic(
    doctorId: string,
    input: UpdateDoctorProfilePicInput,
  ): Promise<UpdateDoctorProfilePicOutput> {
    const updatedDoctor = await this.doctorsRepo.updateDoctorById(
      doctorId,
      input,
    );
    if (!updatedDoctor) {
      throw new BadRequestException(`Failed to update doctor profile pic`);
    }
    return updatedDoctor;
  }
}
