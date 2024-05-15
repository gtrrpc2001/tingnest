import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    }),
  );

  app.use(express.json({limit:'100mb'}))
  app.use(express.urlencoded({limit:'100mb'}))
  
  const config = new DocumentBuilder()
  .setTitle('ting')
  .setDescription('API description')
  .setVersion('1.0')
  .build()

  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app,document);
  app.enableCors({    
    origin:'*',
    methods:['POST', 'PUT', 'DELETE', 'GET'],
    credentials:true
  });  
  
  await app.listen('4500');
}
bootstrap();
