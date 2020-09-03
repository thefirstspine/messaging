import { Module, DynamicModule } from '@nestjs/common';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { IndexController } from './index/index.controller';
import { AuthService } from '@thefirstspine/auth-nest';
import { LogsService } from '@thefirstspine/logs-nest';
import { MessagingService } from './messaging/messaging.service';

@Module({})
export class AppModule {
  public static register(): DynamicModule {
    return {
      module: AppModule,
      controllers: [ApiController, IndexController],
      providers: [
        AuthService,
        MessagingService,
        MessagingGateway,
        LogsService,
      ],
    };
  }
}
