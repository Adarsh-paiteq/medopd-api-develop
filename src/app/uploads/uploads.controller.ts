import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UploadChatAttachmentsDTO,
  UploadResponse,
  VideoUploadResponse,
} from './dto/upload.dto';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { Roles } from '@core/services/auth.service';
import { Role } from '@core/decorators/roles.decorator';
import { RolesGuard } from '@core/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/profile/picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    return await this.uploadsService.uploadImage(file);
  }

  @Post('/image')
  @Role(Roles.ADMIN, Roles.DOCTOR, Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    return await this.uploadsService.uploadImage(file);
  }

  @Post('/video')
  @Role(Roles.DOCTOR, Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<VideoUploadResponse> {
    return await this.uploadsService.uploadVideo(file);
  }

  @Post('/audio')
  @Role(Roles.DOCTOR, Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    return await this.uploadsService.uploadAudio(file);
  }

  @Post('/chat/attachments')
  @Role(Roles.DOCTOR, Roles.CLINIC)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadChatAttachments(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() uploadChatAttachmentsDTO: UploadChatAttachmentsDTO,
  ): Promise<UploadResponse> {
    return await this.uploadsService.uploadChatAttachments(
      file,
      uploadChatAttachmentsDTO.chatFileType,
    );
  }
}
