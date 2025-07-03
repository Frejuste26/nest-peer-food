import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { ComposerService } from './composer.service';
import { CreateComposerDto } from './dto/create-composer.dto';
import { UpdateComposerDto } from './dto/update-composer.dto';
import { Composer } from '../Models/composer.model';

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('composers') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class ComposerController {
  constructor(private readonly composerService: ComposerService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des compositions
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createComposerDto: CreateComposerDto): Promise<Composer> {
    return this.composerService.create(createComposerDto);
  }

  @Get()
  // Tous les utilisateurs peuvent voir la composition des plats
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Composer[]> {
    return this.composerService.findAll();
  }

  // Récupérer une composition par platId et ingredientId
  @Get(':platId/:ingredientId')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(
    @Param('platId') platId: string,
    @Param('ingredientId') ingredientId: string,
  ): Promise<Composer> {
    const composer = await this.composerService.findOne(+platId, +ingredientId);
    if (!composer) {
      throw new NotFoundException(`Composition for Plat ID ${platId} and Ingredient ID ${ingredientId} not found`);
    }
    return composer;
  }

  @Patch(':platId/:ingredientId')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les compositions
  async update(
    @Param('platId') platId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() updateComposerDto: UpdateComposerDto,
  ): Promise<Composer> {
    return this.composerService.update(+platId, +ingredientId, updateComposerDto);
  }

  @Delete(':platId/:ingredientId')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les compositions
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('platId') platId: string,
    @Param('ingredientId') ingredientId: string,
  ): Promise<void> {
    await this.composerService.remove(+platId, +ingredientId);
  }
}