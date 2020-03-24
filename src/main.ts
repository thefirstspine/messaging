import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import env from './@shared/env-shared/env';
import { ErrorFilter } from './error.filter';
import { LogService } from './@shared/log-shared/log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  app.useGlobalFilters(new ErrorFilter(new LogService('messaging')));
  await app.listen(env.dist ? env.config.PORT : 2205);
}
bootstrap();
