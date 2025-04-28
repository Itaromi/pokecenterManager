import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePokemonAccountTable1745568213447 implements MigrationInterface {
    name = 'CreatePokemonAccountTable1745568213447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "nom"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "nom" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP CONSTRAINT "UQ_d82d30e3ed658de338e38ea8792"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "email" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD CONSTRAINT "UQ_d82d30e3ed658de338e38ea8792" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "mot_de_passe_hash"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "mot_de_passe_hash" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "region" character varying(512) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "ville"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "ville" character varying(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "ville"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "ville" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "region" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "mot_de_passe_hash"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "mot_de_passe_hash" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP CONSTRAINT "UQ_d82d30e3ed658de338e38ea8792"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD CONSTRAINT "UQ_d82d30e3ed658de338e38ea8792" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "nom"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "nom" character varying(255) NOT NULL`);
    }

}
