import * as Joi from 'joi';

/**
 * Schema de validación para variables de entorno
 * Asegura que todas las variables requeridas estén presentes y tengan el formato correcto
 */
export const validationSchema = Joi.object({
    // Configuración de la aplicación
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    PORT: Joi.number().port().default(3000),

    // Configuración de la base de datos
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().port().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_SYNC: Joi.boolean().default(false),
    DB_LOGGING: Joi.boolean().default(false),

    // Configuración de JWT
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_EXPIRES_IN: Joi.string().default('1h'),
    JWT_REFRESH_SECRET: Joi.string().min(32).optional(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

    // Configuración de CORS
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),
    CORS_CREDENTIALS: Joi.boolean().default(true),

    // Límites de rate limiting
    THROTTLE_TTL: Joi.number().default(60),
    THROTTLE_LIMIT: Joi.number().default(10),
});
