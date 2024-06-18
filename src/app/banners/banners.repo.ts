import { DRIZZLE_PROVIDER } from '@core/providers/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Banner, bannersTable } from './banners.schema';
import { ulid } from 'ulid';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { AddBannerInput } from './dto/add-banner.dto';
import { UpdateBannerInput } from './dto/update-banner.dto';

@Injectable()
export class BannersRepo {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: PostgresJsDatabase<{
      bannersTable: typeof bannersTable;
    }>,
  ) {}

  async bulkInsertBanners(
    banners: {
      title: string;
      description: string;
      image_file_path: string;
      image_id: string;
      image_url: string;
    }[],
  ): Promise<Banner[]> {
    const values = banners.map<
      Pick<
        Banner,
        | 'id'
        | 'title'
        | 'description'
        | 'imageFilePath'
        | 'imageId'
        | 'imageUrl'
      >
    >((banner) => ({
      id: ulid(),
      title: banner.title.trim(),
      description: banner.description,
      imageFilePath: banner.image_file_path,
      imageId: banner.image_id,
      imageUrl: banner.image_url,
    }));

    return await this.db
      .insert(bannersTable)
      .values(values)
      .onConflictDoNothing({
        target: bannersTable.title,
      })
      .returning();
  }

  async getBanners(
    page: number,
    limit: number,
    title?: string,
  ): Promise<Banner[]> {
    const offset = (page - 1) * limit;
    const builder = this.db.select().from(bannersTable);
    if (title) {
      builder.where(
        and(
          eq(bannersTable.isDisable, false),
          ilike(bannersTable.title, sql.placeholder('title')),
        ),
      );
    } else {
      builder.where(eq(bannersTable.isDisable, false));
    }
    builder.offset(offset).limit(limit);
    const query = builder.prepare('banners');
    const executeOptions: Parameters<typeof query.execute>[0] = {};
    if (title) {
      executeOptions.title = `%${title}%`;
    }
    const result = await query.execute(executeOptions);
    return result;
  }

  async getBanner(id: string): Promise<Banner | undefined> {
    const [result] = await this.db
      .select()
      .from(bannersTable)
      .where(and(eq(bannersTable.isDisable, false), eq(bannersTable.id, id)));
    return result;
  }

  async getBannerByTitle(title: string): Promise<Banner | undefined> {
    const formattedTitle = title.replace(/ /g, '').toLowerCase();
    const [result] = await this.db
      .select()
      .from(bannersTable)
      .where(
        and(
          eq(bannersTable.isDisable, false),
          sql`LOWER(REPLACE(${bannersTable.title}, ' ', '')) = ${formattedTitle}`,
        ),
      );
    return result;
  }

  async addBanner(bannerInput: AddBannerInput): Promise<Banner> {
    const [result] = await this.db
      .insert(bannersTable)
      .values({
        id: ulid(),
        ...bannerInput,
      })
      .returning();
    return result;
  }

  async deleteBanner(id: string): Promise<Banner | undefined> {
    const [result] = await this.db
      .delete(bannersTable)
      .where(eq(bannersTable.id, id))
      .returning();
    return result;
  }

  async disableBanner(id: string): Promise<Banner | undefined> {
    const [result] = await this.db
      .update(bannersTable)
      .set({ isDisable: true })
      .where(eq(bannersTable.id, id))
      .returning();
    return result;
  }

  async updateBanner(
    bannerUpdate: UpdateBannerInput,
  ): Promise<Banner | undefined> {
    const { id, ...updates } = bannerUpdate;
    const fliedsToUpdate = {
      ...updates,
      updatedAt: new Date(),
    };
    const [result] = await this.db
      .update(bannersTable)
      .set(fliedsToUpdate)
      .where(eq(bannersTable.id, id))
      .returning();
    return result;
  }
}
