import 'reflect-metadata'; // Assurez-vous que c'est la premiere ligne
import express from 'express';
import { AppDataSource } from './data-source'; // Importez votre DataSource
import { PokemonAccount } from './entity/PokemonAccount';
import { CreatePokemonAccountDto } from './dto/CreatePokemonAccountDto';
import bcrypt from 'bcrypt';
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000; // Utilise le port 3000 par defaut ou celui defini par env

app.use(express.json()); // Middleware pour parser le corps des requetes en JSON

// Route de test simple
app.get('/', (req, res) => {
    res.send('Hello from the Pokemon App API!');
});

// Exemple de route pour interagir avec la BDD (apres initialization)


app.post('/pokecenter/account', async (req, res) => {
    try {
        const { nom, email, motDePasse, region, ville } = req.body as CreatePokemonAccountDto;

        const compteRepository = AppDataSource.getRepository(PokemonAccount);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

        const newCompte = compteRepository.create({
            nom,
            email,
            mot_de_passe_hash: hashedPassword,
            region,
            ville
        });
        await compteRepository.save(newCompte);

        res.status(201).send('Compte Pokecenter créé avec succès !');
    } catch (error) {
        console.error("Erreur lors de la création du compte :", error);
        res.status(500).send("Erreur serveur");
    }
});
//const isPasswordValid = await bcrypt.compare(plainPassword, hashedPasswordFromDB);


// Initialiser TypeORM puis demarrer le serveur Express
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        // Démarrer le serveur Express une fois la connexion BDD établie
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`App listening on port ${port}`); // Message pour le conteneur
        });
    })
    .catch((error) => console.error("Error during Data Source initialization:", error));