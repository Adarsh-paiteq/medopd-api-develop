import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AdminsRepo } from './admins.repo';
import { AdminsService } from './admins.service';
import { AdminsResolver } from './admins.resolver';

@Module({
  imports: [CoreModule],
  providers: [AdminsResolver, AdminsService, AdminsRepo],
  exports: [AdminsRepo],
})
export class AdminsModule {}
