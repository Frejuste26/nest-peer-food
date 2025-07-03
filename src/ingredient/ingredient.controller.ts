import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from '../Models/ingredient.model'; 

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('ingredients') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des ingrédients
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  // Tous les utilisateurs peuvent voir les ingrédients (pour la composition des plats par exemple)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Ingredient[]> {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  // Tous les utilisateurs peuvent voir un ingrédient spécifique
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(@Param('id') id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientService.findOne(+id);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
    return ingredient;
  }

  @Patch(':id')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les ingrédients
  async update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    return this.ingredientService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les ingrédients
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.ingredientService.remove(+id);
  }
}