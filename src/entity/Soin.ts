import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import {Pokemon} from './Pokemon';
import {TypeSoin} from './TypeSoin';

@Entity({name: 'soin'})
export class Soin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({name: 'soin_date', type: 'date'})
    soinDate!: string;

    @Column({type: 'text', nullable: true})
    notes?: string;

    @ManyToOne(() => Pokemon, (pokemon) => pokemon.soins, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'pokemon_id'})
    pokemon!: Pokemon;

    @ManyToOne(() => TypeSoin, (typeSoin) => typeSoin.soins)
    @JoinColumn({name: 'type_soin_id'})
    typeSoin!: TypeSoin;
}