import { Module, forwardRef } from '@nestjs/common';
import { BookingsResolver } from './bookings.resolver';
import { BookingsRepo } from './bookings.repo';
import { BookingsService } from './bookings.service';
import { PatientsModule } from '@patients/patients.module';
import { DoctorsModule } from '@doctors/doctors.module';
import { ClinicsModule } from '@clinics/clinics.module';
import { ChatsModule } from '@chats/chats.module';
import { AdminsModule } from '@admins/admins.module';
import { PrescriptionsModule } from '@prescriptions/prescriptions.module';

@Module({
  imports: [
    forwardRef(() => DoctorsModule),
    PatientsModule,
    forwardRef(() => ClinicsModule),
    ChatsModule,
    AdminsModule,
    forwardRef(() => PrescriptionsModule),
    AdminsModule,
  ],
  providers: [BookingsResolver, BookingsService, BookingsRepo],
  exports: [BookingsRepo],
})
export class BookingsModule {}
