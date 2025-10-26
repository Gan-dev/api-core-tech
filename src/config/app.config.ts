import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

/**
 * Configuración general de la aplicación
 */
export default registerAs('app', (): AppConfig => {
    const env = process.env.NODE_ENV || 'development';

    return {
        env,
        port: parseInt(process.env.PORT || '3000', 10),

        cors: {
            origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: process.env.CORS_CREDENTIALS === 'true',
        },

        throttle: {
            ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
            limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
        },

        // Helpers tipados como propiedades booleanas
        isDevelopment: env === 'development',
        isProduction: env === 'production',
        isTest: env === 'test',
    };
});
