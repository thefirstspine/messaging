import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { LogsService } from '@thefirstspine/logs-nest';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    private readonly logsService: LogsService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 500;
    try {
      status = exception.getStatus()
    } catch (e) {}
    if (status >= 500) {
      this.logsService.error(
        `Global error with status ${status}`, {
          message: exception.message,
          name: exception.name,
          stack: exception.stack,
        });
    } else {
      this.logsService.warning(
        `Global warning with status ${status}`, {
          message: exception.message,
          name: exception.name,
          stack: exception.stack,
        });
    }

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
