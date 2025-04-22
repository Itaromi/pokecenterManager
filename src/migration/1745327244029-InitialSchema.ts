import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1745327244029 implements MigrationInterface {
    name = 'InitialSchema1745327244029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Pokemon_Species" ("pokedex_number" integer NOT NULL, "species_name" character varying(50) NOT NULL, "type1" character varying(20) NOT NULL, "type2" character varying(20), "base_hp" integer NOT NULL, "base_attack" integer NOT NULL, "base_defense" integer NOT NULL, "base_special_attack" integer NOT NULL, "base_special_defense" integer NOT NULL, "base_speed" integer NOT NULL, "description" text, "height" numeric(5,2), "weight" numeric(5,2), CONSTRAINT "UQ_f3e8ec27b1dfe592100923abaca" UNIQUE ("species_name"), CONSTRAINT "PK_d2b72df223269ddb91695d6b699" PRIMARY KEY ("pokedex_number"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f3e8ec27b1dfe592100923abac" ON "Pokemon_Species" ("species_name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_f3e8ec27b1dfe592100923abac"`);
        await queryRunner.query(`DROP TABLE "Pokemon_Species"`);
    }

}
