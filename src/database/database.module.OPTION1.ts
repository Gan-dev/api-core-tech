import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/config.interface';

// Importar TODAS las entidades
import { Company } from '../tenancy/entities';
import { Client } from '../clients/entities/client.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Device } from '../devices/entities/device.entity';
import { Note } from '../notes/entities/note.entity';
import { RepairOrder } from '../reports/entities/repair-order.entity';

/**
 * DatabaseModule - Configuración de conexión a PostgreSQL
 * 
 * MODO DESARROLLO: Sincroniza todas las entidades en schema público
 * MODO PRODUCCIÓN: Solo entidades globales (Company) + schemas dinámicos por tenant
 */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: 'default',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = configService.get<DatabaseConfig>('database')!;
                const isDevelopment = configService.get('app.isDevelopment');

                return {
                    type: 'postgres',
                    host: dbConfig.host,
                    port: dbConfig.port,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    database: dbConfig.database,
                    schema: 'public',

                    // En desarrollo: todas las entidades para testing
                    // En producción: solo Company (las demás van en schemas de tenant)
                    entities: isDevelopment
                        ? [Company, Client, Staff, Brand, Device, Note, RepairOrder]
                        : [Company],

                    synchronize: dbConfig.synchronize,
                    logging: dbConfig.logging,
                    autoLoadEntities: false,
                    keepConnectionAlive: dbConfig.keepConnectionAlive,
                    extra: {
                        ...dbConfig.extra,
                        max: 20,
                        idleTimeoutMillis: 30000,
                    },
                };
            },
        }),
    ],
})
export class DatabaseModule { }
