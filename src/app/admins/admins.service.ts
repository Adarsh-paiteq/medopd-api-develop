import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminsRepo } from './admins.repo';
import { AdminLoginArgs, AdminLoginResponse } from './dto/admin-login.dto';
import { AuthService, Roles } from '@core/services/auth.service';
import { AdminRefreshTokenResponse } from './dto/admin-refresh-token.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminsRepo: AdminsRepo,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async adminLogin(args: AdminLoginArgs): Promise<AdminLoginResponse> {
    const admin = await this.adminsRepo.getAdminByEmail(args.email);
    if (!admin) {
      throw new UnauthorizedException(`Invalid email`);
    }
    const isValid = await this.authService.compareHash(
      args.password,
      admin.password,
    );
    if (!isValid) {
      throw new UnauthorizedException(`You have entered wrong password`);
    }
    const tokens = await this.authService.getTokens({
      id: admin.id,
      role: Roles.ADMIN,
    });
    await this.adminsRepo.updateAdminById(admin.id, {
      refreshToken: tokens.refreshToken,
    });
    return { ...tokens };
  }

  async adminRefreshToken(token: string): Promise<AdminRefreshTokenResponse> {
    const { data, error } = await this.authService.verifyRefreshToken(token);
    if (error) {
      throw new UnauthorizedException(`Token expired`);
    }
    const admin = await this.adminsRepo.getAdminById(data.id);
    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }
    const isValid = String(admin.refreshToken) !== String(token);
    if (isValid) {
      throw new UnauthorizedException(`Invaild token`);
    }
    const tokens = await this.authService.getTokens({
      id: admin.id,
      role: Roles.ADMIN,
    });
    await this.adminsRepo.updateAdminById(admin.id, {
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }
}
