import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './Helper/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.intercepter';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';

// Load environment variables
config();

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      {
        cors: true,
      },
    );

    // Apply global prefix
    nestApp.setGlobalPrefix('api');

    // Apply global pipes, interceptors, and filters
    nestApp.useGlobalPipes(new ValidationPipe());
    nestApp.useGlobalInterceptors(new ResponseInterceptor());
    nestApp.useGlobalFilters(new AllExceptionsFilter());

    // Body parser configuration
    nestApp.use(bodyParser.json({ limit: '2000mb' }));
    nestApp.use(bodyParser.urlencoded({ limit: '2000mb', extended: true }));

    // Initialize the app
    await nestApp.init();

    // Cache the serverless handler
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

// Lambda handler
export const handler: Handler = async (event: any, context: Context) => {
  // Configure context to reuse connections
  context.callbackWaitsForEmptyEventLoop = false;

  const server = await bootstrap();
  return server(event, context);
};
