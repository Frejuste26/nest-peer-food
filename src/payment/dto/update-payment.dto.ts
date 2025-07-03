import { PartialType } from '@nestjs/mapped-types';
import { InitiatePaymentDto } from './initiate-payment.dto';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentStatut } from '../../Models/payment.model';

export class UpdatePaymentDto extends PartialType(InitiatePaymentDto) {
  @IsOptional()
  @IsString({ message: 'Le numéro de transaction doit être une chaîne de caractères.' })
  transactionNumber?: string;

  @IsOptional()
  @IsEnum(PaymentStatut, { message: 'Le statut de paiement doit être valide (Waiting, Completed, Failed).' })
  statut?: PaymentStatut;
}
