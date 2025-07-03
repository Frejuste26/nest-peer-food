import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, Min, MaxLength } from 'class-validator';

export class CreatePlatDto {
  @IsNotEmpty({ message: 'Le nom du plat est requis.' })
  @IsString({ message: 'Le nom du plat doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom du plat ne doit pas dépasser 50 caractères.' })
  platName: string;

  @IsOptional()
  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  description?: string;

  @IsNotEmpty({ message: 'Le prix est requis.' })
  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @Min(0, { message: 'Le prix ne peut pas être négatif.' })
  price: number;

  @IsOptional()
  @IsBoolean({ message: 'La disponibilité doit être un booléen.' })
  availability?: boolean;

  @IsOptional()
  @IsString({ message: 'Le chemin de l\'image doit être une chaîne de caractères.' })
  imagePath?: string;
}
