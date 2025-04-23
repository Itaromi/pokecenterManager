import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";

@Entity('pokemon_patient')
//@Index(['id'], { unique: true })
export class PokemonPatient {
    @PrimaryColumn({type: 'int', name: 'id', nullable: false})
    id!: number;
    @Column({type: 'varchar', length: 12, name: 'unique_id', nullable: false, unique: true})
    uniqueId!: string;
    @Column({type: 'varchar', length: 50, name: 'nickname', nullable: false})
    nickname!: string;
    @Column({type: 'varchar', length: 1, name: 'sexe', nullable: false})
    sexe!: string;
    @Column({type: 'varchar', length: 5, name:'trainer_id', nullable: false})
    trainerId!: string;
    @Column({type: 'smallint', name: 'actual_level', nullable: false})
    actualLevel!: number;
    @Column({type: 'smallint', name: 'actual_hp', nullable: false})
    actualHp!: number;
    @Column({type: 'smallint', name: 'dv_hp', nullable: false})
    dvHp!: number;
    @Column({type: 'smallint', name: 'dv_attack', nullable: false})
    dvAttack!: number;
    @Column({type: 'smallint', name: 'dv_defense', nullable: false})
    dvDefense!: number;
    @Column({type: 'smallint', name: 'dv_special_attack', nullable: false})
    dvSpecialAttack!: number;
    @Column({type: 'smallint', name: 'dv_special_defense', nullable: false})
    dvSpecialDefense!: number;
    @Column({type: 'smallint', name: 'dv_speed', nullable: false})
    dvSpeed!: number;
    @Column({type: 'int', name: 'height_cm', nullable: false})
    heightCm!: number;
    @Column({type: 'int', name: 'weight_gr', nullable: false})
    weightGr!: number;

    //@OneToMany(() => Soins, soins => soins.pokemon_id)
    //soins?: Soins[];
}
