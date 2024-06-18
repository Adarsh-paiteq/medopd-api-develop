import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Admin, adminsTable } from './admins.schema';
import { ulid } from 'ulid';
import { AdminsSeedData } from '@seed/data/admins.data';
import { AuthService } from '@core/services/auth.service';
import { eq, sql } from 'drizzle-orm';
import { AdminUpdateDto } from './dto/admin-login.dto';

@Injectable()
export class AdminsRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      adminsTable: typeof adminsTable;
    }>,
    private readonly authService: AuthService,
  ) {}

  async bulkInsertAdmins(admins: AdminsSeedData[]): Promise<Admin[]> {
    const values = admins.map<
      Pick<Admin, 'id' | 'password' | 'email' | 'fullName'>
    >((admin) => ({
      id: ulid(),
      email: admin.email,
      fullName: admin.full_name,
      password: this.authService.hashPassword(admin.password),
    }));
    return await this.db
      .insert(adminsTable)
      .values(values)
      .onConflictDoNothing({
        target: adminsTable.email,
      })
      .returning();
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const formattedEmail = email.toLowerCase().replace(/\s+/g, '');
    const [result] = await this.db
      .select()
      .from(adminsTable)
      .where(
        sql`LOWER(REPLACE(${adminsTable.email}, ' ', '')) = ${formattedEmail}`,
      );

    return result;
  }

  async updateAdminById(
    adminId: string,
    ClinicUpdate: AdminUpdateDto,
  ): Promise<Admin | undefined> {
    const fieldsToUpdate = {
      ...ClinicUpdate,
      updatedAt: new Date(),
    };
    const [result] = await this.db
      .update(adminsTable)
      .set(fieldsToUpdate)
      .where(eq(adminsTable.id, adminId))
      .returning();
    return result;
  }

  async getAdminById(id: string): Promise<Admin | undefined> {
    const [result] = await this.db
      .select()
      .from(adminsTable)
      .where(eq(adminsTable.id, id));
    return result;
  }

  async getAdmin(): Promise<Admin | undefined> {
    const [result] = await this.db.select().from(adminsTable);
    return result;
  }
}
