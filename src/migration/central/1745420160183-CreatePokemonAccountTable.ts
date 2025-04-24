import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePokemonAccountTable1745420160183 implements MigrationInterface {
    name = 'CreatePokemonAccountTable1745420160183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pokemonAccount" ("id" SERIAL NOT NULL, "nom" character varying(255) NOT NULL, "email" character varying(100) NOT NULL, "mot_de_passe_hash" character varying(255) NOT NULL, "region" character varying(20) NOT NULL, "ville" character varying(20) NOT NULL, "date_creation" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d82d30e3ed658de338e38ea8792" UNIQUE ("email"), CONSTRAINT "PK_d63d7b56458c9f190c5947f6c67" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pokemonAccount"`);
    }

}
