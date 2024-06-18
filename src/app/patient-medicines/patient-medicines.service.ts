import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PatientMedicinesRepo } from './patient-medicines.repo';
import {
  AddPatientMedicineInput,
  AddPatientMedicineOutput,
} from './dto/add-patient-medicine.dto';
import { PrescriptionsRepo } from '@prescriptions/prescriptions.repo';
import {
  UpdatePatientMedicineInput,
  UpdatePatientMedicineResponse,
} from './dto/update-patient-medicine.dto';
import { DeletePatientMedicineArgs } from './dto/delete-patient-medicine.dto';
import { MedicinesRepo } from '@medicines/medicines.repo';

@Injectable()
export class PatientMedicinesService {
  constructor(
    private readonly patientMedicinesRepo: PatientMedicinesRepo,
    private readonly prescriptionRepo: PrescriptionsRepo,
    private readonly medicinesRepo: MedicinesRepo,
  ) {}

  async addPatientMedicine(
    doctorId: string,
    input: AddPatientMedicineInput,
  ): Promise<AddPatientMedicineOutput> {
    const { prescriptionId, name } = input;
    const prescription =
      await this.prescriptionRepo.getPrescriptionById(prescriptionId);

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    const medicine = await this.medicinesRepo.getMedicineByName(name);
    if (!medicine) {
      await this.medicinesRepo.addMedicine(name, doctorId);
    }
    const { bookingId } = prescription;
    const patientMedicine = await this.patientMedicinesRepo.addPatientMedicine(
      doctorId,
      bookingId,
      input,
    );
    return patientMedicine;
  }

  async updatePatientMedicine(
    input: UpdatePatientMedicineInput,
  ): Promise<UpdatePatientMedicineResponse> {
    const { id } = input;
    const patientMedicine =
      await this.patientMedicinesRepo.getPatientMedicineById(id);
    if (!patientMedicine) {
      throw new NotFoundException('Patient Medicine not found');
    }

    const updatePatientMedicine =
      await this.patientMedicinesRepo.updatePatientMedicine(input);
    if (!updatePatientMedicine) {
      throw new BadRequestException('Patient Medicine not updated');
    }
    return { message: 'Patient Medicine updated successfully' };
  }

  async deletePatientMedicine(
    args: DeletePatientMedicineArgs,
  ): Promise<UpdatePatientMedicineResponse> {
    const { id } = args;
    const patientMedicine =
      await this.patientMedicinesRepo.getPatientMedicineById(id);
    if (!patientMedicine) {
      throw new NotFoundException('Patient Medicine not found');
    }

    const deletePatientMedicine =
      await this.patientMedicinesRepo.deletePatientMedicine(id);
    if (!deletePatientMedicine) {
      throw new BadRequestException('Patient Medicine not deleted');
    }
    return { message: 'Patient Medicine deleted successfully' };
  }
}
