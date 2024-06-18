import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GetMedicalCouncilsArgs,
  GetMedicalCouncilsOutput,
} from './dto/get-councils.dto';
import { MedicalCouncilsRepo } from './medical-councils.repo';
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
import { DeleteMedicalCouncilArgs } from './dto/delete-council.dto';
import {
  GetMedicalCouncilsListArgs,
  GetMedicalCouncilsListOutput,
} from './dto/get-councils-list.dto';

@Injectable()
export class MedicalCouncilsService {
  constructor(private readonly councilsRepo: MedicalCouncilsRepo) {}

  async getMedicalCouncils(
    args: GetMedicalCouncilsArgs,
  ): Promise<GetMedicalCouncilsOutput> {
    const councils = await this.councilsRepo.getCouncils(args.name);
    return {
      councils,
    };
  }

  async updateMedicalCouncil(
    args: UpdateMedicalCouncilArgs,
  ): Promise<UpdateMedicalCouncilOutput> {
    const { councilId, name } = args;
    const modifiedName = name.replace(/\s/g, '').toLowerCase();
    const council = await this.councilsRepo.getMedicalCouncilById(councilId);
    if (!council) {
      throw new NotFoundException(`Medical council not found`);
    }
    const existingCouncil = council.name.replace(/\s/g, '').toLowerCase();
    if (modifiedName !== existingCouncil) {
      const councilName = await this.councilsRepo.getCouncilByName(name);
      if (councilName) {
        throw new BadRequestException(
          `Medical council already exist with this name`,
        );
      }
    }
    const updatedcouncil = await this.councilsRepo.updateMedicalCouncil(
      councilId,
      name,
    );
    if (!updatedcouncil) {
      throw new BadRequestException(`Medical council not updated`);
    }
    return {
      council: updatedcouncil,
    };
  }

  async addMedicalCouncil(
    args: AddMedicalCouncilArgs,
  ): Promise<AddMedicalCouncilOutput> {
    const { name } = args;
    const council = await this.councilsRepo.getCouncilByName(name);
    if (council) {
      throw new BadRequestException(
        `Medical council already exist with this name`,
      );
    }
    const savedCouncil = await this.councilsRepo.addMedicalCouncil(args.name);
    return savedCouncil;
  }

  async getMedicalCouncil(
    args: GetMedicalCouncilArgs,
  ): Promise<GetMedicalCouncilOutput> {
    const council = await this.councilsRepo.getMedicalCouncilById(
      args.councilId,
    );
    if (!council) {
      throw new NotFoundException(`Medical council not found`);
    }
    return {
      council,
    };
  }

  async deleteMedicalCouncil(
    args: DeleteMedicalCouncilArgs,
  ): Promise<UpdateMedicalCouncilOutput> {
    const { councilId } = args;
    const council = await this.councilsRepo.getMedicalCouncilById(councilId);
    if (!council) {
      throw new NotFoundException(`Medical council not found`);
    }
    const updatedcouncil =
      await this.councilsRepo.deleteMedicalCouncil(councilId);
    if (!updatedcouncil) {
      throw new BadRequestException(`Medical council not deleted`);
    }
    return {
      council: updatedcouncil,
    };
  }

  async getMedicalCouncilsList(
    args: GetMedicalCouncilsListArgs,
  ): Promise<GetMedicalCouncilsListOutput> {
    const { name, page, limit } = args;
    const result = await this.councilsRepo.getCouncils(name);
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const councils = result.slice(offset, offset + limit);
    return {
      councils,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
