import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger('☠️ Error');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()?.url;

    return next.handle().pipe(
      catchError((error) => {
        this.logger.log(request, error);
        // 예외가 HttpException인 경우
        if (error.response) {
          const statusCode = error.getStatus();
          const message = error.message;
          const handler = context.getHandler().name;
          const response = error.response;
          return throwError(
            () =>
              new HttpException(
                {
                  handler,
                  statusCode,
                  message: message,
                  response,
                },
                statusCode,
              ),
          );
        }
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: 500,
                message: '내부 서버 오류가 발생했습니다',
                error: error.message,
              },
              500,
            ),
        );
      }),
    );
  }
}
