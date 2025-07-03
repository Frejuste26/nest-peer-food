import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserStatut {
  ADMINISTRATOR = 'Administrator',
  MANAGER = 'Manager',
}

@Entity('users') // Nom de la table dans la base de données
export class User {
  @PrimaryGeneratedColumn() // Auto-incrémenté
  userId: number;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string; // Le mot de passe haché

  @Column({ type: 'enum', enum: UserStatut, default: UserStatut.MANAGER, nullable: true })
  statut: UserStatut;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}