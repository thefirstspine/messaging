import { Controller, UseGuards, Post, Req } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';
import { isString, isArray } from 'util';
import { AuthGuard } from '../@shared/auth-shared/auth.guard';

@Controller('api')
export class ApiController {

  constructor(private readonly messagingService: MessagingService) {
    // Send pending messages on startup
    this.messagingService.sendPendingMessages();
  }

  /**
   * Main post method. Thi smethod is protected with the AuthGuard
   * @param body
   */
  @Post()
  @UseGuards(AuthGuard)
  async sendMessage(@Req() request: any): Promise<IApiResponse|IApiError> {
    // Validate request
    if (!isIApiRequest(request.body)) {
      return {
        error: 'Not a valid request.',
        status: false,
      };
    }

    // Register message to the queue
    await this.messagingService.registerMessage(
      request.body.to,
      request.body.subject,
      request.body.message,
    );

    // Send pending messages
    await this.messagingService.sendPendingMessages();

    return {
      status: true,
      original: request.body,
    };
  }
}

/**
 * Type guard for IApiRequest
 * @param toBeDetermined
 */
export function isIApiRequest(toBeDetermined: any): toBeDetermined is IApiRequest {
  return (
    (isArray(toBeDetermined.to) || toBeDetermined.to === '*') &&
    isString(toBeDetermined.subject) &&
    toBeDetermined.message
  );
}

export interface IApiRequest {
  to: number[]|'*';
  subject: string;
  message: any;
}

export interface IApiBaseResponse {
  status: boolean;
}

export interface IApiResponse extends IApiBaseResponse {
  original: IApiRequest;
}

export interface IApiError extends IApiBaseResponse {
  error: string;
}
