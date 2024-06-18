import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import fs from 'fs/promises';
import { printSchema } from 'graphql';
import path from 'path';
import { AppModule } from '../app/app.module';

async function generateSchema(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const { schema } = app.get(GraphQLSchemaHost);
  await fs.writeFile(
    path.join(__dirname, './schema.graphql'),
    printSchema(schema),
    'utf-8',
  );
  app.close();
}

generateSchema();
