import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePokemonAccountTable1745567976721 implements MigrationInterface {
    name = 'CreatePokemonAccountTable1745567976721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "region" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "ville"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "ville" character varying(64) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "ville"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "ville" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "region" character varying(20) NOT NULL`);
    }

}
