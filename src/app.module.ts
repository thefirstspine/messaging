import { Module, DynamicModule } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { MessagingModule } from './messaging/messaging.module';
import { IndexController } from './index/index.controller';
import { AuthService } from '@thefirstspine/auth-nest';
import { LogsService } from '@thefirstspine/logs-nest';

@Module({})
export class AppModule {
  public static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        MessagingModule,
      ],
      controllers: [ApiController, IndexController],
      providers: [
        AuthService,
        MessagingGateway,
        LogsService,
      ],
    };
  }
}
