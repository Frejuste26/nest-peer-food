import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../Models/order.model';
import { Plat } from '../Models/plat.model';
import { Customer } from '../Models/customer.model';
import { Category } from '../Models/category.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Plat, Customer, Category]), // Enregistrer les entités nécessaires
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService], // Exportez si d'autres modules ont besoin d'interagir avec OrderService
})
export class OrderModule {}
