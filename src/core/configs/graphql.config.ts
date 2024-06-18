import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GqlModuleAsyncOptions } from '@nestjs/graphql';
import metadata from '../../metadata';
import path from 'path';
import { Environment, EnvironmentVariable } from './env.config';

export const graphqlModuleOptions: GqlModuleAsyncOptions<ApolloDriverConfig> = {
  driver: ApolloDriver,
  inject: [ConfigService],
  useFactory(configService: ConfigService) {
    const schemaFilePath = path.join(
      __dirname,
      '../../graphql-schema/schema.graphql',
    );
    const env = configService.getOrThrow(EnvironmentVariable.NODE_ENV);
    const isLocal = env === Environment.Local;
    return {
      path: '/v1/graphql',
      metadata,
      autoSchemaFile: schemaFilePath,
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoTransformHttpErrors: true,
      playground: isLocal,
    };
  },
};
