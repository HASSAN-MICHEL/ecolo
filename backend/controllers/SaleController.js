🔧 5. Tests API avec Postman
Endpoints disponibles:
Inscription POST /api/auth/inscription

json
{
    "email": "test@example.com",
    "telephone": "0123456789",
    "motDePasse": "motdepasse123",
    "typeProducteur": "menage",
    "nomComplet": "Jean Dupont",
    "adresse": "123 Rue de la République",
    "longitude": 2.3522,
    "latitude": 48.8566,
    "quartier": "Centre-ville",
    "commune": "Paris",
    "cguAcceptees": true
}
Connexion POST /api/auth/connexion

json
{
    "identifiant": "test@example.com",
    "motDePasse": "motdepasse123"
}
Créer déclaration POST /api/declarations

json
{
    "typeDechet": "plastique_pet",
    "quantite": 5,
    "unite": "kg",
    "modeCollecte": "collecte_domicile",
    "dateSouhaitee": "2024-01-15",
    "creneauHoraire": "9h-12h",
    "notes": "Déchets bien triés"
}