import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new MyLoggerService(); // Utiliser votre logger personnalisé

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    // Log de la requête entrante
    this.logger.log(
      `Requête entrante: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
      context.getClass().name, // Contexte: Nom de la classe du contrôleur
    );

    return next.handle().pipe(
      tap(
        (data) => {
          // Log de la réponse réussie
          this.logger.log(
            `Requête sortante (succès): ${method} ${url} - ${Date.now() - now}ms - Réponse: ${JSON.stringify(data)}`,
            context.getClass().name,
          );
        },
        (error) => {
          // Log de l'erreur
          this.logger.error(
            `Requête sortante (erreur): ${method} ${url} - ${Date.now() - now}ms - Erreur: ${error.message}`,
            error.stack, // Trace de la pile d'appels
            context.getClass().name,
          );
        },
      ),
    );
  }
}
