import { DataSource } from "typeorm";
import {NextFunction, Request, Response, Router} from "express";
import { authenticate } from '../auth_middleware';
import { PokeCenterAccountService} from '../service/PokeCenterAccountService'
import {CreatePokemonAccountDto} from "../dto/CreatePokemonAccountDto";

export function AuthRouter(accountService: PokeCenterAccountService): Router {
    const router = Router();

    // Route de login
    router.post('/login', async (req, res) => {
        // Appel de la fonction login du service
        await accountService.login(req, res);
    });

    return router;
}