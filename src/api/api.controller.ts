import { Controller, UseGuards, Post, Req } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';
import { isString, isArray } from 'util';
import { CertificateGuard } from '@thefirstspine/certificate-nest';

@Controller('api')
export class ApiController {

  constructor(private readonly messagingService: MessagingService) {
  }

  /**
   * Main post method. This method is protected with the CertificateGuard
   * @param body
   */
  @Post()
  @UseGuards(CertificateGuard)
  sendMessage(@Req() request: any): IApiResponse|IApiError {
    // Validate request
    if (!isIApiRequest(request.body)) {
      return {
        error: 'Not a valid request.',
        status: false,
      };
    }

    // Send pending messages
    this.messagingService.sendMessageToClient(
      (request.body as IApiRequest).to,
      (request.body as IApiRequest).subject,
      (request.body as IApiRequest).message);

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
