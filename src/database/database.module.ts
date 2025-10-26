import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/config.interface';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = configService.get<DatabaseConfig>('database')!;

                return {
                    type: 'mysql', // Cambia a 'postgres' si usas PostgreSQL
                    host: dbConfig.host,
                    port: dbConfig.port,
                    username: dbConfig.username,
                    password: dbConfig.password,
                    database: dbConfig.database,
                    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                    synchronize: dbConfig.synchronize,
                    logging: dbConfig.logging,
                    autoLoadEntities: dbConfig.autoLoadEntities,
                    keepConnectionAlive: dbConfig.keepConnectionAlive,
                    extra: dbConfig.extra,
                };
            },
        }),
    ],
})
export class DatabaseModule { }
