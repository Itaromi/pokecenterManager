import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, BeforeUpdate, AfterLoad } from "typeorm";
import { encrypt, decrypt } from "../utils/cryptoUtils";

@Entity({ name: "pokemonAccount" })
export class PokemonAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 512 })
    nom!: string;

    @Column({ type: "varchar", length: 512, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 512 })
    mot_de_passe_hash!: string;

    @Column({ type: "varchar", length: 512 })
    region!: string;

    @Column({ type: "varchar", length: 512 })
    ville!: string;

    @Column({ type: "varchar", length: 512 })
    dbName!: string;

    @CreateDateColumn({ name: "date_creation", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    date_creation!: Date;

    // Champs déchiffrés temporaires
    private decryptedFields: Partial<PokemonAccount> = {};

    @BeforeInsert()
    @BeforeUpdate()
    encryptSensitiveData() {
        this.nom = encrypt(this.nom);
        this.email = encrypt(this.email);
        this.region = encrypt(this.region);
        this.ville = encrypt(this.ville);
        this.dbName = encrypt(this.dbName);
    }

    @AfterLoad()
    decryptSensitiveData() {
        this.decryptedFields.nom = decrypt(this.nom);
        this.decryptedFields.email = decrypt(this.email);
        this.decryptedFields.region = decrypt(this.region);
        this.decryptedFields.ville = decrypt(this.ville);
        this.decryptedFields.dbName = encrypt(this.dbName);
    }

    getDecryptedNom() { return this.decryptedFields.nom; }
    getDecryptedEmail() { return this.decryptedFields.email; }
    getDecryptedRegion() { return this.decryptedFields.region; }
    getDecryptedVille() { return this.decryptedFields.ville; }
    getDecryptedDbName() { return this.decryptedFields.dbName; }

}