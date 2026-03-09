// // services/gestionnaireService.js
// // const API_URL = 'https://ecobackend-y6nd.vercel.app';
// const API_URL = 'http://localhost:3000';

// class GestionnaireService {
//     constructor() {
//         this.token = null;
//         this.STORAGE_KEYS = {
//             TOKEN: 'ecocollect_token',
//             USER: 'ecocollect_user',
//             ROLE: 'ecocollect_role'
//         };
//     }

//     // ==================== GESTION DU TOKEN ====================
//     setToken(token) {
//         this.token = token;
//     }

//     getToken() {
//         if (!this.token) {
//             this.token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
//         }
//         return this.token;
//     }

//     getHeaders() {
//         const token = this.getToken();
//         return {
//             'Content-Type': 'application/json',
//             'Authorization': token ? `Bearer ${token}` : ''
//         };
//     }

//     handleResponse = async (response) => {
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // Token expiré ou invalide
//                 localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
//                 localStorage.removeItem(this.STORAGE_KEYS.USER);
//                 localStorage.removeItem(this.STORAGE_KEYS.ROLE);
//                 window.location.href = '/login';
//                 throw new Error('Session expirée');
//             }
            
//             const error = await response.json().catch(() => ({}));
//             throw new Error(error.message || 'Erreur serveur');
//         }
        
//         const data = await response.json();
//         return data.success ? data : data; // Retourne directement les données si pas de wrapper success
//     }

//     // ==================== PROFIL UTILISATEUR ====================
//     async getProfil() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.utilisateur || result;
//         } catch (error) {
//             console.error('❌ Erreur getProfil:', error);
//             throw error;
//         }
//     }

//     async updateProfil(donnees) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
//                 method: 'PUT',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify(donnees)
//             });
//             return this.handleResponse(response);
//         } catch (error) {
//             console.error('❌ Erreur updateProfil:', error);
//             throw error;
//         }
//     }

//     async changePassword(motDePasseActuel, nouveauMotDePasse) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/changer-mot-de-passe`, {
//                 method: 'PUT',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify({ motDePasseActuel, nouveauMotDePasse })
//             });
//             return this.handleResponse(response);
//         } catch (error) {
//             console.error('❌ Erreur changePassword:', error);
//             throw error;
//         }
//     }

//     // ==================== TABLEAU DE BORD ====================
//     async getTableauBord() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
            
//             // Formater les données pour le frontend
//             const statsGlobales = result.statistiques || {};
//             const mesStats = result.mes_statistiques || {};

//             return {
//                 statistiques: {
//                     enAttente: statsGlobales.en_attente || 0,
//                     totalValidees: statsGlobales.total_validees || 0,
//                     poidsTotalGlobal: statsGlobales.poids_total_global || 0,
//                     gainsDistribuesGlobal: statsGlobales.gains_distribues_global || 0,
//                 },
//                 mes_statistiques: {
//                     missionsValidees: mesStats.missions_validees || 0,
//                     poidsTotalValide: mesStats.poids_total_valide || 0,
//                     gainsDistribues: mesStats.gains_distribues || 0,
//                     contribution: statsGlobales.total_validees ? 
//                         Math.round((mesStats.missions_validees / statsGlobales.total_validees) * 100) : 0
//                 },
//                 dernieresMissions: result.dernieresMissions || []
//             };
//         } catch (error) {
//             console.error('❌ Erreur getTableauBord:', error);
//             throw error;
//         }
//     }

//     // ==================== MISSIONS ====================
//     async getMissionsEnAttente() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.missions || [];
//         } catch (error) {
//             console.error('❌ Erreur getMissionsEnAttente:', error);
//             throw error;
//         }
//     }

//     async getToutesMissions(statut = null) {
//         try {
//             const url = statut 
//                 ? `${API_URL}/api/gestionnaires/missions?statut=${statut}`
//                 : `${API_URL}/api/gestionnaires/missions`;
            
//             const response = await fetch(url, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.missions || [];
//         } catch (error) {
//             console.error('❌ Erreur getToutesMissions:', error);
//             throw error;
//         }
//     }

//     async getMissionDetails(missionId) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.mission;
//         } catch (error) {
//             console.error('❌ Erreur getMissionDetails:', error);
//             throw error;
//         }
//     }

