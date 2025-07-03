import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { Supply } from '../Models/supply.model';
import { Plat } from '../Models/plat.model';
import { Order } from '../Models/order.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supply, Plat, Order]), // Enregistrer les entités nécessaires
  ],
  providers: [SupplyService],
  controllers: [SupplyController],
  exports: [SupplyService], // Exporter si d'autres modules ont besoin d'interagir avec SupplyService
})
export class SupplyModule {}