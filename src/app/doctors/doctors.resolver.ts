import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import {
  VerifyDoctorOTPArgs,
  VerifyDoctorOTPResponse,
} from './dto/verify-dto-otp.dto';
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
import {
  SetDoctorEducationInput,
  SetDoctorEducationResponse,
} from './dto/set-doctor-education.dto';
import {
  SendOTPForLoginAndRegisterDoctorArgs,
  SendOTPForLoginAndRegisterDoctorResponse,
} from './dto/send-otp-login-register-doctor.dto';
import {
  SetDoctorSpecialtiesInput,
  SetDoctorSpecialtiesResponse,
} from './dto/set-doctor-specialties.dto';
import { GetDoctorsArgs, GetDoctorsOutput } from './dto/get-doctors.dto';
import { UseGuards } from '@nestjs/common';
import { Role } from '@core/decorators/roles.decorator';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/services/auth.service';
import { GetDoctorHomepageOutput } from './dto/get-doctor-homepage.dto';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
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
import { LogoutDoctorResponse } from './dto/logout-doctor.dto';
import {
  UpdateDoctorProfilePicInput,
  UpdateDoctorProfilePicOutput,
} from './dto/update-doctor-profile-pic.dto';

@Resolver()
export class DoctorsResolver {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Mutation(() => SendOTPForLoginAndRegisterDoctorResponse, {
    name: 'sendOTPForLoginAndRegisterDoctor',
  })
  async sendOTPForLoginAndRegisterDoctor(
    @Args() args: SendOTPForLoginAndRegisterDoctorArgs,
  ): Promise<SendOTPForLoginAndRegisterDoctorResponse> {
    return await this.doctorsService.sendOTPForLoginAndRegisterDoctor(args);
  }

  @Mutation(() => VerifyDoctorOTPResponse, { name: 'verifyDoctorOTP' })
  async verifyDoctorOTP(
    @Args() args: VerifyDoctorOTPArgs,
  ): Promise<VerifyDoctorOTPResponse> {
    return await this.doctorsService.verfiyDoctorOTP(args);
  }
  @Mutation(() => SetDoctorProfileResponse, { name: 'setDoctorProfile' })
  async setDoctorProfile(
    @Args('input') input: SetDoctorProfileInput,
  ): Promise<SetDoctorProfileResponse> {
    return await this.doctorsService.setDoctorProfile(input);
  }

  @Mutation(() => DoctorRefreshTokenResponse, { name: 'doctorRefreshToken' })
  async doctorRefreshToken(
    @Args() args: DoctorRefreshTokenArgs,
  ): Promise<DoctorRefreshTokenResponse> {
    return await this.doctorsService.doctorRefreshToken(args);
  }

  @Mutation(() => ResendDoctorOTPResponse, { name: 'resendDoctorOTP' })
  async resendDoctorOTP(
    @Args() args: ResendDoctorOTPArgs,
  ): Promise<ResendDoctorOTPResponse> {
    return await this.doctorsService.resendDoctorOTP(args);
  }

  @Mutation(() => SetDoctorEducationResponse, { name: 'setDoctorEducation' })
  async setDoctorEducation(
    @Args('input') input: SetDoctorEducationInput,
  ): Promise<SetDoctorEducationResponse> {
    return await this.doctorsService.setDoctorEducation(input);
  }

  @Mutation(() => SetDoctorSpecialtiesResponse, {
    name: 'setDoctorSpecialties',
  })
  async setDoctorSpecialties(
    @Args('input') input: SetDoctorSpecialtiesInput,
  ): Promise<SetDoctorSpecialtiesResponse> {
    return await this.doctorsService.setDoctorSpecialties(input);
  }

  @Query(() => GetDoctorsOutput, { name: 'getDoctors' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctors(@Args() args: GetDoctorsArgs): Promise<GetDoctorsOutput> {
    return await this.doctorsService.getDoctors(args);
  }

  @Query(() => GetDoctorHomepageOutput, { name: 'getDoctorHomePage' })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctorHomePage(
    @GetUser() user: LoggedInUser,
    @Args() args: PaginationArgs,
  ): Promise<GetDoctorHomepageOutput> {
    return await this.doctorsService.getDoctorHomepage(user.id, args);
  }

  @Query(() => GetDoctorsListOutput, { name: 'getDoctorsList' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctorsList(
    @Args() args: GetDoctorsListArgs,
  ): Promise<GetDoctorsListOutput> {
    return await this.doctorsService.getDoctorsList(args);
  }

  @Mutation(() => UpdateBookingChargesResponse, {
    name: 'updateBookingCharges',
  })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateBookingCharges(
    @Args('input') input: UpdateBookingChargesInput,
  ): Promise<UpdateBookingChargesResponse> {
    return await this.doctorsService.updateBookingCharges(input);
  }

  @Mutation(() => UpdateDoctorStatusResponse, {
    name: 'updateDoctorStatus',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateDoctorStatus(
    @GetUser() user: LoggedInUser,
    @Args() args: UpdateDoctorStatusArgs,
  ): Promise<UpdateDoctorStatusResponse> {
    return await this.doctorsService.updateDoctorStatus(user.id, args);
  }

  @Mutation(() => LogoutDoctorResponse, { name: 'logoutDoctor' })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logoutDoctor(
    @GetUser() user: LoggedInUser,
  ): Promise<LogoutDoctorResponse> {
    return await this.doctorsService.logoutDoctor(user.id);
  }

  @Mutation(() => UpdateDoctorProfilePicOutput, {
    name: 'updateDoctorProfilePic',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateDoctorProfilePic(
    @GetUser() user: LoggedInUser,
    @Args('input') input: UpdateDoctorProfilePicInput,
  ): Promise<UpdateDoctorProfilePicOutput> {
    return await this.doctorsService.updateDoctorProfilePic(user.id, input);
  }
}
