import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public')); // Javascript css 파일 서빙
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 템플릿엔진 디렉토리
  app.setViewEngine('hbs');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
}
bootstrap();
