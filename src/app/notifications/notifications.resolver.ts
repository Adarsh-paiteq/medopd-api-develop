import { Args, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { GetNotificationsOutput } from './dto/get-doctor-notifications.dto';
import { GetUser } from '@core/decorators/user.decorator';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { PaginationArgs } from '@utils/helpers';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '@core/guards/roles.guard';
import { Role } from '@core/decorators/roles.decorator';
import { Roles } from '@core/services/auth.service';
import { JwtAuthGuard } from '@core/guards/auth.guard';

@Resolver()
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => GetNotificationsOutput, {
    name: 'getDoctorNotifications',
  })
  @Role(Roles.DOCTOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDoctorNotifications(
    @GetUser() user: LoggedInUser,
    @Args() args: PaginationArgs,
  ): Promise<GetNotificationsOutput> {
    return await this.notificationsService.getDoctorNotifications(
      user.id,
      args,
    );
  }
}