//     async validerMission(missionId, donnees) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
//                 method: 'POST',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify({
//                     poidsDepose: parseFloat(donnees.poidsDepose),
//                     prixParKg: parseFloat(donnees.prixParKg),
//                     qualiteDechets: donnees.qualiteDechets,
//                     validationNotes: donnees.notes
//                 })
//             });
//             const result = await this.handleResponse(response);
//             return result.mission || result;
//         } catch (error) {
//             console.error('❌ Erreur validerMission:', error);
//             throw error;
//         }
//     }

//     // ==================== MES VALIDATIONS ====================
//     async getMesMissionsValidees() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/mes-missions/validees`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.missions || [];
//         } catch (error) {
//             console.error('❌ Erreur getMesMissionsValidees:', error);
//             throw error;
//         }
//     }

//     async getMonHistorique(limite = 50) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/mon-historique?limite=${limite}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.historique || [];
//         } catch (error) {
//             console.error('❌ Erreur getMonHistorique:', error);
//             throw error;
//         }
//     }

//     // ==================== ACHATS ====================
//     async getAchats(limite = 50, page = 1) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/achats?limite=${limite}&page=${page}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return {
//                 achats: result.achats || [],
//                 statistiques: result.statistiques || {},
//                 pagination: result.pagination || { page, limite, total: 0 }
//             };
//         } catch (error) {
//             console.error('❌ Erreur getAchats:', error);
//             throw error;
//         }
//     }

//     async getStatistiquesAchats(periode = '30 days') {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/achats/statistiques?periode=${periode}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return {
//                 global: result.global || {},
//                 par_type_dechet: result.par_type_dechet || [],
//                 evolution_journaliere: result.evolution_journaliere || []
//             };
//         } catch (error) {
//             console.error('❌ Erreur getStatistiquesAchats:', error);
//             throw error;
//         }
//     }

//     async creerAchat(donnees) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/achats`, {
//                 method: 'POST',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify({
//                     typeDechet: donnees.typeDechet,
//                     poids: parseFloat(donnees.poids),
//                     prixParKg: parseFloat(donnees.prixParKg),
//                     nomVendeur: donnees.nomVendeur || 'Anonyme',
//                     telephoneVendeur: donnees.telephoneVendeur || null,
//                     notes: donnees.notes || ''
//                 })
//             });
//             const result = await this.handleResponse(response);
//             return result.achat || result;
//         } catch (error) {
//             console.error('❌ Erreur creerAchat:', error);
//             throw error;
//         }
//     }

//     async getRecuAchat(achatId) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/achats/${achatId}/recu`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.recu;
//         } catch (error) {
//             console.error('❌ Erreur getRecuAchat:', error);
//             throw error;
//         }
//     }

//     // ==================== STOCKS ====================
//     async getStocks() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/stocks`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return {
//                 stocks: result.stocks || [],
//                 total_types: result.total_types || 0,
//                 poids_total: result.poids_total || 0
//             };
//         } catch (error) {
//             console.error('❌ Erreur getStocks:', error);
//             throw error;
//         }
//     }

//     async ajusterStock(donnees) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/stocks/ajuster`, {
//                 method: 'PUT',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify({
//                     typeDechet: donnees.typeDechet,
//                     nouvelleQuantite: parseFloat(donnees.nouvelleQuantite),
//                     raison: donnees.raison
//                 })
//             });
//             const result = await this.handleResponse(response);
//             return result.stock;
//         } catch (error) {
//             console.error('❌ Erreur ajusterStock:', error);
//             throw error;
//         }
//     }

//     // ==================== STATISTIQUES ====================
//     async getStatistiquesParTypeDechet() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/statistiques/par-type-dechet`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return {
//                 stats: result.stats || [],
//                 total: result.total || { poids: 0, missions: 0 }
//             };
//         } catch (error) {
//             console.error('❌ Erreur getStatistiquesParTypeDechet:', error);
//             throw error;
//         }
//     }

//     async getRepartitionJournaliere(jours = 30) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/statistiques/repartition-journaliere?jours=${jours}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.repartition || [];
//         } catch (error) {
//             console.error('❌ Erreur getRepartitionJournaliere:', error);
//             throw error;
//         }
//     }

