// CollecteurDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, Clock, CheckCircle, TrendingUp, Award, Plus, 
  BarChart3, Users, MapPin, Star, ArrowRight, Calendar, Leaf, Recycle, Target,
  ArrowLeft, Phone, MapPinned, MessageCircle, Edit, Download, Share,
  Scale, AlertCircle, Filter, Search, Eye, LogOut, Key, Copy,
  Bell, Lock, Globe, Smartphone, Mail, Shield, Info, ChevronRight,
  Home, Building2, Store, Droplets, Cpu, Box, Sparkles,
  User, FileText, Upload, Camera, Save, X, UserCheck, Timer, Route,
  Navigation, ThumbsUp, Award as AwardIcon, Wifi, Volume2, Moon, Sun,
  HelpCircle, CreditCard, Download as DownloadIcon, Upload as UploadIcon,
  LogOut as LogOutIcon, Trash2 as Trash2Icon, Fingerprint, MapPin as MapPinIcon,
  Menu, Settings as SettingsIcon, History, X as XIcon, Check, Play, Flag,
  Map, Navigation as NavigationIcon, DollarSign, Coins, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const CollecteurDashboard = () => {
  // ========== ÉTATS ==========
  const [currentUser, setCurrentUser] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showDepotModal, setShowDepotModal] = useState(false);
  const [pointsDepot, setPointsDepot] = useState([]);

  // Données du tableau de bord
  const [dashboardData, setDashboardData] = useState({
    totalMissions: 0,
    missionsValidees: 0,
    missionsEnCours: 0,
    totalDechets: 0,
    gainsTotal: 0,
    gainsEnAttente: 0,
    gainsValides: 0
  });

  // Missions
  const [missionsDisponibles, setMissionsDisponibles] = useState([]);
  const [mesMissions, setMesMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [missionFilter, setMissionFilter] = useState('tous');
  const [selectedPointDepot, setSelectedPointDepot] = useState('');

  // Formulaire de mission
  const [missionForm, setMissionForm] = useState({
    photoPreuve: null,
    codeConfirmation: '',
    notes: '',
    conformiteTri: 'true',
    pointDepotId: ''
  });

  // Formulaire de mise à jour profil
  const [profileForm, setProfileForm] = useState({
    nomComplet: '',
    telephone: '',
    zoneIntervention: '',
    quartiers: '',
    communes: ''
  });

  // Formulaire changement mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Gains
  const [gains, setGains] = useState([]);
  const [filteredGains, setFilteredGains] = useState([]);
  const [gainsFilter, setGainsFilter] = useState('all');

  // États UI
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '–' });

   const API_URL = 'https://ecobackend-7tuh.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  // ========== TYPES DE DÉCHETS ==========
  const wasteTypes = {
    'plastique': { label: 'Plastique', icon: '♻️', color: 'blue' },
    'plastique_pet': { label: 'Plastique PET', icon: '♻️', color: 'blue' },
    'plastique_pehd': { label: 'Plastique PEHD', icon: '♻️', color: 'blue' },
    'papier_carton': { label: 'Papier/Carton', icon: '📦', color: 'yellow' },
    'papier': { label: 'Papier', icon: '📄', color: 'yellow' },
    'carton': { label: 'Carton', icon: '📦', color: 'yellow' },
    'metal': { label: 'Métal', icon: '🔧', color: 'gray' },
    'verre': { label: 'Verre', icon: '🍾', color: 'green' },
    'organique': { label: 'Organique', icon: '🌱', color: 'orange' }
  };

  // ========== STATUTS ==========
  const getStatusColor = (status) => {
    const colors = {
      'disponible': 'blue',
      'acceptee': 'purple',
      'en_cours': 'orange',
      'deposee': 'amber',
      'validee': 'green',
      'terminee': 'green'
    };
    return colors[status] || 'gray';
  };

  const getStatusText = (status) => {
    const texts = {
      'disponible': 'Disponible',
      'acceptee': 'Acceptée',
      'en_cours': 'En cours',
      'deposee': 'Déposée',
      'validee': 'Validée',
      'terminee': 'Terminée'
    };
    return texts[status] || 'Inconnu';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'disponible': Clock,
      'acceptee': Check,
      'en_cours': Truck,
      'deposee': Map,
      'validee': CheckCircle,
      'terminee': CheckCircle
    };
    return icons[status] || Clock;
  };

  // ========== INITIALISATION ==========
  useEffect(() => {
    console.log('🔄 Initialisation du CollecteurDashboard');
    checkSession();
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  useEffect(() => {
    if (currentToken && currentUser) {
      loadCollecteurData();
    }
  }, [currentToken, currentUser]);

  useEffect(() => {
    filterMissions();
  }, [missionFilter, mesMissions, missionsDisponibles]);

  useEffect(() => {
    filterGains();
  }, [gainsFilter, gains]);

  const checkSession = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);

    if (!token || !userJson || role !== 'collecteur') {
      window.location.href = '/login';
      return;
    }

    try {
      const user = JSON.parse(userJson);
      setCurrentToken(token);
      setCurrentUser(user);
      startAutoRefresh();
    } catch (error) {
      clearSession();
    }
  };

  const startAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    const interval = setInterval(() => {
      if (activeSection === 'dashboard') {
        loadDashboard();
      } else if (activeSection === 'missions') {
        loadMissions();
      }
    }, 30000);
    setRefreshInterval(interval);
  };

  const clearSession = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    window.location.href = '/login';
  };

  const showMessage = (key, type, text) => {
    setMessages(prev => ({ ...prev, [key]: { type, text } }));
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[key];
        return newMessages;
      });
    }, 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      clearSession();
    }
  };

  // ========== CHARGEMENT DES DONNÉES ==========
  const loadCollecteurData = async () => {
    if (!currentToken) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadDashboard(),
        loadMissionsDisponibles(),
        loadMesMissions(),
        loadGains(),
        loadProfil(),
        loadPointsDepot()
      ]);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setIsLoading(false);
      setDataLoaded(true);
    }
  };

  const loadDashboard = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/tableau-bord`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const result = await response.json();
        const d = result.dashboard || {};
        
        setDashboardData({
          totalMissions: d.total_missions || 0,
          missionsValidees: d.missions_validees || 0,
          missionsEnCours: d.missions_en_cours || 0,
          totalDechets: d.total_dechets_collectes || 0,
          gainsTotal: 0,
          gainsEnAttente: 0,
          gainsValides: 0
        });
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    }
  };

  const loadMissionsDisponibles = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const result = await response.json();
        setMissionsDisponibles(result.missions || []);
      }
    } catch (error) {
      console.error('Erreur chargement missions disponibles:', error);
    }
  };

  const loadMesMissions = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/missions`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const result = await response.json();
        setMesMissions(result.missions || []);
      }
    } catch (error) {
      console.error('Erreur chargement mes missions:', error);
    }
  };

  const loadMissions = async () => {
    await Promise.all([
      loadMissionsDisponibles(),
      loadMesMissions()
    ]);
  };

  const loadGains = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/gains`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const result = await response.json();
        setGains(result.gains || []);
        
        setDashboardData(prev => ({
          ...prev,
          gainsTotal: result.resume?.total || 0,
          gainsValides: result.resume?.valides || 0,
          gainsEnAttente: result.resume?.enAttente || 0
        }));
      }
    } catch (error) {
      console.error('Erreur chargement gains:', error);
    }
  };

//   const loadProfil = async () => {
//     if (!currentToken || !currentUser) return;

//     setProfileForm({
//       nomComplet: currentUser.nomComplet || '',
//       telephone: currentUser.telephone || '',
//       zoneIntervention: currentUser.zoneIntervention || '',
//       quartiers: currentUser.quartiers || '',
//       communes: currentUser.communes || ''
//     });
//   };

// ========== VERSION AVEC DEBUG ==========
const loadProfil = async () => {
  if (!currentToken || !currentUser) return;

  try {
    console.log('📡 Chargement du profil...');
    const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('📦 Résultat brut:', result);
      
      const profil = result.collecteur || result;
      console.log('👤 Profil extrait:', profil);
      
      // Afficher les champs spécifiques
      console.log('🔍 zone_intervention_nom:', profil.zone_intervention_nom);
      console.log('🔍 quartiers_habituels:', profil.quartiers_habituels);
      console.log('🔍 communes_intervention:', profil.communes_intervention);
      
      // Construire l'objet utilisateur
      const updatedUser = {
        ...currentUser,
        id: profil.id || currentUser.id,
        nomComplet: profil.nom_complet || profil.nomComplet || currentUser.nomComplet,
        email: profil.email || currentUser.email,
        telephone: profil.telephone || currentUser.telephone,
        zoneIntervention: profil.zone_intervention_nom || '',
        quartiers: Array.isArray(profil.quartiers_habituels) 
          ? profil.quartiers_habituels.join(', ') 
          : (profil.quartiers_habituels || ''),
        communes: Array.isArray(profil.communes_intervention) 
          ? profil.communes_intervention.join(', ') 
          : (profil.communes_intervention || ''),
        typeCollecteur: profil.type_collecteur,
        statut: profil.statut,
        cree_le: profil.cree_le,
        photo_profil_url: profil.photo_profil_url
      };
      
      console.log('✅ Utilisateur mis à jour:', updatedUser);
      setCurrentUser(updatedUser);
      
      setProfileForm({
        nomComplet: updatedUser.nomComplet || '',
        telephone: updatedUser.telephone || '',
        zoneIntervention: updatedUser.zoneIntervention || '',
        quartiers: updatedUser.quartiers || '',
        communes: updatedUser.communes || ''
      });
    }
  } catch (error) {
    console.error('❌ Erreur chargement profil:', error);
  }
};
  const loadPointsDepot = async () => {
    try {
      const response = await fetch(`${API_URL}/api/points-depot`, {
        headers: currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}
      });

      if (response.ok) {
        const result = await response.json();
        setPointsDepot(result.points || []);
      }
    } catch (error) {
      console.error('Erreur chargement points dépôt:', error);
    }
  };

  // ========== FILTRES ==========
  const filterMissions = () => {
    if (missionFilter === 'tous') {
      setFilteredMissions([...missionsDisponibles, ...mesMissions]);
    } else if (missionFilter === 'disponibles') {
      setFilteredMissions(missionsDisponibles);
    } else {
      setFilteredMissions(mesMissions.filter(m => m.statut === missionFilter));
    }
  };

  const filterGains = () => {
    if (gainsFilter === 'all') {
      setFilteredGains(gains);
    } else {
      setFilteredGains(gains.filter(g => g.statut === gainsFilter));
    }
  };

  // ========== ACTIONS SUR LES MISSIONS ==========
  const handleMissionAction = async (action) => {
    if (!selectedMission) {
      showMessage('mission', 'error', 'Veuillez sélectionner une mission');
      return;
    }

    // Pour l'action terminer, vérifier le point de dépôt
    if (action === 'terminer') {
      if (!missionForm.pointDepotId) {
        showMessage('mission', 'error', 'Veuillez sélectionner un point de dépôt');
        setShowDepotModal(true);
        return;
      }

      // D'abord choisir le point de dépôt
      try {
        const depotResponse = await fetch(`${API_URL}/api/collecteurs/missions/${selectedMission.id}/depot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({ pointDepotId: missionForm.pointDepotId })
        });

        const depotResult = await depotResponse.json();
        if (!depotResult.success) {
          throw new Error(depotResult.message || 'Erreur choix point dépôt');
        }
      } catch (error) {
        showMessage('mission', 'error', error.message);
        return;
      }
    }

    // Ensuite exécuter l'action
    let url = '';
    let body = {};

    switch(action) {
      case 'accepter':
        url = `${API_URL}/api/collecteurs/missions/${selectedMission.id}/accepter`;
        break;
      case 'demarrer':
        url = `${API_URL}/api/collecteurs/missions/${selectedMission.id}/demarrer`;
        break;
      case 'terminer':
        url = `${API_URL}/api/collecteurs/missions/${selectedMission.id}/terminer`;
        body = {
          photoPreuveUrl: missionForm.photoPreuve,
          codeConfirmation: missionForm.codeConfirmation,
          notes: missionForm.notes,
          conformiteTri: missionForm.conformiteTri === 'true'
        };
        break;
    }

    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined
      });

      const result = await response.json();

      if (result.success) {
        showMessage('mission', 'success', 'Action effectuée avec succès');
        await loadMissions();
        await loadDashboard();
        await loadGains();
        setSelectedMission(null);
        setShowMissionModal(false);
        setShowDepotModal(false);
        setMissionForm({
          photoPreuve: null,
          codeConfirmation: '',
          notes: '',
          conformiteTri: 'true',
          pointDepotId: ''
        });
      } else {
        throw new Error(result.message || 'Erreur');
      }
    } catch (error) {
      showMessage('mission', 'error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openMissionModal = (mission) => {
    setSelectedMission(mission);
    setShowMissionModal(true);
  };

  const openDepotModal = (mission) => {
    setSelectedMission(mission);
    setShowDepotModal(true);
  };

  // ========== MISE À JOUR PROFIL ==========
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentToken) return;

    const { nomComplet, telephone, zoneIntervention, quartiers, communes } = profileForm;

    if (!nomComplet || !telephone) {
      showMessage('profile', 'error', 'Le nom complet et le téléphone sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil/infos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          nomComplet,
          telephone,
          zoneInterventionNom: zoneIntervention,
          quartiersHabituels: quartiers.split(',').map(q => q.trim()).filter(q => q),
          communesIntervention: communes.split(',').map(c => c.trim()).filter(c => c)
        })
      });

      const result = await response.json();

      if (result.success) {
        const updatedUser = { ...currentUser, nomComplet, telephone };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        showMessage('profile', 'success', 'Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        throw new Error(result.message || 'Erreur mise à jour');
      }
    } catch (error) {
      showMessage('profile', 'error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== CHANGEMENT MOT DE PASSE ==========
  const checkPasswordStrength = (password) => {
    let score = 0;
    let label = 'Faible';

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score === 0) label = '–';
    else if (score <= 1) label = 'Faible';
    else if (score === 2) label = 'Moyen';
    else if (score === 3) label = 'Bon';
    else if (score === 4) label = 'Fort';

    setPasswordStrength({ score, label });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentToken) return;

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage('password', 'error', 'Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('password', 'error', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('password', 'error', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/collecteurs/profil/mot-de-passe`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          ancienMotDePasse: currentPassword,
          nouveauMotDePasse: newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        showMessage('password', 'success', 'Mot de passe changé avec succès');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordFields(false);
      } else {
        throw new Error(result.message || 'Erreur changement mot de passe');
      }
    } catch (error) {
      showMessage('password', 'error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== FORMATAGE ==========
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatWasteType = (type) => {
    return wasteTypes[type]?.label || type || 'Non spécifié';
  };

  const formatGainStatus = (status) => {
    const texts = {
      'valide': 'Validé',
      'en_attente': 'En attente',
      'en_attente_validation': 'En attente'
    };
    return texts[status] || status || 'Inconnu';
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 1) return '#dc2626';
    if (passwordStrength.score === 2) return '#e0a020';
    if (passwordStrength.score >= 3) return '#2d8a5e';
    return '#d9e0d9';
  };

  // ========== SIDEBAR MENU ITEMS ==========
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: Package,
      badge: missionsDisponibles.length,
      badgeColor: 'blue'
    },
    {
      id: 'gains',
      label: 'Mes gains',
      icon: Coins,
      badge: dashboardData.gainsTotal ? `${dashboardData.gainsTotal} FCFA` : null,
      badgeColor: 'green'
    },
    {
      id: 'historique',
      label: 'Historique',
      icon: History,
      badge: null
    }
  ];

  const secondaryMenuItems = [
    {
      id: 'profile',
      label: 'Mon profil',
      icon: User,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec menu burger pour mobile */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <img src={logo} alt="EcoCollect" className="h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(currentUser?.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(false)}
        currentPage={activeSection}
        setActivePage={setActiveSection}
        menuItems={menuItems}
        secondaryMenuItems={secondaryMenuItems}
        currentUser={currentUser}
        getInitials={getInitials}
        handleLogout={handleLogout}
        role="collecteur"
      />

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Messages */}
          {Object.entries(messages).map(([key, msg]) => (
            <div key={key} className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
              msg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {msg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
               msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
               <Info className="w-5 h-5" />}
              {msg.text}
            </div>
          ))}

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="mb-4 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
              Chargement en cours...
            </div>
          )}

          {/* Section Tableau de bord */}
          {activeSection === 'dashboard' && (
            <Dashboard 
              currentUser={currentUser}
              dashboardData={dashboardData}
              missionsDisponibles={missionsDisponibles}
              mesMissions={mesMissions}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              openMissionModal={openMissionModal}
              openDepotModal={openDepotModal}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
              dataLoaded={dataLoaded}
              setActiveSection={setActiveSection}
            />
          )}

          {/* Section Missions */}
          {activeSection === 'missions' && (
            <MissionsSection
              missionsDisponibles={missionsDisponibles}
              mesMissions={mesMissions}
              filteredMissions={filteredMissions}
              missionFilter={missionFilter}
              setMissionFilter={setMissionFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loadMissions={loadMissions}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              openMissionModal={openMissionModal}
              openDepotModal={openDepotModal}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
            />
          )}

          {/* Section Gains */}
          {activeSection === 'gains' && (
            <GainsSection
              gains={filteredGains}
              gainsTotal={dashboardData.gainsTotal}
              gainsValides={dashboardData.gainsValides}
              gainsEnAttente={dashboardData.gainsEnAttente}
              gainsFilter={gainsFilter}
              setGainsFilter={setGainsFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loadGains={loadGains}
              formatDate={formatDate}
              formatGainStatus={formatGainStatus}
              isLoading={isLoading}
            />
          )}

          {/* Section Historique */}
          {activeSection === 'historique' && (
            <HistoriqueSection
              missions={mesMissions.filter(m => m.statut === 'validee' || m.statut === 'terminee')}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              missionFilter={missionFilter}
              setMissionFilter={setMissionFilter}
              loadMissions={loadMissions}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
            />
          )}

          {/* Section Profil */}
          {activeSection === 'profile' && (
            <ProfileSection
              currentUser={currentUser}
              dashboardData={dashboardData}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isLoading={isLoading}
              handleUpdateProfile={handleUpdateProfile}
              showPasswordFields={showPasswordFields}
              setShowPasswordFields={setShowPasswordFields}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              passwordStrength={passwordStrength}
              getStrengthColor={getStrengthColor}
              handleChangePassword={handleChangePassword}
              copyToken={() => {
                navigator.clipboard.writeText(currentToken || '');
                showMessage('token', 'success', 'Token copié !');
              }}
              currentToken={currentToken}
              formatDate={formatDate}
              handleLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Modal Mission */}
      {showMissionModal && selectedMission && (
        <MissionModal
          mission={selectedMission}
          missionForm={missionForm}
          setMissionForm={setMissionForm}
          handleAction={handleMissionAction}
          isLoading={isLoading}
          onClose={() => {
            setShowMissionModal(false);
            setSelectedMission(null);
            setMissionForm({
              photoPreuve: null,
              codeConfirmation: '',
              notes: '',
              conformiteTri: 'true',
              pointDepotId: ''
            });
          }}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatWasteType={formatWasteType}
          wasteTypes={wasteTypes}
        />
      )}

      {/* Modal Choix Point Dépôt */}
      {showDepotModal && selectedMission && (
        <DepotModal
          pointsDepot={pointsDepot}
          selectedPoint={selectedPointDepot}
          setSelectedPoint={setSelectedPointDepot}
          missionForm={missionForm}
          setMissionForm={setMissionForm}
          handleValidate={() => {
            if (missionForm.pointDepotId) {
              handleMissionAction('terminer');
            } else {
              showMessage('depot', 'error', 'Veuillez sélectionner un point de dépôt');
            }
          }}
          isLoading={isLoading}
          onClose={() => {
            setShowDepotModal(false);
            setSelectedMission(null);
          }}
        />
      )}
    </div>
  );
};

// ========== COMPOSANT SIDEBAR ==========
const Sidebar = ({ isOpen, toggleSidebar, currentPage, setActivePage, menuItems, secondaryMenuItems, currentUser, getInitials, handleLogout, role }) => {
  const roleColor = role === 'collecteur' ? 'blue' : role === 'gestionnaire' ? 'green' : 'purple';
  
  const handleItemClick = (item) => {
    setActivePage(item.id);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={toggleSidebar}
        />
        
        <div className={`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className={`bg-gradient-to-r from-${roleColor}-600 to-${roleColor}-700 p-6`}>
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${roleColor}-600 rounded-full flex items-center justify-center text-white font-semibold`}>
                {getInitials(currentUser?.nomComplet)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.nomComplet || 'Collecteur'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'collecteur@ecocollect.cm'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Principal
              </h3>
              <ul className="space-y-2">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                          isActive 
                            ? `bg-${roleColor}-50 text-${roleColor}-700 border-l-4 border-${roleColor}-600` 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? `text-${roleColor}-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${item.badgeColor}-100 text-${item.badgeColor}-700`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Compte
              </h3>
              <ul className="space-y-2">
                {secondaryMenuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                          isActive 
                            ? `bg-${roleColor}-50 text-${roleColor}-700 border-l-4 border-${roleColor}-600` 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? `text-${roleColor}-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-auto p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col`}>
        <div className={`bg-gradient-to-r from-${roleColor}-600 to-${roleColor}-700 p-6`}>
          <div className="flex items-center gap-2">
            <Truck className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">EcoCollect</span>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${roleColor}-600 rounded-full flex items-center justify-center text-white font-semibold`}>
              {getInitials(currentUser?.nomComplet)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser?.nomComplet || 'Collecteur'}</p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'collecteur@ecocollect.cm'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Principal
            </h3>
            <ul className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                        isActive 
                          ? `bg-${roleColor}-50 text-${roleColor}-700 border-l-4 border-${roleColor}-600` 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? `text-${roleColor}-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${item.badgeColor}-100 text-${item.badgeColor}-700`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Compte
            </h3>
            <ul className="space-y-1">
              {secondaryMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
                        isActive 
                          ? `bg-${roleColor}-50 text-${roleColor}-700 border-l-4 border-${roleColor}-600` 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? `text-${roleColor}-600` : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-auto p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
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

// ========== COMPOSANT TABLEAU DE BORD ==========
const Dashboard = ({ currentUser, dashboardData, missionsDisponibles, mesMissions, getStatusColor, getStatusText, getStatusIcon, formatDate, formatWasteType, openMissionModal, openDepotModal, wasteTypes, isLoading, dataLoaded, setActiveSection }) => {
  
  const missionsEnCours = mesMissions.filter(m => m.statut === 'en_cours');
  const missionEnCours = missionsEnCours[0];

  return (
    <div>
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Bienvenue, {currentUser?.nomComplet?.split(' ')[0] || 'Collecteur'} !
              </h2>
              <p className="text-blue-100">
                Prêt à collecter aujourd'hui ? Des missions vous attendent.
              </p>
            </div>
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <div className="text-sm text-blue-100 mb-1">Missions disponibles</div>
                <div className="text-3xl font-bold">{missionsDisponibles.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{dashboardData.totalMissions}</span>
          </div>
          <p className="text-gray-600 font-medium">Missions totales</p>
          <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{dashboardData.missionsValidees}</span>
          </div>
          <p className="text-gray-600 font-medium">Missions validées</p>
          <p className="text-sm text-gray-500 mt-1">Terminées avec succès</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{dashboardData.missionsEnCours}</span>
          </div>
          <p className="text-gray-600 font-medium">Missions en cours</p>
          <p className="text-sm text-gray-500 mt-1">À terminer</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{dashboardData.totalDechets} kg</span>
          </div>
          <p className="text-gray-600 font-medium">Déchets collectés</p>
          <p className="text-sm text-gray-500 mt-1">Poids total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Missions en cours
                </h2>
                <button 
                  onClick={() => setActiveSection('missions')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir tout
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mesMissions.filter(m => m.statut === 'en_cours' || m.statut === 'acceptee').length > 0 ? (
                mesMissions
                  .filter(m => m.statut === 'en_cours' || m.statut === 'acceptee')
                  .slice(0, 3)
                  .map(mission => {
                    const StatusIcon = getStatusIcon(mission.statut);
                    const statusColor = getStatusColor(mission.statut);
                    
                    return (
                      <div key={mission.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                #{mission.id?.substring(0, 8)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                {getStatusText(mission.statut)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-lg">{wasteTypes[mission.type_dechet]?.icon || '📦'}</span>
                              <span className="text-sm font-medium text-gray-700">
                                {mission.quantite || 0} {mission.unite || 'kg'}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {mission.producteur_adresse || 'Adresse non spécifiée'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(mission.date_creation)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {mission.statut === 'acceptee' && (
                              <button
                                onClick={() => openMissionModal(mission)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                Démarrer
                              </button>
                            )}
                            {mission.statut === 'en_cours' && (
                              <button
                                onClick={() => openDepotModal(mission)}
                                className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                              >
                                Terminer
                              </button>
                            )}
                            <button
                              onClick={() => openMissionModal(mission)}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Aucune mission en cours
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-600" />
              Mes gains
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-gray-900">{dashboardData.gainsTotal} FCFA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-green-700">Validés</span>
                <span className="text-lg font-semibold text-green-700">{dashboardData.gainsValides} FCFA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="text-orange-700">En attente</span>
                <span className="text-lg font-semibold text-orange-700">{dashboardData.gainsEnAttente} FCFA</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Missions disponibles
            </h2>
            
            <div className="text-center py-2">
              <div className="text-4xl font-bold text-blue-600 mb-2">{missionsDisponibles.length}</div>
              <p className="text-gray-600">En attente de collecte</p>
            </div>
            
            <button
              onClick={() => setActiveSection('missions')}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Voir les missions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// ========== COMPOSANT MISSIONS AMÉLIORÉ AVEC ONGLETS ET PAGINATION ==========
const MissionsSection = ({ 
  missionsDisponibles, 
  mesMissions, 
  missionFilter, 
  setMissionFilter, 
  searchTerm, 
  setSearchTerm, 
  loadMissions, 
  getStatusColor, 
  getStatusText, 
  formatDate, 
  formatWasteType, 
  openMissionModal, 
  openDepotModal, 
  wasteTypes, 
  isLoading 
}) => {
  
  const [activeTab, setActiveTab] = useState('disponibles'); // 'disponibles' ou 'mes-missions'
  
  // Pagination
  const [currentPageDisponibles, setCurrentPageDisponibles] = useState(1);
  const [currentPageMesMissions, setCurrentPageMesMissions] = useState(1);
  const itemsPerPage = 12;

  // Filtrer les missions disponibles
  const filteredDisponibles = missionsDisponibles.filter(mission => 
    mission.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.producteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatWasteType(mission.type_dechet)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrer mes missions
  const filteredMesMissions = mesMissions.filter(mission => 
    mission.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.producteur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formatWasteType(mission.type_dechet)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination pour les disponibles
  const indexOfLastDisponible = currentPageDisponibles * itemsPerPage;
  const indexOfFirstDisponible = indexOfLastDisponible - itemsPerPage;
  const currentDisponibles = filteredDisponibles.slice(indexOfFirstDisponible, indexOfLastDisponible);
  const totalPagesDisponibles = Math.ceil(filteredDisponibles.length / itemsPerPage);

  // Pagination pour mes missions
  const indexOfLastMesMission = currentPageMesMissions * itemsPerPage;
  const indexOfFirstMesMission = indexOfLastMesMission - itemsPerPage;
  const currentMesMissions = filteredMesMissions.slice(indexOfFirstMesMission, indexOfLastMesMission);
  const totalPagesMesMissions = Math.ceil(filteredMesMissions.length / itemsPerPage);

  // Réinitialiser la pagination quand on change d'onglet ou de recherche
  useEffect(() => {
    setCurrentPageDisponibles(1);
    setCurrentPageMesMissions(1);
  }, [searchTerm, activeTab]);

  // Composant de pagination
  const Pagination = ({ currentPage, totalPages, onPageChange, color = "blue" }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 mt-6 pb-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Afficher max 5 pages
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[36px] h-9 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? `bg-${color}-600 text-white`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (
              page === currentPage - 3 ||
              page === currentPage + 3
            ) {
              return <span key={page} className="text-gray-400 px-1">...</span>;
            }
            return null;
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Missions
        </h1>
        <button
          onClick={loadMissions}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro, producteur, type de déchet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('disponibles')}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === 'disponibles'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Missions disponibles
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'disponibles'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filteredDisponibles.length}
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('mes-missions')}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === 'mes-missions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Mes missions
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'mes-missions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {filteredMesMissions.length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'disponibles' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {currentDisponibles.length > 0 ? (
              currentDisponibles.map(mission => (
                <div 
                  key={mission.id} 
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openMissionModal(mission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{mission.id?.substring(0, 8)}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatWasteType(mission.type_dechet)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          {mission.producteur_nom || 'Inconnu'}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Scale className="w-4 h-4 text-gray-400" />
                          {mission.quantite || 0} {mission.unite || 'kg'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {mission.producteur_adresse || 'Adresse non spécifiée'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(mission.date_creation)}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openMissionModal(mission);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isLoading ? 'Chargement des missions...' : 'Aucune mission disponible'}
                </p>
              </div>
            )}
          </div>
          
          <Pagination 
            currentPage={currentPageDisponibles}
            totalPages={totalPagesDisponibles}
            onPageChange={setCurrentPageDisponibles}
            color="blue"
          />
        </div>
      )}

      {activeTab === 'mes-missions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {currentMesMissions.length > 0 ? (
              currentMesMissions.map(mission => {
                const statusColor = getStatusColor(mission.statut);
                
                return (
                  <div 
                    key={mission.id} 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => openMissionModal(mission)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{mission.id?.substring(0, 8)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                            {getStatusText(mission.statut)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            {mission.producteur_nom || 'Inconnu'}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Scale className="w-4 h-4 text-gray-400" />
                            {mission.quantite || 0} {mission.unite || 'kg'}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {mission.producteur_adresse || 'Adresse non spécifiée'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(mission.date_creation)}
                          </div>
                        </div>
                        
                        {mission.poids_depose && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
                            <span className="text-green-600">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Déposé: {mission.poids_depose} kg
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {mission.statut === 'acceptee' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); openMissionModal(mission); }}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Démarrer
                          </button>
                        )}
                        {mission.statut === 'en_cours' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); openDepotModal(mission); }}
                            className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                          >
                            Terminer
                          </button>
                        )}
                        {mission.statut === 'deposee' && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm whitespace-nowrap">
                            En validation
                          </span>
                        )}
                        {mission.statut === 'validee' && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm whitespace-nowrap">
                            Validée
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {isLoading ? 'Chargement de vos missions...' : 'Vous n\'avez aucune mission'}
                </p>
              </div>
            )}
          </div>
          
          <Pagination 
            currentPage={currentPageMesMissions}
            totalPages={totalPagesMesMissions}
            onPageChange={setCurrentPageMesMissions}
            color="blue"
          />
        </div>
      )}
    </div>
  );
};

// ========== COMPOSANT GAINS ==========
const GainsSection = ({ gains, gainsTotal, gainsValides, gainsEnAttente, gainsFilter, setGainsFilter, searchTerm, setSearchTerm, loadGains, formatDate, formatGainStatus, isLoading }) => {
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Coins className="w-6 h-6 text-blue-600" />
          Mes gains
        </h1>
        <button
          onClick={loadGains}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Coins className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{gainsTotal} FCFA</span>
          </div>
          <p className="text-gray-600 font-medium">Gains totaux</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{gainsValides} FCFA</span>
          </div>
          <p className="text-gray-600 font-medium">Gains validés</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{gainsEnAttente} FCFA</span>
          </div>
          <p className="text-gray-600 font-medium">En attente</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={gainsFilter}
            onChange={(e) => setGainsFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les gains</option>
            <option value="valide">Validés</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {gains.length > 0 ? (
            gains.map(gain => (
              <div key={gain.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{gain.mission_id?.substring(0, 8)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${gain.statut === 'valide' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {formatGainStatus(gain.statut)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{gain.montant} FCFA</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(gain.cree_le)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Type: {gain.type_gain || 'Mission'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isLoading ? 'Chargement des gains...' : 'Aucun gain pour le moment'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT HISTORIQUE ==========
const HistoriqueSection = ({ missions, searchTerm, setSearchTerm, missionFilter, setMissionFilter, loadMissions, getStatusColor, getStatusText, formatDate, formatWasteType, wasteTypes, isLoading }) => {
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <History className="w-6 h-6 text-blue-600" />
        Historique des missions
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={loadMissions}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <History className="w-4 h-4" />
            Actualiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {missions.length > 0 ? (
            missions.map(mission => {
              const statusColor = getStatusColor(mission.statut);
              
              return (
                <div key={mission.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{mission.id?.substring(0, 8)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                          {getStatusText(mission.statut)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-lg">{wasteTypes[mission.type_dechet]?.icon || '📦'}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {mission.quantite || 0} {mission.unite || 'kg'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(mission.date_creation)}
                        </div>
                        
                        {mission.producteur_nom && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {mission.producteur_nom}
                          </div>
                        )}
                      </div>
                      
                      {mission.statut === 'validee' && mission.poids_depose && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Poids déposé: {mission.poids_depose} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isLoading ? 'Chargement de l\'historique...' : 'Aucun historique trouvé'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT MODAL MISSION ==========
const MissionModal = ({ mission, missionForm, setMissionForm, handleAction, isLoading, onClose, getStatusColor, getStatusText, formatWasteType, wasteTypes }) => {
  
  const canAccepter = mission.statut === 'disponible';
  const canDemarrer = mission.statut === 'acceptee';
  const canTerminer = mission.statut === 'en_cours';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Gestion de la mission</h2>
              <p className="text-gray-600">#{mission.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full bg-${getStatusColor(mission.statut)}-100 text-${getStatusColor(mission.statut)}-800 font-medium`}>
              {getStatusText(mission.statut)}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Informations de la mission
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Type de déchet</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg">{wasteTypes[mission.type_dechet]?.icon || '📦'}</span>
                  <span className="font-medium text-gray-900">
                    {formatWasteType(mission.type_dechet)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Quantité estimée</p>
                <div className="flex items-center gap-2 mt-1">
                  <Scale className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {mission.quantite || 0} {mission.unite || 'kg'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Producteur</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {mission.producteur_nom || 'Inconnu'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Adresse</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {mission.producteur_adresse || 'Non spécifiée'}
                  </span>
                </div>
              </div>
              
              {mission.producteur_telephone && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {mission.producteur_telephone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {(canTerminer) && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pt-4 border-t">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Finaliser la collecte
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo preuve (URL)
                    </label>
                    <input
                      type="url"
                      value={missionForm.photoPreuve}
                      onChange={(e) => setMissionForm({...missionForm, photoPreuve: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code confirmation
                    </label>
                    <input
                      type="text"
                      value={missionForm.codeConfirmation}
                      onChange={(e) => setMissionForm({...missionForm, codeConfirmation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Code reçu"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conformité tri
                    </label>
                    <select
                      value={missionForm.conformiteTri}
                      onChange={(e) => setMissionForm({...missionForm, conformiteTri: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Conforme</option>
                      <option value="false">Non conforme</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows="3"
                      value={missionForm.notes}
                      onChange={(e) => setMissionForm({...missionForm, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Observations..."
                    ></textarea>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            
            {canAccepter && (
              <button
                onClick={() => handleAction('accepter')}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accepter la mission
              </button>
            )}
            
            {canDemarrer && (
              <button
                onClick={() => handleAction('demarrer')}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Démarrer la collecte
              </button>
            )}
            
            {canTerminer && (
              <button
                onClick={() => handleAction('terminer')}
                disabled={isLoading}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Terminer la collecte
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT MODAL CHOIX POINT DÉPÔT (VERSION CORRIGÉE) ==========
const DepotModal = ({ pointsDepot, missionForm, setMissionForm, handleValidate, isLoading, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtrer les points de dépôt
  const filteredPoints = pointsDepot.filter(point => 
    point.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.adresse?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.ville?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header - fixe */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Choisir un point de dépôt
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Sélectionnez le point de dépôt où vous allez apporter les déchets
          </p>
          
          {/* Barre de recherche */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un point de dépôt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des points - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-[200px] max-h-[400px]">
          {filteredPoints.length > 0 ? (
            filteredPoints.map(point => (
              <label
                key={point.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  missionForm.pointDepotId === point.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="pointDepot"
                  value={point.id}
                  checked={missionForm.pointDepotId === point.id}
                  onChange={(e) => setMissionForm({...missionForm, pointDepotId: e.target.value})}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{point.nom}</h4>
                    {missionForm.pointDepotId === point.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{point.adresse}</p>
                  {point.ville && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {point.ville}
                    </p>
                  )}
                </div>
              </label>
            ))
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun point de dépôt trouvé</p>
            </div>
          )}
        </div>

        {/* Footer - fixe avec boutons */}
        <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={isLoading || !missionForm.pointDepotId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Valider et terminer
                </>
              )}
            </button>
          </div>
          
          {/* Indicateur de sélection */}
          {missionForm.pointDepotId && (
            <p className="text-xs text-green-600 mt-3 text-center">
              ✓ Point de dépôt sélectionné. Cliquez sur "Valider et terminer" pour finaliser.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


// ========== COMPOSANT PROFIL ==========
const ProfileSection = ({ 
  currentUser, dashboardData, profileForm, setProfileForm, isEditing, setIsEditing,
  isLoading, handleUpdateProfile, showPasswordFields, setShowPasswordFields,
  passwordForm, setPasswordForm, passwordStrength, getStrengthColor,
  handleChangePassword, copyToken, currentToken, formatDate, handleLogout
}) => {
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        Mon Compte
      </h1>

      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                {currentUser?.nomComplet}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <Truck className="h-4 w-4" />
                  Collecteur
                </span>
              </h1>
              <p className="text-white/90 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg"
              >
                <Edit className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span className="font-medium">Modifier le profil</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-blue-600 transition-all hover:bg-blue-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span className="font-medium">Enregistrer</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/30 p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Missions totales</p>
                <p className="text-xl font-bold">{dashboardData.totalMissions}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/30 p-2">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Déchets collectés</p>
                <p className="text-xl font-bold">{dashboardData.totalDechets} kg</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/30 p-2">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Gains totaux</p>
                <p className="text-xl font-bold">{dashboardData.gainsTotal} FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informations personnelles
            </h3>
            
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-900">{currentUser?.nomComplet || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{currentUser?.email || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-900">{currentUser?.telephone || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Zone d'intervention</p>
                  <p className="font-medium text-gray-900">{currentUser?.zoneIntervention || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Quartiers</p>
                  <p className="font-medium text-gray-900">{currentUser?.quartiers || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Communes</p>
                  <p className="font-medium text-gray-900">{currentUser?.communes || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-medium text-gray-900">{currentUser?.cree_le ? formatDate(currentUser.cree_le) : '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {currentUser?.statut === 'actif' ? 'Actif' : 'En attente'}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={profileForm.nomComplet}
                      onChange={(e) => setProfileForm({...profileForm, nomComplet: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.telephone}
                      onChange={(e) => setProfileForm({...profileForm, telephone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone d'intervention
                  </label>
                  <input
                    type="text"
                    value={profileForm.zoneIntervention}
                    onChange={(e) => setProfileForm({...profileForm, zoneIntervention: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quartiers (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={profileForm.quartiers}
                    onChange={(e) => setProfileForm({...profileForm, quartiers: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Akwa, Bonanjo, Bali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communes (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={profileForm.communes}
                    onChange={(e) => setProfileForm({...profileForm, communes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Douala 1, Douala 3"
                  />
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Sécurité
              </h3>
              <button
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {showPasswordFields ? 'Annuler' : 'Changer le mot de passe'}
              </button>
            </div>

            {showPasswordFields && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({...passwordForm, newPassword: e.target.value});
                        // Password strength check would go here
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength="8"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      minLength="8"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Changement...' : 'Changer le mot de passe'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Token JWT
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <code className="flex-1 font-mono text-sm break-all">
                {currentToken ? (currentToken.length > 50 ? currentToken.substring(0, 50) + '...' : currentToken) : 'Non connecté'}
              </code>
              <button
                onClick={copyToken}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copier
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </h3>
            <p className="text-sm text-red-800 mb-4">
              Vous pouvez vous déconnecter de votre session actuelle.
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollecteurDashboard;