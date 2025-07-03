import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../Models/ingredient.model'; 
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  /**
   * Crée un nouvel ingrédient.
   * @param createIngredientDto Les données pour créer l'ingrédient.
   * @returns L'ingrédient créé.
   * @throws ConflictException si un ingrédient avec le même nom existe déjà.
   */
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const existingIngredient = await this.ingredientRepository.findOne({
      where: { ingredientName: createIngredientDto.ingredientName },
    });
    if (existingIngredient) {
      throw new ConflictException(`Ingredient with name "${createIngredientDto.ingredientName}" already exists.`);
    }

    const newIngredient = this.ingredientRepository.create(createIngredientDto);
    return this.ingredientRepository.save(newIngredient);
  }

  /**
   * Récupère tous les ingrédients.
   * @returns Une liste de tous les ingrédients.
   */
  async findAll(): Promise<Ingredient[]> {
    return this.ingredientRepository.find();
  }

  /**
   * Récupère un ingrédient par son ID.
   * @param id L'ID de l'ingrédient.
   * @returns L'ingrédient trouvé ou null si non trouvé.
   */
  async findOne(id: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne({ where: { ingredientId: id } });
  }

  /**
   * Met à jour un ingrédient existant.
   * @param id L'ID de l'ingrédient à mettre à jour.
   * @param updateIngredientDto Les données de mise à jour.
   * @returns L'ingrédient mis à jour.
   * @throws NotFoundException si l'ingrédient n'est pas trouvé.
   * @throws ConflictException si le nouveau nom d'ingrédient existe déjà.
   */
  async update(id: number, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { ingredientId: id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }

    // Vérifier si le nouveau nom d'ingrédient est déjà pris (si le nom est mis à jour)
    if (updateIngredientDto.ingredientName && updateIngredientDto.ingredientName !== ingredient.ingredientName) {
      const existingIngredient = await this.ingredientRepository.findOne({
        where: { ingredientName: updateIngredientDto.ingredientName },
      });
      if (existingIngredient && existingIngredient.ingredientId !== id) {
        throw new ConflictException(`Ingredient with name "${updateIngredientDto.ingredientName}" already exists.`);
      }
    }

    const updatedIngredient = this.ingredientRepository.merge(ingredient, updateIngredientDto);
    return this.ingredientRepository.save(updatedIngredient);
  }

  /**
   * Supprime un ingrédient.
   * @param id L'ID de l'ingrédient à supprimer.
   * @throws NotFoundException si l'ingrédient n'est pas trouvé.
   */
  async remove(id: number): Promise<void> {
    const result = await this.ingredientRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ingredient with ID ${id} not found.`);
    }
  }
}