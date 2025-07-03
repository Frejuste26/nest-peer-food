import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Le nom de la catégorie est requis.' })
  @IsString({ message: 'Le nom de la catégorie doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom de la catégorie ne doit pas dépasser 50 caractères.' })
  categoryName: string;
}