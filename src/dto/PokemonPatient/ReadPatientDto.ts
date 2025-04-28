import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ReadPatientDto {

    @IsNumber()
    @IsNotEmpty()
    id: number | undefined;

    @IsString()
    @IsNotEmpty()
    uniqueId: string | undefined;

    @IsString()
    @IsNotEmpty()
    nickname: string | undefined;

    @IsString()
    @IsNotEmpty()
    sexe: string | undefined;

    @IsString()
    @IsNotEmpty()
    trainerId: string | undefined;

    @IsNumber()
    @IsNotEmpty()
    actualLevel: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    actualHp: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvHp: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvAttack: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvDefense: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvSpecialAttack: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvSpecialDefense: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    dvSpeed: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    heightCm: number | undefined;

    @IsNumber()
    @IsNotEmpty()
    weightGr: number | undefined;
}