import { AuthService } from '@core/services/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';

export enum ContextType {
  HTTP = 'http',
  GRAPGQL = 'graphql',
}

@Injectable()
export class ApiGuard implements CanActivate {
  private readonly logger = new Logger(ApiGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  validate(request: Request): boolean {
    const { headers } = request;
    const apiKey = headers['x-api-key'] as string;
    return this.authService.validateApiToken(apiKey);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      this.logger.log(`Public request`);
      return true;
    }
    if (context.getType() === ContextType.HTTP) {
      const request: Request = context.switchToHttp().getRequest();
      return this.validate(request);
    }
    const ctx = GqlExecutionContext.create(context);
    return this.validate(ctx.getContext().req);
  }
}
