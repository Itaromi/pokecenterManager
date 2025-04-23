import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Soin } from './Soin';

@Entity({ name: 'types_soins' })
export class TypeSoin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 50, unique: true })
    nom!: string;

    @OneToMany(() => Soin, (soin) => soin.typeSoin)
    soins!: Soin[];
}