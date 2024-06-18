import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrescriptionsService } from './prescriptions.service';
import {
  GetPrescriptionWithMedicinesArgs,
  GetPrescriptionWithMedicinesOutput,
} from './dto/get-prescription-with-medicines.dto';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { Role } from '@core/decorators/roles.decorator';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/services/auth.service';
import {
  GeneratePrescriptionArgs,
  GeneratePrescriptionResponse,
} from './dto/generate-prescription.dto';

@Resolver()
export class PrescriptionsResolver {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Query(() => GetPrescriptionWithMedicinesOutput, {
    name: 'getPrescriptionWithMedicines',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getPrescriptionWithMedicines(
    @GetUser() user: LoggedInUser,
    @Args() args: GetPrescriptionWithMedicinesArgs,
  ): Promise<GetPrescriptionWithMedicinesOutput> {
    return await this.prescriptionsService.getPrescriptionWithMedicines(
      user.id,
      args,
    );
  }

  @Mutation(() => GeneratePrescriptionResponse, {
    name: 'generatePrescription',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async generatePrescription(
    @GetUser() user: LoggedInUser,
    @Args() args: GeneratePrescriptionArgs,
  ): Promise<GeneratePrescriptionResponse> {
    return await this.prescriptionsService.generatePrescription(user.id, args);
  }
}
