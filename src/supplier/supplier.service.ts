import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../Models/supplier.model';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  /**
   * Génère un nouvel ID de fournisseur au format "SUPXXXX" (ex: "SUP0001").
   * Trouve le plus grand ID numérique existant et l'incrémente.
   * @returns Le nouvel ID de fournisseur généré.
   */
  private async generateNewSupplierId(): Promise<string> {
    const suppliers = await this.supplierRepository.find({
      select: ['supplierId'],
    });

    let maxNum = 0;
    for (const supplier of suppliers) {
      if (supplier.supplierId.startsWith('SUP')) {
        const numPart = parseInt(supplier.supplierId.substring(3), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }

    const nextIdNum = maxNum + 1;
    const paddedId = String(nextIdNum).padStart(4, '0');
    return `SUP${paddedId}`;
  }

  /**
   * Crée un nouveau fournisseur.
   * @param createSupplierDto Les données pour créer le fournisseur.
   * @returns Le fournisseur créé.
   * @throws ConflictException si un fournisseur avec le même nom existe déjà.
   */
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findOne({
      where: { supplierName: createSupplierDto.supplierName },
    });
    if (existingSupplier) {
      throw new ConflictException(`Supplier with name "${createSupplierDto.supplierName}" already exists.`);
    }

    const newSupplierId = await this.generateNewSupplierId();
    const newSupplier = this.supplierRepository.create({
      ...createSupplierDto,
      supplierId: newSupplierId,
    });
    return this.supplierRepository.save(newSupplier);
  }

  /**
   * Récupère tous les fournisseurs.
   * @returns Une liste de tous les fournisseurs.
   */
  async findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  /**
   * Récupère un fournisseur par son ID.
   * @param id L'ID du fournisseur.
   * @returns Le fournisseur trouvé ou null si non trouvé.
   */
  async findOne(id: string): Promise<Supplier | null> {
    return this.supplierRepository.findOne({ where: { supplierId: id } });
  }

  /**
   * Met à jour un fournisseur existant.
   * @param id L'ID du fournisseur à mettre à jour.
   * @param updateSupplierDto Les données de mise à jour.
   * @returns Le fournisseur mis à jour.
   * @throws NotFoundException si le fournisseur n'est pas trouvé.
   * @throws ConflictException si le nouveau nom de fournisseur existe déjà.
   */
  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { supplierId: id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found.`);
    }

    // Vérifier si le nouveau nom de fournisseur est déjà pris (si le nom est mis à jour)
    if (updateSupplierDto.supplierName && updateSupplierDto.supplierName !== supplier.supplierName) {
      const existingSupplier = await this.supplierRepository.findOne({
        where: { supplierName: updateSupplierDto.supplierName },
      });
      if (existingSupplier && existingSupplier.supplierId !== id) {
        throw new ConflictException(`Supplier with name "${updateSupplierDto.supplierName}" already exists.`);
      }
    }

    const updatedSupplier = this.supplierRepository.merge(supplier, updateSupplierDto);
    return this.supplierRepository.save(updatedSupplier);
  }

  /**
   * Supprime un fournisseur.
   * @param id L'ID du fournisseur à supprimer.
   * @throws NotFoundException si le fournisseur n'est pas trouvé.
   */
  async remove(id: string): Promise<void> {
    const result = await this.supplierRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found.`);
    }
  }
}