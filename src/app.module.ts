import { Module } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { AuthService } from './@shared/auth-shared/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './@shared/env-shared/env';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [
    MessagingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      synchronize: true,
      entities: env.dist ? [__dirname + '/**/**.entity.js'] : [__dirname + '/**/**.entity{.ts,.js}'],
      host: env.config.MESSAGING_PG_HOST,
      port: env.config.MESSAGING_PG_PORT,
      username: env.config.MESSAGING_PG_USERNAME,
      password: env.config.MESSAGING_PG_PASSWORD,
      database: env.config.MESSAGING_PG_DATABASE,
    }),
  ],
  controllers: [ApiController],
  providers: [AuthService, MessagingGateway],
})
export class AppModule {}
