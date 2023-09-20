import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { AuthService } from '@thefirstspine/auth-nest';
import { MessagingService } from '../messaging/messaging.service';
import { MessagingGateway } from '../messaging/messaging.gateway';
import { LogsService } from '@thefirstspine/logs-nest';

describe('Api Controller', () => {
  let controller: ApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        AuthService,
        MessagingService,
        MessagingGateway,
        LogsService,
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
