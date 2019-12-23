import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import env from './@shared/env-shared/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(env.dist ? env.config.MESSAGING_PORT : 2205);
}
bootstrap();
