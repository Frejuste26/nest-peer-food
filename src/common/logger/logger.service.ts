import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  constructor() {
    super(); // Appelle le constructeur de ConsoleLogger
  }

  // Vous pouvez surcharger les méthodes de log ici pour personnaliser le comportement
  // Par exemple, envoyer les logs à un service externe, à un fichier, etc.

  log(message: any, context?: string) {
    // console.log(`[LOG] ${context ? `[${context}] ` : ''}${message}`);
    super.log(message, context); // Utilise le comportement par défaut de ConsoleLogger
  }

  error(message: any, trace?: string, context?: string) {
    // console.error(`[ERROR] ${context ? `[${context}] ` : ''}${message} - Trace: ${trace}`);
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    // console.warn(`[WARN] ${context ? `[${context}] ` : ''}${message}`);
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    // console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${message}`);
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    // console.log(`[VERBOSE] ${context ? `[${context}] ` : ''}${message}`);
    super.verbose(message, context);
  }
}
