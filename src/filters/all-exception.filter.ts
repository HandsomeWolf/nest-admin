import {
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';

import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let httpStatus: HttpStatus;
    let msg: unknown;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      msg = exception.getResponse();
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      msg = `Prisma error with code ${exception.code}: ${exception.message}`;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      msg = 'Internal Server Error';
    }

    const responseBody = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      exception: exception['name'], // Fixed typo in property name
      error: msg,
    };

    this.logger.error('Error Message:', msg, 'AllExceptionFilter');
    this.logger.error('Exception:', exception, 'AllExceptionFilter');

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
