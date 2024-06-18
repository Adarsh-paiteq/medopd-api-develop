import 'dotenv/config';
import type { Config } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

const modulesBasePath = path.join(__dirname, '../app');
const modulesPath = fs
  .readdirSync(modulesBasePath, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .map((dir) => `${modulesBasePath}/${dir.name}`);

const schema = modulesPath.reduce<string[]>((schema, modulePath) => {
  const files = fs
    .readdirSync(modulePath, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('schema.ts'))
    .map((file) => `${modulePath}/${file.name}`);
  schema = [...schema, ...files];
  return schema;
}, []);

export default {
  schema,
  out: './src/migrations/sql',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL as string,
  },
  introspect: {
    casing: 'camel',
  },
  verbose: true,
  strict: true,
} satisfies Config;
