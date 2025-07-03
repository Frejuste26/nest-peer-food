import { PartialType } from '@nestjs/mapped-types'; // Utile pour rendre toutes les propriétés optionnelles
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { UserStatut } from '../../Models/user.model';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
  @MinLength(3, { message: 'Le nom d\'utilisateur doit avoir au moins 3 caractères' })
  @MaxLength(20, { message: 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères' })
  username?: string; // Rendre optionnel

  @IsOptional()
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
  password?: string; // Rendre optionnel

  @IsOptional()
  @IsEnum(UserStatut, { message: 'Le statut doit être un type d\'utilisateur valide (Administrator ou Manager)' })
  statut?: UserStatut; // Rendre optionnel
}