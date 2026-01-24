import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hex: string;

  @Column()
  name: string;

  @Column()
  rgb: string;

  @Column()
  cmyk: string;

  @Column()
  lab: string;

  @CreateDateColumn()
  createdAt: Date;
}
