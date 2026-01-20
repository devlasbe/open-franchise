import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenApiModule } from './openApis/openApi.module';
import { ConfigModule } from '@nestjs/config';
import { StatisticModule } from './statistics/statistic.module';
import { PrismaModule } from './prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { CategoryModule } from './categories/category.module';
import { BrandModule } from './brands/brand.module';
import { StartupsModule } from './startups/startups.module';
import { InteriorsModule } from './interiors/interiors.module';
import { HeadsModule } from './heads/heads.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    HttpModule.register({ global: true }),
    OpenApiModule,
    StatisticModule,
    CategoryModule,
    BrandModule,
    StartupsModule,
    InteriorsModule,
    HeadsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
