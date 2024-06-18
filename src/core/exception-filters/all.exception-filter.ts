import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';
import { HttpStatusCode } from 'axios';
import { GraphQLError, GraphQLErrorExtensions } from 'graphql';
import { ConfigService } from '@nestjs/config';
import { Environment, EnvironmentVariable } from '@core/configs/env.config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly configService: ConfigService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void | unknown {
    const nodeEnv = this.configService.getOrThrow<Environment>(
      EnvironmentVariable.NODE_ENV,
    );
    const attachStackTrace = [
      Environment.Local,
      Environment.Development,
    ].includes(nodeEnv);
    const contextType = host.getType<GqlContextType>();
    const isHttp = contextType === 'http';

    if (isHttp) {
      return super.catch(exception, host);
    }
    this.logger.error(exception);

    const isError = exception instanceof Error;
    const isHttpError = exception instanceof HttpException;

    let key = 'errors.common.internalServerError';
    let statusCode = HttpStatusCode.InternalServerError;

    if (isHttpError) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'object') {
        const { message } = response as Record<string, unknown>;
        if (message) {
          key = Array.isArray(message) ? message[0] : message;
        }
      }
    }

    const message = key;
    const extensions: GraphQLErrorExtensions = {
      statusCode,
      message,
    };
    if (attachStackTrace && (isError || isHttpError)) {
      extensions.stack = exception.stack;
    }
    const error = new GraphQLError(message, {
      originalError: exception as Error,
      extensions,
    });
    return error;
  }
}
