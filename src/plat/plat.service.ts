import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plat } from '../Models/plat.model'; 
import { CreatePlatDto } from './dto/create-plat.dto';
import { UpdatePlatDto } from './dto/update-plat.dto';

@Injectable()
export class PlatService {
  constructor(
    @InjectRepository(Plat)
    private readonly platRepository: Repository<Plat>,
  ) {}

  /**
   * Crée un nouveau plat.
   * @param createPlatDto Les données pour créer le plat.
   * @returns Le plat créé.
   */
  async create(createPlatDto: CreatePlatDto): Promise<Plat> {
    const newPlat = this.platRepository.create(createPlatDto);
    return this.platRepository.save(newPlat);
  }

  /**
   * Récupère tous les plats.
   * @returns Une liste de tous les plats.
   */
  async findAll(): Promise<Plat[]> {
    return this.platRepository.find();
  }

  /**
   * Récupère un plat par son ID.
   * @param id L'ID du plat.
   * @returns Le plat trouvé ou null si non trouvé.
   */
  async findOne(id: number): Promise<Plat | null> {
    return this.platRepository.findOne({ where: { platId: id } });
  }

  /**
   * Met à jour un plat existant.
   * @param id L'ID du plat à mettre à jour.
   * @param updatePlatDto Les données de mise à jour.
   * @returns Le plat mis à jour.
   * @throws NotFoundException si le plat n'est pas trouvé.
   */
  async update(id: number, updatePlatDto: UpdatePlatDto): Promise<Plat> {
    const plat = await this.platRepository.findOne({ where: { platId: id } });
    if (!plat) {
      throw new NotFoundException(`Plat with ID ${id} not found.`);
    }

    // Fusionne les données du DTO avec l'entité existante
    const updatedPlat = this.platRepository.merge(plat, updatePlatDto);
    return this.platRepository.save(updatedPlat);
  }

  /**
   * Supprime un plat.
   * @param id L'ID du plat à supprimer.
   * @throws NotFoundException si le plat n'est pas trouvé.
   */
  async remove(id: number): Promise<void> {
    const result = await this.platRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Plat with ID ${id} not found.`);
    }
  }
}
