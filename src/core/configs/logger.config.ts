import { Params } from 'nestjs-pino';

export const loggerModuleOptions: Params = {
  pinoHttp: { autoLogging: false },
};
