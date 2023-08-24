import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';

export async function configureApp(app) {
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 开启跨域请求 (Enable CORS)
  app.enableCors();

  // 全局管道 (Global pipe)
  app.useGlobalPipes(
    new ValidationPipe({
      // 将类型转为DTO中定义的类型 (Transform values to the types defined in DTO)
      transform: true,
      // 去除在 DTO 中未定义的属性 (Remove properties that are not defined in the DTO)
      whitelist: true,
      // 隐式转换，将/user/1中的字符串转为数字1 (Implicit conversion, convert string in /user/1 to number)
      // transformOptions: { enableImplicitConversion: true },
    }),
  );

  // helmet头部安全策略 (Helmet security policy)
  app.use(helmet());
}
