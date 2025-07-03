import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../Models/category.model'; // Assurez-vous du bon chemin
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Crée une nouvelle catégorie.
   * @param createCategoryDto Les données pour créer la catégorie.
   * @returns La catégorie créée.
   * @throws ConflictException si une catégorie avec le même nom existe déjà.
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { categoryName: createCategoryDto.categoryName },
    });
    if (existingCategory) {
      throw new ConflictException(`Category with name "${createCategoryDto.categoryName}" already exists.`);
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  /**
   * Récupère toutes les catégories.
   * @returns Une liste de toutes les catégories.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  /**
   * Récupère une catégorie par son ID.
   * @param id L'ID de la catégorie.
   * @returns La catégorie trouvée ou null si non trouvée.
   */
  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { categoryId: id } });
  }

  /**
   * Met à jour une catégorie existante.
   * @param id L'ID de la catégorie à mettre à jour.
   * @param updateCategoryDto Les données de mise à jour.
   * @returns La catégorie mise à jour.
   * @throws NotFoundException si la catégorie n'est pas trouvée.
   * @throws ConflictException si le nouveau nom de catégorie existe déjà.
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { categoryId: id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    // Vérifier si le nouveau nom de catégorie est déjà pris (si le nom est mis à jour)
    if (updateCategoryDto.categoryName && updateCategoryDto.categoryName !== category.categoryName) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { categoryName: updateCategoryDto.categoryName },
      });
      if (existingCategory && existingCategory.categoryId !== id) {
        throw new ConflictException(`Category with name "${updateCategoryDto.categoryName}" already exists.`);
      }
    }

    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(updatedCategory);
  }

  /**
   * Supprime une catégorie.
   * @param id L'ID de la catégorie à supprimer.
   * @throws NotFoundException si la catégorie n'est pas trouvée.
   */
  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
  }
}
