import { Module } from '@nestjs/common';
import { MessagingService } from './messaging/messaging.service';
import { ApiController } from './api/api.controller';
import { MessagingGateway } from './messaging/messaging.gateway';
import { AuthService } from './@shared/auth-shared/auth.service';

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [AuthService, MessagingService, MessagingGateway],
})
export class AppModule {}
