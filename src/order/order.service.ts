import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatut } from '../Models/order.model'; // Assurez-vous du bon chemin
import { Plat } from '../Models/plat.model';
import { Customer } from '../Models/customer.model';
import { Category } from '../Models/category.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Plat)
    private readonly platRepository: Repository<Plat>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Génère un nouvel ID de commande au format "ORDXXXX" (ex: "ORD0001").
   * Trouve le plus grand ID numérique existant et l'incrémente.
   * @returns Le nouvel ID de commande généré.
   */
  private async generateNewOrderId(): Promise<string> {
    const orders = await this.orderRepository.find({
      select: ['orderId'],
    });

    let maxNum = 0;
    for (const order of orders) {
      if (order.orderId.startsWith('ORD')) {
        const numPart = parseInt(order.orderId.substring(3), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }

    const nextIdNum = maxNum + 1;
    const paddedId = String(nextIdNum).padStart(4, '0');
    return `ORD${paddedId}`;
  }


  /**
   * Crée une nouvelle commande.
   * Valide l'existence du plat, du client et de la catégorie.
   * @param createOrderDto Les données pour créer la commande.
   * @returns La commande créée.
   * @throws NotFoundException si le plat, le client ou la catégorie n'existent pas.
   * @throws BadRequestException si le plat n'est pas disponible.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { platId, customerId, categoryId, ...orderData } = createOrderDto;

    // 1. Valider l'existence du plat
    const plat = await this.platRepository.findOne({ where: { platId } });
    if (!plat) {
      throw new NotFoundException(`Plat with ID ${platId} not found.`);
    }
    if (!plat.availability) {
      throw new BadRequestException(`Plat "${plat.platName}" is not available.`);
    }

    // 2. Valider l'existence du client
    const customer = await this.customerRepository.findOne({ where: { customerId } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found.`);
    }

    // 3. Valider l'existence de la catégorie
    const category = await this.categoryRepository.findOne({ where: { categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    try {
      // 4. Générer un nouvel ID de commande
      const newOrderId = await this.generateNewOrderId();

      // 5. Créer la nouvelle commande
      const newOrder = this.orderRepository.create({
        orderId: newOrderId,
        plat: plat.platId, // Utiliser l'ID brut pour la colonne FK
        customer: customer.customerId, // Utiliser l'ID brut pour la colonne FK
        category: category.categoryId, // Utiliser l'ID brut pour la colonne FK
        ...orderData,
        // Assurez-vous que le prix de la commande correspond au prix du plat si nécessaire
        // price: plat.price, // Si le prix doit être tiré du plat
        statut: OrderStatut.UNPAID, // Nouvelle commande est par défaut "Unpaid"
      });

      return this.orderRepository.save(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('Failed to create order.');
    }
  }

  /**
   * Récupère toutes les commandes, avec les relations (plat, client, catégorie).
   * @returns Une liste de toutes les commandes.
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['platEntity', 'customerEntity', 'categoryEntity'], // Charger les entités liées
    });
  }

  /**
   * Récupère une commande par son ID, avec les relations.
   * @param id L'ID de la commande.
   * @returns La commande trouvée ou null si non trouvée.
   */
  async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { orderId: id },
      relations: ['platEntity', 'customerEntity', 'categoryEntity'],
    });
  }

  /**
   * Met à jour une commande existante.
   * @param id L'ID de la commande à mettre à jour.
   * @param updateOrderDto Les données de mise à jour.
   * @returns La commande mise à jour.
   * @throws NotFoundException si la commande n'est pas trouvée.
   * @throws BadRequestException si des IDs de relation sont invalides.
   */
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { orderId: id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }

    // Valider les IDs de relation si elles sont mises à jour
    if (updateOrderDto.platId) {
      const plat = await this.platRepository.findOne({ where: { platId: updateOrderDto.platId } });
      if (!plat) throw new BadRequestException(`Plat with ID ${updateOrderDto.platId} not found.`);
      order.plat = plat.platId;
    }
    if (updateOrderDto.customerId) {
      const customer = await this.customerRepository.findOne({ where: { customerId: updateOrderDto.customerId } });
      if (!customer) throw new BadRequestException(`Customer with ID ${updateOrderDto.customerId} not found.`);
      order.customer = customer.customerId;
    }
    if (updateOrderDto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { categoryId: updateOrderDto.categoryId } });
      if (!category) throw new BadRequestException(`Category with ID ${updateOrderDto.categoryId} not found.`);
      order.category = category.categoryId;
    }

    // Fusionne les données du DTO avec l'entité existante
    const updatedOrder = this.orderRepository.merge(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  /**
   * Supprime une commande.
   * @param id L'ID de la commande à supprimer.
   * @throws NotFoundException si la commande n'est pas trouvée.
   */
  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found.`);
    }
  }
}
