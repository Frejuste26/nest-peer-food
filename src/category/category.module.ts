import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from '../Models/category.model'; 

@Module({
  imports: [TypeOrmModule.forFeature([Category])], 
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService], 
})
export class CategoryModule {}