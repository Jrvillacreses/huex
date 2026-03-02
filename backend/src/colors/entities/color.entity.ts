import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameEs: string; // Spanish name

  @Column({ unique: true })
  hex: string;

  @Column()
  rgb: string; // Format: "r,g,b"

  @Column()
  r: number;

  @Column()
  g: number;

  @Column()
  b: number;

  @Column({ nullable: true })
  cmyk: string;

  @Column({ nullable: true })
  lab: string;
}
