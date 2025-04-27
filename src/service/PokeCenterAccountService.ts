import {DataSource} from "typeorm";
import {CreatePokemonAccountDto} from "../dto/CreatePokemonAccountDto";
import {PokemonAccount} from "../entity/PokemonAccount";
import bcrypt from "bcrypt";
import {createAccountDatabaseAndSchema} from "../utils/DatabaseUtils";
import {Request, Response} from "express";
import {generateToken} from "../utils/jwt";

export class PokeCenterAccountService {
    private centralDataSource: DataSource;

    constructor(centralDataSource: DataSource) {
        this.centralDataSource = centralDataSource;
    }
    async createAccount(accountData: CreatePokemonAccountDto): Promise<PokemonAccount> {
        const accountRepository = this.centralDataSource.getRepository(PokemonAccount);
        const newAccount = accountRepository.create(accountData)
        // hash the password before saving
        newAccount.mot_de_passe_hash = await bcrypt.hash(accountData.motDePasse, 10);

        // save the new account to the database
        await accountRepository.save(newAccount);

        if (!newAccount.id) {
            throw new Error("Failed to create account");
        }

        const accountDatabaseName = `PC_${accountData.ville}_${accountData.region}_${newAccount.id}`;

        newAccount.dbName = accountDatabaseName;
        await accountRepository.save(newAccount); // Met à jour le nom de la DB dans l'instance centrale

        console.log(`Account créé avec ID ${newAccount.id}. Préparation à créer la DB secondaire: ${accountDatabaseName}`);

        try {
            // La fonction utilitaire n'a pas besoin de recevoir les DataSources initialisées ici
            // Elle va créer ses propres connexions temporaires
            await createAccountDatabaseAndSchema(accountDatabaseName);
            console.log(`Base de données secondaire "${accountDatabaseName}" créée et schéma appliqué.`);

        } catch (error) {
            console.error(`Échec critique lors de la création de la base de données pour le compte : ${newAccount.id}:`, error);
            // !!! GESTION DE L'ÉCHEC CRITIQUE !!!
            throw new Error(`La création de la base de données pour le compte (${newAccount.id}) a échoué.`);
        }

        return newAccount;
    }

    async login(req: Request, res: Response): Promise<void> {
        const { email, mot_de_passe } = req.body;

        const accountRepository = this.centralDataSource.getRepository(PokemonAccount);
        const account = await accountRepository.findOneBy({ email });

        if (!account) {
            throw new Error('Compte non trouvé.');
        }

        const match = await bcrypt.compare(mot_de_passe, account.mot_de_passe_hash);
        if (!match) {
            throw new Error('Identifiants invalides.');
        }

        const token = generateToken({ id: account.id, email: account.email });

        res.json({ token });
    }
}