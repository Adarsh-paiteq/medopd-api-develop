import { LoggedInUser } from '@core/configs/jwt.strategy';
import { AuthService } from '@core/services/auth.service';
import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export interface SocketClient extends Socket {
  user: LoggedInUser;
}

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const WSAuthMiddleware = (
  authService: AuthService,
  logger: Logger,
): SocketMiddleware => {
  return async (socket: SocketClient, next) => {
    try {
      const accessToken =
        socket.handshake.auth?.token || socket.handshake.headers?.token;
      const unauthorizedError = new WsException(`Unauthorized`);

      if (!accessToken) {
        logger.error(`Unauthorized User`);
        return next(unauthorizedError);
      }

      const { payload, error } = await authService.verifyJwtToken(accessToken);
      if (error) {
        logger.error(`Unauthorized User`);
        return next(unauthorizedError);
      }

      socket.user = payload;
      logger.log(`User`, payload);
      next();
    } catch (error) {
      const exception = new WsException(error.message);
      next(exception);
    }
  };
};
