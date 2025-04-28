import {DataSource} from "typeorm";
import {PokemonAccount} from "../entity/PokemonAccount";
import bcrypt from "bcrypt";

export class DbListService {
    private centralDataSource: DataSource;

    constructor(centralDataSource: DataSource) {
        this.centralDataSource = centralDataSource;
    }

    async getAllDbNames(): Promise<(string | undefined)[]> {
        const accountRepo = this.centralDataSource.getRepository(PokemonAccount);

        const accounts = await accountRepo.find();

        return accounts.map(account => account.getDecryptedDbName());
    }

    async getDbNameById(id: number): Promise<string | undefined> {
        const accountRepo = this.centralDataSource.getRepository(PokemonAccount);

        const account = await accountRepo.findOne({
            where: { id }
        });

        return account ? account.getDecryptedDbName() : undefined;
    }
}

/*
Pour l'appeler :
const dbListService = new DbListService(centralDataSource);
const dbNames = await dbListService.getAllDbNames();
console.log(dbNames); // ["PC_Carmin_Kanto_1", "PC_Johto_Mauville_2", ...]
 */