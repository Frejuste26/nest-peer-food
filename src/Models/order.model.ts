import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Plat } from './plat.model';
import { Customer } from './customer.model';
import { Category } from './category.model';
import { Payment } from './payment.model'; 
import { Supply } from './supply.model'; 

export enum OrderStatut {
  UNPAID = 'Unpaid',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

export enum PaymentMethod {
  MTN_MOMO = 'MTN MoMo',
  ORANGE_MONEY = 'Orange Money',
  WAVE = 'Wave',
}

@Entity('orders')
export class Order {
  @PrimaryColumn({ type: 'char', length: 10 })
  orderId: string;

  @Column({ type: 'int', nullable: false })
  plat: number;

  @Column({ type: 'char', length: 10, nullable: false })
  customer: string;

  @Column({ type: 'int', nullable: false })
  category: number;

  @Column({ type: 'date', nullable: false })
  orderDate: string; // Ou Date, dépend de comment vous voulez le gérer (string 'YYYY-MM-DD')

  @Column({ type: 'time', nullable: false })
  orderTime: string; // Ou Date, dépend de comment vous voulez le gérer (string 'HH:MM:SS')

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  paymentPhone: string;

  @Column({ type: 'enum', enum: OrderStatut, default: OrderStatut.UNPAID })
  statut: OrderStatut;

  @Column({ type: 'datetime', nullable: false })
  paymentDeadline: Date;

  @Column({ type: 'date', nullable: false })
  deliveryDate: string; // Ou Date

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  payMethod: PaymentMethod;

  // Relations ManyToOne
  @ManyToOne(() => Plat, plat => plat.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plat', referencedColumnName: 'platId' })
  platEntity: Plat;

  @ManyToOne(() => Customer, (customer: Customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer', referencedColumnName: 'customerId' })
  customerEntity: Customer;

  @ManyToOne(() => Category, category => category.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category', referencedColumnName: 'categoryId' })
  categoryEntity: Category;

  // Relation OneToMany avec Payment (une commande peut avoir plusieurs tentatives de paiement)
  @OneToMany(() => Payment, payment => payment.orderEntity)
  payments: Payment[];

  // Relation OneToMany avec Supply (une commande peut être liée à plusieurs approvisionnements)
  @OneToMany(() => Supply, supply => supply.orderEntity)
  supplies: Supply[];


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}