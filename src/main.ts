import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './Helper/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.intercepter';
import { config } from 'dotenv'; // Import dotenv
import * as bodyParser from 'body-parser';
config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(bodyParser.json({ limit: '1500mb' }));
  app.use(bodyParser.urlencoded({ limit: '1500mb', extended: true }));

  const port = process.env.BACKEND_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();

