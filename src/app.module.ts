import { Logger, Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { LogsModule } from './modules/logs/logs.module';
import { MenusModule } from './modules/menus/menus.module';

import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';

const isDebug = process.env.NODE_ENV === 'development';
const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

function createDailyRotateTransport(level: string, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().uri().required(),
  APP_PORT: Joi.number().port().required(),
});
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'silly',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        ...(isDebug
          ? []
          : [
              createDailyRotateTransport('warn', 'error'),
              createDailyRotateTransport('info', 'app'),
            ]),
      ],
    }),
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [
        () => {
          const values = dotenv.config({
            path: envFilePath,
          });
          const { error } = schema.validate(values.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
        ${error.message}`,
            );
          }
          return values;
        },
      ],
      validationSchema: schema,
    }),
    PrismaModule,
    RedisModule,

    UserModule,
    LogsModule,
    RolesModule,
    AuthModule,
    MenusModule,
  ],
  controllers: [],
  // providers: [
  //   Logger,
  //   {
  //     provide: APP_FILTER,
  //     useClass: HttpExceptionFilter,
  //   },
  //   {
  //     provide: APP_FILTER,
  //     useClass: AllExceptionFilter,
  //   },
  // ],
  // exports: [Logger],
})
export class AppModule {}
