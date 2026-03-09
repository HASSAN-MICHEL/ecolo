


// // services/adminService.js
// import api from './api';

// class AdminService {
//   // ==================== DASHBOARD ====================
//   async getDashboard() {
//     const response = await api.get('/admin/tableau-bord');
//     return response.data;
//   }

//   async getRecentActivities() {
//     const response = await api.get('/admin/activites-recentes');
//     return response.data;
//   }

//   async getStatistiquesAvancees() {
//     const response = await api.get('/admin/statistiques-avancees');
//     return response.data;
//   }

//   // ==================== SUPERVISEURS ====================
//   async getSuperviseurs(params = {}) {
//     const response = await api.get('/admin/superviseurs', { params });
//     return response.data;
//   }

//   async getSuperviseurById(id) {
//     const response = await api.get(`/admin/superviseurs/${id}`);
//     return response.data;
//   }

//   async creerSuperviseur(data) {
//     const response = await api.post('/admin/superviseurs', data);
//     return response.data;
//   }

//   async modifierSuperviseur(id, data) {
//     const response = await api.put(`/admin/superviseurs/${id}`, data);
//     return response.data;
//   }

//   async supprimerSuperviseur(id) {
//     const response = await api.delete(`/admin/superviseurs/${id}`);
//     return response.data;
//   }

//   // ==================== RECYCLEURS ====================
//   async getRecycleurs(params = {}) {
//     const response = await api.get('/admin/recycleurs', { params });
//     return response.data;
//   }

//   async getRecycleurById(id) {
//     const response = await api.get(`/admin/recycleurs/${id}`);
//     return response.data;
//   }

//   async creerRecycleur(data) {
//     const formData = this._buildFormData(data);
//     const response = await api.post('/admin/recycleurs', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data;
//   }

//   async modifierRecycleur(id, data) {
//     const formData = this._buildFormData(data);
//     const response = await api.put(`/admin/recycleurs/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data;
//   }

//   async validerRecycleur(id, notes) {
//     const response = await api.post(`/admin/recycleurs/${id}/valider`, { notes });
//     return response.data;
//   }

//   async suspendreRecycleur(id, raison) {
//     const response = await api.post(`/admin/recycleurs/${id}/suspendre`, { raison });
//     return response.data;
//   }

//   async demanderSuppressionRecycleur(id, raison) {
//     const response = await api.post(`/admin/recycleurs/${id}/demande-suppression`, { raison });
//     return response.data;
//   }

//   async supprimerRecycleur(id) {
//     const response = await api.delete(`/admin/recycleurs/${id}`);
//     return response.data;
//   }

//   // ==================== PRODUCTEURS PREMIUM ====================
//   async getProducteursPremium() {
//     const response = await api.get('/admin/producteurs-premium');
//     return response.data;
//   }

//   // ==================== DEMANDES DE SUPPRESSION ====================
//   async getDemandesSuppression(params = {}) {
//     const response = await api.get('/admin/demandes-suppression', { params });
//     return response.data;
//   }

//   async getDemandeSuppressionById(id) {
//     const response = await api.get(`/admin/demandes-suppression/${id}`);
//     return response.data;
//   }

//   async traiterDemandeSuppression(demandeId, statut, notes) {
//     const response = await api.put(`/admin/demandes-suppression/${demandeId}`, {
//       statut,
//       notes
//     });
//     return response.data;
//   }

//   // ==================== SPONSORS ====================
//   async getSponsors() {
//     const response = await api.get('/admin/sponsors');
//     return response.data;
//   }

//   async getSponsor(id) {
//     const response = await api.get(`/admin/sponsors/${id}`);
//     return response.data;
//   }

//  async createSponsor(data) {
//   const response = await api.post('/admin/sponsors', data);
//   return response.data;
// }
//   async updateSponsor(id, data) {
//     const formData = this._buildFormData(data);
//     const response = await api.put(`/admin/sponsors/${id}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     return response.data;
//   }

//   async deleteSponsor(id) {
//     const response = await api.delete(`/admin/sponsors/${id}`);
//     return response.data;
//   }

//   async activateSponsor(id) {
//     const response = await api.post(`/admin/sponsors/${id}/activer`);
//     return response.data;
//   }

