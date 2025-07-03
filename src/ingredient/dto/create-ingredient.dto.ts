import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty({ message: 'Le nom de l\'ingrédient est requis.' })
  @IsString({ message: 'Le nom de l\'ingrédient doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom de l\'ingrédient ne doit pas dépasser 50 caractères.' })
  ingredientName: string;
}