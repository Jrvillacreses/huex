import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, user => user.favorites, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

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

  @UpdateDateColumn()
  updatedAt: Date;
}
