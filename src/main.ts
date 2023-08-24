import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configureApp } from './app.config';
import { ConfigEnum } from './enum/config.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get(ConfigEnum.APP_PORT);

  await configureApp(app);

  await app.listen(port);
}

bootstrap();
