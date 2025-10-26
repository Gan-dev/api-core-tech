import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde la raíz del proyecto
config({ path: resolve(__dirname, '../../.env') });

// Verificar que las variables críticas estén cargadas
if (!process.env.DB_PASSWORD) {
    console.error('❌ DB_PASSWORD is not defined. Check your .env file.');
    console.log('Current __dirname:', __dirname);
    console.log('Looking for .env at:', resolve(__dirname, '../../.env'));
}

/**
 * DataSource para migraciones de TypeORM
 * Este archivo es usado por el CLI de TypeORM para ejecutar migraciones
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    schema: 'public', // Schema por defecto

    // Entidades
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],

    // Migraciones
    migrations: [
        __dirname + '/migrations/*{.ts,.js}',
    ],

    // Opciones
    synchronize: false, // Siempre false para migraciones
    logging: process.env.DB_LOGGING === 'true',

    // Configuración del pool
    extra: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
    },
});

// Inicializar el DataSource
// AppDataSource.initialize()
//     .then(() => {
//         console.log('Data Source has been initialized!');
//     })
//     .catch((err) => {
//         console.error('Error during Data Source initialization:', err);
//     });
