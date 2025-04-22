import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",                // change mysql -> postgres
    host: "localhost",
    port: 5431,                      // port par défaut de PostgreSQL
    username: "postgres",            // adapte à ton user
    password: "postgres",            // adapte à ton mot de passe
    database: "test",                // ton nom de base
    entities: ["src/entity/*.ts"],   // si tu utilises ts-node, reste en .ts
    logging: true,
    synchronize: true,
})
