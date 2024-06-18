import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PatientsService } from './patients.service';
import { AddPatientInput, AddPatientResponse } from './dto/add-patient.dto';
import { Role } from '@core/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import { Roles } from '@core/services/auth.service';

@Resolver()
export class PatientsResolver {
  constructor(private readonly patientsService: PatientsService) {}

  @Mutation(() => AddPatientResponse, { name: 'addPatient' })
  @Role(Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addPatient(
    @Args('input') input: AddPatientInput,
  ): Promise<AddPatientResponse> {
    return await this.patientsService.addPatient(input);
  }
}
