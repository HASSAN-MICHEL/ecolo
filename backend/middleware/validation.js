import Joi from 'joi';

// Schéma de validation pour l'inscription
const schemaInscription = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Email invalide',
            'any.required': 'Email est requis'
        }),
    telephone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
        .messages({
            'string.pattern.base': 'Numéro de téléphone invalide',
            'any.required': 'Téléphone est requis'
        }),
    motDePasse: Joi.string().min(8).required()
        .messages({
            'string.min': 'Le mot de passe doit avoir au moins 8 caractères',
            'any.required': 'Mot de passe est requis'
        }),
    typeProducteur: Joi.string().valid('menage', 'commerce', 'entreprise', 'administration').required(),
    nomComplet: Joi.string().min(2).max(100).required(),
    adresse: Joi.string().required(),
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    quartier: Joi.string().required(),
    commune: Joi.string().required(),
    cguAcceptees: Joi.boolean().valid(true).required()
        .messages({
            'any.only': 'Vous devez accepter les CGU'
        })
});

// Schéma de validation pour la connexion
const schemaConnexion = Joi.object({
    identifiant: Joi.string().required(),
    motDePasse: Joi.string().required()
});

// Schéma de validation pour la déclaration de déchets
const schemaDeclaration = Joi.object({
    typeDechet: Joi.string().valid(
        'plastique_pet', 'plastique_pehd', 'papier_carton', 
        'metal', 'verre', 'organique'
    ).required(),
    quantite: Joi.number().positive().required(),
    unite: Joi.string().valid('kg', 'sacs', 'unites').required(),
    modeCollecte: Joi.string().valid('collecte_domicile', 'depot_volontaire').required(),
    dateSouhaitee: Joi.date().min('now').iso(),
    creneauHoraire: Joi.string(),
    notes: Joi.string().max(500),
    typesDechets: Joi.array().items(
        Joi.object({
            type: Joi.string().valid(
                'plastique_pet', 'plastique_pehd', 'papier_carton', 
                'metal', 'verre', 'organique'
            ).required(),
            quantite: Joi.number().positive().required(),
            unite: Joi.string().valid('kg', 'sacs', 'unites').required()
        })
    )
});

// Middleware de validation
const valider = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const erreurs = error.details.map(detail => ({
                champ: detail.context.key,
                message: detail.message
            }));
            
            return res.status(400).json({
                message: 'Erreur de validation',
                erreurs
            });
        }
        
        next();
    };
};


const schemaInscriptionCollecteur = Joi.object({
    email: Joi.string().email().required(),
    telephone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    motDePasse: Joi.string().min(8).required(),
    nomComplet: Joi.string().min(2).max(100).required(),
    typeCollecteur: Joi.string().valid('independant', 'cooperative').required(),
    numeroIdentite: Joi.string().when('typeCollecteur', {
        is: 'independant',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    zoneInterventionNom: Joi.string().required(),
    quartiersHabituels: Joi.array().items(Joi.string()).min(1),
    communesIntervention: Joi.array().items(Joi.string()).min(1),
    photoProfilUrl: Joi.string().uri().optional(),
    cguAcceptees: Joi.boolean().valid(true).required()
});

// Middleware de validation
export const validerInscriptionCollecteur = (req, res, next) => {
    const { error } = schemaInscriptionCollecteur.validate(req.body, { abortEarly: false });
    
    if (error) {
        const erreurs = error.details.map(detail => ({
            champ: detail.context.key,
            message: detail.message
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            erreurs
        });
    }
    
    next();
};

export {
    schemaInscription,
    schemaConnexion,
    schemaDeclaration, schemaInscriptionCollecteur , 
    valider
};