import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Composer } from './composer.model'; // Importation de l'entité Composer
import { Order } from './order.model';     // Importation de l'entité Order
import { Supply } from './supply.model';   // Importation de l'entité Supply

@Entity('plats')
export class Plat {
  @PrimaryGeneratedColumn()
  platId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  platName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'boolean', default: true })
  availability: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagePath: string;

  // Relation OneToMany avec Composer (un plat a plusieurs ingrédients dans sa composition)
  @OneToMany(() => Composer, composer => composer.platEntity)
  composers: Composer[];

  // Relation OneToMany avec Order (un plat peut être commandé plusieurs fois)
  @OneToMany(() => Order, order => order.platEntity)
  orders: Order[];

  // Relation OneToMany avec Supply (un plat peut être lié à plusieurs livraisons/approvisionnements)
  @OneToMany(() => Supply, supply => supply.platEntity)
  supplies: Supply[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
