import { GenerateTokens } from '@clinics/dto/verify-clinic-otp.dto';
import {
  EnvironmentVariable,
  EnvironmentVariables,
} from '@core/configs/env.config';
import { LoggedInUser } from '@core/configs/jwt.strategy';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface IGetTokens {
  id: string;
  role: string;
}

export enum Roles {
  CLINIC = 'clinic',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiration = 1 * 86400; // one day
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private jwtService: JwtService,
  ) {}

  private getJwtRefreshSecret(): string {
    const secret = this.configService.getOrThrow<string>(
      EnvironmentVariable.JWT_SECRET,
    );
    const refreshSecret = secret.slice(0, secret.length - 5);
    return refreshSecret;
  }

  private getJwtSecret(): string {
    return this.configService.getOrThrow(EnvironmentVariable.JWT_SECRET);
  }

  private async getAccessToken(
    user: IGetTokens,
    expiration = this.accessTokenExpiration,
  ): Promise<string> {
    const payload = {
      id: user.id,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload, {
      subject: user.id,
      expiresIn: expiration,
    });
  }

  private async getRefreshToken(
    clinic: IGetTokens,
    expiration = this.accessTokenExpiration,
  ): Promise<string> {
    const secret = this.getJwtRefreshSecret();
    const payload = {
      id: clinic.id,
    };
    return await this.jwtService.signAsync(payload, {
      subject: clinic.id,
      expiresIn: 7 * expiration,
      secret,
    });
  }

  async getTokens(
    clinic: IGetTokens,
    expiration = this.accessTokenExpiration,
  ): Promise<GenerateTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(clinic, expiration),
      this.getRefreshToken(clinic, expiration),
    ]);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: 'Bearer',
      expiresIn: expiration,
      id: clinic.id,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async verifyRefreshToken(token: string) {
    try {
      const secret = this.getJwtRefreshSecret();
      const data = await this.jwtService.verifyAsync(token, {
        secret,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  hashPassword(password: string): string {
    const saltOrRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltOrRounds);
    return passwordHash;
  }

  compareHash(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash);
  }

  validateApiToken(apiKey: string): boolean {
    const token = this.configService.getOrThrow<string>(
      EnvironmentVariable.API_TOKEN,
    );
    if (!apiKey || String(token) !== String(apiKey)) {
      throw new ForbiddenException();
    }
    return true;
  }

  validateRoles(user: LoggedInUser, roles: Roles[]): boolean {
    if (!roles.includes(user.role)) {
      throw new ForbiddenException();
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async verifyJwtToken(token: string) {
    try {
      const secret = this.getJwtSecret();
      const payload = await this.jwtService.verifyAsync(token, { secret });
      return { payload };
    } catch (error) {
      return { error };
    }
  }
}
