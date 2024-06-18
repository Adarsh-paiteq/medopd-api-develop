import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientsRepo } from './patients.repo';
import { AddPatientInput, AddPatientResponse } from './dto/add-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly patientsRepo: PatientsRepo) {}

  async addPatient(input: AddPatientInput): Promise<AddPatientResponse> {
    const { fullName, mobileNumber } = input;
    const patient = await this.patientsRepo.getPatientByMobileNumberAndName(
      mobileNumber,
      fullName,
    );
    if (patient) {
      throw new BadRequestException(
        `Patients with name ${fullName} and mobile number ${mobileNumber} already exists.`,
      );
    }
    const savedPatient = await this.patientsRepo.addPatient(input);
    return { patient: savedPatient };
  }
}
