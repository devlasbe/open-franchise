import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorResponseInterceptor } from './common/interceptors/error-response/error-response.interceptor';
import { SuccessResponseInterceptor } from './common/interceptors/success-response/success-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('franchise');

  // 프록시 뒤에서 실행 시 클라이언트 IP 추적을 위해 설정
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', true);

  app.use(cookieParser());

  app.useGlobalInterceptors(new ErrorResponseInterceptor());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  /* Swagger Setting */
  const options = new DocumentBuilder()
    .setTitle('Open Franchise API List')
    .setDescription('Open Franchise API List')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });
  /* Swagger Setting End */

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
