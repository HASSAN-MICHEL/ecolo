// import api from './api';

// class RecycleurService {
//   // Profil
//   async getProfil() {
//     const response = await api.get('/recycleurs/profil');
//     return response.data;
//   }

//   async updateProfil(data) {
//     const response = await api.put('/recycleurs/profil', data);
//     return response.data;
//   }

//   // Stocks
//   async getStocks(filtres = {}) {
//     const response = await api.get('/recycleurs/stocks', { params: filtres });
//     return response.data;
//   }

//   // Demandes d'enlèvement
//   async creerDemande(data) {
//     const response = await api.post('/recycleurs/demandes', data);
//     return response.data;
//   }

//   async getMesDemandes(statut = null) {
//     const response = await api.get('/recycleurs/demandes', {
//       params: { statut }
//     });
//     return response.data;
//   }

//   async confirmerReception(demandeId, quantiteRecue, notes) {
//     const response = await api.put(`/recycleurs/demandes/${demandeId}/confirmer`, {
//       quantiteRecue,
//       notes
//     });
//     return response.data;
//   }

//   // Déclarations de recyclage
//   async declarerRecyclage(data) {
//     const response = await api.post('/recycleurs/declarations', data);
//     return response.data;
//   }

//   async getMesDeclarations(statut = null) {
//     const response = await api.get('/recycleurs/declarations', {
//       params: { statut }
//     });
//     return response.data;
//   }

//   // Dashboard
//   async getDashboard() {
//     const response = await api.get('/recycleurs/tableau-bord');
//     return response.data;
//   }
// }

// export default new RecycleurService();


// services/recycleurService.js
import api from './api';

class RecycleurService {
  constructor() {
    this.baseURL = '/recycleurs';
  }

