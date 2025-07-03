import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateComposerDto {
  @IsNotEmpty({ message: 'L\'ID du plat est requis.' })
  @IsNumber({}, { message: 'L\'ID du plat doit être un nombre.' })
  platId: number;

  @IsNotEmpty({ message: 'L\'ID de l\'ingrédient est requis.' })
  @IsNumber({}, { message: 'L\'ID de l\'ingrédient doit être un nombre.' })
  ingredientId: number;

  @IsOptional()
  @IsNumber({}, { message: 'La quantité doit être un nombre.' })
  @Min(0, { message: 'La quantité ne peut pas être négative.' })
  quantity?: number;

  @IsOptional()
  @IsString({ message: 'L\'unité doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'L\'unité ne doit pas dépasser 50 caractères.' })
  unit?: string;
}