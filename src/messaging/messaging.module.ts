import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './messaging.service';
import { AuthService } from '../@shared/auth-shared/auth.service';

@Module({
  providers: [MessagingGateway, AuthService, MessagingService],
})
export class MessagingModule {}
