import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
export const MedicineStatusEnum = pgEnum('medicines_status', [
  'pending',
  'approved',
  'rejected',
]);

const tableName = 'medicines';
export const medicinesTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    name: text('name').notNull().unique(),
    medicineStatus: MedicineStatusEnum('medicines_status')
      .default('pending')
      .notNull(),
    createdBy: text('created_by').notNull(),
    updatedBy: text('updated_by').notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdateFn(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index(`${tableName}_${table.name.name}_idx`).on(table.name),
  }),
);

export type Medicine = typeof medicinesTable.$inferSelect;
