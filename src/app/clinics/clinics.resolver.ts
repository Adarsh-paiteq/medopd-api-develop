import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { ClinicsService } from './clinics.service';

import {
  VerifyClinicOTPArgs,
  VerifyClinicOTPResponse,
} from './dto/verify-clinic-otp.dto';
import {
  SendOTPForLoginAndRegisterArgs,
  SendOTPForLoginAndRegisterResponse,
} from './dto/send-otp-login-register.dto';
import {
  ClinicRefreshTokenArgs,
  ClinicRefreshTokenResponse,
} from './dto/clinic-refresh-token.dto';
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
import {
  GetClinicDetailArgs,
  GetClinicDetailResponse,
} from './dto/get-clinic-detail.dto';
import {
  UpdateClinicStatusInput,
  UpdateClinicStatusResponse,
} from './dto/update-clinic-status.dto';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '@core/guards/roles.guard';
import { GetClinicHomepageOutput } from './dto/get-clinic-homepage.dto';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { GetUser } from '@core/decorators/user.decorator';
import {
  UpdateClinicWalletArgs,
  UpdateClinicWalletResponse,
} from './dto/update-clinic-wallet.dto';
import { LogoutClinicResponse } from './dto/logout-clinic.dto';
import {
  UpdateClinicProfilePicInput,
  UpdateClinicProfilePicOutput,
} from './dto/update-clinic-profile-pic.dto';

@Resolver()
export class ClinicsResolver {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Mutation(() => SendOTPForLoginAndRegisterResponse, {
    name: 'sendOTPForLoginAndRegister',
  })
  async sendOTPForLoginAndRegister(
    @Args() args: SendOTPForLoginAndRegisterArgs,
  ): Promise<SendOTPForLoginAndRegisterResponse> {
    return await this.clinicsService.sendOTPForLoginAndRegister(args);
  }

  @Mutation(() => VerifyClinicOTPResponse, {
    name: 'verifyClinicOTP',
  })
  async verifyClinicOTP(
    @Args() args: VerifyClinicOTPArgs,
  ): Promise<VerifyClinicOTPResponse> {
    return await this.clinicsService.verifyClinicOTP(args);
  }

  @Mutation(() => ClinicRefreshTokenResponse, { name: 'clinicRefreshToken' })
  async clinicRefreshToken(
    @Args() args: ClinicRefreshTokenArgs,
  ): Promise<ClinicRefreshTokenResponse> {
    return await this.clinicsService.clinicRefreshToken(args.token);
  }

  @Mutation(() => AddClinicInfoResponse, { name: 'addClinicInfo' })
  async addClinicInfo(
    @Args('input') input: AddClinicInfoInput,
  ): Promise<AddClinicInfoResponse> {
    return await this.clinicsService.addClinicInfo(input);
  }

  @Mutation(() => AddClinicLocationResponse, { name: 'addClinicLocation' })
  async addClinicLocation(
    @Args('input') input: AddClinicLocationInput,
  ): Promise<AddClinicLocationResponse> {
    return await this.clinicsService.addClinicLocation(input);
  }

  @Mutation(() => ResendClinicOTPResPonse, { name: 'resendClinicOTP' })
  async resendClinicOTP(
    @Args() args: ResendClinicOTPArgs,
  ): Promise<ResendClinicOTPResPonse> {
    return await this.clinicsService.resendClinicOTP(args);
  }

  @Query(() => GetClinicsOutput, { name: 'getClinics' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClinics(@Args() args: PaginationArgs): Promise<GetClinicsOutput> {
    return await this.clinicsService.getClinics(args);
  }

  @Query(() => GetClinicDetailResponse, { name: 'getClinicDetail' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClinicDetail(
    @Args() args: GetClinicDetailArgs,
  ): Promise<GetClinicDetailResponse> {
    return await this.clinicsService.getClinicDetail(args.id);
  }

  @Mutation(() => UpdateClinicStatusResponse, { name: 'updateClinicStatus' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateClinicStatus(
    @Args() args: UpdateClinicStatusInput,
  ): Promise<UpdateClinicStatusResponse> {
    return await this.clinicsService.updateClinicStatus(args);
  }

  @Query(() => GetClinicHomepageOutput, { name: 'getClinicHomepage' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClinicHomepage(
    @GetUser() user: LoggedInUser,
  ): Promise<GetClinicHomepageOutput> {
    return await this.clinicsService.getClinicHomepage(user.id);
  }

  @Mutation(() => UpdateClinicWalletResponse, { name: 'updateClinicWallet' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateClinicWallet(
    @Args() args: UpdateClinicWalletArgs,
  ): Promise<UpdateClinicWalletResponse> {
    return await this.clinicsService.updateClinicWallet(args);
  }

  @Mutation(() => LogoutClinicResponse, { name: 'logoutClinic' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logoutClinic(
    @GetUser() user: LoggedInUser,
  ): Promise<LogoutClinicResponse> {
    return await this.clinicsService.logoutClinic(user.id);
  }

  @Mutation(() => UpdateClinicProfilePicOutput, {
    name: 'updateClinicProfilePic',
  })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateClinicProfilePic(
    @GetUser() user: LoggedInUser,
    @Args('input') input: UpdateClinicProfilePicInput,
  ): Promise<UpdateClinicProfilePicOutput> {
    return await this.clinicsService.updateClinicProfilePic(user.id, input);
  }
}
