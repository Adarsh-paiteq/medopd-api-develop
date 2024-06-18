/* eslint-disable require-await */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalSpecialtiesService } from './medical-specialties.service';
import {
  GetMedicalSpecialtiesArgs,
  GetMedicalSpecialtiesOutput,
} from './dto/get-specialties.dto';
import {
  GetMedicalSpecialtyArgs,
  GetMedicalSpecialtyOutput,
} from './dto/get-specialty.dto';
import {
  UpdateMedicalSpecialtyArgs,
  UpdateMedicalSpecialtyOutput,
} from './dto/update-specialty.dto';
import {
  DeleteMedicalSpecialtyArgs,
  DeleteMedicalSpecialtyOutput,
} from './dto/delete-specialty.dto';
import {
  AddMedicalSpecialtyArgs,
  AddMedicalSpecialtyOutput,
} from './dto/add-specialty.dto';
import { Roles } from '@core/services/auth.service';
import { Role } from '@core/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import {
  GetMedicalSpecialtiesListArgs,
  GetMedicalSpecialtiesListOutput,
} from './dto/get-specialties-list.dto';

@Resolver()
export class MedicalSpecialtiesResolver {
  constructor(
    private readonly medicalSpecialtiesService: MedicalSpecialtiesService,
  ) {}

  @Query(() => GetMedicalSpecialtiesOutput, { name: 'getMedicalSpecialties' })
  async getMedicalSpecialties(
    @Args() args: GetMedicalSpecialtiesArgs,
  ): Promise<GetMedicalSpecialtiesOutput> {
    return await this.medicalSpecialtiesService.getMedicalSpeciaties(args);
  }

  @Query(() => GetMedicalSpecialtyOutput, { name: 'getMedicalSpecialty' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMedicalSpecialty(
    @Args() args: GetMedicalSpecialtyArgs,
  ): Promise<GetMedicalSpecialtyOutput> {
    return await this.medicalSpecialtiesService.getMedicalSpecialty(args);
  }

  @Mutation(() => UpdateMedicalSpecialtyOutput, {
    name: 'updateMedicalSpecialty',
  })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMedicalSpecialty(
    @Args() args: UpdateMedicalSpecialtyArgs,
  ): Promise<UpdateMedicalSpecialtyOutput> {
    return await this.medicalSpecialtiesService.updateMedicalSpecialty(args);
  }

  @Mutation(() => DeleteMedicalSpecialtyOutput, {
    name: 'deleteMedicalSpecialty',
  })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMedicalSpecialty(
    @Args() args: DeleteMedicalSpecialtyArgs,
  ): Promise<DeleteMedicalSpecialtyOutput> {
    return await this.medicalSpecialtiesService.deleteMedicalSpecialty(args);
  }
  @Mutation(() => AddMedicalSpecialtyOutput, {
    name: 'addMedicalSpecialty',
  })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addMedicalSpecialty(
    @Args() args: AddMedicalSpecialtyArgs,
  ): Promise<AddMedicalSpecialtyOutput> {
    return await this.medicalSpecialtiesService.addMedicalSpecialty(args);
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => GetMedicalSpecialtiesListOutput, {
    name: 'getMedicalSpecialtiesList',
  })
  async getMedicalSpecialtiesList(
    @Args() args: GetMedicalSpecialtiesListArgs,
  ): Promise<GetMedicalSpecialtiesListOutput> {
    return await this.medicalSpecialtiesService.getMedicalSpecialtiesList(args);
  }
}
