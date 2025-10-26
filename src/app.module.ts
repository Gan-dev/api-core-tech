import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { StaffModule } from './staff/staff.module';
import { DevicesModule } from './devices/devices.module';
import { BrandsModule } from './brands/brands.module';
import { ServicesModule } from './services/services.module';
import { ReportsModule } from './reports/reports.module';
import { NotesModule } from './notes/notes.module';
import { TenancyModule, TenantMiddleware } from './tenancy';
import { appConfig, databaseConfig, jwtConfig, validationSchema } from './config';

const modules = [
  // Configuración global
  ConfigModule.forRoot({
    isGlobal: true, // Hace que ConfigService esté disponible en toda la aplicación
    envFilePath: ['.env.local', '.env'], // Orden de prioridad de archivos .env
    load: [appConfig, databaseConfig, jwtConfig], // Carga las configuraciones modulares
    validationSchema, // Valida las variables de entorno al iniciar
    validationOptions: {
      allowUnknown: true, // Permite variables no definidas en el schema
      abortEarly: false, // Muestra todos los errores de validación, no solo el primero
    },
    cache: true, // Cachea los valores para mejor rendimiento
  }),
  DatabaseModule,
  TenancyModule, // Módulo global de multi-tenancy
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar middleware de tenant a todas las rutas excepto las de gestión de tenants
    consumer
      .apply(TenantMiddleware)
      .exclude('tenancy/*path', 'health', 'docs')
      .forRoutes('*');
  }
}
