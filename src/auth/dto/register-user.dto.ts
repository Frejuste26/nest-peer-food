import { IsString, IsNotEmpty, MinLength, MaxLength, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { AccountRole } from '../../Models/account.model'; // Importer AccountRole

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Le nom de famille est requis.' })
  @IsString({ message: 'Le nom de famille doit être une chaîne de caractères.' })
  @MaxLength(30, { message: 'Le nom de famille ne doit pas dépasser 30 caractères.' })
  lastname: string;

  @IsNotEmpty({ message: 'Le prénom est requis.' })
  @IsString({ message: 'Le prénom doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le prénom ne doit pas dépasser 50 caractères.' })
  firstname: string;

  @IsNotEmpty({ message: 'Le numéro de téléphone est requis.' })
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne de caractères.' })
  @MaxLength(20, { message: 'Le numéro de téléphone ne doit pas dépasser 20 caractères.' })
  phone: string;

  @IsNotEmpty({ message: 'L\'adresse email est requise.' })
  @IsString({ message: 'L\'adresse email doit être une chaîne de caractères.' })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide.' })
  @MaxLength(100, { message: 'L\'adresse email ne doit pas dépasser 100 caractères.' })
  email: string;

  @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis.' })
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères.' })
  @MinLength(3, { message: 'Le nom d\'utilisateur doit avoir au moins 3 caractères.' })
  @MaxLength(20, { message: 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères.' })
  username: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères.' })
  mdpasse: string; // Correspond au champ 'mdpasse' de l'entité Account

  @IsOptional()
  @IsEnum(AccountRole, { message: 'Le rôle doit être un type d\'utilisateur valide (Student ou Teacher).' })
  role?: AccountRole;
}
