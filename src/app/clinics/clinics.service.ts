import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClinicsRepo } from './clinics.repo';
import {
  Clinic,
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from './dto/send-otp-login-register.dto';
import {
  ClinicOnboardingScreens,
  VerifyClinicOTPArgs,
  VerifyClinicOTPResponse,
} from './dto/verify-clinic-otp.dto';
import { AuthService, Roles } from '@core/services/auth.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '@core/configs/env.config';
import { ClinicRefreshTokenResponse } from './dto/clinic-refresh-token.dto';
import {
  AddClinicInfoInput,
  AddClinicInfoResponse,
} from './dto/add-clinic-info.dto';
import {
  AddClinicLocationInput,
  AddClinicLocationResponse,
} from './dto/add-clinic-location.dto';
import {
  ResendClinicOTPArgs,
  ResendClinicOTPResPonse,
} from './dto/resend-clinic-otp.dto';
import { GetClinicsOutput } from './dto/get-clinics.dto';
import { PaginationArgs } from '@utils/helpers';
import { GetClinicDetailResponse } from './dto/get-clinic-detail.dto';
import {
  UpdateClinicStatusInput,
  UpdateClinicStatusResponse,
} from './dto/update-clinic-status.dto';
import { CitiesRepo } from '@cities/cities.repo';
import { BannersRepo } from '@banners/banners.repo';
import { DoctorsRepo } from '@doctors/doctors.repo';
import { GetClinicHomepageOutput } from './dto/get-clinic-homepage.dto';
import { SMSService } from '@core/services/sms.service';
import {
  UpdateClinicWalletArgs,
  UpdateClinicWalletResponse,
} from './dto/update-clinic-wallet.dto';
import { LogoutClinicResponse } from './dto/logout-clinic.dto';
import {
  UpdateClinicProfilePicInput,
  UpdateClinicProfilePicOutput,
} from './dto/update-clinic-profile-pic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    private readonly clinicsRepo: ClinicsRepo,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly citiesRepo: CitiesRepo,
    private readonly bannersRepo: BannersRepo,
    private readonly doctorsRepo: DoctorsRepo,
    private readonly smsService: SMSService,
  ) {}

  private async sendClinicOTPToMobileNumber(
    args: SendOTPForLoginAndRegisterArgs,
  ): Promise<void> {
    const mobile = `${args.countryCode}${args.mobileNumber}`;
    const result = await this.smsService.sendOTP(mobile);
    if (result.type === 'error') {
      throw new BadRequestException(result.message);
    }
  }

  private async verifyClinicMobileNumber(
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

  async sendOTPForLoginAndRegister(
    args: SendOTPForLoginAndRegisterArgs,
  ): Promise<SendOTPForLoginAndRegisterResponse> {
    const { mobileNumber, countryCode } = args;
    let clinic = await this.clinicsRepo.getClinicByMobileNumber(
      mobileNumber,
      countryCode,
    );
    if (!clinic) {
      clinic = await this.clinicsRepo.registerClinic(mobileNumber, countryCode);
    }
    const isTestUser = this.checkTestUser(countryCode, mobileNumber);
    if (!isTestUser) {
      await this.sendClinicOTPToMobileNumber(args);
    }
    return { id: clinic.id };
  }

  getClinicnboardingScreens(clinic: Clinic): ClinicOnboardingScreens {
    const { fullName, clinicName, cityId, email, address, status } = clinic;

    const isLocationSet = !!address;
    const isClinicDetailsSet =
      !!fullName && !!clinicName && !!cityId && !!email;
    const isClinicStatus = status;

    const screens: ClinicOnboardingScreens = {
      isLocationSet,
      isClinicDetailsSet,
      isClinicStatus,
    };
    return screens;
  }

  private async generateTestUserCredentials(
    clinic: Clinic,
  ): Promise<VerifyClinicOTPResponse> {
    const tokens = await this.authService.getTokens({
      id: clinic.id,
      role: Roles.CLINIC,
    });
    await this.clinicsRepo.updateClinicById(clinic.id, {
      refreshToken: tokens.refreshToken,
      isMobileVerified: true,
    });
    const onboardingScreens = this.getClinicnboardingScreens(clinic);
    return {
      ...tokens,
      onboardingScreens: onboardingScreens,
    };
  }

  async verifyClinicOTP(
    args: VerifyClinicOTPArgs,
  ): Promise<VerifyClinicOTPResponse> {
    const { id, otp } = args;
    const clinic = await this.clinicsRepo.getClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    const { countryCode, mobileNumber } = clinic;
    const isTestUser = this.checkTestUser(countryCode, mobileNumber, otp);
    if (isTestUser) {
      return this.generateTestUserCredentials(clinic);
    }
    await this.verifyClinicMobileNumber({ countryCode, mobileNumber, otp });
    const onboardingScreens = this.getClinicnboardingScreens(clinic);
    const tokens = await this.authService.getTokens({
      id: clinic.id,
      role: Roles.CLINIC,
    });
    await this.clinicsRepo.updateClinicById(clinic.id, {
      refreshToken: tokens.refreshToken,
      isMobileVerified: true,
    });
    return {
      ...tokens,
      onboardingScreens: onboardingScreens,
    };
  }

  async clinicRefreshToken(token: string): Promise<ClinicRefreshTokenResponse> {
    const { data, error } = await this.authService.verifyRefreshToken(token);
    if (error) {
      throw new UnauthorizedException(`Token expired`);
    }
    const clinic = await this.clinicsRepo.getClinicById(data.id);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    const isValid = String(clinic.refreshToken) !== String(token);
    if (isValid) {
      throw new UnauthorizedException(`Invalid token`);
    }
    const tokens = await this.authService.getTokens({
      id: clinic.id,
      role: Roles.CLINIC,
    });
    await this.clinicsRepo.updateClinicById(clinic.id, {
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async addClinicInfo(
    input: AddClinicInfoInput,
  ): Promise<AddClinicInfoResponse> {
    const { id, ...updates } = input;
    const [clinic, clinicName, clinicEmail, city] = await Promise.all([
      this.clinicsRepo.getClinicById(id),
      this.clinicsRepo.getClinicByName(input.clinicName),
      this.clinicsRepo.getClinicByEmail(input.email),
      this.citiesRepo.getCity(input.cityId),
    ]);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    if (clinicName) {
      throw new BadRequestException(`Clinic already exist with this name`);
    }
    if (clinicEmail) {
      throw new BadRequestException(`Email already exist`);
    }
    if (!city) {
      throw new BadRequestException(`City not found`);
    }
    await this.clinicsRepo.updateClinicById(id, updates);
    return {
      message: 'Clinic Info Added Successfully',
    };
  }

  async addClinicLocation(
    input: AddClinicLocationInput,
  ): Promise<AddClinicLocationResponse> {
    const { id, ...updates } = input;
    const clinic = await this.clinicsRepo.getClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    await this.clinicsRepo.updateClinicById(id, updates);
    return {
      message: 'Clinic Location Added Successfully',
    };
  }

  async resendClinicOTP(
    args: ResendClinicOTPArgs,
  ): Promise<ResendClinicOTPResPonse> {
    const { mobileNumber, countryCode } = args;
    const clinic = await this.clinicsRepo.getClinicByMobileNumber(
      mobileNumber,
      countryCode,
    );
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    await this.sendClinicOTPToMobileNumber(args);
    return { id: clinic.id };
  }

  async getClinics(args: PaginationArgs): Promise<GetClinicsOutput> {
    const { page, limit } = args;
    const { clinics, total } = await this.clinicsRepo.getClinics(page, limit);
    const totalPages = Math.ceil(total / limit);
    return { clinics, total, totalPages, page, limit };
  }

  async getClinicDetail(id: string): Promise<GetClinicDetailResponse> {
    const clinic = await this.clinicsRepo.getClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    return { clinic };
  }

  async updateClinicStatus(
    args: UpdateClinicStatusInput,
  ): Promise<UpdateClinicStatusResponse> {
    const { id, status } = args;
    const clinic = await this.clinicsRepo.getClinicById(id);
    if (!clinic) {
      throw new NotFoundException('clinic not found');
    }
    await this.clinicsRepo.updateClinicById(id, { status });
    return {
      message: 'clinic status updated',
    };
  }

  async getClinicHomepage(clinicId: string): Promise<GetClinicHomepageOutput> {
    const [clinic, banners, doctors] = await Promise.all([
      this.clinicsRepo.getClinicById(clinicId),
      this.bannersRepo.getBanners(1, 6),
      this.doctorsRepo.getDoctorsWithDetails(1, 10),
    ]);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    return {
      clinicId: clinic.id,
      clinicName: clinic.clinicName,
      clinicOwnerName: clinic.fullName,
      clinicImageFilePath: clinic.imageFilePath,
      clinicImageId: clinic.imageId,
      clinicImageUrl: clinic.imageUrl,
      banners: banners,
      doctors: doctors,
    };
  }

  async updateClinicWallet(
    args: UpdateClinicWalletArgs,
  ): Promise<UpdateClinicWalletResponse> {
    const { clinicId, amount } = args;
    const clinic = await this.clinicsRepo.getClinicById(clinicId);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    const updatedClinic = await this.clinicsRepo.updateClinicWalletById(
      clinicId,
      amount,
    );
    if (!updatedClinic) {
      throw new BadRequestException(`Failed to update wallet balance`);
    }
    return { message: 'Wallet balance updated successfully' };
  }

  async logoutClinic(id: string): Promise<LogoutClinicResponse> {
    const clinic = await this.clinicsRepo.getClinicById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic not found`);
    }
    const updatedClinic = await this.clinicsRepo.updateClinicById(id, {
      refreshToken: '',
    });
    if (!updatedClinic) {
      throw new BadRequestException(`Logout failed`);
    }
    return { message: 'Clinic logout successfully' };
  }

  async updateClinicProfilePic(
    clinicId: string,
    input: UpdateClinicProfilePicInput,
  ): Promise<UpdateClinicProfilePicOutput> {
    const updatedClinic = await this.clinicsRepo.updateClinicById(
      clinicId,
      input,
    );
    if (!updatedClinic) {
      throw new BadRequestException(`Failed to update Clinic profile picture`);
    }
    return updatedClinic;
  }
}
