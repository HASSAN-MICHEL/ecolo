// import Client from '../models/client.js';

// export const clientController = {
  
// createClient : async (req, res) => {
//   try {
//     const { nom, prenom, telephone } = req.body;
    
//     // Validation des champs obligatoires
//     if (!nom || !telephone) {
//       return res.status(400).json({
//         success: false,
//         error: 'Le nom et le téléphone sont obligatoires'
//       });
//     }

//     // Normaliser le prénom (chaîne vide si null/undefined)
//     const normalizedPrenom = prenom || '';

//     // Créer le client
//     const client = await Client.create(nom, normalizedPrenom, telephone);

//     res.status(201).json({
//       success: true,
//       message: 'Client créé avec succès',
//       data: client
//     });

//   } catch (error) {
//     console.error('Erreur création client:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// },


//   // Récupérer tous les clients
//   getAllClients: async (req, res) => {
//     try {
//       const clients = await Client.findAll();

//       res.json({
//         success: true,
//         data: clients
//       });
//     } catch (error) {
//       console.error('Erreur récupération clients:', error);
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Récupérer un client par son code
//   getClientByCode: async (req, res) => {
//     try {
//       const { code } = req.params;
//       const client = await Client.findByCode(code);

//       if (!client) {
//         return res.status(404).json({
//           success: false,
//           message: 'Client non trouvé'
//         });
//       }

//       res.json({
//         success: true,
//         data: client
//       });
//     } catch (error) {
//       console.error('Erreur recherche client:', error);
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Mettre à jour un client
//   updateClient: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { nom, prenom, telephone } = req.body;

//       const client = await Client.findById(id);
//       if (!client) {
//         return res.status(404).json({
//           success: false,
//           message: 'Client non trouvé'
//         });
//       }

//       const clientModifie = await Client.update(id, nom, prenom, telephone);

//       res.json({
//         success: true,
//         message: 'Client modifié avec succès',
//         data: clientModifie
//       });
//     } catch (error) {
//       console.error('Erreur modification client:', error);
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   },

//   // Supprimer un client
//   deleteClient: async (req, res) => {
//     try {
//       const { id } = req.params;

//       const client = await Client.findById(id);
//       if (!client) {
//         return res.status(404).json({
//           success: false,
//           message: 'Client non trouvé'
//         });
//       }

//       await Client.delete(id);

//       res.json({
//         success: true,
//         message: 'Client supprimé avec succès'
//       });
//     } catch (error) {
//       console.error('Erreur suppression client:', error);
//       res.status(500).json({
//         success: false,
//         message: error.message
//       });
//     }
//   }
// };


import Client from '../models/client.js';

export const clientController = {
  // CORRECTION DÉFINITIVE - backend/controllers/clientController.js
createClient: async (req, res) => {
  try {
    const { nom, prenom } = req.body; // SEULEMENT nom et prenom
    
    console.log('📥 Données reçues dans createClient:', { nom, prenom });
    
    // VALIDATION CORRIGÉE - seul le nom est obligatoire
    if (!nom || !nom.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Le nom est obligatoire'
      });
    }

    

    // Créer le client SANS téléphone
    const client = await Client.create(nom);

    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: client
    });

  } catch (error) {
    console.error('Erreur création client:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
},

updateClient: async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom } = req.body; // SEULEMENT nom et prenom

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Mettre à jour SANS téléphone
    const clientModifie = await Client.update(id, nom, prenom);

    res.json({
      success: true,
      message: 'Client modifié avec succès',
      data: clientModifie
    });
  } catch (error) {
    console.error('Erreur modification client:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
},
//cupérer tous les clients
  getAllClients: async (req, res) => {
    try {
      const clients = await Client.findAll();

      res.json({
        success: true,
        data: clients
      });
    } catch (error) {
      console.error('Erreur récupération clients:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Récupérer un client par son code
  getClientByCode: async (req, res) => {
    try {
      const { code } = req.params;
      const client = await Client.findByCode(code);

      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client non trouvé'
        });
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error) {
      console.error('Erreur recherche client:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Supprimer un client
  deleteClient: async (req, res) => {
    try {
      const { id } = req.params;

      const client = await Client.findById(id);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client non trouvé'
        });
      }

      await Client.delete(id);

      res.json({
        success: true,
        message: 'Client supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression client:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};