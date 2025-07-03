import { SetMetadata } from '@nestjs/common';
import { AccountRole } from '../Models/account.model'; 
import { UserStatut } from '../Models/user.model';

// Créez un type union pour tous les rôles possibles dans votre application
export type AllowedRoles = AccountRole | UserStatut;

// La clé utilisée pour stocker les rôles dans les métadonnées de la route
export const ROLES_KEY = 'roles';

// Le décorateur @Roles prend un tableau de rôles autorisés
export const Roles = (...roles: AllowedRoles[]) => SetMetadata(ROLES_KEY, roles);
