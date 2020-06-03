import { Module, DynamicModule } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingModule } from './messaging/messaging.module';
import { IndexController } from './index/index.controller';
import { LogService } from './@shared/log-shared/log.service';
import { AuthService } from '@thefirstspine/auth-nest';

@Module({})
export class AppModule {
  public static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MessagingModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          synchronize: true,
          entities: [__dirname + '/**/**.entity{.ts,.js}'],
          host: process.env.PG_HOST,
          port: parseInt(process.env.PG_PORT, 10),
          username: process.env.PG_USERNAME,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DATABASE,
        }),
      ],
      controllers: [ApiController, IndexController],
      providers: [
        AuthService,
        MessagingGateway,
        {provide: LogService, useValue: new LogService('messaging')},
      ],
    };
  }
}
