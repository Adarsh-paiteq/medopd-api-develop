import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrescriptionsRepo } from './prescriptions.repo';
import {
  GetPrescriptionWithMedicinesArgs,
  GetPrescriptionWithMedicinesOutput,
} from './dto/get-prescription-with-medicines.dto';
import { BookingsRepo } from '@bookings/bookings.repo';
import { HtmlToImageService } from '@core/services/htmlToImage.service';
import {
  GeneratePrescriptionArgs,
  GeneratePrescriptionResponse,
} from './dto/generate-prescription.dto';
import { StorageService } from '@core/services/storage.service';
import { ChatMessageAttachmentsRepo } from '@chat-message-attachments/chat-message-attachments.repo';
import { ChatMessagesRepo } from '@chat-messages/chat-messages.repo';
import { CHATFILETYPE } from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import * as dateFns from 'date-fns';

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prescriptionsRepo: PrescriptionsRepo,
    private readonly bookingsRepo: BookingsRepo,
    private readonly htmlToImageService: HtmlToImageService,
    private readonly storageService: StorageService,
    private readonly chatMessageAttachmentsRepo: ChatMessageAttachmentsRepo,
    private readonly chatMessagesRepo: ChatMessagesRepo,
  ) {}

  async getPrescriptionWithMedicines(
    doctorId: string,
    args: GetPrescriptionWithMedicinesArgs,
  ): Promise<GetPrescriptionWithMedicinesOutput> {
    const { bookingId } = args;
    const booking = await this.bookingsRepo.getBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const prescriptionWithMedicines =
      await this.prescriptionsRepo.getPrescriptionWithMedicines(
        doctorId,
        bookingId,
      );
    return prescriptionWithMedicines;
  }

  async generatePrescription(
    doctorId: string,
    args: GeneratePrescriptionArgs,
  ): Promise<GeneratePrescriptionResponse> {
    const { id, generalInstruction } = args;
    const prescription = await this.prescriptionsRepo.getPrescriptionById(id);
    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }
    const [updatePrescription, generatePrescriptionData] = await Promise.all([
      this.prescriptionsRepo.updatePrescription(id, generalInstruction),
      this.prescriptionsRepo.getGeneratePrescription(id),
    ]);
    if (!updatePrescription) {
      throw new BadRequestException('Failed to update prescription');
    }
    const prescriptionDate = dateFns.format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    const { filePath, imageUrl, fileId } =
      await this.htmlToImageService.generateImage({
        ...generatePrescriptionData,
        prescriptionDate,
        generalInstruction,
      });

    const chatMessage = await this.chatMessagesRepo.createChatMessage({
      chatId: generatePrescriptionData.chatId,
      clinicId: generatePrescriptionData.clinicId,
      doctorId: doctorId,
      senderId: doctorId,
    });

    await this.chatMessageAttachmentsRepo.createChatAttachments([
      {
        chatId: generatePrescriptionData.chatId,
        chatMessageId: chatMessage.id,
        senderId: doctorId,
        fileId: fileId,
        filePath: filePath,
        fileUrl: imageUrl,
        fileType: CHATFILETYPE.IMAGE,
      },
    ]);
    return {
      message: 'Prescription generated successfully',
    };
  }
}
