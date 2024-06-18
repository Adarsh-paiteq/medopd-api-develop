import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BannersService } from './banners.service';
import { GetBannersArgs, GetBannersOutput } from './dto/get-banners.dto';
import { GetBannerArgs, GetBannerOutput } from './dto/get-banner.dto';
import { AddBannerInput, AddBannerOutput } from './dto/add-banner.dto';
import { DeleteBannerArgs, DeleteBannerOutput } from './dto/delete-banner.dto';
import {
  DisableBannerArgs,
  DisableBannerOutput,
} from './dto/disble-banner.dto';
import { UpdateBannerInput, UpdateBannerOutput } from './dto/update-banner.dto';
import { Role } from '@core/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@core/guards/auth.guard';
import { Roles } from '@core/services/auth.service';
import { RolesGuard } from '@core/guards/roles.guard';

@Resolver()
export class BannersResolver {
  constructor(private readonly bannersService: BannersService) {}

  @Query(() => GetBannersOutput, { name: 'getBanners' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBanners(@Args() args: GetBannersArgs): Promise<GetBannersOutput> {
    return await this.bannersService.getBanners(args);
  }

  @Query(() => GetBannerOutput, { name: 'getBanner' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getBanner(@Args() args: GetBannerArgs): Promise<GetBannerOutput> {
    return await this.bannersService.getBanner(args);
  }

  @Mutation(() => AddBannerOutput, { name: 'addBanner' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addBanner(
    @Args('input') bannerInput: AddBannerInput,
  ): Promise<AddBannerOutput> {
    return await this.bannersService.addBanner(bannerInput);
  }

  @Mutation(() => DeleteBannerOutput, { name: 'deleteBanner' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBanner(
    @Args() args: DeleteBannerArgs,
  ): Promise<DeleteBannerOutput> {
    return await this.bannersService.deleteBanner(args);
  }

  @Mutation(() => DisableBannerOutput, { name: 'disableBanner' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async disableBanner(
    @Args() args: DisableBannerArgs,
  ): Promise<DisableBannerOutput> {
    return await this.bannersService.disableBanner(args);
  }

  @Mutation(() => UpdateBannerOutput, { name: 'updateBanner' })
  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateBanner(
    @Args('updates') bannerUpdate: UpdateBannerInput,
  ): Promise<UpdateBannerOutput> {
    return await this.bannersService.updateBanner(bannerUpdate);
  }
}