//     async getStatistiquesCompletes() {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/statistiques/completes`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result;
//         } catch (error) {
//             console.error('❌ Erreur getStatistiquesCompletes:', error);
//             throw error;
//         }
//     }

//     // ==================== TOP COLLECTEURS ====================
//     async getTopCollecteurs(limite = 5) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/top-collecteurs?limite=${limite}`, {
//                 headers: this.getHeaders()
//             });
//             const result = await this.handleResponse(response);
//             return result.top || [];
//         } catch (error) {
//             console.error('❌ Erreur getTopCollecteurs:', error);
//             throw error;
//         }
//     }

//     // ==================== CRÉDITS BONUS ====================
//     async attribuerCreditsBonus(collecteurId, missionId, montant) {
//         try {
//             const response = await fetch(`${API_URL}/api/gestionnaires/collecteurs/${collecteurId}/missions/${missionId}/credits`, {
//                 method: 'POST',
//                 headers: this.getHeaders(),
//                 body: JSON.stringify({ montant: parseFloat(montant) })
//             });
//             const result = await this.handleResponse(response);
//             return result.gain;
//         } catch (error) {
//             console.error('❌ Erreur attribuerCreditsBonus:', error);
//             throw error;
//         }
//     }

//     // ==================== UTILITAIRES ====================
//     formatDate(dateString) {
//         if (!dateString) return 'N/A';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('fr-FR', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     }

//     formatCurrency(amount) {
//         return new Intl.NumberFormat('fr-FR', { 
//             style: 'currency', 
//             currency: 'XOF',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(amount).replace('XOF', 'FCFA');
//     }

//     getTypeColor(type) {
//         const colors = {
//             'plastique_pet': '#3B82F6',
//             'plastique_pehd': '#2563EB',
//             'papier_carton': '#F59E0B',
//             'metal': '#6B7280',
//             'verre': '#10B981',
//             'organique': '#84CC16'
//         };
//         return colors[type] || '#6B7280';
//     }

//     getTypeIcon(type) {
//         const icons = {
//             'plastique_pet': '🥤',
//             'plastique_pehd': '🧴',
//             'papier_carton': '📦',
//             'metal': '🔩',
//             'verre': '🍾',
//             'organique': '🥬'
//         };
//         return icons[type] || '📊';
//     }

//     getNiveauStock(quantite) {
//         if (quantite < 20) return { class: 'bg-red-100 text-red-800 border-red-200', label: 'Critique' };
//         if (quantite < 50) return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Bas' };
//         return { class: 'bg-green-100 text-green-800 border-green-200', label: 'Normal' };
//     }

//     getStatusBadge(statut) {
//         const badges = {
//             'validee': { class: 'bg-green-100 text-green-800', label: 'Validée' },
//             'deposee': { class: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
//             'acceptee': { class: 'bg-blue-100 text-blue-800', label: 'Acceptée' },
//             'en_cours': { class: 'bg-purple-100 text-purple-800', label: 'En cours' }
//         };
//         return badges[statut] || { class: 'bg-gray-100 text-gray-800', label: statut };
//     }
// }

// // Export en singleton
// const gestionnaireService = new GestionnaireService();
// export default gestionnaireService;



// services/gestionnaireService.js
const API_URL = 'https://ecobackend-zeds.vercel.app';

class GestionnaireService {
    constructor() {
        this.token = null;
        this.STORAGE_KEYS = {
            TOKEN: 'ecocollect_token',
            USER: 'ecocollect_user',
            ROLE: 'ecocollect_role'
        };
    }

    formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

formatCurrency(amount) {
    if (amount === undefined || amount === null) return '0 FCFA';
    
    // Arrondir à l'entier le plus proche (pas de décimales pour le FCFA)
    const roundedAmount = Math.round(amount);
    
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF',
        minimumFractionDigits: 0,  // ← Pas de décimales
        maximumFractionDigits: 0   // ← Pas de décimales
    }).format(roundedAmount).replace('XOF', 'FCFA');
}
// ✅ AJOUTÉ - getTypeColor
getTypeColor(type) {
    const colors = {
        'plastique_pet': '#3B82F6',
        'plastique_pehd': '#2563EB',
        'papier_carton': '#F59E0B',
        'metal': '#6B7280',
        'verre': '#10B981',
        'organique': '#84CC16'
    };
    return colors[type] || '#6B7280';
}

