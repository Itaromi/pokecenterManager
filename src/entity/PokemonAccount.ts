import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "pokemonAccount" })
export class PokemonAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    nom!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    mot_de_passe_hash!: string;

    @Column({ type: "varchar", length: 20 })
    region!: string;

    @Column({ type: "varchar", length: 20 })
    ville!: string;

    @CreateDateColumn({ name: "date_creation", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date_creation!: Date;
}
