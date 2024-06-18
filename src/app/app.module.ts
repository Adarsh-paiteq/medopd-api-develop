import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@core/core.module';
import { MedicalDegreesModule } from '@medical-degrees/medical-degrees.module';
import { MedicalSpecialtiesModule } from '@medical-specialties/medical-specialties.module';
import { MedicalCouncilsModule } from '@medical-councils/medical-councils.module';
import { CitiesModule } from '@cities/cities.module';
import { ClinicsModule } from '@clinics/clinics.module';
import { BannersModule } from '@banners/banners.module';
import { AdminsModule } from '@admins/admins.module';
import { DoctorsModule } from '@doctors/doctors.module';
import { DoctorSpecialtiesModule } from '@doctor-specialties/doctor-specialties.module';
import { PatientsModule } from '@patients/patients.module';
import { BookingsModule } from '@bookings/bookings.module';
import { UploadsModule } from '@uploads/uploads.module';
import { ChatsModule } from '@chats/chats.module';
import { ChatMessagesModule } from '@chat-messages/chat-messages.module';
import { ChatMessageAttachmentsModule } from '@chat-message-attachments/chat-message-attachments.module';
import { AppGateway } from '@core/gateways/app.gateway';
import { MedicinesModule } from '@medicines/medicines.module';
import { PrescriptionsModule } from '@prescriptions/prescriptions.module';
import { PatientMedicinesModule } from '@patient-medicines/patient-medicines.module';
import { AudioCallsModule } from '@audio-calls/audio-calls.module';
import { VideoCallsModule } from '@video-calls/video-calls.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CoreModule,
    MedicalDegreesModule,
    MedicalSpecialtiesModule,
    MedicalCouncilsModule,
    CitiesModule,
    ClinicsModule,
    BannersModule,
    AdminsModule,
    DoctorsModule,
    DoctorSpecialtiesModule,
    PatientsModule,
    BookingsModule,
    UploadsModule,
    ChatsModule,
    ChatMessagesModule,
    ChatMessageAttachmentsModule,
    MedicinesModule,
    PrescriptionsModule,
    PatientMedicinesModule,
    AudioCallsModule,
    VideoCallsModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {}
