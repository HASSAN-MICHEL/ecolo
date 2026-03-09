




import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  Warehouse, Package, Clock, CheckCircle, TrendingUp, Award,
  BarChart3, Target, DollarSign, Bell, ArrowRight,
  Truck, MapPin, Star, Activity, Users, Calendar,
  Menu, X, LogOut, User, Settings, HelpCircle,
  LayoutDashboard, Filter, Search, Phone, MessageSquare, Eye,
  Edit2, Save, Building, Shield, Download, AlertCircle,
  RefreshCw, Gift, Award as AwardIcon, BarChart, PieChart,
  Scale, ThumbsUp, Info, ChevronRight, Check
} from 'lucide-react';

// ==================== COMPOSANT PRINCIPAL ====================
const DashboardGestionnaire = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
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

  // États pour les données
  const [stats, setStats] = useState({
    enAttente: 0,
    totalValidees: 0,
    poidsTotalGlobal: 0,
    gainsDistribuesGlobal: 0,
    mesValidations: 0,
    monPoidsValide: 0,
    mesGainsDistribues: 0,
    maContribution: 0
  });

  const [missionsEnAttente, setMissionsEnAttente] = useState([]);
  const [missionsRecentes, setMissionsRecentes] = useState([]);
  const [topCollecteurs, setTopCollecteurs] = useState([]);
  const [mesMissionsValidees, setMesMissionsValidees] = useState([]);
  const [monHistorique, setMonHistorique] = useState([]);
  
  // États pour les statistiques avancées
  const [statsParType, setStatsParType] = useState([]);
  const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
  const [periodeEvolution, setPeriodeEvolution] = useState(30);
  
  // État pour le modal de validation
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [validationForm, setValidationForm] = useState({
    missionId: '',
    poidsDepose: '',
    prixParKg: 50,
    qualiteDechets: 'conforme',
    notes: ''
  });
  const [montantTotal, setMontantTotal] = useState(0);

  // État pour la confirmation de validation
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Références pour éviter les rechargements inutiles
  const initialLoadDone = useRef(false);
  const intervalRef = useRef(null);
  const lastRefreshTime = useRef(Date.now());
  const validationsLoadedRef = useRef(false); // Déplacé au niveau parent

