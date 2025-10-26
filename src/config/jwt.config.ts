import { registerAs } from '@nestjs/config';
import { JwtConfig } from './config.interface';

/**
 * Configuración de JWT (JSON Web Tokens)
 */
export default registerAs('jwt', (): JwtConfig => ({
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',

    refresh: {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
}));
