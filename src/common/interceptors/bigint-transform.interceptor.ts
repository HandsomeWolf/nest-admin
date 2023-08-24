import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

const serializeBigInt = (data: any) => {
  if (typeof data === 'bigint') {
    return data.toString();
  }

  if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        data[key] = serializeBigInt(data[key]);
      }
    }
  }

  return data;
};

@Injectable()
export class BigIntTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return serializeBigInt(data);
      }),
    );
  }
}
