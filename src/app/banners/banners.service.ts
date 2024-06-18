import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BannersRepo } from './banners.repo';
import { GetBannersArgs, GetBannersOutput } from './dto/get-banners.dto';
import { GetBannerArgs, GetBannerOutput } from './dto/get-banner.dto';
import { AddBannerInput, AddBannerOutput } from './dto/add-banner.dto';
import { DeleteBannerArgs, DeleteBannerOutput } from './dto/delete-banner.dto';
import {
  DisableBannerArgs,
  DisableBannerOutput,
} from './dto/disble-banner.dto';
import { UpdateBannerInput, UpdateBannerOutput } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private readonly bannersRepo: BannersRepo) {}

  async getBanners(args: GetBannersArgs): Promise<GetBannersOutput> {
    const { title, page, limit } = args;
    const banners = await this.bannersRepo.getBanners(page, limit, title);
    return {
      banners,
    };
  }

  async getBanner(args: GetBannerArgs): Promise<GetBannerOutput> {
    const { id } = args;
    const banner = await this.bannersRepo.getBanner(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return {
      banner,
    };
  }

  async addBanner(bannerInput: AddBannerInput): Promise<AddBannerOutput> {
    const { title } = bannerInput;
    const banner = await this.bannersRepo.getBannerByTitle(title);
    if (banner) {
      throw new BadRequestException('Banner already exists');
    }
    const savedBanner = await this.bannersRepo.addBanner(bannerInput);
    return {
      savedBanner,
    };
  }

  async deleteBanner(args: DeleteBannerArgs): Promise<DeleteBannerOutput> {
    const { id } = args;
    const banner = await this.bannersRepo.getBanner(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    const deletedBanner = await this.bannersRepo.deleteBanner(id);
    if (!deletedBanner) {
      throw new BadRequestException('Banner not deleted');
    }
    return {
      deletedBanner,
    };
  }

  async disableBanner(args: DisableBannerArgs): Promise<DisableBannerOutput> {
    const { id } = args;
    const banner = await this.bannersRepo.getBanner(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    const disabledBanner = await this.bannersRepo.disableBanner(id);
    if (!disabledBanner) {
      throw new BadRequestException('Banner not disabled');
    }
    return {
      disabledBanner,
    };
  }

  async updateBanner(
    bannerUpdate: UpdateBannerInput,
  ): Promise<UpdateBannerOutput> {
    const { id, ...updates } = bannerUpdate;
    const banner = await this.bannersRepo.getBanner(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    if (updates.title) {
      const { title } = updates;
      const existingTitle = banner.title.replace(/ /g, '').toLowerCase();
      const modifiedTitle = title.replace(/ /g, '').toLowerCase();
      if (existingTitle !== modifiedTitle) {
        const bannerByTitle = await this.bannersRepo.getBannerByTitle(title);
        if (bannerByTitle) {
          throw new BadRequestException('Banner already with this title');
        }
      }
    }
    const updatedBanner = await this.bannersRepo.updateBanner(bannerUpdate);
    if (!updatedBanner) {
      throw new BadRequestException('Banner not updated');
    }
    return {
      updatedBanner,
    };
  }
}
