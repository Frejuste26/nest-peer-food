import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('supplier')
export class Supplier {
  @PrimaryColumn({ type: 'char', length: 10 })
  supplierId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  supplierName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}