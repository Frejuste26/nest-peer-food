import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { PlatService } from './plat.service';
import { CreatePlatDto } from './dto/create-plat.dto';
import { UpdatePlatDto } from './dto/update-plat.dto';
import { Plat } from '../Models/plat.model'; 

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model'; 
import { AccountRole } from 'src/Models/account.model';

@Controller('plats') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class PlatController {
  constructor(private readonly platService: PlatService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des plats
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlatDto: CreatePlatDto): Promise<Plat> {
    return this.platService.create(createPlatDto);
  }

  @Get()
  // Correction ici : Utilisez AccountRole.STUDENT et AccountRole.TEACHER
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Plat[]> {
    return this.platService.findAll();
  }

  @Get(':id')
  // Correction ici : Utilisez AccountRole.STUDENT et AccountRole.TEACHER
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(@Param('id') id: string): Promise<Plat> {
    const plat = await this.platService.findOne(+id);
    if (!plat) {
      throw new NotFoundException(`Plat with ID ${id} not found`);
    }
    return plat;
  }

  @Patch(':id')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les plats
  async update(@Param('id') id: string, @Body() updatePlatDto: UpdatePlatDto): Promise<Plat> {
    return this.platService.update(+id, updatePlatDto); // Le service gère déjà NotFoundException
  }

  @Delete(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les plats
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.platService.remove(+id); // Le service gère déjà NotFoundException
  }
}
