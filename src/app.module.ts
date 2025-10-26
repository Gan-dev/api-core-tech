import { Module } from '@nestjs/common';
import { ClientsModule } from './clients';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { StaffModule } from './staff/staff.module';
import { BrandsModule } from './brands/brands.module';
import { ServicesModule } from './services/services.module';
import { NotesModule } from './notes/notes.module';

const modules = [
  //DatabaseModule,
  ClientsModule,
  SharedModule,
  StaffModule,
  BrandsModule,
  ServicesModule,
  NotesModule,
];

@Module({
  imports: [...modules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
