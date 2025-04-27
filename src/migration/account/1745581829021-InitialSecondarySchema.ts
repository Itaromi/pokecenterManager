import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSecondarySchema1745581829021 implements MigrationInterface {
    name = 'InitialSecondarySchema1745581829021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "types_soins" ("id" SERIAL NOT NULL, "nom" character varying(50) NOT NULL, CONSTRAINT "UQ_1d47183a8354fd7f937ac0e0491" UNIQUE ("nom"), CONSTRAINT "PK_ec55440e010760549343bbbb076" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "soin" ("id" SERIAL NOT NULL, "soin_date" date NOT NULL, "notes" text, "pokemon_id" integer, CONSTRAINT "PK_5f05f0cb3711f5c94b706a92d21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pokemon_patient" ("id" SERIAL NOT NULL, "unique_id" character varying(12) NOT NULL, "nickname" character varying(50) NOT NULL, "sexe" character varying(1) NOT NULL, "trainer_id" character varying(5) NOT NULL, "actual_level" smallint NOT NULL, "actual_hp" smallint NOT NULL, "dv_hp" smallint NOT NULL, "dv_attack" smallint NOT NULL, "dv_defense" smallint NOT NULL, "dv_special_attack" smallint NOT NULL, "dv_special_defense" smallint NOT NULL, "dv_speed" smallint NOT NULL, "height_cm" integer NOT NULL, "weight_gr" integer NOT NULL, CONSTRAINT "UQ_86ee5f1e8288ff787e3113987ac" UNIQUE ("unique_id"), CONSTRAINT "PK_79465609c78376240afb816824e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "soin" ADD CONSTRAINT "FK_e6aeaf4dbe3cc9dd7c2bc6a5ce8" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon_patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "soin" DROP CONSTRAINT "FK_e6aeaf4dbe3cc9dd7c2bc6a5ce8"`);
        await queryRunner.query(`DROP TABLE "pokemon_patient"`);
        await queryRunner.query(`DROP TABLE "soin"`);
        await queryRunner.query(`DROP TABLE "types_soins"`);
    }

}
