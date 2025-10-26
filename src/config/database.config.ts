import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.interface';

/**
 * Configuración de la base de datos
 */
export default registerAs('database', (): DatabaseConfig => ({
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    synchronize: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',

    // Configuración adicional de TypeORM
    autoLoadEntities: true,
    keepConnectionAlive: true,

    // Pool de conexiones
    extra: {
        max: 10, // Máximo de conexiones en el pool
        min: 2,  // Mínimo de conexiones en el pool
        idleTimeoutMillis: 30000,
    },
}));
