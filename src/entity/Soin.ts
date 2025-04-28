import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad
} from 'typeorm';
import { TypeSoin } from "./TypeSoin";
import { PokemonPatient } from "./PokemonPatient";
import { encrypt, decrypt } from "../utils/cryptoUtils";

@Entity({ name: 'soin' })
export class Soin {
    @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
    id!: number;

    @Column({ name: 'soin_date', type: 'varchar', length: 512 }) // Stocké chiffré
    soinDate!: string;

    @Column({ type: 'varchar', length: 512, nullable: true }) // Stocké chiffré aussi
    notes!: string;

    @ManyToOne(() => PokemonPatient, (pokemon) => pokemon.soins, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pokemon_id' })
    pokemon!: PokemonPatient;

    @ManyToMany(() => TypeSoin, (typeSoin) => typeSoin.soins)
    @JoinColumn({ name: 'type_soin_id' })
    typeSoin: TypeSoin | undefined;

    // Champs déchiffrés temporaires
    private decryptedFields: Partial<Record<keyof Soin, string>> = {};

    @BeforeInsert()
    @BeforeUpdate()
    encryptSensitiveData() {
        this.soinDate = encrypt(this.soinDate);
        if (this.notes) {
            this.notes = encrypt(this.notes);
        }
    }

    @AfterLoad()
    decryptSensitiveData() {
        this.decryptedFields.soinDate = decrypt(this.soinDate);
        if (this.notes) {
            this.decryptedFields.notes = decrypt(this.notes);
        }
    }

    // Getters pour accéder aux données déchiffrées
    getDecryptedSoinDate() { return this.decryptedFields.soinDate; }
    getDecryptedNotes() { return this.decryptedFields.notes; }
}