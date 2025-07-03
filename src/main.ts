import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MyLoggerService } from './common/logger/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MyLoggerService(), // Utiliser votre logger personnalisé pour l'application NestJS
  });

  // Activer la validation des DTOs globalement
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Supprime les propriétés non définies dans les DTOs
    forbidNonWhitelisted: true, // Lance une erreur si des propriétés non définies sont présentes
    transform: true, // Transforme les types des paramètres de requête/corps (ex: string en number)
  }));

  // Enregistrer l'intercepteur de logging globalement
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Activer CORS si nécessaire (pour les applications front-end)
  // app.enableCors();

  const port = process.env.PORT || 3000; // Utiliser le port de .env ou 3000 par défaut
  await app.listen(port);
  console.log(`Application NestJS démarrée sur le port ${port}`);
}
bootstrap();
