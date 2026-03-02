import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorsModule } from './colors/colors.module';
import { FavoritesModule } from './favorites/favorites.module';
import { HistoryModule } from './history/history.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Favorite } from './favorites/entities/favorite.entity';
import { History } from './history/entities/history.entity';
import { User } from './users/entities/user.entity';
import { Color } from './colors/entities/color.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'sqlite');

        // Base configuration
        const baseConfig = {
          entities: [User, Favorite, History, Color],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
        };

        // PostgreSQL configuration
        if (dbType === 'postgres') {
          return {
            ...baseConfig,
            type: 'postgres' as const,
            host: configService.get<string>('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT', '5432')),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
          };
        }

        // SQLite configuration (default)
        return {
          ...baseConfig,
          type: 'sqlite' as const,
          database: configService.get<string>('DB_NAME', 'database.sqlite'),
        };
      },
      inject: [ConfigService],
    }),
    ColorsModule,
    FavoritesModule,
    HistoryModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
