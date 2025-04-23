import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from 'typeorm';
import { Soin } from './Soin';

@Entity({ name: 'types_soins' })
export class TypeSoin {
    @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
    id!: number;

    @Column({ length: 50, unique: true })
    nom!: string;

    @ManyToMany(() => Soin, (soin) => soin.typeSoin)
    soins!: Soin[];
}