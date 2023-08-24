import { LoggerService, HttpException } from '@nestjs/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest(); // 获取请求对象 (Get the request object)
    const status = exception.getStatus();

    const errorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url, // 请求的URL (The URL of the request)
      method: request.method, // 请求方法 (The method of the request)
      message: exception.message || exception.name,
    };

    this.logger.error(
      'Error Message:',
      exception.message,
      'HttpExceptionFilter',
    );
    this.logger.error('Stack Trace:', exception.stack, 'HttpExceptionFilter');

    response.status(status).json(errorResponse);
  }
}
