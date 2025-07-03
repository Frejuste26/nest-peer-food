import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.model';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  categoryName: string;

  // Relation OneToMany avec Order (une catégorie peut avoir plusieurs commandes)
  @OneToMany(() => Order, order => order.categoryEntity)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}