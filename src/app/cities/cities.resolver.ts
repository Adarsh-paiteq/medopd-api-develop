import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CitiesService } from './cities.service';
import { GetCitiesArgs, GetCitiesOutput } from './dto/get-cities.dto';
import { AddCityArgs, AddCityOutput } from './dto/add-city.dto';
import { GetCityArgs, GetCityOutput } from './dto/get-city.dto';
import { DeleteCityArgs, DeleteCityOutput } from './dto/delete-city.dto';
import { UpdateCityArgs, UpdateCityOutput } from './dto/update-city.dto';
import { UseGuards } from '@nestjs/common';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { RolesGuard } from '@core/guards/roles.guard';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import {
  GetCitesListArgs,
  GetCitiesListOutput,
} from './dto/get-cities-list.dto';

@Resolver()
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

  @Query(() => GetCitiesOutput, { name: 'getCities' })
  async getCities(@Args() args: GetCitiesArgs): Promise<GetCitiesOutput> {
    return await this.citiesService.getCities(args);
  }

  @Mutation(() => AddCityOutput, { name: 'addCity' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addCity(@Args() args: AddCityArgs): Promise<AddCityOutput> {
    return await this.citiesService.addCity(args);
  }

  @Query(() => GetCityOutput, { name: 'getCity' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCity(@Args() args: GetCityArgs): Promise<GetCityOutput> {
    return await this.citiesService.getCity(args);
  }

  @Mutation(() => DeleteCityOutput, { name: 'deleteCity' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCity(@Args() args: DeleteCityArgs): Promise<DeleteCityOutput> {
    return await this.citiesService.deleteCity(args);
  }

  @Mutation(() => UpdateCityOutput, { name: 'updateCity' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCity(@Args() args: UpdateCityArgs): Promise<UpdateCityOutput> {
    return await this.citiesService.updateCity(args);
  }

  @Query(() => GetCitiesListOutput, { name: 'getCitiesList' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCitiesList(
    @Args() args: GetCitesListArgs,
  ): Promise<GetCitiesListOutput> {
    return await this.citiesService.getCitiesList(args);
  }
}
