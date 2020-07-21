import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './messaging.service';
import { AuthService } from '@thefirstspine/auth-nest';

@Module({
  imports: [],
  providers: [MessagingGateway, AuthService, MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