getTypeIcon(type) {
    const icons = {
        'plastique_pet': '🥤',
        'plastique_pehd': '🧴',
        'papier_carton': '📦',
        'metal': '🔩',
        'verre': '🍾',
        'organique': '🥬'
    };
    return icons[type] || '📊';
}

getNiveauStock(quantite) {
    if (quantite < 20) return { class: 'bg-red-100 text-red-800 border-red-200', label: 'Critique' };
    if (quantite < 50) return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Bas' };
    return { class: 'bg-green-100 text-green-800 border-green-200', label: 'Normal' };
}

getStatusBadge(statut) {
    const badges = {
        'validee': { class: 'bg-green-100 text-green-800', label: 'Validée' },
        'deposee': { class: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
        'acceptee': { class: 'bg-blue-100 text-blue-800', label: 'Acceptée' },
        'en_cours': { class: 'bg-purple-100 text-purple-800', label: 'En cours' }
    };
    return badges[statut] || { class: 'bg-gray-100 text-gray-800', label: statut };
}

    // ==================== GESTION DU TOKEN ====================
    setToken(token) {
        this.token = token;
    }

    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
        }
        return this.token;
    }

    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    handleResponse = async (response) => {
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
                localStorage.removeItem(this.STORAGE_KEYS.USER);
                localStorage.removeItem(this.STORAGE_KEYS.ROLE);
                window.location.href = '/login';
                throw new Error('Session expirée');
            }
            
            if (response.status === 404) {
                console.error('❌ Route non trouvée:', response.url);
                throw new Error(`Route non trouvée: ${response.url}`);
            }
            
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erreur ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }

    // ==================== PROFIL UTILISATEUR ====================
    async getProfil() {
        try {
            console.log('📡 Chargement du profil...');
            const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
                headers: this.getHeaders()
            });
            const result = await this.handleResponse(response);
            return result.utilisateur || result;
        } catch (error) {
            console.error('❌ Erreur getProfil:', error);
            throw error;
        }
    }

    // ==================== TABLEAU DE BORD ====================
    async getTableauBord() {
        try {
            console.log('📡 Chargement du tableau de bord...');
            const response = await fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    // Si la route n'existe pas, retourner des données par défaut
                    console.warn('⚠️ Route tableau-bord non trouvée, utilisation données par défaut');
                    return {
                        statistiques: { enAttente: 0, totalValidees: 0, poidsTotalGlobal: 0, gainsDistribuesGlobal: 0 },
                        mes_statistiques: { missionsValidees: 0, poidsTotalValide: 0, gainsDistribues: 0, contribution: 0 },
                        dernieresMissions: []
                    };
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            
            const statsGlobales = result.statistiques || {};
            const mesStats = result.mes_statistiques || {};

            return {
                statistiques: {
                    enAttente: statsGlobales.en_attente || 0,
                    totalValidees: statsGlobales.total_validees || 0,
                    poidsTotalGlobal: statsGlobales.poids_total_global || 0,
                    gainsDistribuesGlobal: statsGlobales.gains_distribues_global || 0,
                },
                mes_statistiques: {
                    missionsValidees: mesStats.missions_validees || 0,
                    poidsTotalValide: mesStats.poids_total_valide || 0,
                    gainsDistribues: mesStats.gains_distribues || 0,
                    contribution: statsGlobales.total_validees ? 
                        Math.round((mesStats.missions_validees / statsGlobales.total_validees) * 100) : 0
                },
                dernieresMissions: result.dernieresMissions || []
            };
        } catch (error) {
            console.error('❌ Erreur getTableauBord:', error);
            // Retourner des données par défaut pour éviter le blocage
            return {
                statistiques: { enAttente: 0, totalValidees: 0, poidsTotalGlobal: 0, gainsDistribuesGlobal: 0 },
                mes_statistiques: { missionsValidees: 0, poidsTotalValide: 0, gainsDistribues: 0, contribution: 0 },
                dernieresMissions: []
            };
        }
    }

    // ==================== MISSIONS ====================
    async getMissionsEnAttente() {
        try {
            console.log('📡 Chargement des missions en attente...');
            const response = await fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route missions/en-attente non trouvée');
                    return [];
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.missions || [];
        } catch (error) {
            console.error('❌ Erreur getMissionsEnAttente:', error);
            return []; // Retourner tableau vide en cas d'erreur
        }
    }

    // ==================== MES VALIDATIONS ====================
    async getMesMissionsValidees() {
        try {
            console.log('📡 Chargement de mes missions validées...');
            const response = await fetch(`${API_URL}/api/gestionnaires/mes-missions/validees`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route mes-missions/validees non trouvée');
                    return [];
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.missions || [];
        } catch (error) {
            console.error('❌ Erreur getMesMissionsValidees:', error);
            return [];
        }
    }

    async validerMission(missionId, donnees) {
    try {
        console.log('📡 Validation mission...', { missionId, donnees });
        const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                poidsDepose: parseFloat(donnees.poidsDepose),
                prixParKg: parseFloat(donnees.prixParKg),
                qualiteDechets: donnees.qualiteDechets,
                 campagneId: donnees.campagneId || null  ,
                validationNotes: donnees.notes
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Route de validation non trouvée');
            }
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erreur ${response.status}`);
        }

        const result = await this.handleResponse(response);
        return result.mission || result;
    } catch (error) {
        console.error('❌ Erreur validerMission:', error);
        throw error;
    }
}

    async getMonHistorique(limite = 50) {
        try {
            console.log('📡 Chargement de mon historique...');
            const response = await fetch(`${API_URL}/api/gestionnaires/mon-historique?limite=${limite}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route mon-historique non trouvée');
                    return [];
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.historique || [];
        } catch (error) {
            console.error('❌ Erreur getMonHistorique:', error);
            return [];
        }
    }


    // ==================== STATISTIQUES DÉTAILLÉES ====================
