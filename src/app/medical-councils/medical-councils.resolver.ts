import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MedicalCouncilsService } from './medical-councils.service';
import {
  GetMedicalCouncilsArgs,
  GetMedicalCouncilsOutput,
} from './dto/get-councils.dto';
import {
  UpdateMedicalCouncilArgs,
  UpdateMedicalCouncilOutput,
} from './dto/update-council.dto';
import {
  AddMedicalCouncilOutput,
  AddMedicalCouncilArgs,
} from './dto/add-councils.dto';
import {
  GetMedicalCouncilArgs,
  GetMedicalCouncilOutput,
} from './dto/get-council.dto';
import {
  DeleteMedicalCouncilArgs,
  DeleteMedicalCouncilOutput,
} from './dto/delete-council.dto';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { RolesGuard } from '@core/guards/roles.guard';
import {
  GetMedicalCouncilsListArgs,
  GetMedicalCouncilsListOutput,
} from './dto/get-councils-list.dto';

@Resolver()
export class MedicalCouncilsResolver {
  constructor(
    private readonly medicalCouncilsService: MedicalCouncilsService,
  ) {}

  @Query(() => GetMedicalCouncilsOutput, { name: 'getMedicalCouncils' })
  async getMedicalCouncils(
    @Args() args: GetMedicalCouncilsArgs,
  ): Promise<GetMedicalCouncilsOutput> {
    return await this.medicalCouncilsService.getMedicalCouncils(args);
  }

  @Mutation(() => UpdateMedicalCouncilOutput, { name: 'updateMedicalCouncil' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateMedicalCouncil(
    @Args() args: UpdateMedicalCouncilArgs,
  ): Promise<UpdateMedicalCouncilOutput> {
    return await this.medicalCouncilsService.updateMedicalCouncil(args);
  }

  @Mutation(() => AddMedicalCouncilOutput, { name: 'addMedicalCouncil' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addMedicalCouncil(
    @Args() args: AddMedicalCouncilArgs,
  ): Promise<AddMedicalCouncilOutput> {
    return await this.medicalCouncilsService.addMedicalCouncil(args);
  }

  @Query(() => GetMedicalCouncilOutput, { name: 'getMedicalCouncil' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getMedicalCouncil(
    @Args() args: GetMedicalCouncilArgs,
  ): Promise<GetMedicalCouncilOutput> {
    return await this.medicalCouncilsService.getMedicalCouncil(args);
  }

  @Mutation(() => DeleteMedicalCouncilOutput, { name: 'deleteMedicalCouncil' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteMedicalCouncil(
    @Args() args: DeleteMedicalCouncilArgs,
  ): Promise<DeleteMedicalCouncilOutput> {
    return await this.medicalCouncilsService.deleteMedicalCouncil(args);
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => GetMedicalCouncilsListOutput, { name: 'getMedicalCouncilsList' })
  async getMedicalCouncilsList(
    @Args() args: GetMedicalCouncilsListArgs,
  ): Promise<GetMedicalCouncilsListOutput> {
    return await this.medicalCouncilsService.getMedicalCouncilsList(args);
  }
}
