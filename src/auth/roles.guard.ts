import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AllowedRoles } from './roles.decorator'; // Importer la clé et le type de rôle

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupérer les rôles requis pour cette route
    const requiredRoles = this.reflector.getAllAndOverride<AllowedRoles[]>(ROLES_KEY, [
      context.getHandler(), // Rôles définis sur la méthode du contrôleur
      context.getClass(),   // Rôles définis sur la classe du contrôleur (si applicable)
    ]);

    // Si aucun rôle n'est spécifié, la route est accessible à tous les utilisateurs authentifiés
    if (!requiredRoles) {
      return true;
    }

    // Récupérer l'utilisateur authentifié (injecté par JwtStrategy dans req.user)
    const { user } = context.switchToHttp().getRequest();

    // L'objet 'user' peut être soit une instance de User (pour admins/managers)
    // soit une instance de Account (pour students/teachers).
    // On doit extraire le rôle correctement.
    const userRole = user.role || user.statut; // Role pour Account, Statut pour User

    // Vérifier si le rôle de l'utilisateur fait partie des rôles requis
    return requiredRoles.includes(userRole);
  }
}
