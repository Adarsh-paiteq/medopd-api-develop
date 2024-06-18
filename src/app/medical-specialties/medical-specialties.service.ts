import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MedicalSpecialtiesRepo } from './medical-specialties.repo';
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
import {
  GetMedicalSpecialtiesListArgs,
  GetMedicalSpecialtiesListOutput,
} from './dto/get-specialties-list.dto';

@Injectable()
export class MedicalSpecialtiesService {
  constructor(
    private readonly medicalSpecialtiesRepo: MedicalSpecialtiesRepo,
  ) {}

  async getMedicalSpeciaties(
    args: GetMedicalSpecialtiesArgs,
  ): Promise<GetMedicalSpecialtiesOutput> {
    const specialties = await this.medicalSpecialtiesRepo.getSpecialties(
      args.name,
    );
    return {
      specialties,
    };
  }

  async getMedicalSpecialty(
    args: GetMedicalSpecialtyArgs,
  ): Promise<GetMedicalSpecialtyOutput> {
    const { id } = args;
    const specialty = await this.medicalSpecialtiesRepo.getSpecialtyById(id);
    if (!specialty) {
      throw new NotFoundException('Medical specialty not found');
    }
    return {
      specialty,
    };
  }

  async updateMedicalSpecialty(
    args: UpdateMedicalSpecialtyArgs,
  ): Promise<UpdateMedicalSpecialtyOutput> {
    const { id, name } = args;
    const modifiedName = name.replace(/ /g, '').toLowerCase();
    const specialty = await this.medicalSpecialtiesRepo.getSpecialtyById(id);
    if (!specialty) {
      throw new NotFoundException('Medical specialty not found');
    }
    const existingSpecialty = specialty.name.replace(/ /g, '').toLowerCase();
    if (existingSpecialty !== modifiedName) {
      const specialtyName =
        await this.medicalSpecialtiesRepo.getSpecailtyByName(name);
      if (specialtyName) {
        throw new BadRequestException('Medical Specialty already exist');
      }
    }
    const updatedSpecialty = await this.medicalSpecialtiesRepo.updateSpecialty(
      id,
      name,
    );
    if (!updatedSpecialty) {
      throw new BadRequestException('Medical Specialty not updated');
    }
    return {
      updatedSpecialty,
    };
  }

  async deleteMedicalSpecialty(
    args: DeleteMedicalSpecialtyArgs,
  ): Promise<DeleteMedicalSpecialtyOutput> {
    const { id } = args;
    const specialty = await this.medicalSpecialtiesRepo.getSpecialtyById(id);
    if (!specialty) {
      throw new NotFoundException('Medical specialty not found');
    }
    const deletedSpecialty =
      await this.medicalSpecialtiesRepo.deleteSpecialty(id);
    return {
      deletedSpecialty,
    };
  }

  async addMedicalSpecialty(
    args: AddMedicalSpecialtyArgs,
  ): Promise<AddMedicalSpecialtyOutput> {
    const { name } = args;
    const specialty =
      await this.medicalSpecialtiesRepo.getSpecailtyByName(name);

    if (specialty) {
      throw new BadRequestException('Medical specialty alread exist');
    }
    const savedSpecialty = await this.medicalSpecialtiesRepo.addSpecialty(name);
    return {
      savedSpecialty,
    };
  }

  async getMedicalSpecialtiesList(
    args: GetMedicalSpecialtiesListArgs,
  ): Promise<GetMedicalSpecialtiesListOutput> {
    const { name, page, limit } = args;
    const result = await this.medicalSpecialtiesRepo.getSpecialties(name);
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const specialties = result.slice(offset, offset + limit);
    return {
      specialties,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
