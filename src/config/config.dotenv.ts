import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envFilePath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
}
dotenv.config();

export const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key];
    if (value === undefined || value === '') {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
export const isProduction = (): boolean => {
    return getEnvVariable('NODE_ENV', 'development') === 'production';
};