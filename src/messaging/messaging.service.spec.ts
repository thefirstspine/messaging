import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { AuthService } from '@thefirstspine/auth-nest';
import { MessagingGateway } from './messaging.gateway';
import { LogsService } from '@thefirstspine/logs-nest';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        MessagingService,
        MessagingGateway,
        LogsService,
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