async getStatistiquesCompletes() {
    try {
        console.log('📡 Chargement des statistiques complètes...');
        
        // Récupérer les missions validées par type
        const missionsParType = await this.getStatistiquesParTypeDechet();
        
        // Récupérer les achats par type
        const achatsParType = await this.getStatistiquesAchats();
        
        // Combiner les données
        const typesDechets = [
            'plastique_pet',
            'plastique_pehd', 
            'papier_carton',
            'metal',
            'verre',
            'organique'
        ];
        
        const statistiquesParType = typesDechets.map(type => {
            const mission = missionsParType.stats.find(s => s.type_dechet === type) || {
                poids_total_valide: 0,
                missions_validees: 0
            };
            
            const achat = achatsParType.par_type_dechet.find(s => s.type_dechet === type) || {
                poids_total: 0,
                nombre_achats: 0,
                montant_total: 0
            };
            
            return {
                type_dechet: type,
                missions: {
                    poids: parseFloat(mission.poids_total_valide || 0),
                    nombre: mission.missions_validees || 0
                },
                achats: {
                    poids: parseFloat(achat.poids_total || 0),
                    nombre: achat.nombre_achats || 0,
                    montant: achat.montant_total || 0
                },
                total: {
                    poids: parseFloat(mission.poids_total_valide || 0) + parseFloat(achat.poids_total || 0),
                    pourcentage_missions: mission.poids_total_valide ? 
                        ((mission.poids_total_valide / ((mission.poids_total_valide || 0) + (achat.poids_total || 0))) * 100).toFixed(1) : 0,
                    pourcentage_achats: achat.poids_total ?
                        ((achat.poids_total / ((mission.poids_total_valide || 0) + (achat.poids_total || 0))) * 100).toFixed(1) : 0
                }
            };
        });
        
        // Totaux généraux
        const totalMissions = statistiquesParType.reduce((acc, curr) => acc + curr.missions.poids, 0);
        const totalAchats = statistiquesParType.reduce((acc, curr) => acc + curr.achats.poids, 0);
        const totalGlobal = totalMissions + totalAchats;
        
        return {
            par_type: statistiquesParType,
            totaux: {
                missions: {
                    poids: totalMissions,
                    nombre: missionsParType.total?.missions || 0
                },
                achats: {
                    poids: totalAchats,
                    nombre: achatsParType.global?.nombre_achats || 0,
                    montant: achatsParType.global?.montant_total_depense || 0
                },
                global: {
                    poids: totalGlobal,
                    pourcentage_missions: totalGlobal ? ((totalMissions / totalGlobal) * 100).toFixed(1) : 0,
                    pourcentage_achats: totalGlobal ? ((totalAchats / totalGlobal) * 100).toFixed(1) : 0
                }
            }
        };
    } catch (error) {
        console.error('❌ Erreur getStatistiquesCompletes:', error);
        return {
            par_type: [],
            totaux: {
                missions: { poids: 0, nombre: 0 },
                achats: { poids: 0, nombre: 0, montant: 0 },
                global: { poids: 0, pourcentage_missions: 0, pourcentage_achats: 0 }
            }
        };
    }
}

    // ==================== ACHATS (via /api/achatsGestionnaire) ====================
    
