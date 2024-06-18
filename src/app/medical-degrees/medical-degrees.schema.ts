import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

const tableName = 'medical_degrees';
export const medicalDegreesTable = pgTable(
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

export type MedicalDegree = typeof medicalDegreesTable.$inferSelect;
