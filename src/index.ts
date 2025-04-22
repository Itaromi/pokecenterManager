import 'reflect-metadata'; // Assurez-vous que c'est la premiere ligne
import express from 'express';
import { AppDataSource } from './data-source'; // Importez votre DataSource
import { PokemonSpecies } from './entity/PokemonSpecies'; // Importez une entite pour test

const app = express();
const port = process.env.PORT || 3000; // Utilise le port 3000 par defaut ou celui defini par env

app.use(express.json()); // Middleware pour parser le corps des requetes en JSON

// Route de test simple
app.get('/', (req, res) => {
    res.send('Hello from the Pokemon App API!');
});

// Exemple de route pour interagir avec la BDD (apres initialization)
app.get('/species', async (req, res) => {
    try {
        const speciesRepository = AppDataSource.getRepository(PokemonSpecies);
        const allSpecies = await speciesRepository.find();
        res.json(allSpecies);
    } catch (error) {
        console.error("Error fetching species:", error);
        res.status(500).send("Error fetching data.");
    }
});


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