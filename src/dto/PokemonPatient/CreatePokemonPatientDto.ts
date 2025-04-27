// src/dto/CreatePokemonPatientDto.ts

import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { IsOptional } from 'class-validator'; // Pour Update DTO

export class CreatePokemonPatientDto {
    // L'ID n'est PAS inclus ici car il est généré par la base de données.

    @IsString()
    @IsNotEmpty()
    uniqueId!: string;

    @IsString()
    @IsNotEmpty()
    nickname!: string;

    @IsString()
    @IsNotEmpty()
    sexe!: string;

    @IsString()
    @IsNotEmpty()
    trainerId!: string;

    // Note: Les champs numériques (level, stats, height, weight) sont stockés comme strings chiffrées dans la DB.
    // Ici dans le DTO, ils peuvent être reçus comme numbers ou strings.
    // Le service gèrera la conversion et le chiffrement.

    @IsNumber()
    @IsNotEmpty()
    actualLevel!: number;

    @IsNumber()
    @IsNotEmpty()
    actualHp!: number;

    @IsNumber()
    @IsNotEmpty()
    dvHp!: number;

    @IsNumber()
    @IsNotEmpty()
    dvAttack!: number;

    @IsNumber()
    @IsNotEmpty()
    dvDefense!: number;

    @IsNumber()
    @IsNotEmpty()
    dvSpecialAttack!: number;

    @IsNumber()
    @IsNotEmpty()
    dvSpecialDefense!: number;

    @IsNumber()
    @IsNotEmpty()
    dvSpeed!: number;

    @IsNumber()
    @IsNotEmpty()
    heightCm!: number;

    @IsNumber()
    @IsNotEmpty()
    weightGr!: number;
}