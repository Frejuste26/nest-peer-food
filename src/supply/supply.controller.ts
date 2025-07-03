// src/supply/supply.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from '../Models/supply.model';

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('supplies') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des approvisionnements
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply> {
    return this.supplyService.create(createSupplyDto);
  }

  @Get()
  // Tous les utilisateurs peuvent voir les approvisionnements (si pertinent pour eux)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Supply[]> {
    return this.supplyService.findAll();
  }

  // Récupérer un approvisionnement par platId et orderId
  @Get(':platId/:orderId')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(
    @Param('platId') platId: string,
    @Param('orderId') orderId: string,
  ): Promise<Supply> {
    const supply = await this.supplyService.findOne(+platId, orderId);
    if (!supply) {
      throw new NotFoundException(`Supply for Plat ID ${platId} and Order ID ${orderId} not found`);
    }
    return supply;
  }

  @Patch(':platId/:orderId')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les approvisionnements
  async update(
    @Param('platId') platId: string,
    @Param('orderId') orderId: string,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ): Promise<Supply> {
    // Si UpdateSupplyDto est vide, cette méthode ne fera rien d'autre que valider l'existence.
    // Si des champs modifiables sont ajoutés à Supply, le service les gérera.
    return this.supplyService.update(+platId, orderId, updateSupplyDto);
  }

  @Delete(':platId/:orderId')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les approvisionnements
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('platId') platId: string,
    @Param('orderId') orderId: string,
  ): Promise<void> {
    await this.supplyService.remove(+platId, orderId);
  }
}
