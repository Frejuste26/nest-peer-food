import { Entity, PrimaryColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'; // Retirer JoinColumn d'ici
import { Account } from './account.model';
import { Order } from './order.model';

@Entity('customers')
export class Customer {
  @PrimaryColumn({ type: 'char', length: 10 })
  customerId: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lastname: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstname: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string;

  // Relation OneToOne avec Account
  // C'est le côté inverse de la relation. Le @JoinColumn est sur l'entité Account.
  @OneToOne(() => Account, account => account.customerEntity, { onDelete: 'CASCADE' }) // Changer 'account.customer' à 'account.customerEntity' pour correspondre au nom de propriété dans Account
  account: Account;

  @OneToMany(() => Order, order => order.customerEntity)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
