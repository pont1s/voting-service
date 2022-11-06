import * as fs from 'fs';

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? {
    key: fs.readFileSync(`${process.cwd()}/tools/mkcert/key.pem`),
    cert: fs.readFileSync(`${process.cwd()}/tools/mkcert/cert.pem`),
  } : undefined;

  Logger.log(`Process ENV: ${process.env.NODE_ENV}`, 'ENV');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      https: httpsOptions,
    }),
  );

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const openApiConfig = new DocumentBuilder()
    .setTitle('Animes documentation')
    .setDescription('The animes API description')
    .setVersion('1.0')
    .addTag('animes')
    .build();
  const openApiInstance = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api', app, openApiInstance);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
}

// eslint-disable-next-line no-void
void bootstrap();
