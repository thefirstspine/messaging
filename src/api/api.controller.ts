import { Controller, UseGuards, Post, Req } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';
import { isString, isArray } from 'util';
import { AuthGuard } from '../@shared/auth-shared/auth.guard';

@Controller('api')
export class ApiController {

  constructor(private readonly messagingService: MessagingService) {}

  /**
   * Main post method. Thi smethod is protected with the AuthGuard
   * @param body
   */
  @Post()
  @UseGuards(AuthGuard)
  sendMessage(@Req() request: any): IApiResponse|IApiError {
    if (!isIApiRequest(request.body)) {
      return {
        error: 'Not a valid request.',
        sent: false,
      };
    }

    return {
      sent: this.messagingService.sendMessage(
        request.body.to,
        request.body.subject,
        request.body.message,
      ),
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
  subject: string|'*';
  message: any;
}

export interface IApiResponse {
  sent: boolean;
}

export interface IApiError extends IApiResponse {
  error: string;
}
