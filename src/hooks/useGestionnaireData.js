// hooks/useGestionnaireData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gestionnaireService from '../services/gestionnaireService';

const useGestionnaireData = () => {
    const navigate = useNavigate();
    
    // États
    const [userData, setUserData] = useState({
        id: '',
        nomComplet: '',
        email: '',
        telephone: '',
        pointCollecteId: '',
        pointCollecteNom: '',
        fonction: '',
        photoUrl: ''
    });

    const [stats, setStats] = useState({
        enAttente: 0,
        totalValidees: 0,
        poidsTotalGlobal: 0,
        gainsDistribuesGlobal: 0,
        mesValidations: 0,
        monPoidsValide: 0,
        mesGainsDistribues: 0,
        maContribution: 0,
        totalAchats: 0,
        poidsTotalAchete: 0,
        montantTotalDepense: 0,
        prixMoyenAchat: 0
    });

    const [missionsEnAttente, setMissionsEnAttente] = useState([]);
    const [missionsRecentes, setMissionsRecentes] = useState([]);
    const [topCollecteurs, setTopCollecteurs] = useState([]);
    const [mesMissionsValidees, setMesMissionsValidees] = useState([]);
    const [monHistorique, setMonHistorique] = useState([]);
    const [achats, setAchats] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [statsAchats, setStatsAchats] = useState({});
    const [statsAchatsParType, setStatsAchatsParType] = useState([]);
    const [statsParType, setStatsParType] = useState([]);
    const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    
    const [statistiquesCompletes, setStatistiquesCompletes] = useState({
    par_type: [],
    totaux: {
        missions: { poids: 0, nombre: 0 },
        achats: { poids: 0, nombre: 0, montant: 0 },
        global: { poids: 0, pourcentage_missions: 0, pourcentage_achats: 0 }
    }
       });
    
    // Références
    const initialLoadDone = useRef(false);
    const intervalRef = useRef(null);
    const lastRefreshTime = useRef(Date.now());
    const validationsLoadedRef = useRef(false);

    // ==================== CHARGEMENT DES DONNÉES ====================
    const loadUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('ecocollect_token');
            if (!token) {
                navigate('/login');
                return;
            }
            gestionnaireService.setToken(token);
            
            const profil = await gestionnaireService.getProfil();
            setUserData({
                id: profil.id || '',
                nomComplet: profil.nomComplet || profil.nom_complet || '',
                email: profil.email || '',
                telephone: profil.telephone || '',
                pointCollecteId: profil.pointCollecteId || profil.point_collecte_id || '',
                pointCollecteNom: profil.pointCollecteNom || profil.point_collecte_nom || '',
                fonction: profil.fonction || 'Gestionnaire',
                photoUrl: profil.photoUrl || ''
            });
        } catch (error) {
            console.error('❌ Erreur chargement utilisateur:', error);
            throw error;
        }
    }, [navigate]);

   // hooks/useGestionnaireData.js - loadAllData avec statistiquesCompletes

