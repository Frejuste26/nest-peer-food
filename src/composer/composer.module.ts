import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComposerService } from './composer.service';
import { ComposerController } from './composer.controller';
import { Composer } from '../Models/composer.model'; 
import { Plat } from '../Models/plat.model';       
import { Ingredient } from '../Models/ingredient.model'; 
@Module({
  imports: [
    TypeOrmModule.forFeature([Composer, Plat, Ingredient]), // Enregistrer les entités nécessaires
  ],
  providers: [ComposerService],
  controllers: [ComposerController],
  exports: [ComposerService], // Exporter si d'autres modules ont besoin d'interagir avec ComposerService
})
export class ComposerModule {}