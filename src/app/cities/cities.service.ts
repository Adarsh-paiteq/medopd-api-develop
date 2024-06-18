import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CitiesRepo } from './cities.repo';
import { GetCitiesArgs, GetCitiesOutput } from './dto/get-cities.dto';
import { AddCityArgs, AddCityOutput } from './dto/add-city.dto';
import { GetCityArgs, GetCityOutput } from './dto/get-city.dto';
import { DeleteCityArgs, DeleteCityOutput } from './dto/delete-city.dto';
import { UpdateCityArgs, UpdateCityOutput } from './dto/update-city.dto';
import {
  GetCitesListArgs,
  GetCitiesListOutput,
} from './dto/get-cities-list.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly citiesRepo: CitiesRepo) {}

  async getCities(args: GetCitiesArgs): Promise<GetCitiesOutput> {
    const { name } = args;
    const cities = await this.citiesRepo.getCities(name);
    return {
      cities,
    };
  }

  async addCity(args: AddCityArgs): Promise<AddCityOutput> {
    const { name } = args;
    const city = await this.citiesRepo.getCityByName(name);
    if (city) {
      throw new BadRequestException('City alread exist');
    }
    const savedCity = await this.citiesRepo.addCity(name);
    return {
      savedCity,
    };
  }

  async getCity(args: GetCityArgs): Promise<GetCityOutput> {
    const { id } = args;
    const city = await this.citiesRepo.getCity(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return {
      city,
    };
  }

  async deleteCity(args: DeleteCityArgs): Promise<DeleteCityOutput> {
    const { id } = args;
    const city = await this.citiesRepo.getCity(id);
    if (!city) {
      throw new NotFoundException('City not found');
    }
    const deletedCity = await this.citiesRepo.deleteCity(id);
    if (!deletedCity) {
      throw new BadRequestException('City not deleted');
    }
    return {
      deletedCity,
    };
  }

  async updateCity(args: UpdateCityArgs): Promise<UpdateCityOutput> {
    const { id, name } = args;
    const modifiedName = name.replace(/ /g, '').toLowerCase();
    const city = await this.citiesRepo.getCity(id);
    if (!city) {
      throw new NotFoundException('City Not Found');
    }
    const existingName = city.name.replace(/ /g, '').toLowerCase();
    if (existingName !== modifiedName) {
      const cityByName = await this.citiesRepo.getCityByName(name);
      if (cityByName) {
        throw new BadRequestException('City already exist');
      }
    }
    const updatedCity = await this.citiesRepo.updateCity(id, name);
    if (!updatedCity) {
      throw new BadRequestException('City not updated');
    }
    return {
      updatedCity,
    };
  }

  async getCitiesList(args: GetCitesListArgs): Promise<GetCitiesListOutput> {
    const { name, page, limit } = args;
    const result = await this.citiesRepo.getCities(name);
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const cities = result.slice(offset, offset + limit);
    return {
      cities,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
