import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Plat } from './plat.model';
import { Order } from './order.model'; // Importation de l'entité Order

@Entity('supply')
export class Supply {
  // Clé primaire composite
  @PrimaryColumn({ type: 'int' })
  plat: number;

  @PrimaryColumn({ type: 'char', length: 10 })
  order: string; // Nom de la colonne dans la DB

  // Relation ManyToOne avec Plat
  @ManyToOne(() => Plat, plat => plat.supplies, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plat', referencedColumnName: 'platId' })
  platEntity: Plat;

  // Relation ManyToOne avec Order
  // Cette relation lie une entrée 'supply' à une 'order' spécifique
  @ManyToOne(() => Order, order => order.supplies, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order', referencedColumnName: 'orderId' })
  orderEntity: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
