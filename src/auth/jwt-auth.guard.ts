import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Optionnel: Vous pouvez surcharger la gestion des erreurs d'authentification
  handleRequest(err, user, info) {
    if (err || !user) {
      // 'info' peut contenir des détails sur l'échec (ex: 'jwt expired')
      console.log('JWT Auth Guard Info:', info);
      throw err || new UnauthorizedException('Accès non autorisé. Token invalide ou manquant.');
    }
    return user;
  }
}
