import { PartialType } from '@nestjs/mapped-types';
import { CreateComposerDto } from './create-composer.dto';
import { IsNumber, IsString, IsOptional, Min, MaxLength } from 'class-validator';

// PartialType rend toutes les propriétés de CreateComposerDto optionnelles.
// Cependant, pour une mise à jour d'une clé primaire composite, les clés elles-mêmes ne sont pas modifiables.
// Nous allons donc explicitement définir les champs modifiables.
export class UpdateComposerDto {
  @IsOptional()
  @IsNumber({}, { message: 'La quantité doit être un nombre.' })
  @Min(0, { message: 'La quantité ne peut pas être négative.' })
  quantity?: number;

  @IsOptional()
  @IsString({ message: 'L\'unité doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'L\'unité ne doit pas dépasser 50 caractères.' })
  unit?: string;
}