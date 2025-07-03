import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatut, PaymentMethod } from '../Models/payment.model';
import { Order, OrderStatut } from '../Models/order.model'; 
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>, // Pour mettre à jour la commande
  ) {}

  /**
   * Génère un nouvel ID de paiement au format "PAYXXXX" (ex: "PAY0001").
   * Trouve le plus grand ID numérique existant et l'incrémente.
   * @returns Le nouvel ID de paiement généré.
   */
  private async generateNewPayCode(): Promise<string> {
    const payments = await this.paymentRepository.find({
      select: ['payCode'],
    });

    let maxNum = 0;
    for (const payment of payments) {
      if (payment.payCode.startsWith('PAY')) {
        const numPart = parseInt(payment.payCode.substring(3), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    }

    const nextIdNum = maxNum + 1;
    const paddedId = String(nextIdNum).padStart(4, '0');
    return `PAY${paddedId}`;
  }

  /**
   * Simule l'initiation d'un paiement pour une commande.
   * Crée un enregistrement de paiement avec le statut 'Waiting'.
   * @param initiatePaymentDto Les détails du paiement.
   * @returns Le paiement créé avec le statut initial.
   * @throws NotFoundException si la commande n'est pas trouvée.
   * @throws BadRequestException si la commande est déjà payée ou annulée.
   */
  async initiatePayment(initiatePaymentDto: InitiatePaymentDto): Promise<Payment> {
    const { orderId, amount, method, paymentPhone } = initiatePaymentDto;

    // 1. Vérifier l'existence et le statut de la commande
    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }
    if (order.statut === OrderStatut.PAID) {
      throw new BadRequestException(`Order with ID ${orderId} is already paid.`);
    }
    if (order.statut === OrderStatut.CANCELLED) {
      throw new BadRequestException(`Order with ID ${orderId} is cancelled.`);
    }
    if (order.price !== amount) {
        throw new BadRequestException(`Payment amount (${amount}) does not match order price (${order.price}).`);
    }

    try {
      // 2. Générer un nouveau code de paiement
      const newPayCode = await this.generateNewPayCode();

      // 3. Créer l'enregistrement de paiement initial
      const newPayment = this.paymentRepository.create({
        payCode: newPayCode,
        orderId: orderId,
        method: method,
        amount: amount,
        paymentDate: new Date(), // Date d'initiation
        statut: PaymentStatut.WAITING, // Statut initial
        transactionNumber: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Simuler un numéro de transaction
      });

      return this.paymentRepository.save(newPayment);
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw new InternalServerErrorException('Failed to initiate payment.');
    }
  }

  /**
   * Simule la réception d'un webhook de paiement ou une mise à jour manuelle du statut.
   * Met à jour le statut du paiement et, si le paiement est 'Completed', met à jour le statut de la commande.
   * @param payCode Le code de paiement à mettre à jour.
   * @param updatePaymentDto Les données de mise à jour (statut, numéro de transaction).
   * @returns Le paiement mis à jour.
   * @throws NotFoundException si le paiement n'est pas trouvé.
   */
  async updatePaymentStatus(payCode: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { payCode } });
    if (!payment) {
      throw new NotFoundException(`Payment with code ${payCode} not found.`);
    }

    // Fusionner les données de mise à jour
    const updatedPayment = this.paymentRepository.merge(payment, updatePaymentDto);
    const savedPayment = await this.paymentRepository.save(updatedPayment);

    // Si le paiement est COMPLETED, mettre à jour le statut de la commande
    if (savedPayment.statut === PaymentStatut.COMPLETED) {
      const order = await this.orderRepository.findOne({ where: { orderId: savedPayment.orderId } });
      if (order && order.statut !== OrderStatut.PAID) {
        order.statut = OrderStatut.PAID;
        await this.orderRepository.save(order);
      }
    } else if (savedPayment.statut === PaymentStatut.FAILED) {
        // Optionnel: Gérer le cas où le paiement échoue (ex: remettre la commande en "Unpaid" ou marquer comme "Payment Failed")
        // Pour l'instant, nous ne changeons pas le statut de la commande si le paiement échoue,
        // mais vous pourriez vouloir le faire en fonction de votre logique métier.
    }

    return savedPayment;
  }

  /**
   * Récupère un paiement par son code.
   * @param payCode Le code de paiement.
   * @returns Le paiement trouvé ou null.
   */
  async findOne(payCode: string): Promise<Payment | null> {
    return this.paymentRepository.findOne({ where: { payCode } });
  }

  /**
   * Récupère tous les paiements.
   * @returns Une liste de tous les paiements.
   */
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }
}
