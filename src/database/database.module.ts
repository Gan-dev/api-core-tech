import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        // Import database-related modules here
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'your_username',
            password: 'your_password',
            database: 'your_database',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
        }),
    ],
})
export class DatabaseModule { }
