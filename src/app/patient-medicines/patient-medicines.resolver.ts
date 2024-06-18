import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PatientMedicinesService } from './patient-medicines.service';
import {
  AddPatientMedicineInput,
  AddPatientMedicineOutput,
} from './dto/add-patient-medicine.dto';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import {
  UpdatePatientMedicineInput,
  UpdatePatientMedicineResponse,
} from './dto/update-patient-medicine.dto';
import {
  DeletePatientMedicineArgs,
  DeletePatientMedicineResponse,
} from './dto/delete-patient-medicine.dto';

@Resolver()
export class PatientMedicinesResolver {
  constructor(
    private readonly patientMedicinesService: PatientMedicinesService,
  ) {}

  @Mutation(() => AddPatientMedicineOutput, {
    name: 'addPatientMedicine',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addPatientMedicine(
    @GetUser() user: LoggedInUser,
    @Args('input') input: AddPatientMedicineInput,
  ): Promise<AddPatientMedicineOutput> {
    return await this.patientMedicinesService.addPatientMedicine(
      user.id,
      input,
    );
  }

  @Mutation(() => UpdatePatientMedicineResponse, {
    name: 'updatePatientMedicine',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePatientMedicine(
    @Args('input') input: UpdatePatientMedicineInput,
  ): Promise<UpdatePatientMedicineResponse> {
    return await this.patientMedicinesService.updatePatientMedicine(input);
  }

  @Mutation(() => DeletePatientMedicineResponse, {
    name: 'deletePatientMedicine',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletePatientMedicine(
    @Args() args: DeletePatientMedicineArgs,
  ): Promise<DeletePatientMedicineResponse> {
    return await this.patientMedicinesService.deletePatientMedicine(args);
  }
}