//  API EN DEVELOPPEMENT  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   const API_URL = 'https://ecobackend-y6nd.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const getInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      navigate('/login');
    }
  };

  // ==================== CHARGEMENT DES DONNÉES ====================
  const loadUserData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        const profil = result.utilisateur || result;
        
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
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  }, [API_URL]);

  // Fonction pour charger toutes les données
  const loadAllData = useCallback(async (showLoading = true) => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 10000 && !showLoading) {
      return;
    }
    lastRefreshTime.current = now;

    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const [dashboardRes, missionsAttenteRes, statsTypeRes, evolutionRes, topRes] = await Promise.all([
        fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/gestionnaires/statistiques/par-type-dechet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/gestionnaires/statistiques/repartition-journaliere?jours=30`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/gestionnaires/top-collecteurs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        if (dashboardData.success) {
          const statsGlobales = dashboardData.statistiques || {};
          const mesStats = dashboardData.mes_statistiques || {};

          setStats({
            enAttente: statsGlobales.en_attente || 0,
            totalValidees: statsGlobales.total_validees || 0,
            poidsTotalGlobal: statsGlobales.poids_total_global || 0,
            gainsDistribuesGlobal: statsGlobales.gains_distribues_global || 0,
            mesValidations: mesStats.missions_validees || 0,
            monPoidsValide: mesStats.poids_total_valide || 0,
            mesGainsDistribues: mesStats.gains_distribues || 0,
            maContribution: statsGlobales.total_validees ? 
              Math.round((mesStats.missions_validees / statsGlobales.total_validees) * 100) : 0
          });

          if (dashboardData.dernieresMissions) {
            setMissionsRecentes(dashboardData.dernieresMissions);
          }
        }
      }

      if (missionsAttenteRes.ok) {
        const result = await missionsAttenteRes.json();
        setMissionsEnAttente(result.missions || []);
      }

      if (statsTypeRes.ok) {
        const result = await statsTypeRes.json();
        setStatsParType(result.stats || []);
      }

      if (evolutionRes.ok) {
        const result = await evolutionRes.json();
        setEvolutionJournaliere(result.repartition || []);
      }

      if (topRes.ok) {
        const result = await topRes.json();
        setTopCollecteurs(result.top || []);
      }

      setDataLoaded(true);
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Impossible de charger les données');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [API_URL, navigate]);

  // Charger les validations séparément - UNE SEULE FOIS DANS LA VIE DU COMPOSANT
  const loadMesValidations = useCallback(async (force = false) => {
    // Ne charger qu'une seule fois sauf si forcé
    if (!force && validationsLoadedRef.current) {
      return;
    }

    const token = getToken();
    if (!token) return;
    
    try {
      const [missionsRes, historiqueRes] = await Promise.all([
        fetch(`${API_URL}/api/gestionnaires/mes-missions/validees`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/gestionnaires/mon-historique`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (missionsRes.ok) {
        const result = await missionsRes.json();
        setMesMissionsValidees(result.missions || []);
      }

      if (historiqueRes.ok) {
        const result = await historiqueRes.json();
        setMonHistorique(result.historique || []);
      }

      validationsLoadedRef.current = true;
    } catch (error) {
      console.error('❌ Erreur chargement validations:', error);
    }
  }, [API_URL]);

  // ==================== CHARGEMENT INITIAL ====================
  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
    if (!token || role !== 'gestionnaire') {
      navigate('/login');
      return;
    }

    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      
      const initializeData = async () => {
        await loadUserData();
        await loadAllData();
        // Charger les validations une seule fois au niveau parent
        await loadMesValidations(true);
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

  // ==================== ACTIONS ====================
  const calculerMontant = (poids, prixKg) => {
    const montant = (parseFloat(poids || 0) * parseFloat(prixKg || 0)).toFixed(0);
    setMontantTotal(montant);
    return montant;
  };

  const handleValidationSubmit = async () => {
    const token = getToken();
    const { missionId, poidsDepose, prixParKg, qualiteDechets, notes } = validationForm;

    try {
      const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          poidsDepose: parseFloat(poidsDepose),
          prixParKg: parseFloat(prixParKg),
          qualiteDechets,
          validationNotes: notes
        })
      });

      const result = await response.json();

      if (result.success) {
        // Réinitialiser le flag pour forcer le rechargement
        validationsLoadedRef.current = false;
        
        await loadAllData(false);
        await loadMesValidations(true);
        
        setShowConfirmation(false);
        setShowValidationModal(false);
        setValidationForm({
          missionId: '',
          poidsDepose: '',
          prixParKg: 50,
          qualiteDechets: 'conforme',
          notes: ''
        });
      } else {
        throw new Error(result.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  // ==================== UTILITAIRES ====================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'validee':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Validée</span>;
      case 'deposee':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
      case 'acceptee':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Acceptée</span>;
      case 'en_cours':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">En cours</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
    }
  };

  const getColorForType = (type) => {
    const colors = {
      'plastique': '#2196F3',
      'verre': '#4CAF50',
      'papier': '#FF9800',
      'carton': '#795548',
      'metal': '#9E9E9E',
      'electronique': '#9C27B0',
      'organique': '#8BC34A'
    };
    return colors[type?.toLowerCase()] || '#757575';
  };

  // ==================== COMPOSANTS ====================
  const Sidebar = () => {
    const menuItems = {
      principal: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/gestionnaire' },
        { id: 'missions', label: 'Missions à valider', icon: Package, path: '/gestionnaire/missions', badge: stats.enAttente },
        { id: 'mes-validations', label: 'Mes validations', icon: CheckCircle, path: '/gestionnaire/mes-validations' },
        { id: 'statistiques', label: 'Statistiques', icon: BarChart, path: '/gestionnaire/statistiques' }
      ],
      compte: [
        { id: 'profil', label: 'Mon profil', icon: User, path: '/gestionnaire/profil' },
        { id: 'securite', label: 'Sécurité', icon: Shield, path: '/gestionnaire/securite' },
        { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/gestionnaire/aide' }
      ]
    };

    const NavSection = ({ title, items }) => (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <>
        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-8 h-8 text-white" />
                  <span className="text-xl font-bold text-white">EcoCollect</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(userData.nomComplet)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
                  <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <NavSection title="Principal" items={menuItems.principal} />
              <NavSection title="Compte" items={menuItems.compte} />

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center gap-2">
              <Warehouse className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">EcoCollect</span>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userData.nomComplet)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
                <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <NavSection title="Principal" items={menuItems.principal} />
            <NavSection title="Compte" items={menuItems.compte} />

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </>
    );
  };

  // ==================== PAGE TABLEAU DE BORD ====================
  const DashboardPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-green-600" />
          Tableau de bord
        </h1>
        <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Gestionnaire'} !</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.enAttente}</span>
          </div>
          <p className="text-blue-100 text-sm">Missions en attente</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.totalValidees}</span>
          </div>
          <p className="text-green-100 text-sm">Missions validées</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Scale className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.poidsTotalGlobal} kg</span>
          </div>
          <p className="text-orange-100 text-sm">Poids total collecté</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <span className="text-3xl font-bold">{stats.gainsDistribuesGlobal.toLocaleString()} FCFA</span>
          </div>
          <p className="text-purple-100 text-sm">Gains distribués</p>
        </div>
      </div>

      {/* Mes statistiques personnelles */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          Mes statistiques personnelles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-2">Mes validations</p>
            <p className="text-3xl font-bold text-green-600">{stats.mesValidations}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-2">Mon poids validé</p>
            <p className="text-3xl font-bold text-orange-600">{stats.monPoidsValide} kg</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-2">Mes gains distribués</p>
            <p className="text-3xl font-bold text-purple-600">{stats.mesGainsDistribues.toLocaleString()} FCFA</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-2">Ma contribution</p>
            <p className="text-3xl font-bold text-blue-600">{stats.maContribution}%</p>
          </div>
        </div>
      </div>

      {/* Missions récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Missions en attente
            </h3>
            <Link to="/gestionnaire/missions" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {missionsEnAttente.length > 0 ? (
              missionsEnAttente.slice(0, 5).map((mission) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
                      </p>
                    </div>
                    {getStatusBadge(mission.statut)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet || 'Déchets'}</p>
                    <p><Calendar className="inline h-3 w-3 mr-1" /> {formatDate(mission.date_depot_point)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune mission en attente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Missions récentes validées
            </h3>
            <Link to="/gestionnaire/mes-validations" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {missionsRecentes.length > 0 ? (
              missionsRecentes.slice(0, 5).map((mission) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {mission.poids_depose || 0} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600"><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet}</span>
                    <span className="text-green-600 font-medium">{mission.gains_attribues || 0} FCFA</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune mission validée récente</p>
            )}
          </div>
        </div>
      </div>

      {/* Top collecteurs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Top collecteurs du point
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCollecteurs.length > 0 ? (
            topCollecteurs.map((collecteur, index) => (
              <div key={collecteur.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' : 'bg-green-600'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{collecteur.nom_complet}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span><Scale className="inline h-3 w-3 mr-1" /> {collecteur.total_poids || 0} kg</span>
                    <span><CheckCircle className="inline h-3 w-3 mr-1" /> {collecteur.missions_validees || 0} missions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{(collecteur.total_gains || 0).toLocaleString()} FCFA</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4 col-span-3">Aucune donnée</p>
          )}
        </div>
      </div>
    </div>
  );

  // ==================== PAGE MISSIONS À VALIDER ====================
  const MissionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMissions = missionsEnAttente.filter(mission =>
      mission.collecteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-6 w-6 text-green-600" />
              Missions à valider
            </h1>
            <p className="text-gray-600 mt-1">{missionsEnAttente.length} mission(s) en attente</p>
          </div>
          <button
            onClick={() => loadAllData(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des missions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {filteredMissions.length > 0 ? (
              filteredMissions.map((mission) => (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Mission #{mission.id?.substring(0,8)}
                        </h3>
                        {getStatusBadge(mission.statut)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Collecteur</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="h-3 w-3" /> {mission.collecteur_nom || 'Inconnu'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type déchet</p>
                          <p className="font-medium text-gray-900">{mission.type_dechet || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantité</p>
                          <p className="font-medium text-gray-900">{mission.quantite || 0} {mission.unite || 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date dépôt</p>
                          <p className="font-medium text-gray-900">{formatDate(mission.date_depot_point)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setValidationForm({
                          ...validationForm,
                          missionId: mission.id
                        });
                        setSelectedMission(mission);
                        setShowValidationModal(true);
                      }}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Valider
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission en attente</h3>
                <p className="text-gray-600">Les missions apparaîtront ici quand des collecteurs déposeront des déchets</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de validation */}
        {showValidationModal && selectedMission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Valider la mission</h2>
                  <button
                    onClick={() => {
                      setShowValidationModal(false);
                      setShowConfirmation(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {!showConfirmation ? (
                <form className="p-6 space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Mission sélectionnée</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Collecteur: <span className="font-semibold">{selectedMission.collecteur_nom}</span>
                        </p>
                        <p className="text-sm text-blue-600">
                          Type: {selectedMission.type_dechet} | Quantité estimée: {selectedMission.quantite} {selectedMission.unite}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Poids déposé (kg) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={validationForm.poidsDepose}
                        onChange={(e) => {
                          setValidationForm({...validationForm, poidsDepose: e.target.value});
                          calculerMontant(e.target.value, validationForm.prixParKg);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix par kg (FCFA) *
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={validationForm.prixParKg}
                        onChange={(e) => {
                          setValidationForm({...validationForm, prixParKg: e.target.value});
                          calculerMontant(validationForm.poidsDepose, e.target.value);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-green-800 mb-2">
                      Montant total à attribuer
                    </label>
                    <p className="text-3xl font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualité
                    </label>
                    <select
                      value={validationForm.qualiteDechets}
                      onChange={(e) => setValidationForm({...validationForm, qualiteDechets: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    >
                      <option value="conforme">Conforme</option>
                      <option value="non_conforme">Non conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows="3"
                      value={validationForm.notes}
                      onChange={(e) => setValidationForm({...validationForm, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                      placeholder="Observations..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowValidationModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmation(true)}
                      disabled={!validationForm.poidsDepose || validationForm.poidsDepose <= 0}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continuer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gift className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'attribution</h3>
                    <p className="text-gray-600">
                      Vous êtes sur le point d'attribuer <span className="font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</span> au collecteur
                    </p>
                    <p className="text-lg font-semibold text-gray-800 mt-2">{selectedMission.collecteur_nom}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mission</span>
                      <span className="font-medium">#{selectedMission.id?.substring(0,8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Poids</span>
                      <span className="font-medium">{validationForm.poidsDepose} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix/kg</span>
                      <span className="font-medium">{validationForm.prixParKg} FCFA</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-semibold">Montant total</span>
                      <span className="text-green-600 font-bold text-lg">{montantTotal.toLocaleString()} FCFA</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Cette action est irréversible</p>
                        <p className="text-sm text-yellow-600">
                          Une fois confirmée, les crédits seront définitivement attribués au collecteur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleValidationSubmit}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Confirmer et valider
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE MES VALIDATIONS (MAINTENANT SANS USEEFFECT) ====================
  const MesValidationsPage = () => {
    const [activeTab, setActiveTab] = useState('mes-missions');
    
    // Plus de useEffect - les données sont déjà chargées au niveau parent

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Mes validations
          </h1>
          <p className="text-gray-600">Historique de vos interventions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mes-missions')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'mes-missions'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Missions validées ({mesMissionsValidees.length})
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'historique'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Historique complet ({monHistorique.length})
          </button>
        </div>

        {activeTab === 'mes-missions' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {mesMissionsValidees.length > 0 ? (
                mesMissionsValidees.map((mission) => (
                  <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Mission #{mission.id?.substring(0,8)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3" /> {mission.collecteur_nom || 'Collecteur'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Validée le {formatDate(mission.date_validation)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500">Type déchet</p>
                        <p className="font-medium">{mission.type_dechet}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Poids</p>
                        <p className="font-medium">{mission.poids_depose || 0} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gains</p>
                        <p className="font-medium text-green-600">{mission.gains_attribues || 0} FCFA</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Qualité</p>
                        <p className="font-medium">{mission.qualite_dechets || 'conforme'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune mission validée</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'historique' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {monHistorique.length > 0 ? (
                monHistorique.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Validation de collecte</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-gray-500">Collecteur</p>
                            <p className="font-medium">{item.collecteur_nom || 'Inconnu'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Type déchet</p>
                            <p className="font-medium">{item.type_dechet || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Poids</p>
                            <p className="font-medium">{item.poids || 0} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(item.date_action)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun historique</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE STATISTIQUES ====================
  const StatistiquesPage = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart className="h-6 w-6 text-green-600" />
            Statistiques détaillées
          </h1>
          <p className="text-gray-600">Analyse des activités de votre point de collecte</p>
        </div>
        
        {/* Statistiques par type de déchet */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Répartition par type de déchet</h2>
            <div className="text-sm text-gray-600">
              Total: {statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0).toFixed(1)} kg
            </div>
          </div>

          <div className="space-y-4">
            {statsParType.length > 0 ? (
              statsParType.map((stat) => {
                const totalPoids = statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0);
                const pourcentage = totalPoids > 0 ? ((parseFloat(stat.poids_total_valide || 0) / totalPoids) * 100).toFixed(1) : 0;
                
                return (
                  <div key={stat.type_dechet} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getColorForType(stat.type_dechet) }}
                        ></div>
                        <span className="font-medium text-gray-900">{stat.type_dechet}</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{pourcentage}%</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500">Poids validé</p>
                        <p className="font-medium">{stat.poids_total_valide || 0} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Missions validées</p>
                        <p className="font-medium">{stat.missions_validees || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total missions</p>
                        <p className="font-medium">{stat.nombre_total_missions || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Taux réalisation</p>
                        <p className="font-medium">{stat.taux_realisation || 0}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${pourcentage}%`,
                            backgroundColor: getColorForType(stat.type_dechet)
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
            )}
          </div>
        </div>

        {/* Évolution journalière */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Évolution journalière</h2>
            <select
              value={periodeEvolution}
              onChange={(e) => {
                setPeriodeEvolution(parseInt(e.target.value));
                loadAllData(false);
              }}
              className="px-3 py-1 border border-gray-300 rounded-lg"
            >
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
            </select>
          </div>

          <div className="space-y-4">
            {evolutionJournaliere.length > 0 ? (
              evolutionJournaliere.map((jour) => (
                <div key={jour.jour} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {new Date(jour.jour).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {jour.nombre_validations} validation(s)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Poids total</p>
                      <p className="font-medium">{jour.poids_total || 0} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Collecteurs actifs</p>
                      <p className="font-medium">{jour.collecteurs_actifs || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gains distribués</p>
                      <p className="font-medium text-green-600">{(jour.gains_total || 0).toLocaleString()} FCFA</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Aucune donnée pour cette période</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAGE PROFIL ====================
  const ProfilPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      nomComplet: '',
      telephone: '',
      fonction: ''
    });

    useEffect(() => {
      setEditData({
        nomComplet: userData.nomComplet,
        telephone: userData.telephone,
        fonction: userData.fonction
      });
    }, [userData]);

    const handleSave = async () => {
      const token = getToken();
      try {
        const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editData)
        });

        if (response.ok) {
          setUserData({...userData, ...editData});
          setIsEditing(false);
          alert('Profil mis à jour avec succès');
        }
      } catch (error) {
        console.error('Erreur mise à jour:', error);
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-green-600" />
            Mon profil
          </h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte d'identité */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(userData.nomComplet)}
                  </div>
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {userData.nomComplet}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{userData.fonction}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Point de collecte</span>
                  <span className="text-sm font-medium text-gray-900">{userData.pointCollecteNom || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Téléphone</span>
                  <span className="text-sm font-medium text-gray-900">{userData.telephone || 'Non renseigné'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire d'édition */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Informations personnelles</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditData({
                          nomComplet: userData.nomComplet,
                          telephone: userData.telephone,
                          fonction: userData.fonction
                        });
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nomComplet}
                      onChange={(e) => setEditData({...editData, nomComplet: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.nomComplet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.telephone}
                      onChange={(e) => setEditData({...editData, telephone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.telephone || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fonction}
                      onChange={(e) => setEditData({...editData, fonction: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.fonction}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.pointCollecteNom || 'Non assigné'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAGE SÉCURITÉ ====================
  const SecuritePage = () => {
    const [passwords, setPasswords] = useState({
      actuel: '',
      nouveau: '',
      confirmation: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (passwords.nouveau !== passwords.confirmation) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
      }

      if (passwords.nouveau.length < 6) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }

      const token = getToken();
      try {
        const response = await fetch(`${API_URL}/api/gestionnaires/changer-mot-de-passe`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            motDePasseActuel: passwords.actuel,
            nouveauMotDePasse: passwords.nouveau
          })
        });

        if (response.ok) {
          alert('Mot de passe modifié avec succès');
          setPasswords({ actuel: '', nouveau: '', confirmation: '' });
        } else {
          const error = await response.json();
          alert(error.message || 'Erreur lors du changement');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du changement de mot de passe');
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Sécurité
          </h1>
          <p className="text-gray-600">Gérez la sécurité de votre compte</p>
        </div>

        <div className="max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Changer le mot de passe</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwords.actuel}
                  onChange={(e) => setPasswords({...passwords, actuel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwords.nouveau}
                  onChange={(e) => setPasswords({...passwords, nouveau: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwords.confirmation}
                  onChange={(e) => setPasswords({...passwords, confirmation: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold mt-4"
              >
                Changer le mot de passe
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAGE AIDE ====================
  const AidePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-green-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-600">Trouvez des réponses à vos questions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Valider une mission
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Sélectionnez une mission dans la liste</li>
            <li>Entrez le poids déposé</li>
            <li>Définissez le prix par kilogramme</li>
            <li>Confirmez l'attribution des crédits au collecteur</li>
            <li>Cliquez sur "Valider" pour finaliser</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-green-600" />
            Consulter les statistiques
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Accédez à l'onglet "Statistiques"</li>
            <li>Consultez la répartition par type de déchet</li>
            <li>Analysez l'évolution journalière</li>
            <li>Identifiez les meilleurs collecteurs</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Gérer votre profil
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Allez dans "Mon profil"</li>
            <li>Cliquez sur "Modifier" pour changer vos informations</li>
            <li>Accédez à "Sécurité" pour changer votre mot de passe</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Suivre les collecteurs
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Consultez le tableau de bord pour voir les statistiques</li>
            <li>Les top collecteurs sont affichés dans la section dédiée</li>
            <li>Chaque validation crédite automatiquement le collecteur</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
        <p className="text-green-100 mb-4">
          Notre équipe est disponible pour répondre à toutes vos questions
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contacter le support
          </button>
          <button className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== ROUTAGE ====================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => loadAllData(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec routage interne */}
      <div className="lg:ml-80 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/mes-validations" element={<MesValidationsPage />} />
          <Route path="/statistiques" element={<StatistiquesPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/securite" element={<SecuritePage />} />
          <Route path="/aide" element={<AidePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardGestionnaire;



// // import { useState, useEffect, useCallback, useRef } from 'react';
// // import { useNavigate, Routes, Route, Link } from 'react-router-dom';
// // import {
// //   Warehouse, Package, Clock, CheckCircle, TrendingUp, Award,
// //   BarChart3, Target, DollarSign, Bell, ArrowRight,
// //   Truck, MapPin, Star, Activity, Users, Calendar,
// //   Menu, X, LogOut, User, Settings, HelpCircle,
// //   LayoutDashboard, Filter, Search, Phone, MessageSquare, Eye,
// //   Edit2, Save, Building, Shield, Download, AlertCircle,
// //   RefreshCw, Gift, Award as AwardIcon, BarChart, PieChart,
// //   Scale, ThumbsUp, Info, ChevronRight, Check
// // } from 'lucide-react';

// // // ==================== COMPOSANT PRINCIPAL ====================
// // const DashboardGestionnaire = () => {
// //   const navigate = useNavigate();
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [currentPage, setCurrentPage] = useState('dashboard');
// //   const [userData, setUserData] = useState({
// //     id: '',
// //     nomComplet: '',
// //     email: '',
// //     telephone: '',
// //     pointCollecteId: '',
// //     pointCollecteNom: '',
// //     fonction: '',
// //     photoUrl: ''
// //   });

// //   // États pour les données
// //   const [stats, setStats] = useState({
// //     enAttente: 0,
// //     totalValidees: 0,
// //     poidsTotalGlobal: 0,
// //     gainsDistribuesGlobal: 0,
// //     mesValidations: 0,
// //     monPoidsValide: 0,
// //     mesGainsDistribues: 0,
// //     maContribution: 0
// //   });

// //   const [missionsEnAttente, setMissionsEnAttente] = useState([]);
// //   const [missionsRecentes, setMissionsRecentes] = useState([]);
// //   const [topCollecteurs, setTopCollecteurs] = useState([]);
// //   const [mesMissionsValidees, setMesMissionsValidees] = useState([]);
// //   const [monHistorique, setMonHistorique] = useState([]);
  
// //   // États pour les statistiques avancées
// //   const [statsParType, setStatsParType] = useState([]);
// //   const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
// //   const [periodeEvolution, setPeriodeEvolution] = useState(30);
  
// //   // État pour le modal de validation
// //   const [showValidationModal, setShowValidationModal] = useState(false);
// //   const [selectedMission, setSelectedMission] = useState(null);
// //   const [validationForm, setValidationForm] = useState({
// //     missionId: '',
// //     poidsDepose: '',
// //     prixParKg: 50,
// //     qualiteDechets: 'conforme',
// //     notes: ''
// //   });
// //   const [montantTotal, setMontantTotal] = useState(0);

// //   // État pour la confirmation de validation
// //   const [showConfirmation, setShowConfirmation] = useState(false);

// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [dataLoaded, setDataLoaded] = useState(false);
  
// //   // Références pour éviter les rechargements inutiles
// //   const initialLoadDone = useRef(false);
// //   const intervalRef = useRef(null);
// //   const lastRefreshTime = useRef(Date.now());
// //   const validationsLoadedRef = useRef(false);

// //   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// //   const STORAGE_KEYS = {
// //     TOKEN: 'ecocollect_token',
// //     USER: 'ecocollect_user',
// //     ROLE: 'ecocollect_role'
// //   };

// //   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
// //   const getInitials = (name) => {
// //     if (!name) return 'G';
// //     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
// //   };

// //   const handleLogout = () => {
// //     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
// //       if (intervalRef.current) clearInterval(intervalRef.current);
// //       localStorage.removeItem(STORAGE_KEYS.TOKEN);
// //       localStorage.removeItem(STORAGE_KEYS.USER);
// //       localStorage.removeItem(STORAGE_KEYS.ROLE);
// //       navigate('/login');
// //     }
// //   };

// //   // ==================== CHARGEMENT DES DONNÉES ====================
// //   const loadUserData = useCallback(async () => {
// //     const token = getToken();
// //     if (!token) return;

// //     try {
// //       const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
// //         headers: { 'Authorization': `Bearer ${token}` }
// //       });

// //       if (response.ok) {
// //         const result = await response.json();
// //         const profil = result.utilisateur || result;
        
// //         setUserData({
// //           id: profil.id || '',
// //           nomComplet: profil.nomComplet || profil.nom_complet || '',
// //           email: profil.email || '',
// //           telephone: profil.telephone || '',
// //           pointCollecteId: profil.pointCollecteId || profil.point_collecte_id || '',
// //           pointCollecteNom: profil.pointCollecteNom || profil.point_collecte_nom || '',
// //           fonction: profil.fonction || 'Gestionnaire',
// //           photoUrl: profil.photoUrl || ''
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement utilisateur:', error);
// //     }
// //   }, [API_URL]);

// //   // Fonction pour charger toutes les données
// //   const loadAllData = useCallback(async (showLoading = true) => {
// //     const now = Date.now();
// //     if (now - lastRefreshTime.current < 10000 && !showLoading) {
// //       return;
// //     }
// //     lastRefreshTime.current = now;

// //     const token = getToken();
// //     if (!token) {
// //       navigate('/login');
// //       return;
// //     }

// //     if (showLoading) setIsLoading(true);
// //     setError(null);

// //     try {
// //       const [dashboardRes, missionsAttenteRes, statsTypeRes, evolutionRes, topRes] = await Promise.all([
// //         fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         }),
// //         fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         }),
// //         fetch(`${API_URL}/api/gestionnaires/statistiques/par-type-dechet`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         }),
// //         fetch(`${API_URL}/api/gestionnaires/statistiques/repartition-journaliere?jours=30`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         }),
// //         fetch(`${API_URL}/api/gestionnaires/top-collecteurs`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         })
// //       ]);

// //       if (dashboardRes.ok) {
// //         const dashboardData = await dashboardRes.json();
// //         if (dashboardData.success) {
// //           const statsGlobales = dashboardData.statistiques || {};
// //           const mesStats = dashboardData.mes_statistiques || {};

// //           setStats({
// //             enAttente: statsGlobales.en_attente || 0,
// //             totalValidees: statsGlobales.total_validees || 0,
// //             poidsTotalGlobal: statsGlobales.poids_total_global || 0,
// //             gainsDistribuesGlobal: statsGlobales.gains_distribues_global || 0,
// //             mesValidations: mesStats.missions_validees || 0,
// //             monPoidsValide: mesStats.poids_total_valide || 0,
// //             mesGainsDistribues: mesStats.gains_distribues || 0,
// //             maContribution: statsGlobales.total_validees ? 
// //               Math.round((mesStats.missions_validees / statsGlobales.total_validees) * 100) : 0
// //           });

// //           if (dashboardData.dernieresMissions) {
// //             setMissionsRecentes(dashboardData.dernieresMissions);
// //           }
// //         }
// //       }

// //       if (missionsAttenteRes.ok) {
// //         const result = await missionsAttenteRes.json();
// //         setMissionsEnAttente(result.missions || []);
// //       }

// //       if (statsTypeRes.ok) {
// //         const result = await statsTypeRes.json();
// //         setStatsParType(result.stats || []);
// //       }

// //       if (evolutionRes.ok) {
// //         const result = await evolutionRes.json();
// //         setEvolutionJournaliere(result.repartition || []);
// //       }

// //       if (topRes.ok) {
// //         const result = await topRes.json();
// //         setTopCollecteurs(result.top || []);
// //       }

// //       setDataLoaded(true);
// //     } catch (error) {
// //       console.error('❌ Erreur chargement données:', error);
// //       setError('Impossible de charger les données');
// //     } finally {
// //       if (showLoading) setIsLoading(false);
// //     }
// //   }, [API_URL, navigate]);

// //   // Charger les validations séparément
// //   const loadMesValidations = useCallback(async (force = false) => {
// //     if (!force && validationsLoadedRef.current) {
// //       return;
// //     }

// //     const token = getToken();
// //     if (!token) return;
    
// //     try {
// //       const [missionsRes, historiqueRes] = await Promise.all([
// //         fetch(`${API_URL}/api/gestionnaires/mes-missions/validees`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         }),
// //         fetch(`${API_URL}/api/gestionnaires/mon-historique`, {
// //           headers: { 'Authorization': `Bearer ${token}` }
// //         })
// //       ]);

// //       if (missionsRes.ok) {
// //         const result = await missionsRes.json();
// //         setMesMissionsValidees(result.missions || []);
// //       }

// //       if (historiqueRes.ok) {
// //         const result = await historiqueRes.json();
// //         setMonHistorique(result.historique || []);
// //       }

// //       validationsLoadedRef.current = true;
// //     } catch (error) {
// //       console.error('❌ Erreur chargement validations:', error);
// //     }
// //   }, [API_URL]);

// //   // ==================== CHARGEMENT INITIAL ====================
// //   useEffect(() => {
// //     const token = getToken();
// //     const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
// //     if (!token || role !== 'gestionnaire') {
// //       navigate('/login');
// //       return;
// //     }

// //     if (!initialLoadDone.current) {
// //       initialLoadDone.current = true;
      
// //       const initializeData = async () => {
// //         await loadUserData();
// //         await loadAllData();
// //         await loadMesValidations(true);
// //       };
      
// //       initializeData();
// //     }

// //     return () => {
// //       if (intervalRef.current) {
// //         clearInterval(intervalRef.current);
// //         intervalRef.current = null;
// //       }
// //     };
// //   }, [navigate, loadUserData, loadAllData, loadMesValidations]);

// //   // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
// //   useEffect(() => {
// //     if (dataLoaded && !intervalRef.current) {
// //       intervalRef.current = setInterval(() => {
// //         loadAllData(false);
// //       }, 60000);
// //     }

// //     return () => {
// //       if (intervalRef.current) {
// //         clearInterval(intervalRef.current);
// //         intervalRef.current = null;
// //       }
// //     };
// //   }, [dataLoaded, loadAllData]);

// //   // ==================== ACTIONS ====================
// //   const calculerMontant = (poids, prixKg) => {
// //     const montant = (parseFloat(poids || 0) * parseFloat(prixKg || 0)).toFixed(0);
// //     setMontantTotal(montant);
// //     return montant;
// //   };

// //   const handleValidationSubmit = async () => {
// //     const token = getToken();
// //     const { missionId, poidsDepose, prixParKg, qualiteDechets, notes } = validationForm;

// //     try {
// //       const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           poidsDepose: parseFloat(poidsDepose),
// //           prixParKg: parseFloat(prixParKg),
// //           qualiteDechets,
// //           validationNotes: notes
// //         })
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         validationsLoadedRef.current = false;
        
// //         await loadAllData(false);
// //         await loadMesValidations(true);
        
// //         setShowConfirmation(false);
// //         setShowValidationModal(false);
// //         setValidationForm({
// //           missionId: '',
// //           poidsDepose: '',
// //           prixParKg: 50,
// //           qualiteDechets: 'conforme',
// //           notes: ''
// //         });
// //       } else {
// //         throw new Error(result.message || 'Erreur lors de la validation');
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur:', error);
// //       alert(error.message);
// //     }
// //   };

// //   // ==================== UTILITAIRES ====================
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString('fr-FR', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   const getStatusBadge = (statut) => {
// //     switch (statut) {
// //       case 'validee':
// //         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Validée</span>;
// //       case 'deposee':
// //         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
// //       case 'acceptee':
// //         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Acceptée</span>;
// //       case 'en_cours':
// //         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">En cours</span>;
// //       default:
// //         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
// //     }
// //   };

// //   const getColorForType = (type) => {
// //     const colors = {
// //       'plastique': '#2196F3',
// //       'verre': '#4CAF50',
// //       'papier': '#FF9800',
// //       'carton': '#795548',
// //       'metal': '#9E9E9E',
// //       'electronique': '#9C27B0',
// //       'organique': '#8BC34A'
// //     };
// //     return colors[type?.toLowerCase()] || '#757575';
// //   };

// //   // ==================== COMPOSANTS ====================
// //   const Sidebar = () => {
// //     const menuItems = {
// //       principal: [
// //         { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/gestionnaire' },
// //         { id: 'missions', label: 'Missions à valider', icon: Package, path: '/gestionnaire/missions', badge: stats.enAttente },
// //         { id: 'mes-validations', label: 'Mes validations', icon: CheckCircle, path: '/gestionnaire/mes-validations' },
// //         { id: 'statistiques', label: 'Statistiques', icon: BarChart, path: '/gestionnaire/statistiques' }
// //       ],
// //       compte: [
// //         { id: 'profil', label: 'Mon profil', icon: User, path: '/gestionnaire/profil' },
// //         { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/gestionnaire/aide' }
// //       ]
// //     };

// //     const NavSection = ({ title, items }) => (
// //       <div className="mb-6">
// //         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
// //           {title}
// //         </h3>
// //         <ul className="space-y-1">
// //           {items.map(item => {
// //             const Icon = item.icon;
// //             const isActive = currentPage === item.id;
            
// //             return (
// //               <li key={item.id}>
// //                 <Link
// //                   to={item.path}
// //                   onClick={() => {
// //                     setCurrentPage(item.id);
// //                     setSidebarOpen(false);
// //                   }}
// //                   className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
// //                     isActive
// //                       ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600'
// //                       : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
// //                   }`}
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
// //                     <span className="font-medium">{item.label}</span>
// //                   </div>
// //                   {item.badge > 0 && (
// //                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
// //                       {item.badge}
// //                     </span>
// //                   )}
// //                 </Link>
// //               </li>
// //             );
// //           })}
// //         </ul>
// //       </div>
// //     );

// //     return (
// //       <>
// //         {/* Mobile Sidebar */}
// //         <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
// //           sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
// //         }`}>
// //           <div 
// //             className={`absolute inset-0 bg-black transition-opacity duration-300 ${
// //               sidebarOpen ? 'opacity-50' : 'opacity-0'
// //             }`}
// //             onClick={() => setSidebarOpen(false)}
// //           />
          
// //           <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
// //             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
// //           }`}>
// //             <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-2">
// //                   <Warehouse className="w-8 h-8 text-white" />
// //                   <span className="text-xl font-bold text-white">EcoCollect</span>
// //                 </div>
// //                 <button
// //                   onClick={() => setSidebarOpen(false)}
// //                   className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
// //                 >
// //                   <X className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>

// //             <div className="p-4 border-b">
// //               <div className="flex items-center gap-3">
// //                 <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
// //                   {getInitials(userData.nomComplet)}
// //                 </div>
// //                 <div className="flex-1">
// //                   <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
// //                   <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
// //               <NavSection title="Principal" items={menuItems.principal} />
// //               <NavSection title="Compte" items={menuItems.compte} />

// //               <div className="mt-6 pt-6 border-t">
// //                 <button
// //                   onClick={handleLogout}
// //                   className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
// //                 >
// //                   <LogOut className="w-5 h-5" />
// //                   <span className="font-medium">Déconnexion</span>
// //                 </button>
// //               </div>
// //             </nav>
// //           </div>
// //         </div>

// //         {/* Desktop Sidebar */}
// //         <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
// //           <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
// //             <div className="flex items-center gap-2">
// //               <Warehouse className="w-8 h-8 text-white" />
// //               <span className="text-xl font-bold text-white">EcoCollect</span>
// //             </div>
// //           </div>

// //           <div className="p-4 border-b">
// //             <div className="flex items-center gap-3">
// //               <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
// //                 {getInitials(userData.nomComplet)}
// //               </div>
// //               <div className="flex-1">
// //                 <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
// //                 <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
// //             <NavSection title="Principal" items={menuItems.principal} />
// //             <NavSection title="Compte" items={menuItems.compte} />

// //             <div className="mt-6 pt-6 border-t">
// //               <button
// //                 onClick={handleLogout}
// //                 className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
// //               >
// //                 <LogOut className="w-5 h-5" />
// //                 <span className="font-medium">Déconnexion</span>
// //               </button>
// //             </div>
// //           </nav>
// //         </div>
// //       </>
// //     );
// //   };

// //   // ==================== PAGE TABLEAU DE BORD ====================
// //   const DashboardPage = () => (
// //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //       {/* En-tête */}
// //       <div className="mb-8">
// //         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //           <LayoutDashboard className="h-6 w-6 text-green-600" />
// //           Tableau de bord
// //         </h1>
// //         <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Gestionnaire'} !</p>
// //       </div>

// //       {/* Mes statistiques personnelles SEULEMENT */}
// //       <div className="mb-8">
// //         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
// //           <User className="h-5 w-5 text-green-600" />
// //           Mes statistiques personnelles
// //         </h2>
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
// //             <p className="text-sm text-gray-600 mb-2">Mes validations</p>
// //             <p className="text-3xl font-bold text-green-600">{stats.mesValidations}</p>
// //           </div>
// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
// //             <p className="text-sm text-gray-600 mb-2">Mon poids validé</p>
// //             <p className="text-3xl font-bold text-orange-600">{stats.monPoidsValide} kg</p>
// //           </div>
// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
// //             <p className="text-sm text-gray-600 mb-2">Mes gains distribués</p>
// //             <p className="text-3xl font-bold text-purple-600">{stats.mesGainsDistribues.toLocaleString()} FCFA</p>
// //           </div>
// //           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
// //             <p className="text-sm text-gray-600 mb-2">Ma contribution</p>
// //             <p className="text-3xl font-bold text-blue-600">{stats.maContribution}%</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Missions récentes */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <div className="flex items-center justify-between mb-6">
// //             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //               <Clock className="h-5 w-5 text-green-600" />
// //               Missions en attente
// //             </h3>
// //             <Link to="/gestionnaire/missions" className="text-green-600 hover:text-green-700 text-sm font-medium">
// //               Voir tout
// //             </Link>
// //           </div>
          
// //           <div className="space-y-4 max-h-96 overflow-y-auto">
// //             {missionsEnAttente.length > 0 ? (
// //               missionsEnAttente.slice(0, 5).map((mission) => (
// //                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                   <div className="flex items-start justify-between mb-2">
// //                     <div>
// //                       <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
// //                       <p className="text-sm text-gray-600 mt-1">
// //                         <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
// //                       </p>
// //                     </div>
// //                     {getStatusBadge(mission.statut)}
// //                   </div>
// //                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
// //                     <p><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet || 'Déchets'}</p>
// //                     <p><Calendar className="inline h-3 w-3 mr-1" /> {formatDate(mission.date_depot_point)}</p>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-center text-gray-500 py-8">Aucune mission en attente</p>
// //             )}
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <div className="flex items-center justify-between mb-6">
// //             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //               <CheckCircle className="h-5 w-5 text-green-600" />
// //               Missions récentes validées
// //             </h3>
// //             <Link to="/gestionnaire/mes-validations" className="text-green-600 hover:text-green-700 text-sm font-medium">
// //               Voir tout
// //             </Link>
// //           </div>
          
// //           <div className="space-y-4 max-h-96 overflow-y-auto">
// //             {missionsRecentes.length > 0 ? (
// //               missionsRecentes.slice(0, 5).map((mission) => (
// //                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                   <div className="flex items-start justify-between mb-2">
// //                     <div>
// //                       <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
// //                       <p className="text-sm text-gray-600 mt-1">
// //                         <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
// //                       </p>
// //                     </div>
// //                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// //                       {mission.poids_depose || 0} kg
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center justify-between text-sm">
// //                     <span className="text-gray-600"><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet}</span>
// //                     <span className="text-green-600 font-medium">{mission.gains_attribues || 0} FCFA</span>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-center text-gray-500 py-8">Aucune mission validée récente</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Top collecteurs */}
// //       <div className="bg-white rounded-xl shadow-lg p-6">
// //         <div className="flex items-center justify-between mb-6">
// //           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //             <Award className="h-5 w-5 text-green-600" />
// //             Top collecteurs du point
// //           </h3>
// //         </div>
        
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           {topCollecteurs.length > 0 ? (
// //             topCollecteurs.map((collecteur, index) => (
// //               <div key={collecteur.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
// //                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
// //                   index === 0 ? 'bg-yellow-500' :
// //                   index === 1 ? 'bg-gray-400' :
// //                   index === 2 ? 'bg-orange-600' : 'bg-green-600'
// //                 }`}>
// //                   {index + 1}
// //                 </div>
// //                 <div className="flex-1">
// //                   <p className="font-semibold text-gray-900">{collecteur.nom_complet}</p>
// //                   <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
// //                     <span><Scale className="inline h-3 w-3 mr-1" /> {collecteur.total_poids || 0} kg</span>
// //                     <span><CheckCircle className="inline h-3 w-3 mr-1" /> {collecteur.missions_validees || 0} missions</span>
// //                   </div>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="font-bold text-green-600">{(collecteur.total_gains || 0).toLocaleString()} FCFA</p>
// //                 </div>
// //               </div>
// //             ))
// //           ) : (
// //             <p className="text-center text-gray-500 py-4 col-span-3">Aucune donnée</p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   // ==================== PAGE MISSIONS À VALIDER ====================
// //   const MissionsPage = () => {
// //     const [searchTerm, setSearchTerm] = useState('');

// //     const filteredMissions = missionsEnAttente.filter(mission =>
// //       mission.collecteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       mission.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       mission.id?.toLowerCase().includes(searchTerm.toLowerCase())
// //     );

// //     return (
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="flex items-center justify-between mb-8">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //               <Package className="h-6 w-6 text-green-600" />
// //               Missions à valider
// //             </h1>
// //             <p className="text-gray-600 mt-1">{missionsEnAttente.length} mission(s) en attente</p>
// //           </div>
// //           <button
// //             onClick={() => loadAllData(false)}
// //             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
// //           >
// //             <RefreshCw className="h-4 w-4" />
// //             Actualiser
// //           </button>
// //         </div>

// //         {/* Recherche */}
// //         <div className="mb-6">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
// //             <input
// //               type="text"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               placeholder="Rechercher une mission..."
// //               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
// //             />
// //           </div>
// //         </div>

// //         {/* Liste des missions */}
// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <div className="space-y-4">
// //             {filteredMissions.length > 0 ? (
// //               filteredMissions.map((mission) => (
// //                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                   <div className="flex items-start justify-between">
// //                     <div className="flex-1">
// //                       <div className="flex items-center gap-3 mb-2">
// //                         <h3 className="font-semibold text-gray-900">
// //                           Mission #{mission.id?.substring(0,8)}
// //                         </h3>
// //                         {getStatusBadge(mission.statut)}
// //                       </div>
                      
// //                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
// //                         <div>
// //                           <p className="text-gray-500">Collecteur</p>
// //                           <p className="font-medium text-gray-900 flex items-center gap-1">
// //                             <User className="h-3 w-3" /> {mission.collecteur_nom || 'Inconnu'}
// //                           </p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-500">Type déchet</p>
// //                           <p className="font-medium text-gray-900">{mission.type_dechet || 'Non spécifié'}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-500">Quantité</p>
// //                           <p className="font-medium text-gray-900">{mission.quantite || 0} {mission.unite || 'kg'}</p>
// //                         </div>
// //                         <div>
// //                           <p className="text-gray-500">Date dépôt</p>
// //                           <p className="font-medium text-gray-900">{formatDate(mission.date_depot_point)}</p>
// //                         </div>
// //                       </div>
// //                     </div>
                    
// //                     <button
// //                       onClick={() => {
// //                         setValidationForm({
// //                           ...validationForm,
// //                           missionId: mission.id
// //                         });
// //                         setSelectedMission(mission);
// //                         setShowValidationModal(true);
// //                       }}
// //                       className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
// //                     >
// //                       <CheckCircle className="h-4 w-4" />
// //                       Valider
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <div className="text-center py-12">
// //                 <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission en attente</h3>
// //                 <p className="text-gray-600">Les missions apparaîtront ici quand des collecteurs déposeront des déchets</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Modal de validation */}
// //         {showValidationModal && selectedMission && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //             <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
// //               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
// //                 <div className="flex items-center justify-between">
// //                   <h2 className="text-2xl font-bold text-gray-900">Valider la mission</h2>
// //                   <button
// //                     onClick={() => {
// //                       setShowValidationModal(false);
// //                       setShowConfirmation(false);
// //                     }}
// //                     className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
// //                   >
// //                     <X className="h-6 w-6" />
// //                   </button>
// //                 </div>
// //               </div>

// //               {!showConfirmation ? (
// //                 <form className="p-6 space-y-6">
// //                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// //                     <div className="flex items-start gap-3">
// //                       <Info className="h-5 w-5 text-blue-600 mt-0.5" />
// //                       <div>
// //                         <p className="font-medium text-blue-800">Mission sélectionnée</p>
// //                         <p className="text-sm text-blue-600 mt-1">
// //                           Collecteur: <span className="font-semibold">{selectedMission.collecteur_nom}</span>
// //                         </p>
// //                         <p className="text-sm text-blue-600">
// //                           Type: {selectedMission.type_dechet} | Quantité estimée: {selectedMission.quantite} {selectedMission.unite}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="grid grid-cols-2 gap-4">
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// //                         Poids déposé (kg) *
// //                       </label>
// //                       <input
// //                         type="number"
// //                         step="0.1"
// //                         value={validationForm.poidsDepose}
// //                         onChange={(e) => {
// //                           setValidationForm({...validationForm, poidsDepose: e.target.value});
// //                           calculerMontant(e.target.value, validationForm.prixParKg);
// //                         }}
// //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                         required
// //                       />
// //                     </div>

// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// //                         Prix par kg (FCFA) *
// //                       </label>
// //                       <input
// //                         type="number"
// //                         step="1"
// //                         value={validationForm.prixParKg}
// //                         onChange={(e) => {
// //                           setValidationForm({...validationForm, prixParKg: e.target.value});
// //                           calculerMontant(validationForm.poidsDepose, e.target.value);
// //                         }}
// //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                         required
// //                       />
// //                     </div>
// //                   </div>

// //                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
// //                     <label className="block text-sm font-medium text-green-800 mb-2">
// //                       Montant total à attribuer
// //                     </label>
// //                     <p className="text-3xl font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</p>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Qualité
// //                     </label>
// //                     <select
// //                       value={validationForm.qualiteDechets}
// //                       onChange={(e) => setValidationForm({...validationForm, qualiteDechets: e.target.value})}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                     >
// //                       <option value="conforme">Conforme</option>
// //                       <option value="non_conforme">Non conforme</option>
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Notes
// //                     </label>
// //                     <textarea
// //                       rows="3"
// //                       value={validationForm.notes}
// //                       onChange={(e) => setValidationForm({...validationForm, notes: e.target.value})}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                       placeholder="Observations..."
// //                     />
// //                   </div>

// //                   <div className="flex gap-3 pt-4">
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowValidationModal(false)}
// //                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
// //                     >
// //                       Annuler
// //                     </button>
// //                     <button
// //                       type="button"
// //                       onClick={() => setShowConfirmation(true)}
// //                       disabled={!validationForm.poidsDepose || validationForm.poidsDepose <= 0}
// //                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
// //                     >
// //                       Continuer
// //                     </button>
// //                   </div>
// //                 </form>
// //               ) : (
// //                 <div className="p-6 space-y-6">
// //                   <div className="text-center">
// //                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //                       <Gift className="h-10 w-10 text-green-600" />
// //                     </div>
// //                     <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'attribution</h3>
// //                     <p className="text-gray-600">
// //                       Vous êtes sur le point d'attribuer <span className="font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</span> au collecteur
// //                     </p>
// //                     <p className="text-lg font-semibold text-gray-800 mt-2">{selectedMission.collecteur_nom}</p>
// //                   </div>

// //                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Mission</span>
// //                       <span className="font-medium">#{selectedMission.id?.substring(0,8)}</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Poids</span>
// //                       <span className="font-medium">{validationForm.poidsDepose} kg</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Prix/kg</span>
// //                       <span className="font-medium">{validationForm.prixParKg} FCFA</span>
// //                     </div>
// //                     <div className="flex justify-between pt-2 border-t border-gray-200">
// //                       <span className="text-gray-800 font-semibold">Montant total</span>
// //                       <span className="text-green-600 font-bold text-lg">{montantTotal.toLocaleString()} FCFA</span>
// //                     </div>
// //                   </div>

// //                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
// //                     <div className="flex items-start gap-3">
// //                       <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
// //                       <div>
// //                         <p className="font-medium text-yellow-800">Cette action est irréversible</p>
// //                         <p className="text-sm text-yellow-600">
// //                           Une fois confirmée, les crédits seront définitivement attribués au collecteur.
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-3">
// //                     <button
// //                       onClick={() => setShowConfirmation(false)}
// //                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
// //                     >
// //                       Retour
// //                     </button>
// //                     <button
// //                       onClick={handleValidationSubmit}
// //                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2"
// //                     >
// //                       <Check className="h-4 w-4" />
// //                       Confirmer et valider
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // ==================== PAGE MES VALIDATIONS ====================
// //   const MesValidationsPage = () => {
// //     const [activeTab, setActiveTab] = useState('mes-missions');

// //     return (
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //             <CheckCircle className="h-6 w-6 text-green-600" />
// //             Mes validations
// //           </h1>
// //           <p className="text-gray-600">Historique de vos interventions</p>
// //         </div>

// //         {/* Tabs */}
// //         <div className="flex gap-4 mb-8 border-b border-gray-200">
// //           <button
// //             onClick={() => setActiveTab('mes-missions')}
// //             className={`px-4 py-2 font-medium transition-colors relative ${
// //               activeTab === 'mes-missions'
// //                 ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
// //                 : 'text-gray-600 hover:text-gray-900'
// //             }`}
// //           >
// //             Missions validées ({mesMissionsValidees.length})
// //           </button>
// //           <button
// //             onClick={() => setActiveTab('historique')}
// //             className={`px-4 py-2 font-medium transition-colors relative ${
// //               activeTab === 'historique'
// //                 ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
// //                 : 'text-gray-600 hover:text-gray-900'
// //             }`}
// //           >
// //             Historique complet ({monHistorique.length})
// //           </button>
// //         </div>

// //         {activeTab === 'mes-missions' && (
// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="space-y-4">
// //               {mesMissionsValidees.length > 0 ? (
// //                 mesMissionsValidees.map((mission) => (
// //                   <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                     <div className="flex items-start justify-between mb-2">
// //                       <div>
// //                         <p className="font-semibold text-gray-900">
// //                           Mission #{mission.id?.substring(0,8)}
// //                         </p>
// //                         <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
// //                           <User className="h-3 w-3" /> {mission.collecteur_nom || 'Collecteur'}
// //                         </p>
// //                       </div>
// //                       <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// //                         Validée le {formatDate(mission.date_validation)}
// //                       </span>
// //                     </div>
// //                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
// //                       <div>
// //                         <p className="text-gray-500">Type déchet</p>
// //                         <p className="font-medium">{mission.type_dechet}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Poids</p>
// //                         <p className="font-medium">{mission.poids_depose || 0} kg</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Gains</p>
// //                         <p className="font-medium text-green-600">{mission.gains_attribues || 0} FCFA</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Qualité</p>
// //                         <p className="font-medium">{mission.qualite_dechets || 'conforme'}</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-center text-gray-500 py-8">Aucune mission validée</p>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {activeTab === 'historique' && (
// //           <div className="bg-white rounded-xl shadow-lg p-6">
// //             <div className="space-y-4">
// //               {monHistorique.length > 0 ? (
// //                 monHistorique.map((item, index) => (
// //                   <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
// //                     <div className="flex items-start gap-3">
// //                       <div className="p-2 bg-green-100 rounded-full">
// //                         <CheckCircle className="h-4 w-4 text-green-600" />
// //                       </div>
// //                       <div className="flex-1">
// //                         <p className="font-semibold text-gray-900">Validation de collecte</p>
// //                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
// //                           <div>
// //                             <p className="text-gray-500">Collecteur</p>
// //                             <p className="font-medium">{item.collecteur_nom || 'Inconnu'}</p>
// //                           </div>
// //                           <div>
// //                             <p className="text-gray-500">Type déchet</p>
// //                             <p className="font-medium">{item.type_dechet || 'N/A'}</p>
// //                           </div>
// //                           <div>
// //                             <p className="text-gray-500">Poids</p>
// //                             <p className="font-medium">{item.poids || 0} kg</p>
// //                           </div>
// //                           <div>
// //                             <p className="text-gray-500">Date</p>
// //                             <p className="font-medium">{formatDate(item.date_action)}</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <p className="text-center text-gray-500 py-8">Aucun historique</p>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // ==================== PAGE STATISTIQUES ====================
// //   const StatistiquesPage = () => {
// //     return (
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //             <BarChart className="h-6 w-6 text-green-600" />
// //             Statistiques détaillées
// //           </h1>
// //           <p className="text-gray-600">Analyse des activités de votre point de collecte</p>
// //         </div>
        
// //         {/* Statistiques par type de déchet */}
// //         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
// //           <div className="flex items-center justify-between mb-6">
// //             <h2 className="text-lg font-bold text-gray-900">Répartition par type de déchet</h2>
// //             <div className="text-sm text-gray-600">
// //               Total: {statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0).toFixed(1)} kg
// //             </div>
// //           </div>

// //           <div className="space-y-4">
// //             {statsParType.length > 0 ? (
// //               statsParType.map((stat) => {
// //                 const totalPoids = statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0);
// //                 const pourcentage = totalPoids > 0 ? ((parseFloat(stat.poids_total_valide || 0) / totalPoids) * 100).toFixed(1) : 0;
                
// //                 return (
// //                   <div key={stat.type_dechet} className="border border-gray-200 rounded-lg p-4">
// //                     <div className="flex items-center justify-between mb-2">
// //                       <div className="flex items-center gap-2">
// //                         <div
// //                           className="w-3 h-3 rounded-full"
// //                           style={{ backgroundColor: getColorForType(stat.type_dechet) }}
// //                         ></div>
// //                         <span className="font-medium text-gray-900">{stat.type_dechet}</span>
// //                       </div>
// //                       <span className="text-sm font-medium text-green-600">{pourcentage}%</span>
// //                     </div>
                    
// //                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
// //                       <div>
// //                         <p className="text-gray-500">Poids validé</p>
// //                         <p className="font-medium">{stat.poids_total_valide || 0} kg</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Missions validées</p>
// //                         <p className="font-medium">{stat.missions_validees || 0}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Total missions</p>
// //                         <p className="font-medium">{stat.nombre_total_missions || 0}</p>
// //                       </div>
// //                       <div>
// //                         <p className="text-gray-500">Taux réalisation</p>
// //                         <p className="font-medium">{stat.taux_realisation || 0}%</p>
// //                       </div>
// //                     </div>
                    
// //                     <div className="mt-3">
// //                       <div className="w-full bg-gray-200 rounded-full h-2">
// //                         <div
// //                           className="h-2 rounded-full"
// //                           style={{
// //                             width: `${pourcentage}%`,
// //                             backgroundColor: getColorForType(stat.type_dechet)
// //                           }}
// //                         ></div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 );
// //               })
// //             ) : (
// //               <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
// //             )}
// //           </div>
// //         </div>

// //         {/* Évolution journalière */}
// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <div className="flex items-center justify-between mb-6">
// //             <h2 className="text-lg font-bold text-gray-900">Évolution journalière</h2>
// //             <select
// //               value={periodeEvolution}
// //               onChange={(e) => {
// //                 setPeriodeEvolution(parseInt(e.target.value));
// //                 loadAllData(false);
// //               }}
// //               className="px-3 py-1 border border-gray-300 rounded-lg"
// //             >
// //               <option value="7">7 jours</option>
// //               <option value="30">30 jours</option>
// //               <option value="90">90 jours</option>
// //             </select>
// //           </div>

// //           <div className="space-y-4">
// //             {evolutionJournaliere.length > 0 ? (
// //               evolutionJournaliere.map((jour) => (
// //                 <div key={jour.jour} className="border border-gray-200 rounded-lg p-4">
// //                   <div className="flex items-center justify-between mb-2">
// //                     <span className="font-medium text-gray-900">
// //                       {new Date(jour.jour).toLocaleDateString('fr-FR', {
// //                         weekday: 'long',
// //                         year: 'numeric',
// //                         month: 'long',
// //                         day: 'numeric'
// //                       })}
// //                     </span>
// //                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
// //                       {jour.nombre_validations} validation(s)
// //                     </span>
// //                   </div>
// //                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
// //                     <div>
// //                       <p className="text-gray-500">Poids total</p>
// //                       <p className="font-medium">{jour.poids_total || 0} kg</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-gray-500">Collecteurs actifs</p>
// //                       <p className="font-medium">{jour.collecteurs_actifs || 0}</p>
// //                     </div>
// //                     <div>
// //                       <p className="text-gray-500">Gains distribués</p>
// //                       <p className="font-medium text-green-600">{(jour.gains_total || 0).toLocaleString()} FCFA</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))
// //             ) : (
// //               <p className="text-center text-gray-500 py-4">Aucune donnée pour cette période</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ==================== PAGE PROFIL ====================
// //   const ProfilPage = () => {
// //     const [isEditing, setIsEditing] = useState(false);
// //     const [editData, setEditData] = useState({
// //       nomComplet: '',
// //       telephone: '',
// //       fonction: ''
// //     });

// //     useEffect(() => {
// //       setEditData({
// //         nomComplet: userData.nomComplet,
// //         telephone: userData.telephone,
// //         fonction: userData.fonction
// //       });
// //     }, [userData]);

// //     const handleSave = async () => {
// //       const token = getToken();
// //       try {
// //         const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
// //           method: 'PUT',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${token}`
// //           },
// //           body: JSON.stringify(editData)
// //         });

// //         if (response.ok) {
// //           setUserData({...userData, ...editData});
// //           setIsEditing(false);
// //           alert('Profil mis à jour avec succès');
// //         }
// //       } catch (error) {
// //         console.error('Erreur mise à jour:', error);
// //       }
// //     };

// //     return (
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-8">
// //           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //             <User className="h-6 w-6 text-green-600" />
// //             Mon profil
// //           </h1>
// //           <p className="text-gray-600">Gérez vos informations personnelles</p>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Carte d'identité */}
// //           <div className="lg:col-span-1">
// //             <div className="bg-white rounded-2xl shadow-lg p-6">
// //               <div className="text-center mb-6">
// //                 <div className="relative inline-block">
// //                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
// //                     {getInitials(userData.nomComplet)}
// //                   </div>
// //                 </div>
                
// //                 <h2 className="mt-4 text-xl font-bold text-gray-900">
// //                   {userData.nomComplet}
// //                 </h2>
// //                 <p className="text-sm text-gray-500 mt-1">{userData.fonction}</p>
// //               </div>

// //               <div className="space-y-3 pt-6 border-t border-gray-200">
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-sm text-gray-600">Point de collecte</span>
// //                   <span className="text-sm font-medium text-gray-900">{userData.pointCollecteNom || 'Non assigné'}</span>
// //                 </div>
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-sm text-gray-600">Email</span>
// //                   <span className="text-sm font-medium text-gray-900">{userData.email}</span>
// //                 </div>
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-sm text-gray-600">Téléphone</span>
// //                   <span className="text-sm font-medium text-gray-900">{userData.telephone || 'Non renseigné'}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Formulaire d'édition */}
// //           <div className="lg:col-span-2">
// //             <div className="bg-white rounded-2xl shadow-lg p-6">
// //               <div className="flex items-center justify-between mb-6">
// //                 <h3 className="text-lg font-bold text-gray-900">Informations personnelles</h3>
// //                 {!isEditing ? (
// //                   <button
// //                     onClick={() => setIsEditing(true)}
// //                     className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
// //                   >
// //                     <Edit2 className="h-4 w-4" />
// //                     Modifier
// //                   </button>
// //                 ) : (
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => {
// //                         setEditData({
// //                           nomComplet: userData.nomComplet,
// //                           telephone: userData.telephone,
// //                           fonction: userData.fonction
// //                         });
// //                         setIsEditing(false);
// //                       }}
// //                       className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
// //                     >
// //                       Annuler
// //                     </button>
// //                     <button
// //                       onClick={handleSave}
// //                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
// //                     >
// //                       Enregistrer
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={editData.nomComplet}
// //                       onChange={(e) => setEditData({...editData, nomComplet: e.target.value})}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                     />
// //                   ) : (
// //                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.nomComplet}</p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
// //                   <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.email}</p>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="tel"
// //                       value={editData.telephone}
// //                       onChange={(e) => setEditData({...editData, telephone: e.target.value})}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                     />
// //                   ) : (
// //                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.telephone || 'Non renseigné'}</p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
// //                   {isEditing ? (
// //                     <input
// //                       type="text"
// //                       value={editData.fonction}
// //                       onChange={(e) => setEditData({...editData, fonction: e.target.value})}
// //                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
// //                     />
// //                   ) : (
// //                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.fonction}</p>
// //                   )}
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
// //                   <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.pointCollecteNom || 'Non assigné'}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // ==================== PAGE AIDE ====================
// //   const AidePage = () => (
// //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //       <div className="mb-8">
// //         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
// //           <HelpCircle className="h-6 w-6 text-green-600" />
// //           Centre d'aide
// //         </h1>
// //         <p className="text-gray-600">Trouvez des réponses à vos questions</p>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
// //             <CheckCircle className="h-5 w-5 text-green-600" />
// //             Valider une mission
// //           </h2>
// //           <ol className="list-decimal list-inside space-y-2 text-gray-600">
// //             <li>Sélectionnez une mission dans la liste</li>
// //             <li>Entrez le poids déposé</li>
// //             <li>Définissez le prix par kilogramme</li>
// //             <li>Confirmez l'attribution des crédits au collecteur</li>
// //             <li>Cliquez sur "Valider" pour finaliser</li>
// //           </ol>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
// //             <BarChart className="h-5 w-5 text-green-600" />
// //             Consulter les statistiques
// //           </h2>
// //           <ol className="list-decimal list-inside space-y-2 text-gray-600">
// //             <li>Accédez à l'onglet "Statistiques"</li>
// //             <li>Consultez la répartition par type de déchet</li>
// //             <li>Analysez l'évolution journalière</li>
// //             <li>Identifiez les meilleurs collecteurs</li>
// //           </ol>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
// //             <User className="h-5 w-5 text-green-600" />
// //             Gérer votre profil
// //           </h2>
// //           <ol className="list-decimal list-inside space-y-2 text-gray-600">
// //             <li>Allez dans "Mon profil"</li>
// //             <li>Cliquez sur "Modifier" pour changer vos informations</li>
// //           </ol>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-lg p-6">
// //           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
// //             <Users className="h-5 w-5 text-green-600" />
// //             Suivre les collecteurs
// //           </h2>
// //           <ol className="list-decimal list-inside space-y-2 text-gray-600">
// //             <li>Consultez le tableau de bord pour voir les statistiques</li>
// //             <li>Les top collecteurs sont affichés dans la section dédiée</li>
// //             <li>Chaque validation crédite automatiquement le collecteur</li>
// //           </ol>
// //         </div>
// //       </div>

// //       <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
// //         <h3 className="text-lg font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
// //         <p className="text-green-100 mb-4">
// //           Notre équipe est disponible pour répondre à toutes vos questions
// //         </p>
// //         <div className="flex gap-4">
// //           <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
// //             Contacter le support
// //           </button>
// //           <button className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
// //             Documentation
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   // ==================== ROUTAGE ====================
// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Sidebar />
// //         <div className="lg:ml-80 min-h-screen">
// //           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
// //             <div className="px-4 py-3 flex items-center justify-between">
// //               <button
// //                 onClick={() => setSidebarOpen(true)}
// //                 className="p-2 hover:bg-gray-100 rounded-lg"
// //               >
// //                 <Menu className="w-6 h-6 text-gray-600" />
// //               </button>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
// //                   {getInitials(userData.nomComplet)}
// //                 </div>
// //               </div>
// //             </div>
// //           </header>
// //           <div className="flex items-center justify-center h-[calc(100vh-64px)]">
// //             <div className="text-center">
// //               <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
// //               <p className="text-gray-600">Chargement du tableau de bord...</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-50">
// //         <Sidebar />
// //         <div className="lg:ml-80 min-h-screen">
// //           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
// //             <div className="px-4 py-3 flex items-center justify-between">
// //               <button
// //                 onClick={() => setSidebarOpen(true)}
// //                 className="p-2 hover:bg-gray-100 rounded-lg"
// //               >
// //                 <Menu className="w-6 h-6 text-gray-600" />
// //               </button>
// //               <div className="flex items-center gap-2">
// //                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
// //                   {getInitials(userData.nomComplet)}
// //                 </div>
// //               </div>
// //             </div>
// //           </header>
// //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //             <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
// //               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
// //               <p className="text-red-600 text-lg mb-4">{error}</p>
// //               <button
// //                 onClick={() => loadAllData(true)}
// //                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
// //               >
// //                 Réessayer
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Sidebar />
      
// //       {/* Header mobile */}
// //       <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
// //         <div className="px-4 py-3 flex items-center justify-between">
// //           <button
// //             onClick={() => setSidebarOpen(true)}
// //             className="p-2 hover:bg-gray-100 rounded-lg"
// //           >
// //             <Menu className="w-6 h-6 text-gray-600" />
// //           </button>
// //           <div className="flex items-center gap-2">
// //             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
// //               {getInitials(userData.nomComplet)}
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Main Content avec routage interne */}
// //       <div className="lg:ml-80 min-h-screen">
// //         <Routes>
// //           <Route path="/" element={<DashboardPage />} />
// //           <Route path="/missions" element={<MissionsPage />} />
// //           <Route path="/mes-validations" element={<MesValidationsPage />} />
// //           <Route path="/statistiques" element={<StatistiquesPage />} />
// //           <Route path="/profil" element={<ProfilPage />} />
// //           <Route path="/aide" element={<AidePage />} />
// //         </Routes>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardGestionnaire;



// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate, Routes, Route, Link } from 'react-router-dom';
// import {
//   Warehouse, Package, Clock, CheckCircle, TrendingUp, Award,
//   BarChart3, Target, DollarSign, Bell, ArrowRight,
//   Truck, MapPin, Star, Activity, Users, Calendar,
//   Menu, X, LogOut, User, Settings, HelpCircle,
//   LayoutDashboard, Filter, Search, Phone, MessageSquare, Eye,
//   Edit2, Save, Building, Shield, Download, AlertCircle,
//   RefreshCw, Gift, Award as AwardIcon, BarChart, PieChart,
//   Scale, ThumbsUp, Info, ChevronRight, Check, TrendingDown
// } from 'lucide-react';

// // ==================== COMPOSANT PRINCIPAL ====================
// const DashboardGestionnaire = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [userData, setUserData] = useState({
//     id: '',
//     nomComplet: '',
//     email: '',
//     telephone: '',
//     pointCollecteId: '',
//     pointCollecteNom: '',
//     fonction: '',
//     photoUrl: ''
//   });

//   // États pour les données
//   const [stats, setStats] = useState({
//     enAttente: 0,
//     totalValidees: 0,
//     poidsTotalGlobal: 0,
//     gainsDistribuesGlobal: 0,
//     mesValidations: 0,
//     monPoidsValide: 0,
//     mesGainsDistribues: 0,
//     maContribution: 0
//   });

//   const [missionsEnAttente, setMissionsEnAttente] = useState([]);
//   const [missionsRecentes, setMissionsRecentes] = useState([]);
//   const [topCollecteurs, setTopCollecteurs] = useState([]);
//   const [mesMissionsValidees, setMesMissionsValidees] = useState([]);
//   const [monHistorique, setMonHistorique] = useState([]);
  
//   // États pour les statistiques avancées
//   const [statsParType, setStatsParType] = useState([]);
//   const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
//   const [periodeEvolution, setPeriodeEvolution] = useState(30);
  
//   // État pour le modal de validation
//   const [showValidationModal, setShowValidationModal] = useState(false);
//   const [selectedMission, setSelectedMission] = useState(null);
//   const [validationForm, setValidationForm] = useState({
//     missionId: '',
//     poidsDepose: '',
//     prixParKg: 50,
//     qualiteDechets: 'conforme',
//     notes: ''
//   });
//   const [montantTotal, setMontantTotal] = useState(0);

//   // État pour la confirmation de validation
//   const [showConfirmation, setShowConfirmation] = useState(false);

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [dataLoaded, setDataLoaded] = useState(false);
  
//   // Références pour éviter les rechargements inutiles
//   const initialLoadDone = useRef(false);
//   const intervalRef = useRef(null);
//   const lastRefreshTime = useRef(Date.now());
//   const validationsLoadedRef = useRef(false);

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
//   const STORAGE_KEYS = {
//     TOKEN: 'ecocollect_token',
//     USER: 'ecocollect_user',
//     ROLE: 'ecocollect_role'
//   };

//   const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
//   const getInitials = (name) => {
//     if (!name) return 'G';
//     return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//   };

//   const handleLogout = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       localStorage.removeItem(STORAGE_KEYS.TOKEN);
//       localStorage.removeItem(STORAGE_KEYS.USER);
//       localStorage.removeItem(STORAGE_KEYS.ROLE);
//       navigate('/login');
//     }
//   };

//   // ==================== CHARGEMENT DES DONNÉES ====================
//   const loadUserData = useCallback(async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (response.ok) {
//         const result = await response.json();
//         const profil = result.utilisateur || result;
        
//         setUserData({
//           id: profil.id || '',
//           nomComplet: profil.nomComplet || profil.nom_complet || '',
//           email: profil.email || '',
//           telephone: profil.telephone || '',
//           pointCollecteId: profil.pointCollecteId || profil.point_collecte_id || '',
//           pointCollecteNom: profil.pointCollecteNom || profil.point_collecte_nom || '',
//           fonction: profil.fonction || 'Gestionnaire',
//           photoUrl: profil.photoUrl || ''
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement utilisateur:', error);
//     }
//   }, [API_URL]);

//   // Fonction pour charger toutes les données
//   const loadAllData = useCallback(async (showLoading = true) => {
//     const now = Date.now();
//     if (now - lastRefreshTime.current < 10000 && !showLoading) {
//       return;
//     }
//     lastRefreshTime.current = now;

//     const token = getToken();
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     if (showLoading) setIsLoading(true);
//     setError(null);

//     try {
//       const [dashboardRes, missionsAttenteRes, statsTypeRes, evolutionRes, topRes] = await Promise.all([
//         fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/gestionnaires/statistiques/par-type-dechet`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/gestionnaires/statistiques/repartition-journaliere?jours=30`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/gestionnaires/top-collecteurs`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       if (dashboardRes.ok) {
//         const dashboardData = await dashboardRes.json();
//         if (dashboardData.success) {
//           const statsGlobales = dashboardData.statistiques || {};
//           const mesStats = dashboardData.mes_statistiques || {};

//           setStats({
//             enAttente: statsGlobales.en_attente || 0,
//             totalValidees: statsGlobales.total_validees || 0,
//             poidsTotalGlobal: statsGlobales.poids_total_global || 0,
//             gainsDistribuesGlobal: statsGlobales.gains_distribues_global || 0,
//             mesValidations: mesStats.missions_validees || 0,
//             monPoidsValide: mesStats.poids_total_valide || 0,
//             mesGainsDistribues: mesStats.gains_distribues || 0,
//             maContribution: statsGlobales.total_validees ? 
//               Math.round((mesStats.missions_validees / statsGlobales.total_validees) * 100) : 0
//           });

//           if (dashboardData.dernieresMissions) {
//             setMissionsRecentes(dashboardData.dernieresMissions);
//           }
//         }
//       }

//       if (missionsAttenteRes.ok) {
//         const result = await missionsAttenteRes.json();
//         setMissionsEnAttente(result.missions || []);
//       }

//       if (statsTypeRes.ok) {
//         const result = await statsTypeRes.json();
//         setStatsParType(result.stats || []);
//       }

//       if (evolutionRes.ok) {
//         const result = await evolutionRes.json();
//         setEvolutionJournaliere(result.repartition || []);
//       }

//       if (topRes.ok) {
//         const result = await topRes.json();
//         setTopCollecteurs(result.top || []);
//       }

//       setDataLoaded(true);
//     } catch (error) {
//       console.error('❌ Erreur chargement données:', error);
//       setError('Impossible de charger les données');
//     } finally {
//       if (showLoading) setIsLoading(false);
//     }
//   }, [API_URL, navigate]);

//   // Charger les validations séparément
//   const loadMesValidations = useCallback(async (force = false) => {
//     if (!force && validationsLoadedRef.current) {
//       return;
//     }

//     const token = getToken();
//     if (!token) return;
    
//     try {
//       const [missionsRes, historiqueRes] = await Promise.all([
//         fetch(`${API_URL}/api/gestionnaires/mes-missions/validees`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         }),
//         fetch(`${API_URL}/api/gestionnaires/mon-historique`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         })
//       ]);

//       if (missionsRes.ok) {
//         const result = await missionsRes.json();
//         setMesMissionsValidees(result.missions || []);
//       }

//       if (historiqueRes.ok) {
//         const result = await historiqueRes.json();
//         setMonHistorique(result.historique || []);
//       }

//       validationsLoadedRef.current = true;
//     } catch (error) {
//       console.error('❌ Erreur chargement validations:', error);
//     }
//   }, [API_URL]);

//   // ==================== CHARGEMENT INITIAL ====================
//   useEffect(() => {
//     const token = getToken();
//     const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
//     if (!token || role !== 'gestionnaire') {
//       navigate('/login');
//       return;
//     }

//     if (!initialLoadDone.current) {
//       initialLoadDone.current = true;
      
//       const initializeData = async () => {
//         await loadUserData();
//         await loadAllData();
//         await loadMesValidations(true);
//       };
      
//       initializeData();
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [navigate, loadUserData, loadAllData, loadMesValidations]);

//   // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
//   useEffect(() => {
//     if (dataLoaded && !intervalRef.current) {
//       intervalRef.current = setInterval(() => {
//         loadAllData(false);
//       }, 60000);
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [dataLoaded, loadAllData]);

//   // ==================== ACTIONS ====================
//   const calculerMontant = (poids, prixKg) => {
//     const montant = (parseFloat(poids || 0) * parseFloat(prixKg || 0)).toFixed(0);
//     setMontantTotal(montant);
//     return montant;
//   };

//   const handleValidationSubmit = async () => {
//     const token = getToken();
//     const { missionId, poidsDepose, prixParKg, qualiteDechets, notes } = validationForm;

//     try {
//       const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           poidsDepose: parseFloat(poidsDepose),
//           prixParKg: parseFloat(prixParKg),
//           qualiteDechets,
//           validationNotes: notes
//         })
//       });

//       const result = await response.json();

//       if (result.success) {
//         validationsLoadedRef.current = false;
        
//         await loadAllData(false);
//         await loadMesValidations(true);
        
//         setShowConfirmation(false);
//         setShowValidationModal(false);
//         setValidationForm({
//           missionId: '',
//           poidsDepose: '',
//           prixParKg: 50,
//           qualiteDechets: 'conforme',
//           notes: ''
//         });
//       } else {
//         throw new Error(result.message || 'Erreur lors de la validation');
//       }
//     } catch (error) {
//       console.error('❌ Erreur:', error);
//       alert(error.message);
//     }
//   };

//   // ==================== UTILITAIRES ====================
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusBadge = (statut) => {
//     switch (statut) {
//       case 'validee':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Validée</span>;
//       case 'deposee':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
//       case 'acceptee':
//         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Acceptée</span>;
//       case 'en_cours':
//         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">En cours</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
//     }
//   };

//   const getColorForType = (type) => {
//     const colors = {
//       'plastique': '#3B82F6',
//       'verre': '#10B981',
//       'papier': '#F59E0B',
//       'carton': '#8B5CF6',
//       'metal': '#6B7280',
//       'electronique': '#EC4899',
//       'organique': '#84CC16'
//     };
//     return colors[type?.toLowerCase()] || '#6B7280';
//   };

//   const getIconForType = (type) => {
//     const icons = {
//       'plastique': '🥤',
//       'verre': '🍾',
//       'papier': '📄',
//       'carton': '📦',
//       'metal': '🔩',
//       'electronique': '💻',
//       'organique': '🥬'
//     };
//     return icons[type?.toLowerCase()] || '📊';
//   };

//   // ==================== COMPOSANTS ====================
//   const Sidebar = () => {
//     const menuItems = {
//       principal: [
//         { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/gestionnaire' },
//         { id: 'missions', label: 'Missions à valider', icon: Package, path: '/gestionnaire/missions', badge: stats.enAttente },
//         { id: 'mes-validations', label: 'Mes validations', icon: CheckCircle, path: '/gestionnaire/mes-validations' },
//         { id: 'statistiques', label: 'Statistiques', icon: BarChart, path: '/gestionnaire/statistiques' }
//       ],
//       compte: [
//         { id: 'profil', label: 'Mon profil', icon: User, path: '/gestionnaire/profil' },
//         { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/gestionnaire/aide' }
//       ]
//     };

//     const NavSection = ({ title, items }) => (
//       <div className="mb-6">
//         <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
//           {title}
//         </h3>
//         <ul className="space-y-1">
//           {items.map(item => {
//             const Icon = item.icon;
//             const isActive = currentPage === item.id;
            
//             return (
//               <li key={item.id}>
//                 <Link
//                   to={item.path}
//                   onClick={() => {
//                     setCurrentPage(item.id);
//                     setSidebarOpen(false);
//                   }}
//                   className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
//                     isActive
//                       ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600'
//                       : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
//                     <span className="font-medium">{item.label}</span>
//                   </div>
//                   {item.badge > 0 && (
//                     <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
//                       {item.badge}
//                     </span>
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     );

//     return (
//       <>
//         {/* Mobile Sidebar */}
//         <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
//           sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}>
//           <div 
//             className={`absolute inset-0 bg-black transition-opacity duration-300 ${
//               sidebarOpen ? 'opacity-50' : 'opacity-0'
//             }`}
//             onClick={() => setSidebarOpen(false)}
//           />
          
//           <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}>
//             <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Warehouse className="w-8 h-8 text-white" />
//                   <span className="text-xl font-bold text-white">EcoCollect</span>
//                 </div>
//                 <button
//                   onClick={() => setSidebarOpen(false)}
//                   className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 border-b">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
//                   <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
//                 </div>
//               </div>
//             </div>

//             <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//               <NavSection title="Principal" items={menuItems.principal} />
//               <NavSection title="Compte" items={menuItems.compte} />

//               <div className="mt-6 pt-6 border-t">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span className="font-medium">Déconnexion</span>
//                 </button>
//               </div>
//             </nav>
//           </div>
//         </div>

//         {/* Desktop Sidebar */}
//         <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
//             <div className="flex items-center gap-2">
//               <Warehouse className="w-8 h-8 text-white" />
//               <span className="text-xl font-bold text-white">EcoCollect</span>
//             </div>
//           </div>

//           <div className="p-4 border-b">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
//                 {getInitials(userData.nomComplet)}
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
//                 <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
//               </div>
//             </div>
//           </div>

//           <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//             <NavSection title="Principal" items={menuItems.principal} />
//             <NavSection title="Compte" items={menuItems.compte} />

//             <div className="mt-6 pt-6 border-t">
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
//               >
//                 <LogOut className="w-5 h-5" />
//                 <span className="font-medium">Déconnexion</span>
//               </button>
//             </div>
//           </nav>
//         </div>
//       </>
//     );
//   };

//   // ==================== PAGE TABLEAU DE BORD ====================
//   const DashboardPage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* En-tête */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <LayoutDashboard className="h-6 w-6 text-green-600" />
//           Tableau de bord
//         </h1>
//         <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Gestionnaire'} !</p>
//       </div>

//       {/* Mes statistiques personnelles SEULEMENT */}
//       <div className="mb-8">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <User className="h-5 w-5 text-green-600" />
//           Mes statistiques personnelles
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
//             <p className="text-sm text-gray-600 mb-2">Mes validations</p>
//             <p className="text-3xl font-bold text-green-600">{stats.mesValidations}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
//             <p className="text-sm text-gray-600 mb-2">Mon poids validé</p>
//             <p className="text-3xl font-bold text-orange-600">{stats.monPoidsValide} kg</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
//             <p className="text-sm text-gray-600 mb-2">Mes gains distribués</p>
//             <p className="text-3xl font-bold text-purple-600">{stats.mesGainsDistribues.toLocaleString()} FCFA</p>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
//             <p className="text-sm text-gray-600 mb-2">Ma contribution</p>
//             <p className="text-3xl font-bold text-blue-600">{stats.maContribution}%</p>
//           </div>
//         </div>
//       </div>

//       {/* Missions récentes */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <Clock className="h-5 w-5 text-green-600" />
//               Missions en attente
//             </h3>
//             <Link to="/gestionnaire/missions" className="text-green-600 hover:text-green-700 text-sm font-medium">
//               Voir tout
//             </Link>
//           </div>
          
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {missionsEnAttente.length > 0 ? (
//               missionsEnAttente.slice(0, 5).map((mission) => (
//                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
//                       <p className="text-sm text-gray-600 mt-1">
//                         <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
//                       </p>
//                     </div>
//                     {getStatusBadge(mission.statut)}
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                     <p><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet || 'Déchets'}</p>
//                     <p><Calendar className="inline h-3 w-3 mr-1" /> {formatDate(mission.date_depot_point)}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">Aucune mission en attente</p>
//             )}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <CheckCircle className="h-5 w-5 text-green-600" />
//               Missions récentes validées
//             </h3>
//             <Link to="/gestionnaire/mes-validations" className="text-green-600 hover:text-green-700 text-sm font-medium">
//               Voir tout
//             </Link>
//           </div>
          
//           <div className="space-y-4 max-h-96 overflow-y-auto">
//             {missionsRecentes.length > 0 ? (
//               missionsRecentes.slice(0, 5).map((mission) => (
//                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-gray-900">Mission #{mission.id?.substring(0,8)}</p>
//                       <p className="text-sm text-gray-600 mt-1">
//                         <User className="inline h-3 w-3 mr-1" /> {mission.collecteur_nom || 'Collecteur'}
//                       </p>
//                     </div>
//                     <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                       {mission.poids_depose || 0} kg
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600"><Package className="inline h-3 w-3 mr-1" /> {mission.type_dechet}</span>
//                     <span className="text-green-600 font-medium">{mission.gains_attribues || 0} FCFA</span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">Aucune mission validée récente</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Top collecteurs */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <Award className="h-5 w-5 text-green-600" />
//             Top collecteurs du point
//           </h3>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {topCollecteurs.length > 0 ? (
//             topCollecteurs.map((collecteur, index) => (
//               <div key={collecteur.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
//                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
//                   index === 0 ? 'bg-yellow-500' :
//                   index === 1 ? 'bg-gray-400' :
//                   index === 2 ? 'bg-orange-600' : 'bg-green-600'
//                 }`}>
//                   {index + 1}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-900">{collecteur.nom_complet}</p>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
//                     <span><Scale className="inline h-3 w-3 mr-1" /> {collecteur.total_poids || 0} kg</span>
//                     <span><CheckCircle className="inline h-3 w-3 mr-1" /> {collecteur.missions_validees || 0} missions</span>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-green-600">{(collecteur.total_gains || 0).toLocaleString()} FCFA</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-500 py-4 col-span-3">Aucune donnée</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // ==================== PAGE MISSIONS À VALIDER ====================
//   const MissionsPage = () => {
//     const [searchTerm, setSearchTerm] = useState('');

//     const filteredMissions = missionsEnAttente.filter(mission =>
//       mission.collecteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       mission.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       mission.id?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Package className="h-6 w-6 text-green-600" />
//               Missions à valider
//             </h1>
//             <p className="text-gray-600 mt-1">{missionsEnAttente.length} mission(s) en attente</p>
//           </div>
//           <button
//             onClick={() => loadAllData(false)}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Actualiser
//           </button>
//         </div>

//         {/* Recherche */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Rechercher une mission..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {/* Liste des missions */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <div className="space-y-4">
//             {filteredMissions.length > 0 ? (
//               filteredMissions.map((mission) => (
//                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="font-semibold text-gray-900">
//                           Mission #{mission.id?.substring(0,8)}
//                         </h3>
//                         {getStatusBadge(mission.statut)}
//                       </div>
                      
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                           <p className="text-gray-500">Collecteur</p>
//                           <p className="font-medium text-gray-900 flex items-center gap-1">
//                             <User className="h-3 w-3" /> {mission.collecteur_nom || 'Inconnu'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Type déchet</p>
//                           <p className="font-medium text-gray-900">{mission.type_dechet || 'Non spécifié'}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Quantité</p>
//                           <p className="font-medium text-gray-900">{mission.quantite || 0} {mission.unite || 'kg'}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Date dépôt</p>
//                           <p className="font-medium text-gray-900">{formatDate(mission.date_depot_point)}</p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={() => {
//                         setValidationForm({
//                           ...validationForm,
//                           missionId: mission.id
//                         });
//                         setSelectedMission(mission);
//                         setShowValidationModal(true);
//                       }}
//                       className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
//                     >
//                       <CheckCircle className="h-4 w-4" />
//                       Valider
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-12">
//                 <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission en attente</h3>
//                 <p className="text-gray-600">Les missions apparaîtront ici quand des collecteurs déposeront des déchets</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Modal de validation */}
//         {showValidationModal && selectedMission && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//               <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-2xl font-bold text-gray-900">Valider la mission</h2>
//                   <button
//                     onClick={() => {
//                       setShowValidationModal(false);
//                       setShowConfirmation(false);
//                     }}
//                     className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>

//               {!showConfirmation ? (
//                 <form className="p-6 space-y-6">
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-start gap-3">
//                       <Info className="h-5 w-5 text-blue-600 mt-0.5" />
//                       <div>
//                         <p className="font-medium text-blue-800">Mission sélectionnée</p>
//                         <p className="text-sm text-blue-600 mt-1">
//                           Collecteur: <span className="font-semibold">{selectedMission.collecteur_nom}</span>
//                         </p>
//                         <p className="text-sm text-blue-600">
//                           Type: {selectedMission.type_dechet} | Quantité estimée: {selectedMission.quantite} {selectedMission.unite}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Poids déposé (kg) *
//                       </label>
//                       <input
//                         type="number"
//                         step="0.1"
//                         value={validationForm.poidsDepose}
//                         onChange={(e) => {
//                           setValidationForm({...validationForm, poidsDepose: e.target.value});
//                           calculerMontant(e.target.value, validationForm.prixParKg);
//                         }}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Prix par kg (FCFA) *
//                       </label>
//                       <input
//                         type="number"
//                         step="1"
//                         value={validationForm.prixParKg}
//                         onChange={(e) => {
//                           setValidationForm({...validationForm, prixParKg: e.target.value});
//                           calculerMontant(validationForm.poidsDepose, e.target.value);
//                         }}
//                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                     <label className="block text-sm font-medium text-green-800 mb-2">
//                       Montant total à attribuer
//                     </label>
//                     <p className="text-3xl font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</p>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Qualité
//                     </label>
//                     <select
//                       value={validationForm.qualiteDechets}
//                       onChange={(e) => setValidationForm({...validationForm, qualiteDechets: e.target.value})}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                     >
//                       <option value="conforme">Conforme</option>
//                       <option value="non_conforme">Non conforme</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Notes
//                     </label>
//                     <textarea
//                       rows="3"
//                       value={validationForm.notes}
//                       onChange={(e) => setValidationForm({...validationForm, notes: e.target.value})}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                       placeholder="Observations..."
//                     />
//                   </div>

//                   <div className="flex gap-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => setShowValidationModal(false)}
//                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmation(true)}
//                       disabled={!validationForm.poidsDepose || validationForm.poidsDepose <= 0}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Continuer
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="p-6 space-y-6">
//                   <div className="text-center">
//                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Gift className="h-10 w-10 text-green-600" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'attribution</h3>
//                     <p className="text-gray-600">
//                       Vous êtes sur le point d'attribuer <span className="font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</span> au collecteur
//                     </p>
//                     <p className="text-lg font-semibold text-gray-800 mt-2">{selectedMission.collecteur_nom}</p>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Mission</span>
//                       <span className="font-medium">#{selectedMission.id?.substring(0,8)}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Poids</span>
//                       <span className="font-medium">{validationForm.poidsDepose} kg</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Prix/kg</span>
//                       <span className="font-medium">{validationForm.prixParKg} FCFA</span>
//                     </div>
//                     <div className="flex justify-between pt-2 border-t border-gray-200">
//                       <span className="text-gray-800 font-semibold">Montant total</span>
//                       <span className="text-green-600 font-bold text-lg">{montantTotal.toLocaleString()} FCFA</span>
//                     </div>
//                   </div>

//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                     <div className="flex items-start gap-3">
//                       <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
//                       <div>
//                         <p className="font-medium text-yellow-800">Cette action est irréversible</p>
//                         <p className="text-sm text-yellow-600">
//                           Une fois confirmée, les crédits seront définitivement attribués au collecteur.
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setShowConfirmation(false)}
//                       className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                     >
//                       Retour
//                     </button>
//                     <button
//                       onClick={handleValidationSubmit}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2"
//                     >
//                       <Check className="h-4 w-4" />
//                       Confirmer et valider
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ==================== PAGE MES VALIDATIONS ====================
//   const MesValidationsPage = () => {
//     const [activeTab, setActiveTab] = useState('mes-missions');

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <CheckCircle className="h-6 w-6 text-green-600" />
//             Mes validations
//           </h1>
//           <p className="text-gray-600">Historique de vos interventions</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-8 border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab('mes-missions')}
//             className={`px-4 py-2 font-medium transition-colors relative ${
//               activeTab === 'mes-missions'
//                 ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Missions validées ({mesMissionsValidees.length})
//           </button>
//           <button
//             onClick={() => setActiveTab('historique')}
//             className={`px-4 py-2 font-medium transition-colors relative ${
//               activeTab === 'historique'
//                 ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             Historique complet ({monHistorique.length})
//           </button>
//         </div>

//         {activeTab === 'mes-missions' && (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="space-y-4">
//               {mesMissionsValidees.length > 0 ? (
//                 mesMissionsValidees.map((mission) => (
//                   <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <p className="font-semibold text-gray-900">
//                           Mission #{mission.id?.substring(0,8)}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
//                           <User className="h-3 w-3" /> {mission.collecteur_nom || 'Collecteur'}
//                         </p>
//                       </div>
//                       <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                         Validée le {formatDate(mission.date_validation)}
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
//                       <div>
//                         <p className="text-gray-500">Type déchet</p>
//                         <p className="font-medium">{mission.type_dechet}</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Poids</p>
//                         <p className="font-medium">{mission.poids_depose || 0} kg</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Gains</p>
//                         <p className="font-medium text-green-600">{mission.gains_attribues || 0} FCFA</p>
//                       </div>
//                       <div>
//                         <p className="text-gray-500">Qualité</p>
//                         <p className="font-medium">{mission.qualite_dechets || 'conforme'}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 py-8">Aucune mission validée</p>
//               )}
//             </div>
//           </div>
//         )}

//         {activeTab === 'historique' && (
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="space-y-4">
//               {monHistorique.length > 0 ? (
//                 monHistorique.map((item, index) => (
//                   <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-green-100 rounded-full">
//                         <CheckCircle className="h-4 w-4 text-green-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-semibold text-gray-900">Validation de collecte</p>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
//                           <div>
//                             <p className="text-gray-500">Collecteur</p>
//                             <p className="font-medium">{item.collecteur_nom || 'Inconnu'}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-500">Type déchet</p>
//                             <p className="font-medium">{item.type_dechet || 'N/A'}</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-500">Poids</p>
//                             <p className="font-medium">{item.poids || 0} kg</p>
//                           </div>
//                           <div>
//                             <p className="text-gray-500">Date</p>
//                             <p className="font-medium">{formatDate(item.date_action)}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 py-8">Aucun historique</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ==================== PAGE STATISTIQUES (STYLISÉE AVEC DIAGRAMMES) ====================
//   const StatistiquesPage = () => {
//     // Calculer le poids maximum pour les barres
//     const maxPoids = Math.max(...statsParType.map(s => parseFloat(s.poids_total_valide || 0)), 0.1);
    
//     // Calculer le nombre maximum de missions pour les barres
//     const maxMissions = Math.max(...statsParType.map(s => s.missions_validees || 0), 0.1);

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <BarChart className="h-6 w-6 text-green-600" />
//             Statistiques détaillées
//           </h1>
//           <p className="text-gray-600">Analyse des activités de votre point de collecte</p>
//         </div>
        
//         {/* Statistiques par type de déchet - STYLE DIAGRAMME EN BARRES */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <BarChart3 className="h-5 w-5 text-green-600" />
//               Répartition par type de déchet
//             </h2>
//             <div className="px-4 py-2 bg-green-50 rounded-lg">
//               <p className="text-sm font-medium text-green-700">
//                 Total: {statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0).toFixed(1)} kg
//               </p>
//             </div>
//           </div>

//           {/* Diagramme en barres pour les poids */}
//           <div className="mb-8">
//             <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <Scale className="h-4 w-4 text-green-600" />
//               Poids collecté par type (kg)
//             </h3>
//             <div className="space-y-4">
//               {statsParType.length > 0 ? (
//                 statsParType.map((stat) => {
//                   const poids = parseFloat(stat.poids_total_valide || 0);
//                   const pourcentagePoids = (poids / maxPoids) * 100;
//                   const couleur = getColorForType(stat.type_dechet);
                  
//                   return (
//                     <div key={stat.type_dechet} className="group">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{getIconForType(stat.type_dechet)}</span>
//                           <span className="font-medium text-gray-900">{stat.type_dechet}</span>
//                           <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
//                             {stat.missions_validees || 0} missions
//                           </span>
//                         </div>
//                         <span className="font-bold text-gray-900">{poids.toFixed(1)} kg</span>
//                       </div>
//                       <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
//                         <div 
//                           className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 group-hover:opacity-90"
//                           style={{ 
//                             width: `${pourcentagePoids}%`,
//                             background: `linear-gradient(90deg, ${couleur} 0%, ${couleur}dd 100%)`,
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//                           }}
//                         >
//                           <div className="absolute inset-0 flex items-center justify-end px-3">
//                             <span className="text-xs font-bold text-white drop-shadow-md">
//                               {pourcentagePoids.toFixed(1)}%
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-center py-8">
//                   <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">Aucune donnée disponible</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Diagramme en barres pour les missions */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               Nombre de missions par type
//             </h3>
//             <div className="space-y-4">
//               {statsParType.length > 0 ? (
//                 statsParType.map((stat) => {
//                   const missions = stat.missions_validees || 0;
//                   const pourcentageMissions = (missions / maxMissions) * 100;
//                   const couleur = getColorForType(stat.type_dechet);
                  
//                   return (
//                     <div key={`missions-${stat.type_dechet}`} className="group">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="flex items-center gap-2">
//                           <span className="text-lg">{getIconForType(stat.type_dechet)}</span>
//                           <span className="font-medium text-gray-900">{stat.type_dechet}</span>
//                         </div>
//                         <span className="font-bold text-gray-900">{missions}</span>
//                       </div>
//                       <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
//                         <div 
//                             className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 group-hover:opacity-90"
//                           style={{ 
//                             width: `${pourcentageMissions}%`,
//                             background: `linear-gradient(90deg, ${couleur} 0%, ${couleur}aa 100%)`,
//                             opacity: 0.8
//                           }}
//                         >
//                           <div className="absolute inset-0 flex items-center justify-end px-3">
//                             <span className="text-xs font-bold text-white drop-shadow-md">
//                               {pourcentageMissions.toFixed(0)}%
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
//               )}
//             </div>
//           </div>

//           {/* Cartes récapitulatives */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-green-600">
//                 {statsParType.length}
//               </p>
//               <p className="text-xs text-gray-500">Types de déchets</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-blue-600">
//                 {statsParType.reduce((acc, s) => acc + (s.missions_validees || 0), 0)}
//               </p>
//               <p className="text-xs text-gray-500">Total missions</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-orange-600">
//                 {statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0).toFixed(0)} kg
//               </p>
//               <p className="text-xs text-gray-500">Poids total</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold text-purple-600">
//                 {statsParType.filter(s => (s.taux_realisation || 0) > 0).length}
//               </p>
//               <p className="text-xs text-gray-500">Types actifs</p>
//             </div>
//           </div>
//         </div>

//         {/* Évolution journalière - Gardé mais stylisé */}
//         <div className="bg-white rounded-2xl shadow-xl p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-green-600" />
//               Évolution journalière
//             </h2>
//             <select
//               value={periodeEvolution}
//               onChange={(e) => {
//                 setPeriodeEvolution(parseInt(e.target.value));
//                 loadAllData(false);
//               }}
//               className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
//             >
//               <option value="7">7 jours</option>
//               <option value="30">30 jours</option>
//               <option value="90">90 jours</option>
//             </select>
//           </div>

//           <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//             {evolutionJournaliere.length > 0 ? (
//               evolutionJournaliere.map((jour, index) => {
//                 const poidsMax = Math.max(...evolutionJournaliere.map(j => j.poids_total || 0), 0.1);
//                 const pourcentagePoids = ((jour.poids_total || 0) / poidsMax) * 100;
                
//                 return (
//                   <div key={jour.jour} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-center justify-between mb-3">
//                       <div>
//                         <span className="font-medium text-gray-900">
//                           {new Date(jour.jour).toLocaleDateString('fr-FR', {
//                             weekday: 'long',
//                             day: 'numeric',
//                             month: 'long'
//                           })}
//                         </span>
//                         <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
//                           {jour.nombre_validations} validation{jour.nombre_validations > 1 ? 's' : ''}
//                         </span>
//                       </div>
//                       <span className="text-sm font-semibold text-green-600">
//                         {jour.gains_total?.toLocaleString()} FCFA
//                       </span>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-gray-500">Poids</span>
//                           <span className="font-medium">{jour.poids_total || 0} kg</span>
//                         </div>
//                         <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                           <div 
//                             className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
//                             style={{ width: `${pourcentagePoids}%` }}
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-gray-500">Collecteurs</span>
//                           <span className="font-medium">{jour.collecteurs_actifs || 0}</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Users className="h-4 w-4 text-gray-400" />
//                           <span className="text-xs text-gray-500">actifs</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-12">
//                 <TrendingDown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">Aucune donnée pour cette période</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ==================== PAGE PROFIL ====================
//   const ProfilPage = () => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [editData, setEditData] = useState({
//       nomComplet: '',
//       telephone: '',
//       fonction: ''
//     });

//     useEffect(() => {
//       setEditData({
//         nomComplet: userData.nomComplet,
//         telephone: userData.telephone,
//         fonction: userData.fonction
//       });
//     }, [userData]);

//     const handleSave = async () => {
//       const token = getToken();
//       try {
//         const response = await fetch(`${API_URL}/api/gestionnaires/profil`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify(editData)
//         });

//         if (response.ok) {
//           setUserData({...userData, ...editData});
//           setIsEditing(false);
//           alert('Profil mis à jour avec succès');
//         }
//       } catch (error) {
//         console.error('Erreur mise à jour:', error);
//       }
//     };

//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <User className="h-6 w-6 text-green-600" />
//             Mon profil
//           </h1>
//           <p className="text-gray-600">Gérez vos informations personnelles</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Carte d'identité */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="text-center mb-6">
//                 <div className="relative inline-block">
//                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
//                     {getInitials(userData.nomComplet)}
//                   </div>
//                 </div>
                
//                 <h2 className="mt-4 text-xl font-bold text-gray-900">
//                   {userData.nomComplet}
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">{userData.fonction}</p>
//               </div>

//               <div className="space-y-3 pt-6 border-t border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Point de collecte</span>
//                   <span className="text-sm font-medium text-gray-900">{userData.pointCollecteNom || 'Non assigné'}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Email</span>
//                   <span className="text-sm font-medium text-gray-900">{userData.email}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Téléphone</span>
//                   <span className="text-sm font-medium text-gray-900">{userData.telephone || 'Non renseigné'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Formulaire d'édition */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-bold text-gray-900">Informations personnelles</h3>
//                 {!isEditing ? (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                   >
//                     <Edit2 className="h-4 w-4" />
//                     Modifier
//                   </button>
//                 ) : (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditData({
//                           nomComplet: userData.nomComplet,
//                           telephone: userData.telephone,
//                           fonction: userData.fonction
//                         });
//                         setIsEditing(false);
//                       }}
//                       className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       onClick={handleSave}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//                     >
//                       Enregistrer
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={editData.nomComplet}
//                       onChange={(e) => setEditData({...editData, nomComplet: e.target.value})}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                     />
//                   ) : (
//                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.nomComplet}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.email}</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
//                   {isEditing ? (
//                     <input
//                       type="tel"
//                       value={editData.telephone}
//                       onChange={(e) => setEditData({...editData, telephone: e.target.value})}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                     />
//                   ) : (
//                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.telephone || 'Non renseigné'}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       value={editData.fonction}
//                       onChange={(e) => setEditData({...editData, fonction: e.target.value})}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                     />
//                   ) : (
//                     <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.fonction}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
//                   <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.pointCollecteNom || 'Non assigné'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ==================== PAGE AIDE ====================
//   const AidePage = () => (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <HelpCircle className="h-6 w-6 text-green-600" />
//           Centre d'aide
//         </h1>
//         <p className="text-gray-600">Trouvez des réponses à vos questions</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             Valider une mission
//           </h2>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600">
//             <li>Sélectionnez une mission dans la liste</li>
//             <li>Entrez le poids déposé</li>
//             <li>Définissez le prix par kilogramme</li>
//             <li>Confirmez l'attribution des crédits au collecteur</li>
//             <li>Cliquez sur "Valider" pour finaliser</li>
//           </ol>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <BarChart className="h-5 w-5 text-green-600" />
//             Consulter les statistiques
//           </h2>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600">
//             <li>Accédez à l'onglet "Statistiques"</li>
//             <li>Consultez la répartition par type de déchet</li>
//             <li>Analysez l'évolution journalière</li>
//             <li>Identifiez les meilleurs collecteurs</li>
//           </ol>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <User className="h-5 w-5 text-green-600" />
//             Gérer votre profil
//           </h2>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600">
//             <li>Allez dans "Mon profil"</li>
//             <li>Cliquez sur "Modifier" pour changer vos informations</li>
//           </ol>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <Users className="h-5 w-5 text-green-600" />
//             Suivre les collecteurs
//           </h2>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600">
//             <li>Consultez le tableau de bord pour voir les statistiques</li>
//             <li>Les top collecteurs sont affichés dans la section dédiée</li>
//             <li>Chaque validation crédite automatiquement le collecteur</li>
//           </ol>
//         </div>
//       </div>

//       <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
//         <h3 className="text-lg font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
//         <p className="text-green-100 mb-4">
//           Notre équipe est disponible pour répondre à toutes vos questions
//         </p>
//         <div className="flex gap-4">
//           <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//             Contacter le support
//           </button>
//           <button className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
//             Documentation
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // ==================== ROUTAGE ====================
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="lg:ml-80 min-h-screen">
//           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//             <div className="px-4 py-3 flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="flex items-center justify-center h-[calc(100vh-64px)]">
//             <div className="text-center">
//               <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-600">Chargement du tableau de bord...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Sidebar />
//         <div className="lg:ml-80 min-h-screen">
//           <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//             <div className="px-4 py-3 flex items-center justify-between">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="p-2 hover:bg-gray-100 rounded-lg"
//               >
//                 <Menu className="w-6 h-6 text-gray-600" />
//               </button>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
//                   {getInitials(userData.nomComplet)}
//                 </div>
//               </div>
//             </div>
//           </header>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
//               <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//               <p className="text-red-600 text-lg mb-4">{error}</p>
//               <button
//                 onClick={() => loadAllData(true)}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Réessayer
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar />
      
//       {/* Header mobile */}
//       <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <Menu className="w-6 h-6 text-gray-600" />
//           </button>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
//               {getInitials(userData.nomComplet)}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content avec routage interne */}
//       <div className="lg:ml-80 min-h-screen">
//         <Routes>
//           <Route path="/" element={<DashboardPage />} />
//           <Route path="/missions" element={<MissionsPage />} />
//           <Route path="/mes-validations" element={<MesValidationsPage />} />
//           <Route path="/statistiques" element={<StatistiquesPage />} />
//           <Route path="/profil" element={<ProfilPage />} />
//           <Route path="/aide" element={<AidePage />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default DashboardGestionnaire;








// components/DashboardGestionnaire.js
// import { useState } from 'react';
import { useState, useEffect, useCallback, useRef, useMemo, useDeferredValue } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  Warehouse, Package, Clock, CheckCircle, TrendingUp, Award,
  BarChart3, Target, DollarSign, Bell, ArrowRight,
  Truck, MapPin, Star, Activity, Users, Calendar,
  Menu, X, LogOut, User, Settings, HelpCircle,
  LayoutDashboard, Filter, Search, Phone, MessageSquare, Eye,
  Edit2, Save, Building, Shield, Download, AlertCircle,
  RefreshCw, Gift, Award as AwardIcon, BarChart, PieChart,
  Scale, ThumbsUp, Info, ChevronRight, Check, TrendingDown,
  ShoppingCart, Plus, Minus, Receipt, History, Printer
} from 'lucide-react';

// Hooks personnalisés
import useGestionnaireData from '../../hooks/useGestionnaireData';

// ==================== COMPOSANT PRINCIPAL ====================
const DashboardGestionnaire = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Utiliser le hook personnalisé
  const {
    userData,
    stats,
    missionsEnAttente,
    missionsRecentes,
    topCollecteurs,
    mesMissionsValidees,
    monHistorique,
    achats,
    stocks,
    statsAchatsParType,
    statsParType,
    evolutionJournaliere,
    isLoading,
    error,
    validerMission,
    creerAchat,
    ajusterStock,
    updateProfil,
    changePassword,
    refreshData,
    formatDate,
    formatCurrency,
    getTypeIcon,  getTypeColor,   
    getNiveauStock,
    getStatusBadge
  } = useGestionnaireData();

  // États locaux pour les modals
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showAchatModal, setShowAchatModal] = useState(false);
  const [showAjustementModal, setShowAjustementModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [montantTotal, setMontantTotal] = useState(0);
  const [montantAchat, setMontantAchat] = useState(0);

  // États des formulaires
  const [validationForm, setValidationForm] = useState({
    missionId: '',
    poidsDepose: '',
    prixParKg: 50,
    qualiteDechets: 'conforme',
    notes: ''
  });

  const [achatForm, setAchatForm] = useState({
    typeDechet: 'plastique_pet',
    poids: '',
    prixParKg: 100,
    nomVendeur: '',
    telephoneVendeur: '',
    notes: ''
  });

  const [ajustementForm, setAjustementForm] = useState({
    typeDechet: '',
    nouvelleQuantite: '',
    raison: ''
  });

  const [periodeEvolution, setPeriodeEvolution] = useState(30);
  const [activeStatsTab, setActiveStatsTab] = useState('collectes');

  // ==================== UTILITAIRES ====================
  const getInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('ecocollect_token');
      localStorage.removeItem('ecocollect_user');
      localStorage.removeItem('ecocollect_role');
      navigate('/login');
    }
  };

  const calculerMontant = (poids, prixKg) => {
    const montant = (parseFloat(poids || 0) * parseFloat(prixKg || 0)).toFixed(0);
    setMontantTotal(montant);
    return montant;
  };

  const calculerMontantAchat = (poids, prixKg) => {
    const montant = (parseFloat(poids || 0) * parseFloat(prixKg || 0)).toFixed(0);
    setMontantAchat(montant);
    return montant;
  };

  
  // ==================== GESTIONNAIRES D'ACTIONS ====================
  const handleValidationSubmit = async () => {
    try {
      await validerMission(validationForm.missionId, validationForm);
      setShowConfirmation(false);
      setShowValidationModal(false);
      setValidationForm({
        missionId: '',
        poidsDepose: '',
        prixParKg: 50,
        qualiteDechets: 'conforme',
        notes: ''
      });
      alert(`✅ Mission validée ! ${montantTotal} FCFA attribués au collecteur.`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAchatSubmit = async () => {
    try {
      const result = await creerAchat(achatForm);
      setShowAchatModal(false);
      setAchatForm({
        typeDechet: 'plastique_pet',
        poids: '',
        prixParKg: 100,
        nomVendeur: '',
        telephoneVendeur: '',
        notes: ''
      });
      alert(`✅ Achat effectué ! ${result.poids} kg de ${result.typeDechet} pour ${formatCurrency(result.total)}.`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAjustementSubmit = async () => {
    try {
      await ajusterStock(ajustementForm);
      setShowAjustementModal(false);
      setAjustementForm({
        typeDechet: '',
        nouvelleQuantite: '',
        raison: ''
      });
      alert(`✅ Stock ajusté avec succès !`);
    } catch (error) {
      alert(error.message);
    }
  };

  // ==================== COMPOSANTS ====================
  const Sidebar = () => {
    const menuItems = {
      principal: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/gestionnaire' },
        { id: 'missions', label: 'Missions à valider', icon: Package, path: '/gestionnaire/missions', badge: stats.enAttente },
        { id: 'achats', label: 'Achats de déchets', icon: ShoppingCart, path: '/gestionnaire/achats' },
        { id: 'stocks', label: 'Gestion des stocks', icon: Warehouse, path: '/gestionnaire/stocks' },
        { id: 'mes-validations', label: 'Mes validations', icon: CheckCircle, path: '/gestionnaire/mes-validations' },
        { id: 'statistiques', label: 'Statistiques', icon: BarChart, path: '/gestionnaire/statistiques' },
         { id: 'statistiques-detaillees', label: 'Bilan détaillé', icon: PieChart, path: '/gestionnaire/statistiques-detaillees' } // ← Ajouté
  
      ],
      compte: [
        { id: 'profil', label: 'Mon profil', icon: User, path: '/gestionnaire/profil' },
        { id: 'securite', label: 'Sécurité', icon: Shield, path: '/gestionnaire/securite' },
        { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/gestionnaire/aide' }
      ]
    };

    const NavSection = ({ title, items }) => (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
          {title}
        </h3>
        <ul className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <>
        {/* Mobile Sidebar */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-8 h-8 text-white" />
                  <span className="text-xl font-bold text-white">EcoCollect</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(userData.nomComplet)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
                  <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <NavSection title="Principal" items={menuItems.principal} />
              <NavSection title="Compte" items={menuItems.compte} />

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-40 w-80 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
            <div className="flex items-center gap-2">
              <Warehouse className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">EcoCollect</span>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userData.nomComplet)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userData.nomComplet || 'Gestionnaire'}</p>
                <p className="text-xs text-gray-500">{userData.pointCollecteNom || 'Point de collecte'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <NavSection title="Principal" items={menuItems.principal} />
            <NavSection title="Compte" items={menuItems.compte} />

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </>
    );
  };

  // ==================== PAGE TABLEAU DE BORD ====================
  const DashboardPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête avec boutons d'action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-green-600" />
            Tableau de bord
          </h1>
          <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Gestionnaire'} !</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowAchatModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Nouvel achat
          </button>
          <button
            onClick={() => setShowAjustementModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Warehouse className="h-4 w-4" />
            Ajuster stock
          </button>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-2">Missions en attente</p>
          <p className="text-3xl font-bold text-blue-600">{stats.enAttente}</p>
          <p className="text-xs text-gray-500 mt-2">À valider</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-2">Mes validations</p>
          <p className="text-3xl font-bold text-green-600">{stats.mesValidations}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.maContribution}% du total</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <p className="text-sm text-gray-600 mb-2">Achats effectués</p>
          <p className="text-3xl font-bold text-orange-600">{stats.totalAchats}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.poidsTotalAchete} kg achetés</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600 mb-2">Montant dépensé</p>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.montantTotalDepense)}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.prixMoyenAchat} FCFA/kg en moyenne</p>
        </div>
      </div>

      {/* Alertes stocks bas */}
      {stocks.filter(s => s.quantite_disponible < 50).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Alertes stocks bas</p>
              <div className="mt-2 space-y-1">
                {stocks.filter(s => s.quantite_disponible < 50).map(stock => {
                  const niveau = getNiveauStock(stock.quantite_disponible);
                  return (
                    <p key={stock.type_dechet} className="text-sm text-yellow-700">
                      • {stock.type_dechet}: {stock.quantite_disponible} kg restants
                      {stock.quantite_disponible < 20 && ' (Critique !)'}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Mes statistiques
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Missions validées</span>
                <span className="font-semibold">{stats.mesValidations}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.min(stats.maContribution, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Poids validé</span>
                <span className="font-semibold">{stats.monPoidsValide} kg</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full" style={{ width: `${(stats.monPoidsValide / (stats.poidsTotalGlobal || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Gains distribués</span>
                <span className="font-semibold">{formatCurrency(stats.mesGainsDistribues)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* État des stocks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-green-600" />
            État des stocks
          </h3>
          <div className="space-y-3">
            {stocks.length > 0 ? (
              stocks.slice(0, 5).map(stock => {
                const niveau = getNiveauStock(stock.quantite_disponible);
                return (
                  <div key={stock.type_dechet} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(stock.type_dechet)}</span>
                      <span className="font-medium">{stock.type_dechet}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${niveau.class}`}>
                        {stock.quantite_disponible} kg
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">Aucun stock disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Missions en attente
            </h3>
            <Link to="/gestionnaire/missions" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {missionsEnAttente.length > 0 ? (
              missionsEnAttente.slice(0, 5).map((mission) => {
                const badge = getStatusBadge(mission.statut);
                return (
                  <div key={mission.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">#{mission.id?.substring(0,8)}</p>
                        <p className="text-sm text-gray-600">
                          {mission.collecteur_nom || 'Collecteur'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 ${badge.class} rounded-full text-xs font-medium`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{mission.type_dechet || 'Déchets'}</span>
                      <span className="text-gray-600">{mission.quantite || 0} kg</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune mission en attente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Derniers achats
            </h3>
            <Link to="/gestionnaire/achats" className="text-green-600 hover:text-green-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {achats.length > 0 ? (
              achats.slice(0, 5).map((achat) => (
                <div key={achat.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{achat.type_dechet}</p>
                      <p className="text-sm text-gray-600">Vendeur: {achat.nom_vendeur}</p>
                    </div>
                    <span className="text-green-600 font-semibold">{formatCurrency(achat.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{achat.poids} kg × {achat.prix_par_kg} FCFA/kg</span>
                    <span>{formatDate(achat.date_achat)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucun achat effectué</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

//  // ==================== PAGE MISSIONS À VALIDER ====================
// const MissionsPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredMissions = missionsEnAttente.filter(mission =>
//     mission.collecteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mission.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     mission.id?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <Package className="h-6 w-6 text-green-600" />
//             Missions à valider
//           </h1>
//           <p className="text-gray-600 mt-1">{missionsEnAttente.length} mission(s) en attente</p>
//         </div>
//         <button
//           onClick={() => refreshData()}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Actualiser
//         </button>
//       </div>

//       {/* Recherche */}
//       <div className="mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="Rechercher une mission..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Liste des missions */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="space-y-4">
//           {filteredMissions.length > 0 ? (
//             filteredMissions.map((mission) => {
//               const badge = getStatusBadge(mission.statut);
//               return (
//                 <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="font-semibold text-gray-900">
//                           Mission #{mission.id?.substring(0,8)}
//                         </h3>
//                         <span className={`px-2 py-1 ${badge.class} rounded-full text-xs font-medium`}>
//                           {badge.label}
//                         </span>
//                       </div>
                      
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                           <p className="text-gray-500">Collecteur</p>
//                           <p className="font-medium text-gray-900 flex items-center gap-1">
//                             <User className="h-3 w-3" /> {mission.collecteur_nom || 'Inconnu'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Type déchet</p>
//                           <p className="font-medium text-gray-900">{mission.type_dechet || 'Non spécifié'}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Quantité</p>
//                           <p className="font-medium text-gray-900">{mission.quantite || 0} {mission.unite || 'kg'}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Date dépôt</p>
//                           <p className="font-medium text-gray-900">{formatDate(mission.date_depot_point)}</p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={() => {
//                         setValidationForm({
//                           ...validationForm,
//                           missionId: mission.id
//                         });
//                         setSelectedMission(mission);
//                         setShowValidationModal(true);
//                       }}
//                       className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
//                     >
//                       <CheckCircle className="h-4 w-4" />
//                       Valider
//                     </button>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-12">
//               <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission en attente</h3>
//               <p className="text-gray-600">Les missions apparaîtront ici quand des collecteurs déposeront des déchets</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ MODAL DE VALIDATION COMPLET (à remettre ici) */}
//       {showValidationModal && selectedMission && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">Valider la mission</h2>
//                 <button
//                   onClick={() => {
//                     setShowValidationModal(false);
//                     setShowConfirmation(false);
//                   }}
//                   className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>

//             {!showConfirmation ? (
//               <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <div className="flex items-start gap-3">
//                     <Info className="h-5 w-5 text-blue-600 mt-0.5" />
//                     <div>
//                       <p className="font-medium text-blue-800">Mission sélectionnée</p>
//                       <p className="text-sm text-blue-600 mt-1">
//                         Collecteur: <span className="font-semibold">{selectedMission.collecteur_nom}</span>
//                       </p>
//                       <p className="text-sm text-blue-600">
//                         Type: {selectedMission.type_dechet} | Quantité estimée: {selectedMission.quantite} {selectedMission.unite}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Poids déposé (kg) *
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       value={validationForm.poidsDepose}
//                       onChange={(e) => {
//                         setValidationForm({...validationForm, poidsDepose: e.target.value});
//                         calculerMontant(e.target.value, validationForm.prixParKg);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Prix par kg (FCFA) *
//                     </label>
//                     <input
//                       type="number"
//                       step="1"
//                       value={validationForm.prixParKg}
//                       onChange={(e) => {
//                         setValidationForm({...validationForm, prixParKg: e.target.value});
//                         calculerMontant(validationForm.poidsDepose, e.target.value);
//                       }}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//                   <label className="block text-sm font-medium text-green-800 mb-2">
//                     Montant total à attribuer
//                   </label>
//                   <p className="text-3xl font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Qualité
//                   </label>
//                   <select
//                     value={validationForm.qualiteDechets}
//                     onChange={(e) => setValidationForm({...validationForm, qualiteDechets: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                   >
//                     <option value="conforme">Conforme</option>
//                     <option value="non_conforme">Non conforme</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     rows="3"
//                     value={validationForm.notes}
//                     onChange={(e) => setValidationForm({...validationForm, notes: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
//                     placeholder="Observations..."
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowValidationModal(false)}
//                     className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmation(true)}
//                     disabled={!validationForm.poidsDepose || validationForm.poidsDepose <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Continuer
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="p-6 space-y-6">
//                 <div className="text-center">
//                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Gift className="h-10 w-10 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'attribution</h3>
//                   <p className="text-gray-600">
//                     Vous êtes sur le point d'attribuer <span className="font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</span> au collecteur
//                   </p>
//                   <p className="text-lg font-semibold text-gray-800 mt-2">{selectedMission.collecteur_nom}</p>
//                 </div>

//                 <div className="bg-gray-50 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Mission</span>
//                     <span className="font-medium">#{selectedMission.id?.substring(0,8)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Poids</span>
//                     <span className="font-medium">{validationForm.poidsDepose} kg</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Prix/kg</span>
//                     <span className="font-medium">{validationForm.prixParKg} FCFA</span>
//                   </div>
//                   <div className="flex justify-between pt-2 border-t border-gray-200">
//                     <span className="text-gray-800 font-semibold">Montant total</span>
//                     <span className="text-green-600 font-bold text-lg">{montantTotal.toLocaleString()} FCFA</span>
//                   </div>
//                 </div>

//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <div className="flex items-start gap-3">
//                     <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
//                     <div>
//                       <p className="font-medium text-yellow-800">Cette action est irréversible</p>
//                       <p className="text-sm text-yellow-600">
//                         Une fois confirmée, les crédits seront définitivement attribués au collecteur.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowConfirmation(false)}
//                     className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
//                   >
//                     Retour
//                   </button>
//                   <button
//                     onClick={handleValidationSubmit}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2"
//                   >
//                     <Check className="h-4 w-4" />
//                     Confirmer et valider
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// ==================== PAGE MISSIONS À VALIDER ====================
const MissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campagnes, setCampagnes] = useState([]);
  const [loadingCampagnes, setLoadingCampagnes] = useState(false);

  // Charger les campagnes disponibles
  useEffect(() => {
    loadCampagnes();
  }, []);

  const loadCampagnes = async () => {
    const token = localStorage.getItem('ecocollect_token');
    setLoadingCampagnes(true);
    try {
      const response = await fetch('http://localhost:3000/api/campagnes?statut=active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Filtrer les campagnes qui acceptent le type de déchet de la mission sélectionnée
        setCampagnes(data.campagnes || []);
      }
    } catch (error) {
      console.error('Erreur chargement campagnes:', error);
    } finally {
      setLoadingCampagnes(false);
    }
  };

  const filteredMissions = missionsEnAttente.filter(mission =>
    mission.collecteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" />
            Missions à valider
          </h1>
          <p className="text-gray-600 mt-1">{missionsEnAttente.length} mission(s) en attente</p>
        </div>
        <button
          onClick={() => {
            refreshData();
            loadCampagnes();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une mission..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des missions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {filteredMissions.length > 0 ? (
            filteredMissions.map((mission) => {
              const badge = getStatusBadge(mission.statut);
              return (
                <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Mission #{mission.id?.substring(0,8)}
                        </h3>
                        <span className={`px-2 py-1 ${badge.class} rounded-full text-xs font-medium`}>
                          {badge.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Collecteur</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="h-3 w-3" /> {mission.collecteur_nom || 'Inconnu'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type déchet</p>
                          <p className="font-medium text-gray-900">{mission.type_dechet || 'Non spécifié'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantité</p>
                          <p className="font-medium text-gray-900">{mission.quantite || 0} {mission.unite || 'kg'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date dépôt</p>
                          <p className="font-medium text-gray-900">{formatDate(mission.date_depot_point)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setValidationForm({
                          ...validationForm,
                          missionId: mission.id
                        });
                        setSelectedMission(mission);
                        setShowValidationModal(true);
                      }}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Valider
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune mission en attente</h3>
              <p className="text-gray-600">Les missions apparaîtront ici quand des collecteurs déposeront des déchets</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE VALIDATION AVEC SÉLECTION DE CAMPAGNE */}
      {showValidationModal && selectedMission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Valider la mission</h2>
                <button
                  onClick={() => {
                    setShowValidationModal(false);
                    setShowConfirmation(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {!showConfirmation ? (
              <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Mission sélectionnée</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Collecteur: <span className="font-semibold">{selectedMission.collecteur_nom}</span>
                      </p>
                      <p className="text-sm text-blue-600">
                        Type: {selectedMission.type_dechet} | Quantité estimée: {selectedMission.quantite} {selectedMission.unite}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✅ NOUVEAU : Sélection de campagne */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Campagne (optionnel)
                  </label>
                  <select
                    value={validationForm.campagneId || ''}
                    onChange={(e) => setValidationForm({...validationForm, campagneId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Aucune campagne</option>
                    {campagnes
                      .filter(c => c.types_dechets?.includes(selectedMission.type_dechet))
                      .map(campagne => {
                        const progression = campagne.poids_attendue ? 
                          ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
                        const reste = campagne.poids_attendue - (campagne.poids_collecte_actuel || 0);
                        
                        return (
                          <option key={campagne.id} value={campagne.id}>
                            {campagne.nom} - {reste.toFixed(1)} kg restant(s) sur {campagne.poids_attendue} kg ({progression}%)
                          </option>
                        );
                      })}
                  </select>
                  {validationForm.campagneId && (
                    <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                      Cette mission contribuera à l'objectif de la campagne sélectionnée
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids déposé (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={validationForm.poidsDepose}
                      onChange={(e) => {
                        setValidationForm({...validationForm, poidsDepose: e.target.value});
                        calculerMontant(e.target.value, validationForm.prixParKg);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix par kg (FCFA) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={validationForm.prixParKg}
                      onChange={(e) => {
                        setValidationForm({...validationForm, prixParKg: e.target.value});
                        calculerMontant(validationForm.poidsDepose, e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                      required
                    />
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Montant total à attribuer
                  </label>
                  <p className="text-3xl font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualité
                  </label>
                  <select
                    value={validationForm.qualiteDechets}
                    onChange={(e) => setValidationForm({...validationForm, qualiteDechets: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  >
                    <option value="conforme">Conforme</option>
                    <option value="non_conforme">Non conforme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows="3"
                    value={validationForm.notes}
                    onChange={(e) => setValidationForm({...validationForm, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    placeholder="Observations..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowValidationModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(true)}
                    disabled={!validationForm.poidsDepose || validationForm.poidsDepose <= 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuer
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'attribution</h3>
                  <p className="text-gray-600">
                    Vous êtes sur le point d'attribuer <span className="font-bold text-green-600">{montantTotal.toLocaleString()} FCFA</span> au collecteur
                  </p>
                  <p className="text-lg font-semibold text-gray-800 mt-2">{selectedMission.collecteur_nom}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mission</span>
                    <span className="font-medium">#{selectedMission.id?.substring(0,8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Poids</span>
                    <span className="font-medium">{validationForm.poidsDepose} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix/kg</span>
                    <span className="font-medium">{validationForm.prixParKg} FCFA</span>
                  </div>
                  {validationForm.campagneId && (
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-800 font-semibold">Campagne</span>
                      <span className="text-green-600 font-medium">
                        {campagnes.find(c => c.id === validationForm.campagneId)?.nom}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-800 font-semibold">Montant total</span>
                    <span className="text-green-600 font-bold text-lg">{montantTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Cette action est irréversible</p>
                      <p className="text-sm text-yellow-600">
                        Une fois confirmée, les crédits seront définitivement attribués au collecteur.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleValidationSubmit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Confirmer et valider
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PAGE STATISTIQUES DÉTAILLÉES ====================
const StatistiquesDetailleesPage = () => {
    const [activeTab, setActiveTab] = useState('global');
    const [selectedType, setSelectedType] = useState(null);
    
    const {
        statistiquesCompletes,
        formatCurrency,
        getTypeIcon,
        getTypeColor
    } = useGestionnaireData();

    const maxPoids = Math.max(
        ...statistiquesCompletes.par_type.map(t => t.total.poids),
        0.1
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* En-tête avec totaux */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                    Bilan complet des déchets
                </h1>
                
                {/* Cartes des totaux */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                        <Package className="h-8 w-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold">{statistiquesCompletes.totaux.missions.poids.toFixed(1)} kg</p>
                        <p className="text-sm opacity-90">Total collecté</p>
                        <p className="text-xs opacity-75 mt-1">{statistiquesCompletes.totaux.missions.nombre} missions</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                        <ShoppingCart className="h-8 w-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold">{statistiquesCompletes.totaux.achats.poids.toFixed(1)} kg</p>
                        <p className="text-sm opacity-90">Total acheté</p>
                        <p className="text-xs opacity-75 mt-1">{statistiquesCompletes.totaux.achats.nombre} achats</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                        <Scale className="h-8 w-8 mb-3 opacity-80" />
                        <p className="text-3xl font-bold">{statistiquesCompletes.totaux.global.poids.toFixed(1)} kg</p>
                        <p className="text-sm opacity-90">Total global</p>
                        <div className="flex gap-2 mt-2 text-xs">
                            <span className="bg-white/20 px-2 py-1 rounded">
                                {statistiquesCompletes.totaux.global.pourcentage_missions}% collectes
                            </span>
                            <span className="bg-white/20 px-2 py-1 rounded">
                                {statistiquesCompletes.totaux.global.pourcentage_achats}% achats
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphique de répartition par type */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Répartition par type de déchet
                </h2>

                <div className="space-y-6">
                    {statistiquesCompletes.par_type.map((stat) => {
                        const pourcentage = (stat.total.poids / maxPoids) * 100;
                        
                        return (
                            <div 
                                key={stat.type_dechet}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedType(selectedType === stat.type_dechet ? null : stat.type_dechet)}
                            >
                                {/* En-tête du type */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getTypeIcon(stat.type_dechet)}</span>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{stat.type_dechet}</h3>
                                            <p className="text-xs text-gray-500">
                                                Total: {stat.total.poids.toFixed(1)} kg
                                            </p>
                                        </div>
                                    </div>
                                    <span 
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{
                                            backgroundColor: `${getTypeColor(stat.type_dechet)}20`,
                                            color: getTypeColor(stat.type_dechet)
                                        }}
                                    >
                                        {((stat.total.poids / statistiquesCompletes.totaux.global.poids) * 100 || 0).toFixed(1)}%
                                    </span>
                                </div>

                                {/* Barre de progression globale */}
                                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                                    <div 
                                        className="absolute top-0 left-0 h-full rounded-full"
                                        style={{ 
                                            width: `${pourcentage}%`,
                                            background: `linear-gradient(90deg, ${getTypeColor(stat.type_dechet)} 0%, ${getTypeColor(stat.type_dechet)}dd 100%)`
                                        }}
                                    />
                                </div>

                                {/* Détails déroulants */}
                                {selectedType === stat.type_dechet && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Détails des missions */}
                                            <div className="bg-green-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Package className="h-4 w-4 text-green-600" />
                                                    <span className="font-medium text-green-700">Collectes</span>
                                                </div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {stat.missions.poids.toFixed(1)} kg
                                                </p>
                                                <p className="text-xs text-green-600 mt-1">
                                                    {stat.missions.nombre} missions
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stat.total.pourcentage_missions}% du total
                                                </p>
                                            </div>

                                            {/* Détails des achats */}
                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-700">Achats</span>
                                                </div>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {stat.achats.poids.toFixed(1)} kg
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    {stat.achats.nombre} achats
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stat.total.pourcentage_achats}% du total
                                                </p>
                                            </div>
                                        </div>

                                        {/* Montant dépensé pour les achats */}
                                        {stat.achats.montant > 0 && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Montant total des achats</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {formatCurrency(stat.achats.montant)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Graphique comparatif */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-600" />
                    Comparaison Collectes vs Achats
                </h2>

                <div className="space-y-4">
                    {statistiquesCompletes.par_type.map((stat) => {
                        const maxComparatif = Math.max(stat.missions.poids, stat.achats.poids, 0.1);
                        
                        return (
                            <div key={`comparatif-${stat.type_dechet}`} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-700">{stat.type_dechet}</span>
                                    <span className="text-sm text-gray-500">
                                        {stat.total.poids.toFixed(1)} kg
                                    </span>
                                </div>
                                
                                {/* Barre des collectes */}
                                <div className="relative">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-green-600">Collectes</span>
                                        <span className="text-green-600 font-medium">{stat.missions.poids.toFixed(1)} kg</span>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${(stat.missions.poids / maxComparatif) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                
                                {/* Barre des achats */}
                                <div className="relative">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-blue-600">Achats</span>
                                        <span className="text-blue-600 font-medium">{stat.achats.poids.toFixed(1)} kg</span>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(stat.achats.poids / maxComparatif) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Résumé global */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <Package className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-600">
                                {statistiquesCompletes.totaux.missions.poids.toFixed(1)} kg
                            </p>
                            <p className="text-sm text-gray-600">Total collecté</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <ShoppingCart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-blue-600">
                                {statistiquesCompletes.totaux.achats.poids.toFixed(1)} kg
                            </p>
                            <p className="text-sm text-gray-600">Total acheté</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

  // ==================== PAGE ACHATS ====================
  const AchatsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showStats, setShowStats] = useState(false);

    const filteredAchats = achats.filter(achat =>
      achat.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achat.nom_vendeur?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              Achats de déchets
            </h1>
            <p className="text-gray-600 mt-1">Achetez des déchets à des vendeurs non inscrits</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showStats ? 'Masquer stats' : 'Voir stats'}
            </button>
            <button
              onClick={() => setShowAchatModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvel achat
            </button>
          </div>
        </div>

        {/* Statistiques des achats */}
      {showStats && (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
    <h2 className="text-lg font-bold text-gray-900 mb-4">Statistiques des achats</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-600 mb-1">Total achats</p>
        <p className="text-2xl font-bold text-blue-700">{stats.totalAchats}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-sm text-green-600 mb-1">Poids total</p>
        <p className="text-2xl font-bold text-green-700">{stats.poidsTotalAchete} kg</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-4">
        <p className="text-sm text-orange-600 mb-1">Montant dépensé</p>
        <p className="text-2xl font-bold text-orange-700">{formatCurrency(stats.montantTotalDepense)}</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-4">
        <p className="text-sm text-purple-600 mb-1">Prix moyen/kg</p>
        <p className="text-2xl font-bold text-purple-700">
          {Math.round(stats.prixMoyenAchat || 0)} FCFA  {/* ← Arrondi à l'entier */}
        </p>
      </div>
    </div>

    {/* Répartition par type */}
    <h3 className="font-semibold text-gray-700 mb-3">Répartition par type de déchet</h3>
    <div className="space-y-3">
      {statsAchatsParType.length > 0 ? (
        statsAchatsParType.map(stat => {
          const maxPoids = Math.max(...statsAchatsParType.map(s => s.poids_total), 0.1);
          const pourcentage = (stat.poids_total / maxPoids) * 100;
          
          return (
            <div key={stat.type_dechet} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(stat.type_dechet)}</span>
                  <span className="font-medium">{stat.type_dechet}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {stat.nombre_achats} achats
                  </span>
                </div>
                <span className="font-bold text-gray-900">{stat.poids_total} kg</span>
              </div>
              <div className="relative h-6 bg-gray-100 rounded-lg overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500"
                  style={{ 
                    width: `${pourcentage}%`,
                    background: `linear-gradient(90deg, ${getTypeColor(stat.type_dechet)} 0%, ${getTypeColor(stat.type_dechet)}dd 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Total: {formatCurrency(stat.montant_total)}</span>
                <span>Moy: {Math.round(stat.prix_moyen || 0)} FCFA/kg</span>  {/* ← Arrondi */}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 py-4">Aucune donnée</p>
      )}
    </div>
  </div>
)}

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par type de déchet ou vendeur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Liste des achats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Historique des achats</h2>
          <div className="space-y-4">
            {filteredAchats.length > 0 ? (
              filteredAchats.map((achat) => (
                <div key={achat.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(achat.type_dechet)}</span>
                        {achat.type_dechet}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Vendeur: {achat.nom_vendeur} {achat.telephone_vendeur && `- ${achat.telephone_vendeur}`}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatCurrency(achat.total)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Poids</p>
                      <p className="font-medium">{achat.poids} kg</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Prix/kg</p>
                      <p className="font-medium">{achat.prix_par_kg} FCFA</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(achat.date_achat)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Point</p>
                      <p className="font-medium">{achat.point_depot_nom}</p>
                    </div>
                  </div>
                  
                  {achat.notes && (
                    <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      Note: {achat.notes}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun achat effectué</h3>
                <p className="text-gray-600">Cliquez sur "Nouvel achat" pour commencer</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal d'achat */}
        {showAchatModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Nouvel achat de déchets</h2>
                  <button
                    onClick={() => setShowAchatModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1">Achetez des déchets à des vendeurs non inscrits</p>
              </div>

              <form className="p-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de déchet *
                  </label>
                  <select
                    value={achatForm.typeDechet}
                    onChange={(e) => {
                      setAchatForm({...achatForm, typeDechet: e.target.value});
                      calculerMontantAchat(achatForm.poids, achatForm.prixParKg);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="plastique_pet">Plastique PET</option>
                    <option value="plastique_pehd">Plastique PEHD</option>
                    <option value="papier_carton">Papier / Carton</option>
                    <option value="verre">Verre</option>
                    <option value="metal">Métal</option>
                    <option value="organique">Organique</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poids (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={achatForm.poids}
                      onChange={(e) => {
                        setAchatForm({...achatForm, poids: e.target.value});
                        calculerMontantAchat(e.target.value, achatForm.prixParKg);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix par kg (FCFA) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={achatForm.prixParKg}
                      onChange={(e) => {
                        setAchatForm({...achatForm, prixParKg: e.target.value});
                        calculerMontantAchat(achatForm.poids, e.target.value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Montant total à payer
                  </label>
                  <p className="text-3xl font-bold text-blue-600">{montantAchat.toLocaleString()} FCFA</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du vendeur
                    </label>
                    <input
                      type="text"
                      value={achatForm.nomVendeur}
                      onChange={(e) => setAchatForm({...achatForm, nomVendeur: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="Anonyme"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={achatForm.telephoneVendeur}
                      onChange={(e) => setAchatForm({...achatForm, telephoneVendeur: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="77 XXX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows="3"
                    value={achatForm.notes}
                    onChange={(e) => setAchatForm({...achatForm, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="Observations sur l'achat..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAchatModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleAchatSubmit}
                    disabled={!achatForm.poids || achatForm.poids <= 0 || !achatForm.prixParKg || achatForm.prixParKg <= 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer l'achat
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE STOCKS ====================
  const StocksPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStocks = stocks.filter(stock =>
      stock.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Warehouse className="h-6 w-6 text-green-600" />
              Gestion des stocks
            </h1>
            <p className="text-gray-600 mt-1">Suivez et ajustez vos stocks de déchets</p>
          </div>
          <button
            onClick={() => setShowAjustementModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Minus className="h-4 w-4" />
            Ajuster stock
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un type de déchet..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Types de déchets</p>
            <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Poids total</p>
            <p className="text-2xl font-bold text-gray-900">
              {stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0).toFixed(1)} kg
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Stocks critiques</p>
            <p className="text-2xl font-bold text-red-600">
              {stocks.filter(s => s.quantite_disponible < 20).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Dernière mise à jour</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Liste des stocks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">État des stocks par type</h2>
          <div className="space-y-4">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => {
                const niveau = getNiveauStock(stock.quantite_disponible);
                const pourcentage = Math.min((stock.quantite_disponible / 200) * 100, 100);
                
                return (
                  <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(stock.type_dechet)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{stock.type_dechet}</h3>
                          <p className="text-xs text-gray-500">Point: {stock.point_depot_nom}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${niveau.class.split(' ')[1]}`}>
                          {stock.quantite_disponible} kg
                        </p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${niveau.class}`}>
                          {niveau.label}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                          stock.quantite_disponible < 20 ? 'bg-red-500' :
                          stock.quantite_disponible < 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${pourcentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Dernier mouvement: {formatDate(stock.dernier_mouvement)}</span>
                      {stock.prix_estime && <span>Prix estimé: {stock.prix_estime} FCFA/kg</span>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Warehouse className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun stock disponible</h3>
                <p className="text-gray-600">Les stocks apparaîtront après les premiers achats ou collectes</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal d'ajustement */}
        {showAjustementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Ajuster le stock</h2>
                  <button
                    onClick={() => setShowAjustementModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de déchet *
                  </label>
                  <select
                    value={ajustementForm.typeDechet}
                    onChange={(e) => setAjustementForm({...ajustementForm, typeDechet: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="plastique_pet">Plastique PET</option>
                    <option value="plastique_pehd">Plastique PEHD</option>
                    <option value="papier_carton">Papier / Carton</option>
                    <option value="verre">Verre</option>
                    <option value="metal">Métal</option>
                    <option value="organique">Organique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle quantité (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={ajustementForm.nouvelleQuantite}
                    onChange={(e) => setAjustementForm({...ajustementForm, nouvelleQuantite: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison de l'ajustement *
                  </label>
                  <textarea
                    rows="3"
                    value={ajustementForm.raison}
                    onChange={(e) => setAjustementForm({...ajustementForm, raison: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    placeholder="Inventaire, perte, correction..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAjustementModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleAjustementSubmit}
                    disabled={!ajustementForm.typeDechet || !ajustementForm.nouvelleQuantite || !ajustementForm.raison}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    Confirmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE MES VALIDATIONS ====================
  const MesValidationsPage = () => {
    const [activeTab, setActiveTab] = useState('mes-missions');

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Mes validations
          </h1>
          <p className="text-gray-600">Historique de vos interventions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mes-missions')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'mes-missions'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Missions validées ({mesMissionsValidees.length})
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'historique'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Historique complet ({monHistorique.length})
          </button>
        </div>

        {activeTab === 'mes-missions' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {mesMissionsValidees.length > 0 ? (
                mesMissionsValidees.map((mission) => (
                  <div key={mission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Mission #{mission.id?.substring(0,8)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <User className="h-3 w-3" /> {mission.collecteur_nom || 'Collecteur'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Validée le {formatDate(mission.date_validation)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div>
                        <p className="text-gray-500">Type déchet</p>
                        <p className="font-medium">{mission.type_dechet}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Poids</p>
                        <p className="font-medium">{mission.poids_depose || 0} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Gains</p>
                        <p className="font-medium text-green-600">{formatCurrency(mission.gains_attribues || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Qualité</p>
                        <p className="font-medium">{mission.qualite_dechets || 'conforme'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune mission validée</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'historique' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {monHistorique.length > 0 ? (
                monHistorique.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Validation de collecte</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                          <div>
                            <p className="text-gray-500">Collecteur</p>
                            <p className="font-medium">{item.collecteur_nom || 'Inconnu'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Type déchet</p>
                            <p className="font-medium">{item.type_dechet || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Poids</p>
                            <p className="font-medium">{item.poids || 0} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(item.date_action)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun historique</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE STATISTIQUES ====================
  const StatistiquesPage = () => {
    const maxPoidsCollectes = Math.max(...statsParType.map(s => parseFloat(s.poids_total_valide || 0)), 0.1);
    const maxPoidsAchats = Math.max(...statsAchatsParType.map(s => parseFloat(s.poids_total || 0)), 0.1);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart className="h-6 w-6 text-green-600" />
            Statistiques détaillées
          </h1>
          <p className="text-gray-600">Analyse des activités de votre point de collecte</p>
        </div>

        {/* Tabs pour les stats */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveStatsTab('collectes')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeStatsTab === 'collectes'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Collectes
          </button>
          <button
            onClick={() => setActiveStatsTab('achats')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeStatsTab === 'achats'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Achats
          </button>
          <button
            onClick={() => setActiveStatsTab('global')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeStatsTab === 'global'
                ? 'text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Vue globale
          </button>
        </div>

        {activeStatsTab === 'collectes' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Répartition des collectes par type de déchet
              </h2>
              <div className="px-4 py-2 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-700">
                  Total: {statsParType.reduce((acc, s) => acc + parseFloat(s.poids_total_valide || 0), 0).toFixed(1)} kg
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {statsParType.length > 0 ? (
                statsParType.map((stat) => {
                  const poids = parseFloat(stat.poids_total_valide || 0);
                  const pourcentagePoids = (poids / maxPoidsCollectes) * 100;
                  
                  return (
                    <div key={stat.type_dechet} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(stat.type_dechet)}</span>
                          <span className="font-medium text-gray-900">{stat.type_dechet}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {stat.missions_validees || 0} missions
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">{poids.toFixed(1)} kg</span>
                      </div>
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 group-hover:opacity-90"
                          style={{ 
                            width: `${pourcentagePoids}%`,
                            background: `linear-gradient(90deg, ${getTypeColor(stat.type_dechet)} 0%, ${getTypeColor(stat.type_dechet)}dd 100%)`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-end px-3">
                            <span className="text-xs font-bold text-white drop-shadow-md">
                              {pourcentagePoids.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune donnée de collecte</p>
              )}
            </div>
          </div>
        )}

        {activeStatsTab === 'achats' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Répartition des achats par type de déchet
              </h2>
              <div className="px-4 py-2 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-700">
                  Total: {statsAchatsParType.reduce((acc, s) => acc + parseFloat(s.poids_total || 0), 0).toFixed(1)} kg
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {statsAchatsParType.length > 0 ? (
                statsAchatsParType.map((stat) => {
                  const poids = parseFloat(stat.poids_total || 0);
                  const pourcentagePoids = (poids / maxPoidsAchats) * 100;
                  
                  return (
                    <div key={stat.type_dechet} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(stat.type_dechet)}</span>
                          <span className="font-medium text-gray-900">{stat.type_dechet}</span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {stat.nombre_achats || 0} achats
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{poids.toFixed(1)} kg</span>
                          <span className="text-xs text-gray-500 ml-2">{formatCurrency(stat.montant_total)}</span>
                        </div>
                      </div>
                      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 group-hover:opacity-90"
                          style={{ 
                            width: `${pourcentagePoids}%`,
                            background: `linear-gradient(90deg, ${getTypeColor(stat.type_dechet)} 0%, ${getTypeColor(stat.type_dechet)}dd 100%)`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-end px-3">
                            <span className="text-xs font-bold text-white drop-shadow-md">
                              {pourcentagePoids.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Prix moyen: {stat.prix_moyen} FCFA/kg</span>
                        <span>Min: {stat.prix_min} | Max: {stat.prix_max}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">Aucune donnée d'achat</p>
              )}
            </div>
          </div>
        )}

        {activeStatsTab === 'global' && (
          <>
            {/* Évolution journalière */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Évolution journalière
                </h2>
                <select
                  value={periodeEvolution}
                  onChange={(e) => {
                    setPeriodeEvolution(parseInt(e.target.value));
                    refreshData();
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                >
                  <option value="7">7 jours</option>
                  <option value="30">30 jours</option>
                  <option value="90">90 jours</option>
                </select>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {evolutionJournaliere.length > 0 ? (
                  evolutionJournaliere.map((jour, index) => {
                    const poidsMax = Math.max(...evolutionJournaliere.map(j => j.poids_total || 0), 0.1);
                    const pourcentagePoids = ((jour.poids_total || 0) / poidsMax) * 100;
                    
                    return (
                      <div key={jour.jour} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-medium text-gray-900">
                              {new Date(jour.jour).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </span>
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                              {jour.nombre_validations} validation{jour.nombre_validations > 1 ? 's' : ''}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {jour.gains_total?.toLocaleString()} FCFA
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500">Poids</span>
                              <span className="font-medium">{jour.poids_total || 0} kg</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                                style={{ width: `${pourcentagePoids}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-500">Collecteurs</span>
                              <span className="font-medium">{jour.collecteurs_actifs || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">actifs</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <TrendingDown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune donnée pour cette période</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cartes récapitulatives globales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                <Package className="h-8 w-8 mb-3 opacity-80" />
                <p className="text-3xl font-bold">{statsParType.reduce((acc, s) => acc + (s.missions_validees || 0), 0)}</p>
                <p className="text-sm opacity-90">Missions validées</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
                <ShoppingCart className="h-8 w-8 mb-3 opacity-80" />
                <p className="text-3xl font-bold">{stats.totalAchats}</p>
                <p className="text-sm opacity-90">Achats effectués</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <Users className="h-8 w-8 mb-3 opacity-80" />
                <p className="text-3xl font-bold">{topCollecteurs.length}</p>
                <p className="text-sm opacity-90">Collecteurs actifs</p>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // ==================== PAGE PROFIL ====================
  const ProfilPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      nomComplet: '',
      telephone: '',
      fonction: ''
    });

    useState(() => {
      setEditData({
        nomComplet: userData.nomComplet,
        telephone: userData.telephone,
        fonction: userData.fonction
      });
    }, [userData]);

    const handleSave = async () => {
      try {
        await updateProfil(editData);
        setIsEditing(false);
        alert('Profil mis à jour avec succès');
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6 text-green-600" />
            Mon profil
          </h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte d'identité */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(userData.nomComplet)}
                  </div>
                </div>
                
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {userData.nomComplet}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{userData.fonction}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Point de collecte</span>
                  <span className="text-sm font-medium text-gray-900">{userData.pointCollecteNom || 'Non assigné'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Téléphone</span>
                  <span className="text-sm font-medium text-gray-900">{userData.telephone || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membre depuis</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire d'édition */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Informations personnelles</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditData({
                          nomComplet: userData.nomComplet,
                          telephone: userData.telephone,
                          fonction: userData.fonction
                        });
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.nomComplet}
                      onChange={(e) => setEditData({...editData, nomComplet: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.nomComplet}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.telephone}
                      onChange={(e) => setEditData({...editData, telephone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.telephone || 'Non renseigné'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fonction}
                      onChange={(e) => setEditData({...editData, fonction: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.fonction}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
                  <p className="px-4 py-2 bg-gray-50 rounded-lg">{userData.pointCollecteNom || 'Non assigné'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAGE SÉCURITÉ ====================
  const SecuritePage = () => {
    const [passwords, setPasswords] = useState({
      actuel: '',
      nouveau: '',
      confirmation: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (passwords.nouveau !== passwords.confirmation) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
      }

      if (passwords.nouveau.length < 6) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }

      try {
        await changePassword(passwords.actuel, passwords.nouveau);
        alert('Mot de passe modifié avec succès');
        setPasswords({ actuel: '', nouveau: '', confirmation: '' });
      } catch (error) {
        alert(error.message);
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Sécurité
          </h1>
          <p className="text-gray-600">Gérez la sécurité de votre compte</p>
        </div>

        <div className="max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Changer le mot de passe</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwords.actuel}
                  onChange={(e) => setPasswords({...passwords, actuel: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwords.nouveau}
                  onChange={(e) => setPasswords({...passwords, nouveau: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwords.confirmation}
                  onChange={(e) => setPasswords({...passwords, confirmation: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold mt-4"
              >
                Changer le mot de passe
              </button>
            </form>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Conseils de sécurité</p>
                <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                  <li>Utilisez un mot de passe unique</li>
                  <li>Mélangez lettres, chiffres et caractères spéciaux</li>
                  <li>Ne partagez jamais votre mot de passe</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAGE AIDE ====================
  const AidePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-green-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-600">Trouvez des réponses à vos questions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Valider une mission
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Sélectionnez une mission dans la liste</li>
            <li>Entrez le poids déposé</li>
            <li>Définissez le prix par kilogramme</li>
            <li>Confirmez l'attribution des crédits au collecteur</li>
            <li>Cliquez sur "Valider" pour finaliser</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            Effectuer un achat
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Allez dans "Achats de déchets"</li>
            <li>Cliquez sur "Nouvel achat"</li>
            <li>Sélectionnez le type de déchet</li>
            <li>Entrez le poids et le prix par kg</li>
            <li>Renseignez les infos du vendeur (optionnel)</li>
            <li>Confirmez l'achat</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-green-600" />
            Gérer les stocks
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Consultez l'état des stocks en temps réel</li>
            <li>Les achats augmentent automatiquement les stocks</li>
            <li>Utilisez "Ajuster stock" pour les corrections</li>
            <li>Surveillez les alertes de stocks bas</li>
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart className="h-5 w-5 text-green-600" />
            Consulter les statistiques
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Accédez à l'onglet "Statistiques"</li>
            <li>Consultez la répartition par type de déchet</li>
            <li>Analysez l'évolution journalière</li>
            <li>Comparez collectes et achats</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
        <p className="text-green-100 mb-4">
          Notre équipe est disponible pour répondre à toutes vos questions
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contacter le support
          </button>
          <button className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
            Documentation
          </button>
        </div>
      </div>
    </div>
  );

  // ==================== ROUTAGE ====================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du tableau de bord...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-80 min-h-screen">
          <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Header mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec routage interne */}
      <div className="lg:ml-80 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/achats" element={<AchatsPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/mes-validations" element={<MesValidationsPage />} />
          <Route path="/statistiques" element={<StatistiquesPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/securite" element={<SecuritePage />} />
           <Route path="/statistiques-detaillees" element={<StatistiquesDetailleesPage />} />
          <Route path="/aide" element={<AidePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardGestionnaire;