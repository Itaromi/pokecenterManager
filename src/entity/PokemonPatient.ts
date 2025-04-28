import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    BeforeInsert,
    BeforeUpdate,
    AfterLoad,
} from "typeorm";
import { Soin } from "./Soin";
import { encrypt, decrypt } from "../utils/cryptoUtils";

@Entity('pokemon_patient')
export class PokemonPatient {
    @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
    id!: number;

    @Column({ type: 'varchar', length: 512, name: 'unique_id', nullable: false, unique: true })
    uniqueId!: string;

    @Column({ type: 'varchar', length: 512, name: 'nickname', nullable: false })
    nickname!: string;

    @Column({ type: 'varchar', length: 512, name: 'sexe', nullable: false })
    sexe!: string;

    @Column({ type: 'varchar', length: 512, name: 'trainer_id', nullable: false })
    trainerId!: string;

    @Column({ type: 'varchar', length: 512, name: 'actual_level', nullable: false })
    actualLevel!: string; // Chiffré en string dans la DB

    @Column({ type: 'varchar', length: 512, name: 'actual_hp', nullable: false })
    actualHp!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_hp', nullable: false })
    dvHp!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_attack', nullable: false })
    dvAttack!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_defense', nullable: false })
    dvDefense!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_special_attack', nullable: false })
    dvSpecialAttack!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_special_defense', nullable: false })
    dvSpecialDefense!: string;

    @Column({ type: 'varchar', length: 512, name: 'dv_speed', nullable: false })
    dvSpeed!: string;

    @Column({ type: 'varchar', length: 512, name: 'height_cm', nullable: false })
    heightCm!: string;

    @Column({ type: 'varchar', length: 512, name: 'weight_gr', nullable: false })
    weightGr!: string;

    @OneToMany(() => Soin, soins => soins.pokemon.id)
    soins?: Soin[];

    // Champs déchiffrés temporaires
    private decryptedFields: Partial<Record<keyof PokemonPatient, string | number>> = {};

    @BeforeInsert()
    @BeforeUpdate()
    encryptSensitiveData() {
        this.nickname = encrypt(this.nickname);
        this.sexe = encrypt(this.sexe);
        this.trainerId = encrypt(this.trainerId);
        this.actualLevel = encrypt(this.actualLevel.toString());
        this.actualHp = encrypt(this.actualHp.toString());
        this.dvHp = encrypt(this.dvHp.toString());
        this.dvAttack = encrypt(this.dvAttack.toString());
        this.dvDefense = encrypt(this.dvDefense.toString());
        this.dvSpecialAttack = encrypt(this.dvSpecialAttack.toString());
        this.dvSpecialDefense = encrypt(this.dvSpecialDefense.toString());
        this.dvSpeed = encrypt(this.dvSpeed.toString());
        this.heightCm = encrypt(this.heightCm.toString());
        this.weightGr = encrypt(this.weightGr.toString());
    }

    @AfterLoad()
    decryptSensitiveData() {
        this.decryptedFields.nickname = decrypt(this.nickname);
        this.decryptedFields.sexe = decrypt(this.sexe);
        this.decryptedFields.trainerId = decrypt(this.trainerId);

        this.decryptedFields.actualLevel = parseInt(decrypt(this.actualLevel));
        this.decryptedFields.actualHp = parseInt(decrypt(this.actualHp));
        this.decryptedFields.dvHp = parseInt(decrypt(this.dvHp));
        this.decryptedFields.dvAttack = parseInt(decrypt(this.dvAttack));
        this.decryptedFields.dvDefense = parseInt(decrypt(this.dvDefense));
        this.decryptedFields.dvSpecialAttack = parseInt(decrypt(this.dvSpecialAttack));
        this.decryptedFields.dvSpecialDefense = parseInt(decrypt(this.dvSpecialDefense));
        this.decryptedFields.dvSpeed = parseInt(decrypt(this.dvSpeed));
        this.decryptedFields.heightCm = parseInt(decrypt(this.heightCm));
        this.decryptedFields.weightGr = parseInt(decrypt(this.weightGr));
    }

    // Getters pour accéder aux valeurs déchiffrées
    getUniqueId() { return this.uniqueId as string; }
    getDecryptedNickname() { return this.decryptedFields.nickname as string; }
    getDecryptedSexe() { return this.decryptedFields.sexe as string; }
    getDecryptedTrainerId() { return this.decryptedFields.trainerId as string; }
    getDecryptedActualLevel() { return this.decryptedFields.actualLevel as number; }
    getDecryptedActualHp() { return this.decryptedFields.actualHp as number; }
    getDecryptedDvHp() { return this.decryptedFields.dvHp as number; }
    getDecryptedDvAttack() { return this.decryptedFields.dvAttack as number; }
    getDecryptedDvDefense() { return this.decryptedFields.dvDefense as number; }
    getDecryptedDvSpecialAttack() { return this.decryptedFields.dvSpecialAttack as number; }
    getDecryptedDvSpecialDefense() { return this.decryptedFields.dvSpecialDefense as number; }
    getDecryptedDvSpeed() { return this.decryptedFields.dvSpeed as number; }
    getDecryptedHeightCm() { return this.decryptedFields.heightCm as number; }
    getDecryptedWeightGr() { return this.decryptedFields.weightGr as number; }
}