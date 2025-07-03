import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from '../Models/payment.model';
import { Order } from '../Models/order.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order]), // Enregistrer les entités nécessaires
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService], // Exporter si d'autres modules ont besoin d'interagir avec PaymentService
})
export class PaymentModule {}