// src/routes/pokemonAccountRoutes.ts

import { Router, Request, Response } from 'express';
import { PokemonAccountService } from '../service/PokemonAccountService'; // Assurez-vous que le chemin est correct
import { CreatePokemonAccountDto } from '../dto/CreatePokemonAccountDto'; // Assurez-vous que le chemin est correct


export function createPokemonAccountRouter(accountService: PokemonAccountService): Router {
    const router = Router();

    // Route pour créer un compte Pokecenter
    router.post('/account', async (req: Request, res: Response) => {
        try {

            const newCompte = await accountService.createAccount(req.body as CreatePokemonAccountDto);

            res.status(201).json({ message: 'Compte Pokecenter créé avec succès !', account: newCompte });
        } catch (error) {
            console.error("Erreur lors de la création du compte :", error);
            res.status(500).json({ message: "Erreur serveur lors de la création du compte" });
        }
    });

    return router;
}