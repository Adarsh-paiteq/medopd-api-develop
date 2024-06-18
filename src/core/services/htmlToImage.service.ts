import { Injectable } from '@nestjs/common';
import { GeneratePrescriptionData } from '@prescriptions/dto/generate-prescription.dto';
import { TemplateService } from './template.service';
import { Environment, EnvironmentVariable } from '@core/configs/env.config';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { Logger } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FilePath, UploadResponse } from '@uploads/dto/upload.dto';

@Injectable()
export class HtmlToImageService {
  private readonly logger = new Logger(HtmlToImageService.name);

  constructor(
    private readonly templateService: TemplateService,
    private readonly configService: ConfigService,
    private readonly storageService: StorageService,
  ) {}

  async generateImage(
    generatePrescriptionData: GeneratePrescriptionData,
  ): Promise<UploadResponse> {
    const template = await this.templateService.getPrescriptionTemplate(
      generatePrescriptionData,
    );
    const nodeEnv = this.configService.getOrThrow<Environment>(
      EnvironmentVariable.NODE_ENV,
    );
    let browser;
    if (nodeEnv !== Environment.Local) {
      browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox'],
      });
    } else {
      browser = await puppeteer.launch({});
    }
    const page = await browser.newPage();
    await page.setContent(template);
    const content = await page.$('body');
    const imageBuffer = await content?.screenshot({ omitBackground: true });
    const options = {
      body: imageBuffer as Buffer,
      ext: 'png',
      mime: 'image/png',
      path: FilePath.IMAGE,
    };
    const { filePath, imageUrl, fileId } =
      await this.storageService.uploadFile(options);
    await browser.close();
    return { filePath, imageUrl, fileId };
  }
}
