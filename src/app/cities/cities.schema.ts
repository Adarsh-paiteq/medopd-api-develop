import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'cities';
export const citiesTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    name: text('name').notNull().unique(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
  },
  (table) => ({
    nameIdx: index(`${tableName}_${table.name.name}_idx`).on(table.name),
  }),
);

export type City = typeof citiesTable.$inferSelect;
