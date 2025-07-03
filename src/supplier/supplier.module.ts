import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier } from '../Models/supplier.model';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])], // Enregistrer l'entité Supplier dans ce module
  providers: [SupplierService],
  controllers: [SupplierController],
  exports: [SupplierService], // Exporter si d'autres modules ont besoin d'interagir avec SupplierService
})
export class SupplierModule {}