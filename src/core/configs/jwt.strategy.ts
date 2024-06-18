import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from './env.config';
import { Roles } from '@core/services/auth.service';

export class LoggedInUser {
  id: string;
  iat: number;
  exp: number;
  role: Roles;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(
        EnvironmentVariable.JWT_SECRET,
      ),
      passReqToCallback: true,
    });
  }

  validate(req: Request, user: LoggedInUser): LoggedInUser {
    return user;
  }
}
