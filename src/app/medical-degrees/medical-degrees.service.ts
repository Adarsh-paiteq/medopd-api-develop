import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MedicalDegreesRepo } from './medical-degrees.repo';
import {
  AddMedicalDegreeArgs,
  AddMedicalDegreeOutput,
} from './dto/add-degree.dto';
import {
  GetMedicalDegreeArgs,
  GetMedicalDegreeOutput,
} from './dto/get-degree.dto';
import {
  GetMedicalDegreesArgs,
  GetMedicalDegreesOutput,
} from './dto/get-degrees.dto';
import {
  UpdateMedicalDegreeArgs,
  UpdateMedicalDegreeOutput,
} from './dto/update-degree.dto';
import {
  DeleteMedicalDegreeArgs,
  DeleteMedicalDegreeOutput,
} from './dto/delete-degree.dto';
import {
  GetMedicalDegreesListArgs,
  GetMedicalDegreesListOutput,
} from './dto/get-degrees-list.dto';

@Injectable()
export class MedicalDegreesService {
  constructor(private readonly medicalDegreesRepo: MedicalDegreesRepo) {}

  async addMedicalDegree(
    args: AddMedicalDegreeArgs,
  ): Promise<AddMedicalDegreeOutput> {
    const { name } = args;
    const degree = await this.medicalDegreesRepo.getDegreeByName(name);
    if (degree) {
      throw new BadRequestException('Medical Degree already exit this name');
    }
    const savedDegree = await this.medicalDegreesRepo.addDegree(name);
    return {
      savedDegree,
    };
  }

  async getMedicalDegrees(
    args: GetMedicalDegreesArgs,
  ): Promise<GetMedicalDegreesOutput> {
    const degrees = await this.medicalDegreesRepo.getDegrees(args.name);
    return {
      degrees,
    };
  }

  async getMedicalDegree(
    args: GetMedicalDegreeArgs,
  ): Promise<GetMedicalDegreeOutput> {
    const { id } = args;
    const degree = await this.medicalDegreesRepo.getDegree(id);
    if (!degree) {
      throw new NotFoundException('Medical degree not found');
    }
    return {
      degree,
    };
  }

  async updateMedicalDegree(
    args: UpdateMedicalDegreeArgs,
  ): Promise<UpdateMedicalDegreeOutput> {
    const { id, name } = args;
    const modifiedName = name.replace(/ /g, '').toLowerCase();
    const degree = await this.medicalDegreesRepo.getDegree(id);
    if (!degree) {
      throw new NotFoundException('Medical Degree Not found');
    }
    const existingDegreeName = degree.name.replace(/ /g, '').toLowerCase();

    if (existingDegreeName !== modifiedName) {
      const degreeName = await this.medicalDegreesRepo.getDegreeByName(name);
      if (degreeName) {
        throw new BadRequestException(
          'Medical Degree already exist with this name',
        );
      }
    }
    const updatedDegree = await this.medicalDegreesRepo.updateDegree(id, name);
    if (!updatedDegree) {
      throw new BadRequestException('Medical Degree not updated');
    }
    return {
      updatedDegree,
    };
  }

  async deleteMedicalDegree(
    args: DeleteMedicalDegreeArgs,
  ): Promise<DeleteMedicalDegreeOutput> {
    const { id } = args;
    const degree = await this.medicalDegreesRepo.getDegree(id);
    if (!degree) {
      throw new NotFoundException('Medical degree not found');
    }
    const deletedDegree = await this.medicalDegreesRepo.deleteDegree(id);
    if (!deletedDegree) {
      throw new BadRequestException('Medical Degree not deleted');
    }
    return {
      deletedDegree,
    };
  }

  async getMedicalDegreesList(
    args: GetMedicalDegreesListArgs,
  ): Promise<GetMedicalDegreesListOutput> {
    const { name, page, limit } = args;
    const result = await this.medicalDegreesRepo.getDegrees(name);
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const degrees = result.slice(offset, offset + limit);
    return {
      degrees,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
