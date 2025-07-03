import { IsString, IsNotEmpty, IsNumber, IsEnum, Min } from 'class-validator';
import { PaymentMethod } from '../../Models/payment.model';

export class InitiatePaymentDto {
  @IsNotEmpty({ message: 'L\'ID de la commande est requis.' })
  @IsString({ message: 'L\'ID de la commande doit être une chaîne de caractères.' })
  orderId: string;

  @IsNotEmpty({ message: 'Le montant est requis.' })
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @Min(0, { message: 'Le montant ne peut pas être négatif.' })
  amount: number;

  @IsNotEmpty({ message: 'La méthode de paiement est requise.' })
  @IsEnum(PaymentMethod, { message: 'La méthode de paiement doit être valide (MTN MoMo, Orange Money, Wave).' })
  method: PaymentMethod;

  @IsNotEmpty({ message: 'Le numéro de téléphone de paiement est requis.' })
  @IsString({ message: 'Le numéro de téléphone de paiement doit être une chaîne de caractères.' })
  paymentPhone: string;
}