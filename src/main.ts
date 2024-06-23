import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
// import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
  //   cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem'),
  // };
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule,{httpsOptions});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  app.use((req, res, next) => {
    res.setTimeout(2 * 60 * 1000, () => {
      res.status(408).send('Request timed out');
    });
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('ting')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    credentials: true,
  });

  await app.listen(process.env.BACKENDPORT);
}
bootstrap();
