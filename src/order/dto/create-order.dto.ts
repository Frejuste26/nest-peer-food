import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';
import { PaymentMethod } from '../../Models/order.model'; 

export class CreateOrderDto {
  @IsNotEmpty({ message: 'L\'ID du plat est requis.' })
  @IsNumber({}, { message: 'L\'ID du plat doit être un nombre.' })
  platId: number;

  @IsNotEmpty({ message: 'L\'ID du client est requis.' })
  @IsString({ message: 'L\'ID du client doit être une chaîne de caractères.' })
  customerId: string; // C'est le customerId généré (ex: CUS0001)

  @IsNotEmpty({ message: 'L\'ID de la catégorie est requis.' })
  @IsNumber({}, { message: 'L\'ID de la catégorie doit être un nombre.' })
  categoryId: number;

  @IsNotEmpty({ message: 'La date de commande est requise.' })
  @IsDateString({}, { message: 'La date de commande doit être une date valide (YYYY-MM-DD).' })
  orderDate: string; // Ex: "2025-07-03"

  @IsNotEmpty({ message: 'L\'heure de commande est requise.' })
  @IsString({ message: 'L\'heure de commande doit être une chaîne de caractères (HH:MM:SS).' })
  // Vous pouvez ajouter un validateur de format d'heure si nécessaire
  orderTime: string; // Ex: "12:30:00"

  @IsNotEmpty({ message: 'Le prix est requis.' })
  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @Min(0, { message: 'Le prix ne peut pas être négatif.' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Le numéro de téléphone de paiement doit être une chaîne de caractères.' })
  paymentPhone?: string;

  @IsNotEmpty({ message: 'La date limite de paiement est requise.' })
  @IsDateString({}, { message: 'La date limite de paiement doit être une date valide.' })
  paymentDeadline: Date; // Ex: "2025-07-03T18:00:00Z"

  @IsNotEmpty({ message: 'La date de livraison est requise.' })
  @IsDateString({}, { message: 'La date de livraison doit être une date valide (YYYY-MM-DD).' })
  deliveryDate: string; // Ex: "2025-07-04"

  @IsOptional()
  @IsEnum(PaymentMethod, { message: 'La méthode de paiement doit être valide (MTN MoMo, Orange Money, Wave).' })
  payMethod?: PaymentMethod;
}
