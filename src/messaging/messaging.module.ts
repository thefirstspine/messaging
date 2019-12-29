import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './messaging.service';
import { AuthService } from '../@shared/auth-shared/auth.service';
import { Message } from '../entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagingGateway, AuthService, MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
