import { pgTable, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

const tableName = 'banners';
export const bannersTable = pgTable(
  tableName,
  {
    id: text('id').primaryKey().notNull().unique(),
    title: text('title').notNull().unique(),
    description: text('description').notNull(),
    imageFilePath: text('image_file_path').notNull(),
    imageId: text('image_id').notNull(),
    imageUrl: text('image_url').notNull(),
    isDisable: boolean('is_disable').default(false).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index(`${tableName}_${table.title.name}_idx`).on(table.title),
  }),
);

export type Banner = typeof bannersTable.$inferSelect;
