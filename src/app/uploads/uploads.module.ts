import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { StorageService } from '@core/services/storage.service';
import { multerOptions } from '@core/configs/multer.config';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, StorageService],
  imports: [MulterModule.register(multerOptions)],
})
export class UploadsModule {}
