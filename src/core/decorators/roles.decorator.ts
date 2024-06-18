import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const Role: (...args: string[]) => CustomDecorator<string> = (
  ...args: string[]
) => SetMetadata('roles', args);
