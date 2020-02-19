import { Module } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { AuthService } from './@shared/auth-shared/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './@shared/env-shared/env';
import { MessagingModule } from './messaging/messaging.module';
import { IndexController } from './index/index.controller';
import { LogService } from './@shared/log-shared/log.service';

@Module({
  imports: [
    MessagingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      entities: env.dist ? [__dirname + '/**/**.entity.js'] : [__dirname + '/**/**.entity{.ts,.js}'],
      host: env.config.PG_HOST,
      port: env.config.PG_PORT,
      username: env.config.PG_USERNAME,
      password: env.config.PG_PASSWORD,
      database: env.config.PG_DATABASE,
    }),
  ],
  controllers: [ApiController, IndexController],
  providers: [
    AuthService,
    MessagingGateway,
    {provide: LogService, useValue: new LogService('messaging')},
  ],
})
export class AppModule {}
