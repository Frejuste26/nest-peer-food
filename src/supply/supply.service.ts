import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supply } from '../Models/supply.model'; 
import { Plat } from '../Models/plat.model';
import { Order } from '../Models/order.model';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto'; // Importez le DTO de mise à jour

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
    @InjectRepository(Plat)
    private readonly platRepository: Repository<Plat>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * Crée une nouvelle entrée d'approvisionnement (lie un plat à une commande).
   * @param createSupplyDto Les données pour créer l'approvisionnement.
   * @returns L'approvisionnement créé.
   * @throws NotFoundException si le plat ou la commande n'existent pas.
   * @throws ConflictException si cette liaison plat-commande existe déjà.
   */
  async create(createSupplyDto: CreateSupplyDto): Promise<Supply> {
    const { platId, orderId } = createSupplyDto;

    // 1. Valider l'existence du plat
    const plat = await this.platRepository.findOne({ where: { platId } });
    if (!plat) {
      throw new NotFoundException(`Plat with ID ${platId} not found.`);
    }

    // 2. Valider l'existence de la commande
    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    // 3. Vérifier si cette liaison plat-commande existe déjà (clé primaire composite)
    const existingSupply = await this.supplyRepository.findOne({
      where: { plat: platId, order: orderId },
    });
    if (existingSupply) {
      throw new ConflictException(`Supply for Plat ID ${platId} and Order ID ${orderId} already exists.`);
    }

    // 4. Créer la nouvelle entrée d'approvisionnement
    const newSupply = this.supplyRepository.create({
      plat: platId,
      order: orderId,
      // Si vous aviez d'autres champs dans Supply, ils iraient ici
    });

    return this.supplyRepository.save(newSupply);
  }

  /**
   * Récupère toutes les entrées d'approvisionnement, avec les relations (plat, commande).
   * @returns Une liste de toutes les entrées d'approvisionnement.
   */
  async findAll(): Promise<Supply[]> {
    return this.supplyRepository.find({
      relations: ['platEntity', 'orderEntity'], // Charger les entités liées
    });
  }

  /**
   * Récupère une entrée d'approvisionnement par ses IDs de plat et de commande.
   * @param platId L'ID du plat.
   * @param orderId L'ID de la commande.
   * @returns L'approvisionnement trouvé ou null si non trouvé.
   */
  async findOne(platId: number, orderId: string): Promise<Supply | null> {
    return this.supplyRepository.findOne({
      where: { plat: platId, order: orderId },
      relations: ['platEntity', 'orderEntity'],
    });
  }

  /**
   * Met à jour une entrée d'approvisionnement existante.
   * Étant donné que Supply n'a pas de champs modifiables en dehors de ses clés primaires,
   * cette méthode peut être utilisée pour valider l'existence ou étendre si de nouveaux champs sont ajoutés.
   * @param platId L'ID du plat de l'approvisionnement à mettre à jour.
   * @param orderId L'ID de la commande de l'approvisionnement à mettre à jour.
   * @param updateSupplyDto Les données de mise à jour (actuellement vide).
   * @returns L'approvisionnement mis à jour.
   * @throws NotFoundException si l'approvisionnement n'est pas trouvé.
   */
  async update(platId: number, orderId: string, updateSupplyDto: UpdateSupplyDto): Promise<Supply> {
    const supply = await this.supplyRepository.findOne({
      where: { plat: platId, order: orderId },
    });
    if (!supply) {
      throw new NotFoundException(`Supply for Plat ID ${platId} and Order ID ${orderId} not found.`);
    }

    // Si UpdateSupplyDto n'est pas vide à l'avenir, fusionnez les données ici:
    // const updatedSupply = this.supplyRepository.merge(supply, updateSupplyDto);
    // return this.supplyRepository.save(updatedSupply);

    // Pour l'instant, comme UpdateSupplyDto est vide, nous retournons simplement l'entité existante.
    return supply;
  }

  /**
   * Supprime une entrée d'approvisionnement.
   * @param platId L'ID du plat de l'approvisionnement à supprimer.
   * @param orderId L'ID de la commande de l'approvisionnement à supprimer.
   * @throws NotFoundException si l'approvisionnement n'est pas trouvé.
   */
  async remove(platId: number, orderId: string): Promise<void> {
    const result = await this.supplyRepository.delete({ plat: platId, order: orderId });
    if (result.affected === 0) {
      throw new NotFoundException(`Supply for Plat ID ${platId} and Order ID ${orderId} not found.`);
    }
  }
}
