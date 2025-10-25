import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ClientsModule } from './clients/clients.module';
import { SharedModule } from './shared/shared.module';
import { StaffModule } from './staff/staff.module';
import { DevicesModule } from './devices/devices.module';
import { BrandsModule } from './brands/brands.module';
import { ServicesModule } from './services/services.module';
import { ReportsModule } from './reports/reports.module';
import { NotesModule } from './notes/notes.module';

const modules = [
  DatabaseModule,
  ClientsModule,
  SharedModule,
  StaffModule,
  DevicesModule,
  BrandsModule,
  ServicesModule,
  ReportsModule,
  NotesModule,
];

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
