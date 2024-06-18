import { Clinic, clinicsTable } from '@clinics/clinics.schema';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { VideoCall, videoCallsTable } from './video-calls.schema';
import { Doctor, doctorsTable } from '@doctors/doctors.schema';
import { Chat, chatsTable } from '@chats/chats.schema';
import { and, eq } from 'drizzle-orm';
import { ulid } from 'ulid';
import { InsertVideoCallDto } from './dto/start-video-call.dto';

@Injectable()
export class VideoCallsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      videoCallsTable: typeof videoCallsTable;
    }>,
  ) {}

  async getClinicById(id: string): Promise<Clinic | undefined> {
    const [result] = await this.db
      .select()
      .from(clinicsTable)
      .where(eq(clinicsTable.id, id));
    return result;
  }

  async getDoctorById(id: string): Promise<Doctor | undefined> {
    const [result] = await this.db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.id, id));
    return result;
  }

  async getChatById(chatId: string): Promise<Chat | undefined> {
    const [chat] = await this.db
      .select()
      .from(chatsTable)
      .where(and(eq(chatsTable.id, chatId), eq(chatsTable.isDeleted, false)));
    return chat;
  }

  async createVideoCall(videoCall: InsertVideoCallDto): Promise<VideoCall> {
    const [createdAudioCall] = await this.db
      .insert(videoCallsTable)
      .values({
        id: ulid(),
        ...videoCall,
      })
      .returning();
    return createdAudioCall;
  }
}
