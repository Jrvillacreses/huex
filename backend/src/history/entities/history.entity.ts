import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class History {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 1 }) // Assuming simple single user for now or handled via auth later
    userId: number;

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
}
