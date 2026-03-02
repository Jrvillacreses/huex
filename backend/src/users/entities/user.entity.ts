import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { History } from '../../history/entities/history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'datetime', nullable: true })
  lastSyncAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  preferences: {
    language?: string;
    theme?: string;
    notifications?: boolean;
  };

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => History, history => history.user)
  history: History[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
