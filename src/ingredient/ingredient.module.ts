import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { Ingredient } from '../Models/ingredient.model'; 

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])], // Enregistrer l'entité Ingredient dans ce module
  providers: [IngredientService],
  controllers: [IngredientController],
  exports: [IngredientService], // Exporter si d'autres modules ont besoin d'interagir avec IngredientService
})
export class IngredientModule {}