/* eslint-disable require-await */
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ulid } from 'ulid';
import { City, citiesTable } from './cities.schema';
import { and, eq, ilike, sql } from 'drizzle-orm';

@Injectable()
export class CitiesRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private db: PostgresJsDatabase<{
      citiesTable: typeof citiesTable;
    }>,
  ) {}

  async bulkInsertCities(cities: string[]): Promise<City[]> {
    const values = cities.map<Pick<City, 'name' | 'id'>>((city) => ({
      name: city.trim(),
      id: ulid(),
    }));
    return await this.db
      .insert(citiesTable)
      .values(values)
      .onConflictDoNothing({
        target: citiesTable.name,
      })
      .returning();
  }

  async getCities(name?: string): Promise<City[]> {
    const builder = this.db.select().from(citiesTable);
    if (name) {
      builder.where(
        and(
          eq(citiesTable.isDeleted, false),
          ilike(citiesTable.name, sql.placeholder('name')),
        ),
      );
    } else {
      builder.where(eq(citiesTable.isDeleted, false));
    }
    const query = builder.prepare('cities');
    const executeOptions: Parameters<typeof query.execute>[0] = {};
    if (name) {
      executeOptions.name = `%${name}%`;
    }
    const result = await query.execute(executeOptions);
    return result;
  }

  async getCityByName(name: string): Promise<City | undefined> {
    const formattedName = name.toLowerCase().replace(/ /g, '');
    const [result] = await this.db
      .select()
      .from(citiesTable)
      .where(
        and(
          eq(citiesTable.isDeleted, false),
          sql`LOWER(REPLACE(${citiesTable.name}, ' ', '')) = ${formattedName}`,
        ),
      );
    return result;
  }

  async addCity(name: string): Promise<City> {
    const [result] = await this.db
      .insert(citiesTable)
      .values({ name: name, id: ulid() })
      .onConflictDoUpdate({
        target: citiesTable.name,
        set: {
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      })
      .returning();
    return result;
  }

  async getCity(id: string): Promise<City | undefined> {
    const [result] = await this.db
      .select()
      .from(citiesTable)
      .where(and(eq(citiesTable.isDeleted, false), eq(citiesTable.id, id)));
    return result;
  }

  async updateCity(id: string, name: string): Promise<City | undefined> {
    const [result] = await this.db
      .update(citiesTable)
      .set({ name: name, updatedAt: new Date() })
      .where(eq(citiesTable.id, id))
      .returning();
    return result;
  }

  async deleteCity(id: string): Promise<City | undefined> {
    const [result] = await this.db
      .update(citiesTable)
      .set({ isDeleted: true })
      .where(eq(citiesTable.id, id))
      .returning();
    return result;
  }
}
