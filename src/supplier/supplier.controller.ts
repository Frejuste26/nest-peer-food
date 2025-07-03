import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from '../Models/supplier.model'; 

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('suppliers') // Préfixe de route pour ce contrôleur
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent créer des fournisseurs
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  // Tous les utilisateurs peuvent voir les fournisseurs (par exemple, pour des informations de contact)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  // Tous les utilisateurs peuvent voir un fournisseur spécifique
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(@Param('id') id: string): Promise<Supplier> {
    const supplier = await this.supplierService.findOne(id);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  @Patch(':id')
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER) // Seuls Admin/Manager peuvent mettre à jour les fournisseurs
  async update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les fournisseurs
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.supplierService.remove(id);
  }
}