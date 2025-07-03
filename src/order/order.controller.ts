// src/order/order.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '../Models/order.model'; 

// Importations pour l'authentification et l'autorisation
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserStatut } from '../Models/user.model';
import { AccountRole } from '../Models/account.model';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // Applique les guards au niveau du contrôleur
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  // Seuls les étudiants et les enseignants peuvent créer des commandes
  @Roles(AccountRole.STUDENT, AccountRole.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req): Promise<Order> {
    // Optionnel: Assurez-vous que le customerId du DTO correspond à l'utilisateur authentifié
    // if (req.user.role === AccountRole.STUDENT || req.user.role === AccountRole.TEACHER) {
    //   if (req.user.sub !== createOrderDto.customerId) {
    //     throw new BadRequestException('You can only create orders for your own customer ID.');
    //   }
    // }
    return this.orderService.create(createOrderDto);
  }

  @Get()
  // Tous les rôles peuvent voir toutes les commandes (les admins/managers pour la gestion, les clients pour leurs propres commandes)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':id')
  // Tous les rôles peuvent voir une commande spécifique
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER, AccountRole.STUDENT, AccountRole.TEACHER)
  async findOne(@Param('id') id: string): Promise<Order> {
    const order = await this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Patch(':id')
  // Seuls les administrateurs et managers peuvent mettre à jour les commandes (ex: changer le statut)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER)
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  // Seuls les administrateurs peuvent supprimer les commandes
  @Roles(UserStatut.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.orderService.remove(id);
  }
}
