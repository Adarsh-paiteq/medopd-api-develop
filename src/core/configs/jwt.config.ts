import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from './env.config';
const jwtOptions: JwtModuleAsyncOptions = {
  useFactory: async (config: ConfigService) => ({
    secret: config.get(EnvironmentVariable.JWT_SECRET),
  }),
  inject: [ConfigService],
};
export default jwtOptions;