//   async deactivateSponsor(id, raison) {
//     const response = await api.post(`/admin/sponsors/${id}/desactiver`, { raison });
//     return response.data;
//   }

//   async getOngs() {
//     const response = await api.get('/admin/ongs');
//     return response.data;
// }
// async getOng(id) {
//     const response = await api.get(`/admin/ongs/${id}`);
//     return response.data;
// }
// async createOng(data) {
//     const response = await api.post('/admin/ongs', data);
//     return response.data;
// }
// async updateOng(id, data) {
//     const response = await api.put(`/admin/ongs/${id}`, data);
//     return response.data;
// }

//   // Pas de suppression d'ONG pour l'instant (selon le backend)

//   // // ==================== CAMPAGNES ====================
//   // async getCampagnes(params = {}) {
//   //   const response = await api.get('/admin/campagnes', { params });
//   //   return response.data;
//   // }

//   // async getCampagne(id) {
//   //   const response = await api.get(`/admin/campagnes/${id}`);
//   //   return response.data;
//   // }

//   // async createCampagne(data) {
//   //   const response = await api.post('/admin/campagnes', data);
//   //   return response.data;
//   // }

//   // async updateCampagne(id, data) {
//   //   const response = await api.put(`/admin/campagnes/${id}`, data);
//   //   return response.data;
//   // }

//   // async deleteCampagne(id) {
//   //   const response = await api.delete(`/admin/campagnes/${id}`);
//   //   return response.data;
//   // }

//   async getCampagnes  (data){
//   try {
//     const response = await api.get('/admin/campagnes');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };async getCampagne (id) {
//   try {
//     const response = await api.get(`/admin/campagnes/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };async createCampagne (data) {
//   try {
//     const response = await api.post('/admin/campagnes', data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
// export const updateCampagne = async (id, data) => {
//   try {
//     const response = await api.put(`/admin/campagnes/${id}`, data);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// async deleteCampagne (id)  {
//   try {
//     const response = await api.delete(`/admin/campagnes/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// async getCampagneStats (id)  {
//   try {
//     const response = await api.get(`/admin/campagnes/${id}/statistiques`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

//   async addPromoteur(campagneId, promoteurData) {
//     const response = await api.post(`/admin/campagnes/${campagneId}/promoteurs`, promoteurData);
//     return response.data;
//   }

//   async removePromoteur(campagneId, promoteurId, promoteurType) {
//     const response = await api.delete(
//       `/admin/campagnes/${campagneId}/promoteurs/${promoteurId}/${promoteurType}`
//     );
//     return response.data;
//   }

//   async addSuivi(campagneId, suiviData) {
//     const response = await api.post(`/admin/campagnes/${campagneId}/suivi`, suiviData);
//     return response.data;
//   }

//   async getRapportCampagne(campagneId, format = 'json') {
//     const response = await api.get(`/admin/campagnes/${campagneId}/rapport`, {
//       params: { format },
//       responseType: format === 'pdf' ? 'blob' : 'json'
//     });
//     return response.data;
//   }

//   // ==================== HISTORIQUE ====================
//   async getHistorique(params = {}) {
//     const response = await api.get('/admin/historique', { params });
//     return response.data;
//   }

//   // ==================== STATISTIQUES ====================
//   async getStatistiques() {
//     const response = await api.get('/admin/statistiques');
//     return response.data;
//   }

//   async getStatistiquesPeriodiques(debut, fin) {
//     const response = await api.get('/admin/statistiques-periodiques', {
//       params: { debut, fin }
//     });
//     return response.data;
//   }

//   // ==================== EXPORT ====================
//   async exportData(type, format = 'csv') {
//     const response = await api.get(`/admin/export/${type}`, {
//       params: { format },
//       responseType: 'blob'
//     });
//     return response.data;
//   }

//   // ==================== UTILITAIRE ====================
//   _buildFormData(data) {
//     const formData = new FormData();
//     Object.keys(data).forEach(key => {
//       const value = data[key];
//       if (value instanceof File) {
//         formData.append(key, value);
//       } else if (value !== undefined && value !== null) {
//         formData.append(key, String(value));
//       }
//     });
//     return formData;
//   }
// }

