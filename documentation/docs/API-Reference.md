---
title: Api Rérérence 
sidebar_position: 3
---

### Compte Pokecenter

#### POST /pokecenter/account ➔ Créer un compte

Permet de créer un **nouveau centre Pokémon** avec sa propre base de données secondaire.

**Exemple de requête :**

```http
POST /pokecenter/account
Content-Type: application/json

{
  "nom": "Centre Carmin",
  "email": "carmin@test.fr",
  "motDePasse": "secure123",
  "region": "Kanto",
  "ville": "Carmin"
}
```

**Exemple de réponse :**

```json
{
  "message": "Compte Pokecenter créé avec succès !",
  "account": {
    "id": 1,
    "nom": "Centre Carmin",
    "email": "carmin@test.fr",
    "region": "Kanto",
    "ville": "Carmin",
    "dbName": "PC_Carmin_Kanto_1"
  }
}
```

---

#### GET /pokecenter/account ➔ Lister tous les comptes

Retourne la liste de **tous les centres Pokémon** enregistrés.

**Exemple de réponse :**

```json
[
  {
    "id": 1,
    "nom": "Centre Carmin",
    "email": "carmin@test.fr",
    "region": "Kanto",
    "ville": "Carmin",
    "dbName": "PC_Carmin_Kanto_1"
  },
  {
    "id": 2,
    "nom": "Centre Azuria",
    "email": "azuria@test.fr",
    "region": "Kanto",
    "ville": "Azuria",
    "dbName": "PC_Azuria_Kanto_2"
  }
]
```

---

#### GET /pokecenter/account/:id ➔ Voir un compte

Récupère les détails d'un **compte Pokémon** via son `id`.

**Exemple :**

```
GET /pokecenter/account/1
```

---

#### PUT /pokecenter/account/:id ➔ Modifier un compte

Met à jour les données d'un **centre Pokémon** existant.

**Exemple :**

```http
PUT /pokecenter/account/1
Content-Type: application/json

{
  "nom": "Centre Carmin modifié",
  "region": "Johto"
}
```

---

#### DELETE /pokecenter/account/:id ➔ Supprimer un compte

Supprime un **centre Pokémon** ainsi que sa base secondaire.

```
DELETE /pokecenter/account/1
```

---

### Patients Pokémon (dans une base secondaire)

#### CRUD pour /patients

- **GET /patients** : Lister les patients.
- **POST /patients** : Ajouter un patient.
- **PUT /patients/:id** : Modifier un patient.
- **DELETE /patients/:id** : Supprimer un patient.

> 🔑 **Note :** Ces endpoints sont disponibles **uniquement** dans la base secondaire de chaque Pokécenter.

---

### Soins Pokémon (dans une base secondaire)

#### CRUD pour /soins

- **GET /soins** : Lister les soins appliqués.
- **POST /soins** : Ajouter un soin.
- **PUT /soins/:id** : Modifier un soin.
- **DELETE /soins/:id** : Supprimer un soin.

> 🔑 **Note :** Disponible uniquement dans la **base secondaire** de chaque Pokécenter.

