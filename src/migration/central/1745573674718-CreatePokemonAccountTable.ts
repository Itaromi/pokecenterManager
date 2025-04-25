import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePokemonAccountTable1745573674718 implements MigrationInterface {
    name = 'CreatePokemonAccountTable1745573674718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" ADD "dbName" character varying(512) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pokemonAccount" DROP COLUMN "dbName"`);
    }

}
