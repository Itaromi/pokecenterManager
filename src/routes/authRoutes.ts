import {NextFunction, Router} from "express";
import { authenticate } from '../auth_middleware';
import {login} from '../service/PokemonAccountService'

const router = Router();

// Création de l'instance du service
const pokemonAccountService = new PokemonAccountService(/* passe ton DataSource ici */);

// Route de login
router.post('/login', async (req, res) => {
    // Appel de la fonction login du service
    await login(req, res);
});