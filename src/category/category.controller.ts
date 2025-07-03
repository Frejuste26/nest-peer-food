import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../Models/category.model'; 

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('categories') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des catégories
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // Tous les utilisateurs peuvent voir les catégories
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  // Tous les utilisateurs peuvent voir une catégorie spécifique
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.findOne(+id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Patch(':id')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les catégories
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les catégories
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoryService.remove(+id);
  }
}