import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create-supplier.dto';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
  @IsOptional()
  @IsString({ message: 'Le nom du fournisseur doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le nom du fournisseur ne doit pas dépasser 50 caractères.' })
  supplierName?: string;

  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone doit être une chaîne de caractères.' })
  @MaxLength(20, { message: 'Le numéro de téléphone ne doit pas dépasser 20 caractères.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'L\'adresse doit être une chaîne de caractères.' })
  @MaxLength(255, { message: 'L\'adresse ne doit pas dépasser 255 caractères.' })
  address?: string;
}