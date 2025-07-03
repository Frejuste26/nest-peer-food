import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.model'; 

export enum PaymentMethod { 
  MTN_MOMO = 'MTN MoMo',
  ORANGE_MONEY = 'Orange Money',
  WAVE = 'Wave',
}

export enum PaymentStatut {
  WAITING = 'Waiting',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

@Entity('payments')
export class Payment {
  @PrimaryColumn({ type: 'char', length: 10 })
  payCode: string;

  @Column({ type: 'char', length: 10, nullable: false })
  orderId: string; // Clé étrangère brute

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  method: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transactionNumber: string;

  @Column({ type: 'datetime', nullable: true })
  paymentDate: Date;

  @Column({ type: 'enum', enum: PaymentStatut, default: PaymentStatut.WAITING, nullable: true })
  statut: PaymentStatut;

  // Relation ManyToOne avec Order
  @ManyToOne(() => Order, order => order.payments, { onDelete: 'RESTRICT' }) // Ou 'CASCADE' si la suppression d'une commande doit supprimer les paiements
  @JoinColumn({ name: 'orderId', referencedColumnName: 'orderId' })
  orderEntity: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}