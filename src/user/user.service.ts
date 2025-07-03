import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { User } from '../Models/user.model'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    // Injecter le Repository de l'entité User pour interagir avec la DB
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Méthode pour créer un nouvel utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  // Méthode pour trouver tous les utilisateurs
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Méthode pour trouver un utilisateur par son ID
  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  // Méthode pour mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // 1. Chercher l'utilisateur existant
    const user = await this.userRepository.findOne({ where: { userId: id } });

    // 2. Si l'utilisateur n'est pas trouvé, lancer une exception NotFoundException
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // 3. Fusionner les données du DTO avec l'utilisateur existant
    // TypeORM's .merge() est idéal pour cela car il gère les entités et les objets simples
    const updatedUser = this.userRepository.merge(user, updateUserDto);

    // 4. Sauvegarder l'entité fusionnée. TypeORM détectera qu'il s'agit d'une mise à jour.
    return this.userRepository.save(updatedUser);
  }

  // Méthode pour supprimer un utilisateur
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
