/**
 * Interfaces de configuración tipadas
 * Estas interfaces definen la estructura de toda la configuración de la aplicación
 */

export interface AppConfig {
    env: string;
    port: number;
    cors: CorsConfig;
    throttle: ThrottleConfig;
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
}

export interface CorsConfig {
    origins: string[];
    credentials: boolean;
}

export interface ThrottleConfig {
    ttl: number;
    limit: number;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
    autoLoadEntities: boolean;
    keepConnectionAlive: boolean;
    extra: DatabaseExtraConfig;
}

export interface DatabaseExtraConfig {
    max: number;
    min: number;
    idleTimeoutMillis: number;
}

export interface JwtConfig {
    secret: string;
    expiresIn: string;
    refresh: JwtRefreshConfig;
}

export interface JwtRefreshConfig {
    secret: string;
    expiresIn: string;
}

/**
 * Configuración completa de la aplicación
 */
export interface AllConfig {
    app: AppConfig;
    database: DatabaseConfig;
    jwt: JwtConfig;
}
