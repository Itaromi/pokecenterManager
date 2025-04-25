import {DataSource} from "typeorm";
import {CreatePokemonAccountDto} from "../dto/CreatePokemonAccountDto";
import {PokemonAccount} from "../entity/PokemonAccount";
import bcrypt from "bcrypt";
import {createAccountDatabaseAndSchema} from "../utils/DatabaseUtils";