const loadAllData = useCallback(async (showLoading = true) => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 10000 && !showLoading) {
        return;
    }
    lastRefreshTime.current = now;

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
        // Charger toutes les données en parallèle
        const [
            dashboardData,
            missionsAttente,
            statsTypeData,
            evolutionData,
            topData,
            achatsData,
            stocksData,
            statsAchatsData,
            statsCompletesData  // ← AJOUTÉ
        ] = await Promise.all([
            gestionnaireService.getTableauBord(),
            gestionnaireService.getMissionsEnAttente(),
            gestionnaireService.getStatistiquesParTypeDechet(),
            gestionnaireService.getRepartitionJournaliere(30),
            gestionnaireService.getTopCollecteurs(),
            gestionnaireService.getAchats(50),
            gestionnaireService.getStocks(),
            gestionnaireService.getStatistiquesAchats(),
            gestionnaireService.getStatistiquesCompletes()  // ← AJOUTÉ
        ]);

        // Mettre à jour les états
        setStats(prev => ({
            ...prev,
            enAttente: dashboardData.statistiques.enAttente,
            totalValidees: dashboardData.statistiques.totalValidees,
            poidsTotalGlobal: dashboardData.statistiques.poidsTotalGlobal,
            gainsDistribuesGlobal: dashboardData.statistiques.gainsDistribuesGlobal,
            mesValidations: dashboardData.mes_statistiques.missionsValidees,
            monPoidsValide: dashboardData.mes_statistiques.poidsTotalValide,
            mesGainsDistribues: dashboardData.mes_statistiques.gainsDistribues,
            maContribution: dashboardData.mes_statistiques.contribution
        }));

        setMissionsEnAttente(missionsAttente);
        setMissionsRecentes(dashboardData.dernieresMissions);
        setStatsParType(statsTypeData.stats);
        setEvolutionJournaliere(evolutionData);
        setTopCollecteurs(topData);
        setAchats(achatsData.achats);
        setStocks(stocksData.stocks);
        setStatsAchats(statsAchatsData.global);
        setStatsAchatsParType(statsAchatsData.par_type_dechet);
        
        // ✅ AJOUT: Mettre à jour les statistiques complètes
        setStatistiquesCompletes(statsCompletesData);
        
        setStats(prev => ({
            ...prev,
            totalAchats: statsAchatsData.global?.nombre_achats || 0,
            poidsTotalAchete: statsAchatsData.global?.poids_total_achete || 0,
            montantTotalDepense: statsAchatsData.global?.montant_total_depense || 0,
            prixMoyenAchat: statsAchatsData.global?.prix_moyen_kg || 0
        }));

        setDataLoaded(true);
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
        setError(error.message || 'Impossible de charger les données');
    } finally {
        if (showLoading) setIsLoading(false);
    }
}, []);

    const loadMesValidations = useCallback(async (force = false) => {
        if (!force && validationsLoadedRef.current) {
            return;
        }

        try {
            const [missions, historique] = await Promise.all([
                gestionnaireService.getMesMissionsValidees(),
                gestionnaireService.getMonHistorique()
            ]);

            setMesMissionsValidees(missions);
            setMonHistorique(historique);
            validationsLoadedRef.current = true;
        } catch (error) {
            console.error('❌ Erreur chargement validations:', error);
        }
    }, []);

    // ==================== ACTIONS ====================
    // const validerMission = async (missionId, donnees) => {
    //     try {
    //         const result = await gestionnaireService.validerMission(missionId, donnees);
    //         validationsLoadedRef.current = false;
    //         await loadAllData(false);
    //         await loadMesValidations(true);
    //         return result;
    //     } catch (error) {
    //         console.error('❌ Erreur validation mission:', error);
    //         throw error;
    //     }
    // };

    const validerMission = async (missionId, donnees) => {
  try {
    const result = await gestionnaireService.validerMission(missionId, {
      ...donnees,
      campagneId: donnees.campagneId // ← Ajouté
    });
    validationsLoadedRef.current = false;
    await loadAllData(false);
    await loadMesValidations(true);
    return result;
  } catch (error) {
    console.error('❌ Erreur validation mission:', error);
    throw error;
  }
};

    const creerAchat = async (donnees) => {
        try {
            const result = await gestionnaireService.creerAchat(donnees);
            await loadAllData(false);
            return result;
        } catch (error) {
            console.error('❌ Erreur création achat:', error);
            throw error;
        }
    };

    const ajusterStock = async (donnees) => {
        try {
            const result = await gestionnaireService.ajusterStock(donnees);
            await loadAllData(false);
            return result;
        } catch (error) {
            console.error('❌ Erreur ajustement stock:', error);
            throw error;
        }
    };

    const attribuerCreditsBonus = async (collecteurId, missionId, montant) => {
        try {
            const result = await gestionnaireService.attribuerCreditsBonus(collecteurId, missionId, montant);
            await loadAllData(false);
            return result;
        } catch (error) {
            console.error('❌ Erreur attribution crédits bonus:', error);
            throw error;
        }
    };

    const updateProfil = async (donnees) => {
        try {
            const result = await gestionnaireService.updateProfil(donnees);
            setUserData(prev => ({ ...prev, ...donnees }));
            return result;
        } catch (error) {
            console.error('❌ Erreur mise à jour profil:', error);
            throw error;
        }
    };


    const changePassword = async (actuel, nouveau) => {
        try {
            return await gestionnaireService.changePassword(actuel, nouveau);
        } catch (error) {
            console.error('❌ Erreur changement mot de passe:', error);
            throw error;
        }
    };

    const refreshData = useCallback(() => {
        loadAllData(false);
        loadMesValidations(false);
    }, [loadAllData, loadMesValidations]);

    // ==================== CHARGEMENT INITIAL ====================
    useEffect(() => {
        const token = localStorage.getItem('ecocollect_token');
        const role = localStorage.getItem('ecocollect_role');
        
        if (!token || role !== 'gestionnaire') {
            navigate('/login');
            return;
        }

        gestionnaireService.setToken(token);

        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            
            const initializeData = async () => {
                try {
                    await loadUserData();
                    await loadAllData();
                    await loadMesValidations(true);
                } catch (error) {
                    console.error('❌ Erreur initialisation:', error);
                    setError(error.message);
                }
            };
            
            initializeData();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [navigate, loadUserData, loadAllData, loadMesValidations]);

    // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
    useEffect(() => {
        if (dataLoaded && !intervalRef.current) {
            intervalRef.current = setInterval(() => {
                loadAllData(false);
            }, 60000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [dataLoaded, loadAllData]);

    // ==================== RETOUR ====================
    return {
        // Données
        userData,
        stats,
        missionsEnAttente,
        missionsRecentes,
        topCollecteurs,
        mesMissionsValidees,
        monHistorique,
        achats,
        stocks,
        statsAchats,
        statsAchatsParType,
        statsParType,
        evolutionJournaliere, 
        statistiquesCompletes,
        
        // États
        isLoading,
        error,
        dataLoaded,
        
        // Actions
        validerMission,
        creerAchat,
        ajusterStock,
        attribuerCreditsBonus,
        updateProfil,
        changePassword,
        refreshData,
        
        // Utilitaires (via le service)
        formatDate: gestionnaireService.formatDate.bind(gestionnaireService),
        formatCurrency: gestionnaireService.formatCurrency.bind(gestionnaireService),
        getTypeColor: gestionnaireService.getTypeColor.bind(gestionnaireService),
        getTypeIcon: gestionnaireService.getTypeIcon.bind(gestionnaireService),
        getNiveauStock: gestionnaireService.getNiveauStock.bind(gestionnaireService),
        getStatusBadge: gestionnaireService.getStatusBadge.bind(gestionnaireService)
    };
};

export default useGestionnaireData;