// export default new AdminService();


// services/adminService.js
import api from './api';

class AdminService {
  // ==================== DASHBOARD ====================
  async getDashboard() {
    const response = await api.get('/admin/tableau-bord');
    return response.data;
  }

  async getRecentActivities() {
    const response = await api.get('/admin/activites-recentes');
    return response.data;
  }

  async getStatistiquesAvancees() {
    const response = await api.get('/admin/statistiques-avancees');
    return response.data;
  }

  // ==================== SUPERVISEURS ====================
  async getSuperviseurs(params = {}) {
    const response = await api.get('/admin/superviseurs', { params });
    return response.data;
  }

  async getSuperviseurById(id) {
    const response = await api.get(`/admin/superviseurs/${id}`);
    return response.data;
  }

  async creerSuperviseur(data) {
    const response = await api.post('/admin/superviseurs', data);
    return response.data;
  }

  async modifierSuperviseur(id, data) {
    const response = await api.put(`/admin/superviseurs/${id}`, data);
    return response.data;
  }

  async supprimerSuperviseur(id) {
    const response = await api.delete(`/admin/superviseurs/${id}`);
    return response.data;
  }

  // ==================== RECYCLEURS ====================
  async getRecycleurs(params = {}) {
    const response = await api.get('/admin/recycleurs', { params });
    return response.data;
  }

  async getRecycleurById(id) {
    const response = await api.get(`/admin/recycleurs/${id}`);
    return response.data;
  }

  // async creerRecycleur(data) {
  //   const formData = this._buildFormData(data);
  //   const response = await api.post('/admin/recycleurs', formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   });
  //   return response.data;
  // }

