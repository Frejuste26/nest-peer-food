import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Plat } from './plat.model';
import { Ingredient } from './ingredient.model';

@Entity('composer')
export class Composer {
  // Clé primaire composite
  @PrimaryColumn({ type: 'int' })
  plat: number;

  @PrimaryColumn({ type: 'int' })
  ingredient: number;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit: string;

  // Relation ManyToOne avec Plat
  @ManyToOne(() => Plat, plat => plat.composers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plat', referencedColumnName: 'platId' })
  platEntity: Plat;

  // Relation ManyToOne avec Ingredient
  @ManyToOne(() => Ingredient, ingredient => ingredient.composers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredient', referencedColumnName: 'ingredientId' })
  ingredientEntity: Ingredient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}