  // ==================== AUTH ====================
  async inscription(formData) {
    const response = await api.post(`${this.baseURL}/inscription`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async connexion(identifiant, motDePasse) {
    const response = await api.post(`${this.baseURL}/connexion`, {
      identifiant,
      motDePasse
    });
    return response.data;
  }

  // ==================== PROFIL ====================
  async getProfil() {
    const response = await api.get(`${this.baseURL}/profil`);
    return response.data;
  }

  async updateProfil(data) {
    const response = await api.put(`${this.baseURL}/profil`, data);
    return response.data;
  }

  async updateProfilWithPhoto(formData) {
    const response = await api.put(`${this.baseURL}/profil`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  // ==================== STOCKS ====================
  async getStocks(filtres = {}) {
    const response = await api.get(`${this.baseURL}/stocks`, { params: filtres });
    return response.data;
  }

  async getStockParPoint(pointId) {
    const response = await api.get(`${this.baseURL}/stocks/point/${pointId}`);
    return response.data;
  }

  // ==================== DEMANDES D'ENLÈVEMENT ====================
  async creerDemande(data) {
    const response = await api.post(`${this.baseURL}/demandes`, data);
    return response.data;
  }

  async getMesDemandes(statut = null) {
    const params = statut ? { statut } : {};
    const response = await api.get(`${this.baseURL}/demandes`, { params });
    return response.data;
  }

  async getDemandeDetails(demandeId) {
    const response = await api.get(`${this.baseURL}/demandes/${demandeId}`);
    return response.data;
  }

  async confirmerReception(demandeId, quantiteRecue, notes) {
    const response = await api.put(`${this.baseURL}/demandes/${demandeId}/confirmer`, {
      quantiteRecue,
      notes
    });
    return response.data;
  }

  // ==================== DÉCLARATIONS DE RECYCLAGE ====================
  async declarerRecyclage(data) {
    const response = await api.post(`${this.baseURL}/declarations`, data);
    return response.data;
  }
// services/recycleurService.js - Version corrigée

async declarerRecyclageWithCertificat(formData) {
  try {
    console.log('📤 Envoi déclaration avec FormData:');
    // Afficher le contenu du FormData pour déboguer
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    const response = await api.post(`${this.baseURL}/declarations`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erreur déclaration:', error.response?.data || error);
    throw error;
  }
}

  async getMesDeclarations(statut = null) {
    const params = statut ? { statut } : {};
    const response = await api.get(`${this.baseURL}/declarations`, { params });
    return response.data;
  }

  async getDeclarationDetails(declarationId) {
    const response = await api.get(`${this.baseURL}/declarations/${declarationId}`);
    return response.data;
  }

  // ==================== DASHBOARD ====================
  async getDashboard() {
    const response = await api.get(`${this.baseURL}/tableau-bord`);
    return response.data;
  }

  async getPointsWithStocks() {
  try {
    console.log('📡 Chargement des points avec stocks...');
    
    // 1. Récupérer tous les points de dépôt
    const pointsResponse = await api.get('/points-depot');
    const points = pointsResponse.data.points || pointsResponse.data || [];
    console.log('📍 Points bruts:', points);
    
    // 2. Récupérer tous les stocks
    const stocksResponse = await this.getStocks();
    const stocks = stocksResponse.stocks || stocksResponse || [];
    console.log('📦 Stocks bruts:', stocks);
    
    // 3. Créer une map des stocks par point
    const stocksByPoint = {};
    stocks.forEach(stock => {
      if (!stocksByPoint[stock.point_depot_id]) {
        stocksByPoint[stock.point_depot_id] = {};
      }
      stocksByPoint[stock.point_depot_id][stock.type_dechet] = stock.quantite_disponible;
    });
    
    // 4. Combiner les données
    const pointsWithStocks = points.map(point => ({
      id: point.id,
      nom: point.nom,
      commune: point.commune,
      quartier: point.quartier,
      adresse: point.adresse,
      stocks: stocksByPoint[point.id] || {}
    }));
    
    console.log('✅ Points avec stocks:', pointsWithStocks);
    return pointsWithStocks;
    
  } catch (error) {
    console.error('❌ Erreur getPointsWithStocks:', error);
    throw error;
  }
}

  // ==================== STATISTIQUES ====================
  async getStatistiques(annee = null) {
    const params = annee ? { annee } : {};
    const response = await api.get(`${this.baseURL}/statistiques`, { params });
    return response.data;
  }
  async getMonStock() {
  const response = await api.get(`${this.baseURL}/mon-stock`);
  return response.data;
}

  // ==================== POINTS DE DÉPÔT ====================
  async getPointsDepot() {
    const response = await api.get('/points-depot');
    return response.data;
  }

  async getPointDetails(pointId) {
    const response = await api.get(`/points-depot/${pointId}`);
    return response.data;
  }

  async getMesDeclarations(statut = null) {
  const params = statut ? { statut } : {};
  const response = await api.get(`${this.baseURL}/declarations`, { params });
  return response.data;
}

async getDeclarationDetails(declarationId) {
  const response = await api.get(`${this.baseURL}/declarations/${declarationId}`);
  return response.data;
}

// Ajoutez aussi cette méthode pour obtenir 
getCertificatUrl(path) {
  if (!path) return null;
  // Si le chemin commence par /uploads, utilisez l'URL de base
  return `${import.meta.env.VITE_API_URL ||  'https://ecobackend-zeds.vercel.app/'}${path}`;
}

  // ==================== UTILITAIRES ====================
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  }

  getTypeLabel(type) {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique'
    };
    return labels[type] || type;
  }

  getStatusBadge(statut) {
    const badges = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'En attente' },
      'validee': { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Validée' },
      'acceptee': { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Acceptée' },
      'realisee': { color: 'bg-blue-100 text-blue-800', icon: '♻️', label: 'Réalisée' },
      'refusee': { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Refusée' },
    };
    return badges[statut] || { color: 'bg-gray-100 text-gray-800', icon: '📝', label: statut };
  }
}

export default new RecycleurService();