import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsString({ message: 'Le nom de la catégorie doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom de la catégorie ne doit pas dépasser 50 caractères.' })
  categoryName?: string;
}