  // adminService.js
async creerRecycleur(data) {
  // Vérifiez que c'est bien un FormData
  console.log('🔍 adminService.creerRecycleur - data type:', data instanceof FormData ? 'FormData' : typeof data);
  
  // Affichez les clés du FormData
  if (data instanceof FormData) {
    console.log('📦 FormData keys:');
    for (let pair of data.entries()) {
      console.log(`  ${pair[0]}:`, pair[0].includes('photo') ? '[FICHIER]' : pair[1]);
    }
  }
  
  const response = await api.post('/admin/recycleurs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

  async modifierRecycleur(id, data) {
    const formData = this._buildFormData(data);
    const response = await api.put(`/admin/recycleurs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async validerRecycleur(id, notes) {
    const response = await api.post(`/admin/recycleurs/${id}/valider`, { notes });
    return response.data;
  }

  async suspendreRecycleur(id, raison) {
    const response = await api.post(`/admin/recycleurs/${id}/suspendre`, { raison });
    return response.data;
  }

  async demanderSuppressionRecycleur(id, raison) {
    const response = await api.post(`/admin/recycleurs/${id}/demande-suppression`, { raison });
    return response.data;
  }

  async supprimerRecycleur(id) {
    const response = await api.delete(`/admin/recycleurs/${id}`);
    return response.data;
  }

  // ==================== PRODUCTEURS PREMIUM ====================
  async getProducteursPremium() {
    const response = await api.get('/admin/producteurs-premium');
    return response.data;
  }

  // ==================== DEMANDES DE SUPPRESSION ====================
  async getDemandesSuppression(params = {}) {
    const response = await api.get('/admin/demandes-suppression', { params });
    return response.data;
  }

  async getDemandeSuppressionById(id) {
    const response = await api.get(`/admin/demandes-suppression/${id}`);
    return response.data;
  }

  async traiterDemandeSuppression(demandeId, statut, notes) {
    const response = await api.put(`/admin/demandes-suppression/${demandeId}`, {
      statut,
      notes
    });
    return response.data;
  }

  // ==================== SPONSORS ====================
  async getSponsors() {
    const response = await api.get('/admin/sponsors');
    return response.data;
  }

  async getSponsor(id) {
    const response = await api.get(`/admin/sponsors/${id}`);
    return response.data;
  }

  async createSponsor(data) {
    const response = await api.post('/admin/sponsors', data);
    return response.data;
  }

  async updateSponsor(id, data) {
    const formData = this._buildFormData(data);
    const response = await api.put(`/admin/sponsors/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async deleteSponsor(id) {
    const response = await api.delete(`/admin/sponsors/${id}`);
    return response.data;
  }

  async activateSponsor(id) {
    const response = await api.post(`/admin/sponsors/${id}/activer`);
    return response.data;
  }

  async deactivateSponsor(id, raison) {
    const response = await api.post(`/admin/sponsors/${id}/desactiver`, { raison });
    return response.data;
  }

  // ==================== ONGS ====================
  async getOngs() {
    const response = await api.get('/admin/ongs');
    return response.data;
  }

  async getOng(id) {
    const response = await api.get(`/admin/ongs/${id}`);
    return response.data;
  }

  async createOng(data) {
    const response = await api.post('/admin/ongs', data);
    return response.data;
  }

  async updateOng(id, data) {
    const response = await api.put(`/admin/ongs/${id}`, data);
    return response.data;
  }

  // ==================== CAMPAGNES ====================
  async getCampagnes() {
    try {
      const response = await api.get('/admin/campagnes');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCampagne(id) {
    try {
      const response = await api.get(`/admin/campagnes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createCampagne(data) {
    try {
      const response = await api.post('/admin/campagnes', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCampagne(id, data) {
    try {
      const response = await api.put(`/admin/campagnes/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCampagne(id) {
    try {
      const response = await api.delete(`/admin/campagnes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCampagneStats(id) {
    try {
      const response = await api.get(`/admin/campagnes/${id}/statistiques`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addPromoteur(campagneId, promoteurData) {
    const response = await api.post(`/admin/campagnes/${campagneId}/promoteurs`, promoteurData);
    return response.data;
  }

  async removePromoteur(campagneId, promoteurId, promoteurType) {
    const response = await api.delete(
      `/admin/campagnes/${campagneId}/promoteurs/${promoteurId}/${promoteurType}`
    );
    return response.data;
  }

  async addSuivi(campagneId, suiviData) {
    const response = await api.post(`/admin/campagnes/${campagneId}/suivi`, suiviData);
    return response.data;
  }

  async getRapportCampagne(campagneId, format = 'json') {
    const response = await api.get(`/admin/campagnes/${campagneId}/rapport`, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json'
    });
    return response.data;
  }

  // ==================== HISTORIQUE ====================
  async getHistorique(params = {}) {
    const response = await api.get('/admin/historique', { params });
    return response.data;
  }
  async getStatistiquesAchats() {
    const response = await api.get('/admin/statistiques/achats');
    return response.data;
}

async getStatistiquesCollectes() {
    const response = await api.get('/admin/statistiques/collectes');
    return response.data;
}

async getStocksPoints() {
    const response = await api.get('/admin/stocks-points');
    return response.data;
}

async getProducteurs() {
    const response = await api.get('/admin/producteurs');
    return response.data;
}

async getCollecteurs() {
    const response = await api.get('/admin/collecteurs');
    return response.data;
}

async getGestionnaires() {
    const response = await api.get('/admin/gestionnaires');
    return response.data;
}
async getCollecteurs() {
    const response = await api.get('/admin/collecteurs');
    return response.data;
}

async getGestionnaires() {
    const response = await api.get('/admin/gestionnaires');
    return response.data;
}

async getCollecteurStats(id) {
    const response = await api.get(`/admin/collecteurs/${id}/stats`);
    return response.data;
}

async getGestionnaireDetails(id) {
    const response = await api.get(`/admin/gestionnaires/${id}/details`);
    return response.data;
}
  // ==================== STATISTIQUES ====================
  async getStatistiques() {
    const response = await api.get('/admin/statistiques');
    return response.data;
  }

  async getStatistiquesPeriodiques(debut, fin) {
    const response = await api.get('/admin/statistiques-periodiques', {
      params: { debut, fin }
    });
    return response.data;
  }

  // ==================== EXPORT ====================
  async exportData(type, format = 'csv') {
    const response = await api.get(`/admin/export/${type}`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // ==================== UTILITAIRE ====================
  _buildFormData(data) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return formData;
  }
}

export default new AdminService();