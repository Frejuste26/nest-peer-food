import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';
import { OrderStatut, PaymentMethod } from '../../Models/order.model';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNumber({}, { message: 'L\'ID du plat doit être un nombre.' })
  platId?: number;

  @IsOptional()
  @IsString({ message: 'L\'ID du client doit être une chaîne de caractères.' })
  customerId?: string;

  @IsOptional()
  @IsNumber({}, { message: 'L\'ID de la catégorie doit être un nombre.' })
  categoryId?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La date de commande doit être une date valide (YYYY-MM-DD).' })
  orderDate?: string;

  @IsOptional()
  @IsString({ message: 'L\'heure de commande doit être une chaîne de caractères (HH:MM:SS).' })
  orderTime?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @Min(0, { message: 'Le prix ne peut pas être négatif.' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone de paiement doit être une chaîne de caractères.' })
  paymentPhone?: string;

  @IsOptional()
  @IsEnum(OrderStatut, { message: 'Le statut de la commande doit être valide (Unpaid, Paid, Cancelled).' })
  statut?: OrderStatut; // Permettre la mise à jour du statut

  @IsOptional()
  @IsDateString({}, { message: 'La date limite de paiement doit être une date valide.' })
  paymentDeadline?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'La date de livraison doit être une date valide (YYYY-MM-DD).' })
  deliveryDate?: string;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'La méthode de paiement doit être valide (MTN MoMo, Orange Money, Wave).' })
  payMethod?: PaymentMethod;
}
