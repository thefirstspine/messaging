import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ErrorFilter } from './error.filter';
import { LogService } from './@shared/log-shared/log.service';

async function bootstrap() {
  // Load dotenv config
  require('dotenv').config();

  // Start app
  const app = await NestFactory.create(AppModule.register());
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  app.useGlobalFilters(new ErrorFilter(new LogService('messaging')));
  await app.listen(process.env.PORT);
}
bootstrap();
