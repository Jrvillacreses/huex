import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, user => user.history, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    hex: string;

    @Column({ nullable: true })
    rgb: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    cmyk: string;

    @Column({ nullable: true })
    lab: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
