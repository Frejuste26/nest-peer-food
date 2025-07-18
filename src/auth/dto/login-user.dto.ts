import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Le nom d\'utilisateur est requis.' })
  @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères.' })
  username: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères.' })
  mdpasse: string; // Correspond au champ 'mdpasse'
}
