import { Injectable } from '@nestjs/common';
import { GeneratePrescriptionData } from '@prescriptions/dto/generate-prescription.dto';
import * as Ejs from 'ejs'; // Import the 'Ejs' module
import fs from 'fs';
import path from 'path';

@Injectable()
export class TemplateService {
  async getPrescriptionTemplate(
    generatePrescriptionData: GeneratePrescriptionData,
  ): Promise<string> {
    const basePath = path.join(__dirname, '../../..');
    const templatePath = `${basePath}/components/prescription.ejs`;
    const template = await fs.promises.readFile(templatePath, {
      encoding: 'utf-8',
    });
    return Ejs.render(template, {
      generatePrescriptionData: generatePrescriptionData,
    });
  }
}
