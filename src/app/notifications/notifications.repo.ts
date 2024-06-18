import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { notificationsTable } from './notifications.schema';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { SaveUserNotificationDto } from './dto/create-notification.dto';
import { Notification } from './notifications.schema';
import { ulid } from 'ulid';
import { Clinic, clinicsTable } from '@clinics/clinics.schema';
import { count, eq } from 'drizzle-orm';
import { Doctor, doctorsTable } from '@doctors/doctors.schema';

@Injectable()
export class NotificationsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      notificationsTable: typeof notificationsTable;
    }>,
  ) {}

  async saveUserNotification(
    notification: SaveUserNotificationDto,
  ): Promise<Notification> {
    const [result] = await this.db
      .insert(notificationsTable)
      .values({
        id: ulid(),
        ...notification,
      })
      .returning();
    return result;
  }

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

  async getNotificationsByReceiverId(
    receiverId: string,
    page: number,
    limit: number,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const offset = (page - 1) * limit;
    const [notifications, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.receiverId, receiverId))
        .offset(offset)
        .limit(limit),
      this.db
        .select({
          total: count(),
        })
        .from(notificationsTable)
        .where(eq(notificationsTable.receiverId, receiverId)),
    ]);
    return {
      notifications,
      total,
    };
  }
}
