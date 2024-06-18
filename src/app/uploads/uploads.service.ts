import { BadRequestException, Injectable } from '@nestjs/common';
import * as fileType from 'file-type';
import * as fsp from 'fs/promises';
import * as fs from 'fs';
import {
  FilePath,
  UploadResponse,
  VideoUploadResponse,
} from './dto/upload.dto';
import { IUploadFile, StorageService } from '@core/services/storage.service';
import { videoFormats } from './dto/video-formats.dto';
import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { nanoid } from 'nanoid';
import {
  CHATFILETYPE,
  ChatFileType,
} from '@chat-message-attachments/dto/create-chat-message-attachments.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const image = fs.createReadStream(file.path);
    const imageCopy = fs.createReadStream(file.path);
    const fileTypeResult = await fileType.fromStream(imageCopy);
    const allowedFormats = [
      'image/jpeg',
      'image/gif',
      'image/png',
      'image/jpg',
    ];
    if (!fileTypeResult || !allowedFormats.includes(fileTypeResult.mime)) {
      throw new BadRequestException(`Invalid file-type or file-formats`);
    }
    const options: IUploadFile = {
      body: image,
      ext: fileTypeResult.ext,
      mime: fileTypeResult.mime,
      path: FilePath.IMAGE,
    };
    const { filePath, imageUrl, fileId } =
      await this.storageService.uploadFile(options);
    await fsp.unlink(file.path);
    return { filePath, imageUrl, fileId };
  }

  private takeScreenshot(file: Express.Multer.File): Promise<string> {
    const folder = path.join(process.cwd(), './thumbnails');
    const filename = `${nanoid()}.png`;
    const thumbnailPath = `${folder}/${filename}`;
    return new Promise<string>((resolve, reject) => {
      try {
        ffmpeg(file.path)
          .screenshot({
            filename,
            folder,
            count: 1,
            timestamps: [0],
          })
          .on('end', () => {
            resolve(thumbnailPath);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  private async uploadThumbnail(
    file: Express.Multer.File,
  ): Promise<UploadResponse> {
    const thumbnailPath = await this.takeScreenshot(file);
    const thumbnail = fs.createReadStream(thumbnailPath);
    const thumbnailCopy = fs.createReadStream(thumbnailPath);
    const fileTypeResult = await fileType.fromStream(thumbnailCopy);
    if (!fileTypeResult) {
      throw new BadRequestException(`Invalid file-type or file-formats`);
    }
    const options: IUploadFile = {
      body: thumbnail,
      ext: fileTypeResult.ext,
      mime: fileTypeResult.mime,
      path: FilePath.IMAGE,
    };
    const { filePath, imageUrl, fileId } =
      await this.storageService.uploadFile(options);
    await fsp.unlink(thumbnailPath);
    return { filePath, imageUrl, fileId };
  }

  async uploadVideo(file: Express.Multer.File): Promise<VideoUploadResponse> {
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const video = fs.createReadStream(file.path);
    const videoCopy = fs.createReadStream(file.path);
    const fileTypeResult = await fileType.fromStream(videoCopy);
    const allowedFormats = [
      'video/mp4',
      'video/x-matroska',
      'video/x-m4v',
    ].concat(videoFormats);
    if (!fileTypeResult || !allowedFormats.includes(fileTypeResult.mime)) {
      throw new BadRequestException(`Invalid file-type or file-formats`);
    }
    const options: IUploadFile = {
      body: video,
      ext: fileTypeResult.ext,
      mime: fileTypeResult.mime,
      path: FilePath.VIDEO,
    };
    const [
      { filePath, imageUrl, fileId },
      {
        fileId: thumbnailId,
        imageUrl: thumbnailImageUrl,
        filePath: thumbnailPath,
      },
    ] = await Promise.all([
      this.storageService.uploadFile(options),
      this.uploadThumbnail(file),
    ]);

    await fsp.unlink(file.path);
    return {
      filePath,
      imageUrl,
      fileId,
      thumbnailId,
      thumbnailPath,
      thumbnailImageUrl,
    };
  }

  async uploadAudio(file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const audio = fs.createReadStream(file.path);
    const audioCopy = fs.createReadStream(file.path);
    const fileTypeResult = await fileType.fromStream(audioCopy);
    const allowedFormats = [
      'video/mp4',
      'audio/mpeg',
      'audio/MPA',
      'audio/mpa-robust',
      'audio/wave',
      'audio/wav',
      'audio/vnd.wave',
      'audio/x-wav',
    ];
    if (!fileTypeResult || !allowedFormats.includes(fileTypeResult.mime)) {
      throw new BadRequestException(`Invalid file-type or file-formats`);
    }
    const options: IUploadFile = {
      body: audio,
      ext: fileTypeResult.ext,
      mime: fileTypeResult.mime,
      path: FilePath.AUDIO,
    };
    const { filePath, imageUrl, fileId } =
      await this.storageService.uploadFile(options);
    await fsp.unlink(file.path);
    return { filePath, imageUrl, fileId };
  }

  async uploadDocument(file: Express.Multer.File): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const document = fs.createReadStream(file.path);
    const documentCopy = fs.createReadStream(file.path);
    const fileTypeResult = await fileType.fromStream(documentCopy);
    const allowedFormats = ['application/pdf'];
    if (!fileTypeResult || !allowedFormats.includes(fileTypeResult.mime)) {
      throw new BadRequestException(`Invalid file-type or file-formats`);
    }
    const options: IUploadFile = {
      body: document,
      ext: fileTypeResult.ext,
      mime: fileTypeResult.mime,
      path: FilePath.DOCUMENT,
    };
    const { filePath, imageUrl, fileId } =
      await this.storageService.uploadFile(options);
    await fsp.unlink(file.path);
    return { filePath, imageUrl, fileId };
  }

  async uploadChatAttachments(
    file: Express.Multer.File,
    chatFileType: ChatFileType,
  ): Promise<UploadResponse> {
    if (chatFileType === CHATFILETYPE.IMAGE) {
      return await this.uploadImage(file);
    }
    if (chatFileType === CHATFILETYPE.VIDEO) {
      return await this.uploadVideo(file);
    }
    if (chatFileType === CHATFILETYPE.AUDIO) {
      return await this.uploadAudio(file);
    }
    return await this.uploadDocument(file);
  }
}