async getAchats(limite = 50, page = 1) {
    try {
        console.log('📡 Chargement des achats...');
        // CORRECTION: Utiliser /achats (comme défini dans les routes)
        const response = await fetch(`${API_URL}/api/achatsGestionnaire/achats?limite=${limite}&page=${page}`, {
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('⚠️ Route /achats non trouvée');
                return { achats: [], statistiques: {}, pagination: { page, limite, total: 0 } };
            }
            throw new Error(`Erreur ${response.status}`);
        }
        
        const result = await this.handleResponse(response);
        return {
            achats: result.achats || [],
            statistiques: result.statistiques || {},
            pagination: result.pagination || { page, limite, total: 0 }
        };
    } catch (error) {
        console.error('❌ Erreur getAchats:', error);
        return { achats: [], statistiques: {}, pagination: { page, limite, total: 0 } };
    }
}

async getStatistiquesAchats(periode = '30 days') {
    try {
        console.log('📡 Chargement des statistiques achats...');
        // CORRECTION: Chemin déjà correct
        const response = await fetch(`${API_URL}/api/achatsGestionnaire/achats/statistiques?periode=${periode}`, {
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn('⚠️ Route statistiques achats non trouvée');
                return { global: {}, par_type_dechet: [], evolution_journaliere: [] };
            }
            throw new Error(`Erreur ${response.status}`);
        }
        
        const result = await this.handleResponse(response);
        return {
            global: result.global || {},
            par_type_dechet: result.par_type_dechet || [],
            evolution_journaliere: result.evolution_journaliere || []
        };
    } catch (error) {
        console.error('❌ Erreur getStatistiquesAchats:', error);
        return { global: {}, par_type_dechet: [], evolution_journaliere: [] };
    }
}



    async creerAchat(donnees) {
        try {
            console.log('📡 Création achat...');
            const response = await fetch(`${API_URL}/api/achatsGestionnaire/achats`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    typeDechet: donnees.typeDechet,
                    poids: parseFloat(donnees.poids),
                    prixParKg: parseFloat(donnees.prixParKg),
                    nomVendeur: donnees.nomVendeur || 'Anonyme',
                    telephoneVendeur: donnees.telephoneVendeur || null,
                    notes: donnees.notes || ''
                })
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Route de création d\'achat non trouvée');
                }
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.achat || result;
        } catch (error) {
            console.error('❌ Erreur creerAchat:', error);
            throw error;
        }
    }

    // ==================== STOCKS ====================
    async getStocks() {
        try {
            console.log('📡 Chargement des stocks...');
            const response = await fetch(`${API_URL}/api/achatsGestionnaire/stocks`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route stocks non trouvée');
                    return { stocks: [], total_types: 0, poids_total: 0 };
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return {
                stocks: result.stocks || [],
                total_types: result.total_types || 0,
                poids_total: result.poids_total || 0
            };
        } catch (error) {
            console.error('❌ Erreur getStocks:', error);
            return { stocks: [], total_types: 0, poids_total: 0 };
        }
    }

    async ajusterStock(donnees) {
        try {
            console.log('📡 Ajustement stock...');
            const response = await fetch(`${API_URL}/api/achatsGestionnaire/stocks/ajuster`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    typeDechet: donnees.typeDechet,
                    nouvelleQuantite: parseFloat(donnees.nouvelleQuantite),
                    raison: donnees.raison
                })
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Route d\'ajustement stock non trouvée');
                }
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.stock;
        } catch (error) {
            console.error('❌ Erreur ajusterStock:', error);
            throw error;
        }
    }

    // ==================== STATISTIQUES ====================
    async getStatistiquesParTypeDechet() {
        try {
            console.log('📡 Chargement des stats par type...');
            const response = await fetch(`${API_URL}/api/gestionnaires/statistiques/par-type-dechet`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route stats par type non trouvée');
                    return { stats: [], total: { poids: 0, missions: 0 } };
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return {
                stats: result.stats || [],
                total: result.total || { poids: 0, missions: 0 }
            };
        } catch (error) {
            console.error('❌ Erreur getStatistiquesParTypeDechet:', error);
            return { stats: [], total: { poids: 0, missions: 0 } };
        }
    }

    async getRepartitionJournaliere(jours = 30) {
        try {
            console.log('📡 Chargement répartition journalière...');
            const response = await fetch(`${API_URL}/api/gestionnaires/statistiques/repartition-journaliere?jours=${jours}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route répartition journalière non trouvée');
                    return [];
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.repartition || [];
        } catch (error) {
            console.error('❌ Erreur getRepartitionJournaliere:', error);
            return [];
        }
    }

    // ==================== TOP COLLECTEURS ====================
    async getTopCollecteurs(limite = 5) {
        try {
            console.log('📡 Chargement top collecteurs...');
            const response = await fetch(`${API_URL}/api/gestionnaires/top-collecteurs?limite=${limite}`, {
                headers: this.getHeaders()
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ Route top-collecteurs non trouvée');
                    return [];
                }
                throw new Error(`Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.top || [];
        } catch (error) {
            console.error('❌ Erreur getTopCollecteurs:', error);
            return [];
        }
    }

    // ==================== CRÉDITS BONUS ====================
    async attribuerCreditsBonus(collecteurId, missionId, montant) {
        try {
            console.log('📡 Attribution crédits bonus...');
            const response = await fetch(`${API_URL}/api/gestionnaires/collecteurs/${collecteurId}/missions/${missionId}/credits`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ montant: parseFloat(montant) })
            });
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Route crédits bonus non trouvée');
                }
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `Erreur ${response.status}`);
            }
            
            const result = await this.handleResponse(response);
            return result.gain;
        } catch (error) {
            console.error('❌ Erreur attribuerCreditsBonus:', error);
            throw error;
        }
    }

    // ==================== UTILITAIRES ====================
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
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

    getTypeColor(type) {
        const colors = {
            'plastique_pet': '#3B82F6',
            'plastique_pehd': '#2563EB',
            'papier_carton': '#F59E0B',
            'metal': '#6B7280',
            'verre': '#10B981',
            'organique': '#84CC16'
        };
        return colors[type] || '#6B7280';
    }

    getTypeIcon(type) {
        const icons = {
            'plastique_pet': '🥤',
            'plastique_pehd': '🧴',
            'papier_carton': '📦',
            'metal': '🔩',
            'verre': '🍾',
            'organique': '🥬'
        };
        return icons[type] || '📊';
    }

    getNiveauStock(quantite) {
        if (quantite < 20) return { class: 'bg-red-100 text-red-800 border-red-200', label: 'Critique' };
        if (quantite < 50) return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Bas' };
        return { class: 'bg-green-100 text-green-800 border-green-200', label: 'Normal' };
    }

    getStatusBadge(statut) {
        const badges = {
            'validee': { class: 'bg-green-100 text-green-800', label: 'Validée' },
            'deposee': { class: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
            'acceptee': { class: 'bg-blue-100 text-blue-800', label: 'Acceptée' },
            'en_cours': { class: 'bg-purple-100 text-purple-800', label: 'En cours' }
        };
        return badges[statut] || { class: 'bg-gray-100 text-gray-800', label: statut };
    }
}

// Export en singleton
const gestionnaireService = new GestionnaireService();
export default gestionnaireService;