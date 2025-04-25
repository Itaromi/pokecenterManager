import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
} from 'typeorm';
import { Soin } from './Soin';
import { encrypt, decrypt } from '../utils/cryptoUtils';

@Entity({ name: 'types_soins' })
export class TypeSoin {
    @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
    id!: number;

    @Column({ length: 512, unique: true }) // Augmente la taille pour le chiffrement
    nom!: string;

    @ManyToMany(() => Soin, (soin) => soin.typeSoin)
    soins!: Soin[];

    // Champ déchiffré temporaire
    private decryptedFields: Partial<Record<keyof TypeSoin, string>> = {};

    @BeforeInsert()
    @BeforeUpdate()
    encryptSensitiveData() {
        this.nom = encrypt(this.nom);
    }

    @AfterLoad()
    decryptSensitiveData() {
        this.decryptedFields.nom = decrypt(this.nom);
    }

    // Getter pour accéder au nom déchiffré
    getDecryptedNom() { return this.decryptedFields.nom; }
}