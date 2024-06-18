import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { AdminLoginArgs, AdminLoginResponse } from './dto/admin-login.dto';
import {
  AdminRefreshTokenArgs,
  AdminRefreshTokenResponse,
} from './dto/admin-refresh-token.dto';

@Resolver()
export class AdminsResolver {
  constructor(private readonly adminsService: AdminsService) {}

  @Mutation(() => AdminLoginResponse, { name: 'adminLogin' })
  async adminLogin(@Args() args: AdminLoginArgs): Promise<AdminLoginResponse> {
    return await this.adminsService.adminLogin(args);
  }

  @Mutation(() => AdminRefreshTokenResponse, { name: 'adminRefreshToken' })
  async adminRefreshToken(
    @Args() args: AdminRefreshTokenArgs,
  ): Promise<AdminRefreshTokenResponse> {
    return await this.adminsService.adminRefreshToken(args.token);
  }
}
