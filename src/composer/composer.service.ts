import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Composer } from '../Models/composer.model';
import { Plat } from '../Models/plat.model';
import { Ingredient } from '../Models/ingredient.model';
import { CreateComposerDto } from './dto/create-composer.dto';
import { UpdateComposerDto } from './dto/update-composer.dto';

@Injectable()
export class ComposerService {
  constructor(
    @InjectRepository(Composer)
    private readonly composerRepository: Repository<Composer>,
    @InjectRepository(Plat)
    private readonly platRepository: Repository<Plat>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  /**
   * Crée une nouvelle entrée de composition (lie un plat à un ingrédient).
   * @param createComposerDto Les données pour créer la composition.
   * @returns La composition créée.
   * @throws NotFoundException si le plat ou l'ingrédient n'existent pas.
   * @throws ConflictException si cette composition existe déjà.
   */
  async create(createComposerDto: CreateComposerDto): Promise<Composer> {
    const { platId, ingredientId, ...composerDetails } = createComposerDto;

    // 1. Valider l'existence du plat
    const plat = await this.platRepository.findOne({ where: { platId } });
    if (!plat) {
      throw new NotFoundException(`Plat with ID ${platId} not found.`);
    }

    // 2. Valider l'existence de l'ingrédient
    const ingredient = await this.ingredientRepository.findOne({ where: { ingredientId } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found.`);
    }

    // 3. Vérifier si cette composition existe déjà (clé primaire composite)
    const existingComposer = await this.composerRepository.findOne({
      where: { plat: platId, ingredient: ingredientId },
    });
    if (existingComposer) {
      throw new ConflictException(`Composition for Plat ID ${platId} and Ingredient ID ${ingredientId} already exists.`);
    }

    // 4. Créer la nouvelle composition
    const newComposer = this.composerRepository.create({
      plat: platId,
      ingredient: ingredientId,
      ...composerDetails,
    });

    return this.composerRepository.save(newComposer);
  }

  /**
   * Récupère toutes les compositions, avec les relations (plat, ingrédient).
   * @returns Une liste de toutes les compositions.
   */
  async findAll(): Promise<Composer[]> {
    return this.composerRepository.find({
      relations: ['platEntity', 'ingredientEntity'], // Charger les entités liées
    });
  }

  /**
   * Récupère une composition par ses IDs de plat et d'ingrédient.
   * @param platId L'ID du plat.
   * @param ingredientId L'ID de l'ingrédient.
   * @returns La composition trouvée ou null si non trouvée.
   */
  async findOne(platId: number, ingredientId: number): Promise<Composer | null> {
    return this.composerRepository.findOne({
      where: { plat: platId, ingredient: ingredientId },
      relations: ['platEntity', 'ingredientEntity'],
    });
  }

  /**
   * Met à jour une composition existante.
   * @param platId L'ID du plat de la composition à mettre à jour.
   * @param ingredientId L'ID de l'ingrédient de la composition à mettre à jour.
   * @param updateComposerDto Les données de mise à jour (quantité, unité).
   * @returns La composition mise à jour.
   * @throws NotFoundException si la composition n'est pas trouvée.
   */
  async update(platId: number, ingredientId: number, updateComposerDto: UpdateComposerDto): Promise<Composer> {
    const composer = await this.composerRepository.findOne({
      where: { plat: platId, ingredient: ingredientId },
    });
    if (!composer) {
      throw new NotFoundException(`Composition for Plat ID ${platId} and Ingredient ID ${ingredientId} not found.`);
    }

    const updatedComposer = this.composerRepository.merge(composer, updateComposerDto);
    return this.composerRepository.save(updatedComposer);
  }

  /**
   * Supprime une composition.
   * @param platId L'ID du plat de la composition à supprimer.
   * @param ingredientId L'ID de l'ingrédient de la composition à supprimer.
   * @throws NotFoundException si la composition n'est pas trouvée.
   */
  async remove(platId: number, ingredientId: number): Promise<void> {
    const result = await this.composerRepository.delete({ plat: platId, ingredient: ingredientId });
    if (result.affected === 0) {
      throw new NotFoundException(`Composition for Plat ID ${platId} and Ingredient ID ${ingredientId} not found.`);
    }
  }
}
