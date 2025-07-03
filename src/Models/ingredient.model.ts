import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Composer } from './composer.model'; // Importation de l'entité Composer

@Entity('ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  ingredientId: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  ingredientName: string;

  // Relation OneToMany avec Composer (un ingrédient peut être dans plusieurs compositions)
  @OneToMany(() => Composer, composer => composer.ingredientEntity)
  composers: Composer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}