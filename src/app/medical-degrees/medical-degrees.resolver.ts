/* eslint-disable require-await */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalDegreesService } from './medical-degrees.service';
import {
  AddMedicalDegreeArgs,
  AddMedicalDegreeOutput,
} from './dto/add-degree.dto';
import {
  GetMedicalDegreesArgs,
  GetMedicalDegreesOutput,
} from './dto/get-degrees.dto';
import {
  GetMedicalDegreeArgs,
  GetMedicalDegreeOutput,
} from './dto/get-degree.dto';
import {
  DeleteMedicalDegreeArgs,
  DeleteMedicalDegreeOutput,
} from './dto/delete-degree.dto';

import {
  UpdateMedicalDegreeArgs,
  UpdateMedicalDegreeOutput,
} from './dto/update-degree.dto';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import {
  GetMedicalDegreesListArgs,
  GetMedicalDegreesListOutput,
} from './dto/get-degrees-list.dto';

@Resolver()
export class MedicalDegreesResolver {
  constructor(private readonly medicalDegreesService: MedicalDegreesService) {}

  @Mutation(() => AddMedicalDegreeOutput, { name: 'addMedicalDegree' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addMedicalDegree(
    @Args() args: AddMedicalDegreeArgs,
  ): Promise<AddMedicalDegreeOutput> {
    return this.medicalDegreesService.addMedicalDegree(args);
  }

  @Mutation(() => DeleteMedicalDegreeOutput, { name: 'deleteMedicalDegree' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMedicalDegree(
    @Args() args: DeleteMedicalDegreeArgs,
  ): Promise<DeleteMedicalDegreeOutput> {
    return this.medicalDegreesService.deleteMedicalDegree(args);
  }

  @Mutation(() => UpdateMedicalDegreeOutput, { name: 'updateMedicalDegree' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMedicalDegree(
    @Args() args: UpdateMedicalDegreeArgs,
  ): Promise<UpdateMedicalDegreeOutput> {
    return this.medicalDegreesService.updateMedicalDegree(args);
  }

  @Query(() => GetMedicalDegreesOutput, { name: 'getMedicalDegrees' })
  async getMedicalDegrees(
    @Args() args: GetMedicalDegreesArgs,
  ): Promise<GetMedicalDegreesOutput> {
    return await this.medicalDegreesService.getMedicalDegrees(args);
  }

  @Query(() => GetMedicalDegreeOutput, { name: 'getMedicalDegree' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMedicalDegree(
    @Args() args: GetMedicalDegreeArgs,
  ): Promise<GetMedicalDegreeOutput> {
    return this.medicalDegreesService.getMedicalDegree(args);
  }

  @Query(() => GetMedicalDegreesListOutput, { name: 'getMedicalDegreesList' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMedicalDegreesList(
    @Args() args: GetMedicalDegreesListArgs,
  ): Promise<GetMedicalDegreesListOutput> {
    return await this.medicalDegreesService.getMedicalDegreesList(args);
  }
}
