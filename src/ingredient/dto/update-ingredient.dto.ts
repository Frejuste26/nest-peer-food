import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredient.dto';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
  @IsOptional()
  @IsString({ message: 'Le nom de l\'ingrédient doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom de l\'ingrédient ne doit pas dépasser 50 caractères.' })
  ingredientName?: string;
}