import { IsString, IsNotEmpty, IsEnum, MinLength, MaxLength, IsOptional } from 'class-validator';
import { UserStatut } from '../../Models/user.model';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le nom d\'utilisateur ne doit pas être vide' })
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
  @MinLength(3, { message: 'Le nom d\'utilisateur doit avoir au moins 3 caractères' })
  @MaxLength(20, { message: 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères' })
  username: string;

  @IsNotEmpty({ message: 'Le mot de passe ne doit pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
  mdpasse: string; // RENOMMÉ de 'password' à 'mdpasse'

  @IsOptional()
  @IsEnum(UserStatut, { message: 'Le statut doit être un type d\'utilisateur valide (Administrator ou Manager)' })
  statut?: UserStatut;
}