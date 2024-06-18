import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessagesRepo } from './chat-messages.repo';
import {
  CreateChatMessageAttachmentDTO,
  CreateChatMessageDTO,
  CreateChatMessageInput,
  CreateChatMessageResponse,
} from './dto/create-chat-message.dto';
import { ChatFileUpload } from '@chat-message-attachments/dto/create-chat-message-attachments.dto';
import { ChatsRepo } from '@chats/chats.repo';
import { ChatMessageAttachmentsRepo } from '@chat-message-attachments/chat-message-attachments.repo';
import {
  ChatMessageData,
  ChatPatientInfo,
  GetChatMessagesArgs,
  GetChatMessagesResponse,
  SortOrder,
} from './dto/get-chat-messages.dto';
import { PatientsRepo } from '@patients/patients.repo';
import { GetChatArgs, GetChatResponse } from './dto/get-chat-message.dto';

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly chatMessagesRepo: ChatMessagesRepo,
    private readonly chatsRepo: ChatsRepo,
    private readonly chatMessageAttachmentsRepo: ChatMessageAttachmentsRepo,
    private readonly patientsRepo: PatientsRepo,
  ) {}

  async createChatMessage(
    userId: string,
    input: CreateChatMessageInput,
  ): Promise<CreateChatMessageResponse> {
    const { chatId, attachments, message } = input;
    const chat = await this.chatsRepo.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }

    const patient = await this.patientsRepo.getPatientById(chat.patientId);
    if (!patient) {
      throw new NotFoundException(`Patient not found`);
    }

    const chatAttachments: ChatFileUpload[] = [];
    const chatPatient: ChatPatientInfo = {
      id: patient.id,
      fullName: patient.fullName,
    };

    const createMessageDto: CreateChatMessageDTO = {
      chatId: chatId,
      senderId: userId,
      doctorId: chat.doctorId,
      clinicId: chat.clinicId,
      message,
    };

    const createdChatMessage =
      await this.chatMessagesRepo.createChatMessage(createMessageDto);

    if (attachments?.length) {
      const createChatFileUploadsDto: CreateChatMessageAttachmentDTO[] =
        attachments.map((attachment): CreateChatMessageAttachmentDTO => {
          return {
            ...attachment,
            chatId: chatId,
            chatMessageId: createdChatMessage.id,
            senderId: userId,
          };
        });

      const chatFileUploads =
        await this.chatMessageAttachmentsRepo.createChatAttachments(
          createChatFileUploadsDto,
        );

      chatFileUploads.forEach((fileUpload) => {
        const attachment: ChatFileUpload = {
          id: fileUpload.id,
          fileId: fileUpload.fileId,
          fileUrl: fileUpload.fileUrl,
          filePath: fileUpload.filePath,
          fileType: fileUpload.fileType,
          thumbnailImageId: fileUpload.thumbnailImageId,
          thumbnailImageIdPath: fileUpload.thumbnailImageIdPath,
          thumbnailImageUrl: fileUpload.thumbnailImageUrl,
        };
        chatAttachments.push(attachment);
      });
    }

    const chatMessage: ChatMessageData = {
      ...createdChatMessage,
      attachments: chatAttachments,
      patient: chatPatient,
    };

    return {
      chatMessage,
      chat,
    };
  }

  async getChatMessages(
    args: GetChatMessagesArgs,
  ): Promise<GetChatMessagesResponse> {
    const { chatMessages, total } =
      await this.chatMessagesRepo.getChatMessages(args);
    const hasMore = args.page * args.limit < total;
    return { chatMessages, hasMore };
  }

  async getChatWithMessages(
    chatId: string,
    sortOrder: SortOrder,
    page = 1,
    limit = 30,
  ): Promise<GetChatResponse> {
    const [chat, { chatMessages, hasMore }] = await Promise.all([
      this.chatMessagesRepo.getChatDetails(chatId),
      this.getChatMessages({ chatId, page, limit, sortOrder }),
    ]);
    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }
    //status of the opposite user that we are chatting with. this is not the status of logged in user
    const isActive = false;
    return { chat, isActive, chatMessages, hasMore };
  }

  async getChatMessage(
    loggedInUserId: string,
    args: GetChatArgs,
  ): Promise<GetChatResponse> {
    const { chatId, sortOrder } = args;
    const chat = await this.chatsRepo.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat not found`);
    }
    await this.chatMessagesRepo.readChatMessages(chatId, loggedInUserId);
    return await this.getChatWithMessages(
      chatId,
      sortOrder,
      args.page,
      args.limit,
    );
  }
}
