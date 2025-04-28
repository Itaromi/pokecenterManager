import {DataSource} from "typeorm";
import {DbListService} from "./DbListService";
import {accountTemplateConfig} from "../data-source";
import {CreatePokemonPatientDto} from "../dto/PokemonPatient/CreatePokemonPatientDto";
import bcrypt from "bcrypt";
import {PokemonPatient} from "../entity/PokemonPatient";
import {ReadPatientDto} from "../dto/PokemonPatient/ReadPatientDto";


export class PokemonPatientService {
    private centralDataSource: DataSource; // Pour accéder à DbListService et trouver le nom de la DB secondaire

    constructor(centralDataSource: DataSource) {
        this.centralDataSource = centralDataSource;
    }

    // --- Méthode Helper pour obtenir une DataSource connectée à la base secondaire ---
    // Cette méthode trouve le nom de la DB secondaire pour un compte donné (via son ID central),
    // crée une DataSource dynamique et l'initialise.
    async getAccountDataSource(accountId: number): Promise<DataSource> {
        const dbListService = new DbListService(this.centralDataSource); // Instancie le service
        const targetDbName = await dbListService.getDbNameById(accountId);

        if (!targetDbName || targetDbName.length === 0) {
            // Loggez peut-être ici le accountId pour le débogage
            throw new Error(`Could not find a valid database name for account ID ${accountId}. The account might not exist or its secondary DB name is missing/invalid.`);
        }

        // 2. Créer une instance de DataSource dynamique pour cette base secondaire
        const accountDataSource = new DataSource({
            ...accountTemplateConfig, // Utilise le template (host, port, user, pass, entities, migrations etc.)
            name: `account_${targetDbName}_${Date.now()}_CRUD`, // Nom unique
            database: targetDbName,   // Écrase le nom de la base de données avec le nom trouvé
            // Les entités sont déjà listées dans accountTemplateConfig
            // Les migrations ne sont pas nécessaires ici pour les opérations CRUD
            migrations: [] // Vider les migrations pour cette instance CRUD
        });

        // 3. Initialiser la connexion
        await accountDataSource.initialize();

        return accountDataSource; // Retourne la DataSource connectée
    }

    async create(accountId: number, patientData: CreatePokemonPatientDto): Promise<PokemonPatient> {
        let accountDataSource: DataSource | undefined;
        try {
            // 1. Obtenir la DataSource pour la base secondaire du compte
            accountDataSource = await this.getAccountDataSource(accountId);
            const patientRepository = accountDataSource.getRepository(PokemonPatient);

            // 2. Créer l'entité à partir du DTO
            const newPatient = new PokemonPatient();

            // Mappe les propriétés du DTO à l'entité.
            newPatient.uniqueId = patientData.uniqueId; // uniqueId sera chiffré par @BeforeInsert
            newPatient.nickname = patientData.nickname;
            newPatient.sexe = patientData.sexe;
            newPatient.trainerId = patientData.trainerId;

            // Conversion Number -> String pour les champs numériques chiffrés
            newPatient.actualLevel = String(patientData.actualLevel);
            newPatient.actualHp = String(patientData.actualHp);
            newPatient.dvHp = String(patientData.dvHp);
            newPatient.dvAttack = String(patientData.dvAttack);
            newPatient.dvDefense = String(patientData.dvDefense);
            newPatient.dvSpecialAttack = String(patientData.dvSpecialAttack);
            newPatient.dvSpecialDefense = String(patientData.dvSpecialDefense);
            newPatient.dvSpeed = String(patientData.dvSpeed);
            newPatient.heightCm = String(patientData.heightCm);
            newPatient.weightGr = String(patientData.weightGr);
            // ----------------------------------------------------------------------------

            return await patientRepository.save(newPatient);

        } catch (error) {
            console.error(`Error creating patient for account ID ${accountId}:`, error);
            throw error; // Relancer l'erreur

        } finally {
            // S'assurer que la connexion à la base secondaire est fermée
            if (accountDataSource && accountDataSource.isInitialized) {
                await accountDataSource.destroy();
            }
        }
    }

    async findByUniqueId(accountId: number, uniqueId: string): Promise<ReadPatientDto | null> {
        let accountDataSource: DataSource | undefined;
        try {
            accountDataSource = await this.getAccountDataSource(accountId);
            const patientRepository = accountDataSource.getRepository(PokemonPatient);

            const patient: PokemonPatient | null = await patientRepository.findOne({
                where: { uniqueId: uniqueId },
                select: ['id', 'uniqueId', 'nickname', 'sexe', 'trainerId', 'actualLevel', 'actualHp', 'dvHp', 'dvAttack', 'dvDefense', 'dvSpecialAttack', 'dvSpecialDefense', 'dvSpeed', 'heightCm', 'weightGr', /* ... autres colonnes nécessaires pour la recherche ou l'affichage ... */]
            });

            if (!patient) {
                console.warn(`Patient with UniqueId "${uniqueId}" not found for account ID ${accountId}.`);
                throw new Error(`Patient with UniqueId "${uniqueId}" not found for account ID ${accountId}.`);
            }

            const patientDto: ReadPatientDto = new ReadPatientDto();
            // 3. Mapper les champs déchiffrés dans le DTO
            patientDto.id = patient.id;
            patientDto.uniqueId = patient.getUniqueId();
            patientDto.nickname = patient.getDecryptedNickname();
            patientDto.sexe = patient.getDecryptedSexe();
            patientDto.trainerId = patient.getDecryptedTrainerId();
            patientDto.actualLevel = patient.getDecryptedActualLevel();
            patientDto.actualHp = patient.getDecryptedActualHp();
            patientDto.dvHp = patient.getDecryptedDvHp();
            patientDto.dvAttack = patient.getDecryptedDvAttack();
            patientDto.dvDefense = patient.getDecryptedDvDefense();
            patientDto.dvSpecialAttack = patient.getDecryptedDvSpecialAttack();
            patientDto.dvSpecialDefense = patient.getDecryptedDvSpecialDefense();
            patientDto.dvSpeed = patient.getDecryptedDvSpeed();
            patientDto.heightCm = patient.getDecryptedHeightCm();
            patientDto.weightGr = patient.getDecryptedWeightGr();


            // Si trouvé, @AfterLoad déchiffrera uniqueId et les autres champs.
            return patientDto;

        } catch (error) {
            console.error(`Error finding patient with UniqueId "${uniqueId}" for account ID ${accountId}:`, error);
            throw error;
        } finally {
            if (accountDataSource && accountDataSource.isInitialized) {
                await accountDataSource.destroy();
            }
        }
    }

}