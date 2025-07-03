import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatut } from '../Models/user.model'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard';     
import { Roles, AllowedRoles } from '../auth/roles.decorator'; 

@Controller('users')
// Appliquer les guards au niveau du contrôleur pour toutes les routes
@UseGuards(JwtAuthGuard, RolesGuard) // D'abord JwtAuthGuard pour authentifier, puis RolesGuard pour vérifier les rôles
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // Définir les rôles autorisés pour la création d'utilisateurs (ex: seulement les administrateurs)
  @Roles(UserStatut.ADMINISTRATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  // Définir les rôles autorisés pour la lecture de tous les utilisateurs (ex: admins et managers)
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  // Définir les rôles autorisés pour la lecture d'un utilisateur spécifique
  @Roles(UserStatut.ADMINISTRATOR, UserStatut.MANAGER)
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent mettre à jour les utilisateurs (admin/manager)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.update(+id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  @Delete(':id')
  @Roles(UserStatut.ADMINISTRATOR) // Seuls les administrateurs peuvent supprimer les utilisateurs (admin/manager)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.remove(+id); // UserService gère déjà NotFoundException
  }
}
