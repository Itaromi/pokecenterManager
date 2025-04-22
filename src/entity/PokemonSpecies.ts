// ... (Code de l'entite PokemonSpecies comme defini precedemment) ...
import { Entity, PrimaryColumn, Column, OneToMany, Index } from 'typeorm';
//import { IndividualPokemon } from './IndividualPokemon'; // Vous devrez creer cette entite plus tard

@Entity('Pokemon_Species')
@Index(['species_name'], { unique: true })
export class PokemonSpecies {

    @PrimaryColumn({ type: 'int', name: 'pokedex_number' })
    pokedex_number?: number;

    @Column({ type: 'varchar', length: 50, name: 'species_name', unique: true, nullable: false })
    species_name?: string;

    @Column({ type: 'varchar', length: 20, name: 'type1', nullable: false })
    type1?: string;

    @Column({ type: 'varchar', length: 20, name: 'type2', nullable: true })
    type2?: string | null;

    @Column({ type: 'int', name: 'base_hp', nullable: false })
    base_hp?: number;
    // ... ajoutez les autres champs de statistiques ...
    @Column({ type: 'int', name: 'base_attack', nullable: false })
    base_attack?: number;
    @Column({ type: 'int', name: 'base_defense', nullable: false })
    base_defense?: number;
    @Column({ type: 'int', name: 'base_special_attack', nullable: false })
    base_special_attack?: number;
    @Column({ type: 'int', name: 'base_special_defense', nullable: false })
    base_special_defense?: number;
    @Column({ type: 'int', name: 'base_speed', nullable: false })
    base_speed?: number;


    @Column({ type: 'text', name: 'description', nullable: true })
    description?: string | null;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'height', nullable: true })
    height?: number | null;

    @Column({ type: 'decimal', precision: 5, scale: 2, name: 'weight', nullable: true })
    weight?: number | null;

    // Relation (commentee pour l'instant si l'autre entite n'existe pas encore)
    // @OneToMany(() => IndividualPokemon, individualPokemon => individualPokemon.species)
    // individualPokemon: IndividualPokemon[];
}