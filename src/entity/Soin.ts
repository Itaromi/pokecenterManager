import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany} from 'typeorm';
import {TypeSoin} from "./TypeSoin";
import {PokemonPatient} from "./PokemonPatient";
//import {Pokemon} from './Pokemon';
//import {TypeSoin} from './TypeSoin';

@Entity({name: 'soin'})
export class Soin {
    @PrimaryGeneratedColumn('increment', {type: 'int', name: 'id'})
    id!: number;

    @Column({name: 'soin_date', type: 'date'})
    soinDate!: string;

    @Column({type: 'text', nullable: true})
    notes!: string;

    @ManyToOne(() => PokemonPatient, (pokemon) => pokemon.soins, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'pokemon_id'})
    pokemon!: PokemonPatient;

    @ManyToMany(() => TypeSoin, (typeSoin) => typeSoin.soins)
    @JoinColumn({name: 'type_soin_id'})
    typeSoin: TypeSoin | undefined;
}