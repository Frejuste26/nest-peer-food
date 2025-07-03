import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.model'; // Assurez-vous d'importer l'entité Customer

export enum AccountRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
}

export enum AccountStatut {
  ENABLED = 'Enabled',
  DISABLED = 'Disabled',
}

@Entity('accounts') // Nom de la table dans la base de données
export class Account {
  @PrimaryGeneratedColumn() // Auto-incrémenté
  accountId: number;

  @Column({ type: 'char', length: 10 })
  customer: string; // Cette colonne est la clé étrangère brute

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mdpasse: string; // Le mot de passe haché

  @Column({ type: 'enum', enum: AccountRole, default: AccountRole.STUDENT })
  role: AccountRole;

  @Column({ type: 'enum', enum: AccountStatut, default: AccountStatut.ENABLED, nullable: true })
  statut: AccountStatut;

  @Column({ type: 'varchar', length: 10, nullable: true })
  codeVerif: string;

  // Relation OneToOne avec Customer
  // Le côté propriétaire de la relation (celui qui a la clé étrangère)
  @OneToOne(() => Customer, customer => customer.account)
  @JoinColumn({ name: 'customer', referencedColumnName: 'customerId' }) // 'customer' dans Accounts est la FK vers 'customerId' dans Customers
  customerEntity: Customer; // Nom de la propriété pour l'objet Customer lié

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
