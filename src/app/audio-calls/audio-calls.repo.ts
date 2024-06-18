import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AudioCall, audioCallsTable } from './audio-calls.schema';
import { Clinic, clinicsTable } from '@clinics/clinics.schema';
import { Doctor, doctorsTable } from '@doctors/doctors.schema';
import { Chat, chatsTable } from '@chats/chats.schema';
import { eq, and } from 'drizzle-orm';
import { InsertAudioCallDto } from './dto/start-audio-call.dto';
import { ulid } from 'ulid';

@Injectable()
export class AudioCallsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      audioCallsTable: typeof audioCallsTable;
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

  async createAudioCall(audioCall: InsertAudioCallDto): Promise<AudioCall> {
    const [createdAudioCall] = await this.db
      .insert(audioCallsTable)
      .values({
        id: ulid(),
        ...audioCall,
      })
      .returning();
    return createdAudioCall;
  }
}
