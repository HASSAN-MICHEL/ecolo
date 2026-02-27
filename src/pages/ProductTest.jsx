import React, { useState, useEffect } from 'react';
import { 
  Trash2, Package, Clock, CheckCircle, TrendingUp, Award, Plus, 
  BarChart3, Users, MapPin, Star, ArrowRight, Calendar, Leaf, Recycle, Target,
  ArrowLeft, Phone, MapPinned, MessageCircle, Edit, Download, Share,
  Scale, AlertCircle, Filter, Search, Eye, LogOut, Key, Copy,
  Bell, Lock, Globe, Smartphone, Mail, Shield, Info, ChevronRight,
  Home, Building2, Store, Droplets, Cpu, Box, Truck, Sparkles,
  User, FileText, Upload, Camera, Save, X, UserCheck, Timer, Route,
  Navigation, ThumbsUp, Award as AwardIcon, Wifi, Volume2, Moon, Sun,
  HelpCircle, CreditCard, Download as DownloadIcon, Upload as UploadIcon,
  LogOut as LogOutIcon, Trash2 as Trash2Icon, Fingerprint, MapPin as MapPinIcon
} from 'lucide-react';
import logo from './logo.jpeg';

const ProducteurDashboard = () => {
  // ========== ÉTATS ==========
  const [currentUser, setCurrentUser] = useState(null);
  const [currentToken, setCurrentToken] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Données du tableau de bord
  const [dashboardData, setDashboardData] = useState({
    points: 0,
    totalDeclarations: 0,
    pendingCollections: 0,
    completedCollections: 0,
    totalWaste: 0,
    totalPointsEarned: 0
  });

  // Déclarations
  const [declarations, setDeclarations] = useState([]);
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
  const [declarationFilter, setDeclarationFilter] = useState('all');
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showDeclarationForm, setShowDeclarationForm] = useState(false);
  const [declarationStats, setDeclarationStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    totalWeight: 0,
    totalPoints: 0
  });

  // Formulaire de déclaration
  const [declarationForm, setDeclarationForm] = useState({
    typeDechet: '',
    quantite: '',
    unite: 'kg',
    modeCollecte: '',
    dateSouhaitee: '',
    creneauHoraire: '',
    notes: '',
    photos: []
  });

  // Formulaire de mise à jour profil
  const [profileForm, setProfileForm] = useState({
    nomComplet: '',
    telephone: '',
    adresse: '',
    quartier: '',
    commune: ''
  });

  // Formulaire changement mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Historique récent
  const [recentDeclarations, setRecentDeclarations] = useState([]);

  // Points de dépôt
  const [depotPoints, setDepotPoints] = useState([]);

  // États UI
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // ========== CONFIGURATION ==========
  const API_URL = 'https://ecobackend-three.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  // ========== TYPES DE DÉCHETS ==========
  const wasteTypes = {
    'plastique_pet': { label: 'Plastique PET', icon: '♻️', color: 'blue' },
    'plastique_pehd': { label: 'Plastique PEHD', icon: '♻️', color: 'blue' },
    'papier_carton': { label: 'Papier/Carton', icon: '📦', color: 'yellow' },
    'metal': { label: 'Métal', icon: '🔧', color: 'gray' },
    'verre': { label: 'Verre', icon: '🍾', color: 'green' },
    'organique': { label: 'Organique', icon: '🌱', color: 'orange' }
  };

  // ========== MODES DE COLLECTE ==========
  const collectionModes = {
    'collecte_domicile': 'À domicile',
    'depot_volontaire': 'Dépôt volontaire'
  };

  // ========== STATUTS ==========
  const getStatusColor = (status) => {
    const colors = {
      pending: 'amber',
      assigned: 'blue',
      scheduled: 'purple',
      in_progress: 'orange',
      completed: 'green',
      termine: 'green',
      terminee: 'green',
      validee: 'green',
      en_attente: 'amber',
      affecte: 'blue',
      affectee: 'blue',
      programme: 'purple',
      programmee: 'purple',
      en_cours: 'orange',
      annule: 'red',
      annulee: 'red'
    };
    return colors[status] || 'gray';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      assigned: 'Assigné',
      scheduled: 'Programmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      termine: 'Terminé',
      terminee: 'Terminée',
      validee: 'Validée',
      en_attente: 'En attente',
      en_attente_affectation: 'En attente',
      en_attente_collecte: 'En attente',
      affecte: 'Collecteur affecté',
      affectee: 'Collecteur affecté',
      collecteur_affecte: 'Collecteur affecté',
      programme: 'Programmée',
      programmee: 'Programmée',
      en_cours: 'En cours',
      annule: 'Annulée',
      annulee: 'Annulée'
    };
    return texts[status] || 'Inconnu';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      assigned: Users,
      scheduled: Calendar,
      in_progress: Package,
      completed: CheckCircle,
      termine: CheckCircle,
      terminee: CheckCircle,
      validee: CheckCircle,
      en_attente: Clock,
      affecte: Users,
      affectee: Users,
      programme: Calendar,
      programmee: Calendar,
      en_cours: Truck,
      annule: X,
      annulee: X
    };
    return icons[status] || Clock;
  };

  // ========== INITIALISATION ==========
  useEffect(() => {
    checkSession();
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  const checkSession = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);

    if (!token || !userJson || role !== 'producteur') {
      window.location.href = '/login';
      return;
    }

    try {
      const user = JSON.parse(userJson);
      setCurrentToken(token);
      setCurrentUser(user);
      
      // Charger les données
      loadDashboard();
      loadDeclarations();
      loadNotifications();
      loadProfile();
      loadDepotPoints();
      
      // Démarrer l'auto-raffraîchissement
      startAutoRefresh();
    } catch (error) {
      console.error('Erreur session:', error);
      clearSession();
    }
  };

  const startAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    const interval = setInterval(() => {
      if (activeSection === 'dashboard') {
        loadDashboard();
      } else if (activeSection === 'declarations') {
        loadDeclarations();
      }
    }, 30000);
    setRefreshInterval(interval);
  };

  // ========== GESTION DE SESSION ==========
  const clearSession = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    window.location.href = '/login';
  };

  // ========== MESSAGES ==========
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

  // ========== NAVIGATION ==========
  const showSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // Charger les données si nécessaire
    if (sectionId === 'dashboard') {
      loadDashboard();
    } else if (sectionId === 'declarations') {
      loadDeclarations();
    } else if (sectionId === 'profile') {
      loadProfile();
    } else if (sectionId === 'depot') {
      loadDepotPoints();
    }
  };

  // ========== DÉCONNEXION ==========
  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      clearSession();
    }
  };

  // ========== TABLEAU DE BORD ==========
  const loadDashboard = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/declarations`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        let declarations = data.declarations || data;
        
        if (!Array.isArray(declarations)) {
          declarations = [];
        }

        declarations = declarations.map(d => ({
          ...d,
          statut: (d.statut || '').toLowerCase().trim()
        }));

        const totalDeclarations = declarations.length;
        const pendingCollections = declarations.filter(d => 
          d.statut === 'en_attente' || d.statut === 'en_attente_affectation' || d.statut === 'en_attente_collecte'
        ).length;
        const completedCollections = declarations.filter(d => 
          d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee'
        ).length;
        const inProgress = declarations.filter(d => 
          d.statut === 'en_cours' || d.statut === 'affecte' || d.statut === 'programme'
        ).length;
        
        const totalWaste = declarations
          .filter(d => d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee')
          .reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0);

        const totalPoints = declarations
          .filter(d => d.points)
          .reduce((sum, d) => sum + (parseInt(d.points) || 0), 0);

        setDashboardData({
          points: currentUser?.points || 0,
          totalDeclarations,
          pendingCollections,
          completedCollections,
          totalWaste: totalWaste.toFixed(1),
          totalPointsEarned: totalPoints
        });

        setRecentDeclarations(declarations.slice(0, 5));
      }
    } catch (error) {
      console.error('Erreur dashboard:', error);
    }
  };

  // ========== DÉCLARATIONS ==========
  const handleNewDeclaration = async (e) => {
    e.preventDefault();
    if (!currentToken) {
      showMessage('declaration', 'error', 'Vous devez être connecté');
      return;
    }

    setIsLoading(true);

    const { typeDechet, quantite, unite, modeCollecte, dateSouhaitee, creneauHoraire, notes } = declarationForm;

    if (!typeDechet || !quantite || !unite || !modeCollecte) {
      showMessage('declaration', 'error', 'Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/declarations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          typeDechet,
          quantite: parseFloat(quantite),
          unite,
          modeCollecte,
          dateSouhaitee: dateSouhaitee || null,
          creneauHoraire: creneauHoraire || null,
          notes: notes || null
        })
      });

      if (response.ok) {
        showMessage('declaration', 'success', 'Déclaration créée avec succès !');
        setDeclarationForm({
          typeDechet: '',
          quantite: '',
          unite: 'kg',
          modeCollecte: '',
          dateSouhaitee: '',
          creneauHoraire: '',
          notes: '',
          photos: []
        });
        setShowDeclarationForm(false);
        await loadDeclarations();
        await loadDashboard();
      } else {
        const errorData = await response.json();
        showMessage('declaration', 'error', errorData.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur création déclaration:', error);
      showMessage('declaration', 'error', 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeclarations = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/declarations`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        let declarations = data.declarations || data;
        
        if (!Array.isArray(declarations)) {
          declarations = [];
        }

        declarations = declarations.map(d => ({
          ...d,
          statut: (d.statut || 'en_attente').toLowerCase().trim()
        }));

        setDeclarations(declarations);
        filterDeclarations(declarations, declarationFilter);

        // Calculer les stats
        const stats = {
          total: declarations.length,
          completed: declarations.filter(d => d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee').length,
          pending: declarations.filter(d => d.statut === 'en_attente' || d.statut === 'en_attente_affectation' || d.statut === 'en_attente_collecte').length,
          inProgress: declarations.filter(d => d.statut === 'en_cours' || d.statut === 'affecte' || d.statut === 'programme').length,
          totalWeight: declarations.filter(d => d.quantite).reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0),
          totalPoints: declarations.filter(d => d.points).reduce((sum, d) => sum + (parseInt(d.points) || 0), 0)
        };
        setDeclarationStats(stats);
      }
    } catch (error) {
      console.error('Erreur déclarations:', error);
    }
  };

  const filterDeclarations = (decls, filter) => {
    if (filter === 'all') {
      setFilteredDeclarations(decls);
    } else {
      setFilteredDeclarations(decls.filter(d => d.statut === filter));
    }
  };

  useEffect(() => {
    filterDeclarations(declarations, declarationFilter);
  }, [declarationFilter, declarations]);

  // ========== SUIVI DÉCLARATION ==========
  const showDeclarationDetail = async (declarationId) => {
    if (!currentToken) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/declarations/${declarationId}/suivre`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDeclaration(data.declaration || data);
      } else {
        showMessage('declaration', 'error', 'Erreur lors du chargement du suivi');
      }
    } catch (error) {
      console.error('Erreur chargement suivi:', error);
      showMessage('declaration', 'error', 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const hideDeclarationDetail = () => {
    setSelectedDeclaration(null);
  };

  // ========== ANNULATION DÉCLARATION ==========
  const annulerDeclaration = (declarationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette déclaration ?')) {
      showMessage('declaration', 'success', 'Déclaration annulée avec succès');
      setTimeout(() => {
        hideDeclarationDetail();
        loadDeclarations();
        loadDashboard();
      }, 1000);
    }
  };

  // ========== PROFIL ==========
  const loadProfile = () => {
    if (!currentUser) return;

    setProfileForm({
      nomComplet: currentUser.nomComplet || '',
      telephone: currentUser.telephone || '',
      adresse: currentUser.adresse || '',
      quartier: currentUser.quartier || '',
      commune: currentUser.commune || ''
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentToken) return;

    const { nomComplet, telephone, adresse, quartier, commune } = profileForm;

    if (!nomComplet || !telephone) {
      showMessage('profile', 'error', 'Le nom complet et le téléphone sont obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler la mise à jour (à remplacer par appel API réel)
      setTimeout(() => {
        const updatedUser = { ...currentUser, nomComplet, telephone, adresse, quartier, commune };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        showMessage('profile', 'success', 'Profil mis à jour avec succès !');
        setIsEditing(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      showMessage('profile', 'error', 'Erreur lors de la mise à jour');
      setIsLoading(false);
    }
  };

  const handleLocationClick = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfileForm(prev => ({
            ...prev,
            quartier: `GPS: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }));
          setLocationLoading(false);
          showMessage('profile', 'success', '📍 Localisation mise à jour !');
        },
        (error) => {
          showMessage('profile', 'error', 'Impossible d\'obtenir votre position');
          setLocationLoading(false);
        }
      );
    } else {
      showMessage('profile', 'error', 'Géolocalisation non supportée');
      setLocationLoading(false);
    }
  };

  // ========== CHANGEMENT MOT DE PASSE ==========
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
      // Simuler le changement (à remplacer par appel API réel)
      setTimeout(() => {
        showMessage('password', 'success', 'Mot de passe changé avec succès !');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordFields(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      showMessage('password', 'error', 'Erreur lors du changement de mot de passe');
      setIsLoading(false);
    }
  };

  // ========== NOTIFICATIONS ==========
  const loadNotifications = async () => {
    if (!currentToken) return;

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  // ========== POINTS DE DÉPÔT ==========
  const loadDepotPoints = async () => {
    if (!currentToken) return;

    try {
      const latitude = currentUser?.latitude || 4.0511; // Douala par défaut
      const longitude = currentUser?.longitude || 9.7679;
      
      const response = await fetch(
        `${API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=10`,
        { headers: { 'Authorization': `Bearer ${currentToken}` } }
      ).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        setDepotPoints(data.points || data || []);
      }
    } catch (error) {
      console.error('Erreur points de dépôt:', error);
    }
  };

  // ========== COPIER TOKEN ==========
  const copyToken = () => {
    if (!currentToken) {
      showMessage('token', 'error', 'Aucun token disponible');
      return;
    }
    
    navigator.clipboard.writeText(currentToken)
      .then(() => showMessage('token', 'success', 'Token copié dans le presse-papier !'))
      .catch(() => showMessage('token', 'error', 'Erreur lors de la copie'));
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

  const formatCollectionMode = (mode) => {
    return collectionModes[mode] || mode || 'Non spécifié';
  };

  const formatProducerType = (type) => {
    const types = {
      'menage': 'Ménage',
      'commerce': 'Commerce',
      'entreprise': 'Entreprise',
      'administration': 'Administration'
    };
    return types[type] || type || 'Non spécifié';
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const filteredDeclarationsBySearch = filteredDeclarations.filter(declaration => {
    return declaration.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatWasteType(declaration.type_dechet)?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ========== RENDU ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => showSection('dashboard')}
            >
              <img src={logo} alt="EcoCollect" className="h-10 w-auto" />
              <span className="text-xl font-bold text-gray-900">Eco<span className="text-green-600">Collect</span></span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => showSection('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'dashboard' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Tableau de bord
              </button>
              <button
                onClick={() => showSection('declarations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'declarations' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Déclarations
              </button>
              <button
                onClick={() => showSection('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'profile' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                Mon Compte
              </button>
              <button
                onClick={() => showSection('depot')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'depot' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Points de dépôt
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 ml-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </nav>

            {/* User badge */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1.5">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                {getInitials(currentUser?.nomComplet)}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {currentUser?.nomComplet || 'Producteur'}
              </span>
            </div>
          </div>
        </div>
      </header>

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

        {/* Section Tableau de bord */}
        {activeSection === 'dashboard' && (
          <div>
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Bienvenue, {currentUser?.nomComplet?.split(' ')[0] || 'Producteur'} !
                    </h2>
                    <p className="text-green-100">
                      Prêt à faire une différence aujourd'hui ? Continuez votre excellent travail de tri des déchets.
                    </p>
                  </div>
                  <div className="hidden lg:block flex-shrink-0">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="font-medium">Objectif du mois</span>
                      </div>
                      <div className="text-2xl font-bold">20 kg</div>
                      <div className="text-sm text-green-100">Encore {Math.max(0, 20 - dashboardData.totalWaste).toFixed(1)} kg à atteindre</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{dashboardData.totalDeclarations}</span>
                </div>
                <p className="text-gray-600 font-medium">Total des déclarations</p>
                <p className="text-sm text-gray-500 mt-1">Ce mois</p>
                <div className="mt-3 flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{dashboardData.totalDeclarations > 0 ? '12' : '0'}% vs mois dernier
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{dashboardData.pendingCollections}</span>
                </div>
                <p className="text-gray-600 font-medium">Collectes en attente</p>
                <p className="text-sm text-gray-500 mt-1">En cours</p>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{width: `${dashboardData.totalDeclarations > 0 ? (dashboardData.pendingCollections / dashboardData.totalDeclarations) * 100 : 0}%`}}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{dashboardData.completedCollections}</span>
                </div>
                <p className="text-gray-600 font-medium">Collectes réalisées</p>
                <p className="text-sm text-gray-500 mt-1">Terminées</p>
                <div className="mt-3 flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {dashboardData.totalDeclarations > 0 
                    ? Math.round((dashboardData.completedCollections / dashboardData.totalDeclarations) * 100) 
                    : 0}% de taux de réussite
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{dashboardData.totalPointsEarned}</span>
                </div>
                <p className="text-gray-600 font-medium">Points cumulés</p>
                <p className="text-sm text-gray-500 mt-1">Récompenses</p>
                <div className="mt-3 flex items-center text-purple-600 text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  Niveau Éco-Héros
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Declarations */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-green-600" />
                        Historique des collectes
                      </h2>
                      <button 
                        onClick={() => showSection('declarations')}
                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        Voir tout
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {recentDeclarations.length > 0 ? (
                      recentDeclarations.map(declaration => {
                        const StatusIcon = getStatusIcon(declaration.statut);
                        const statusColor = getStatusColor(declaration.statut);
                        
                        return (
                          <div key={declaration.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    #{declaration.id?.substring(0, 8)}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                    {getStatusText(declaration.statut)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{wasteTypes[declaration.type_dechet]?.icon || '📦'}</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">
                                    {declaration.quantite || 0} {declaration.unite || 'kg'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(declaration.date_declaration)}
                                  </div>
                                  
                                  {declaration.collecteur_nom && (
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {declaration.collecteur_nom}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => showDeclarationDetail(declaration.id)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                              >
                                <span className="text-sm font-medium">Détails</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        Aucune déclaration récente
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Actions rapides
                  </h2>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowDeclarationForm(true);
                        showSection('declarations');
                      }}
                      className="block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Déclarer des déchets
                    </button>
                    
                    <button
                      onClick={() => showSection('declarations')}
                      className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                    >
                      Voir l'historique complet
                    </button>
                    
                    <button
                      onClick={() => showSection('depot')}
                      className="block w-full py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-center font-medium"
                    >
                      Points de collecte
                    </button>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Impact environnemental
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Total collecté</span>
                        <span className="font-semibold text-gray-900">{dashboardData.totalWaste} kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Recycle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-green-600">89%</p>
                        <p className="text-xs text-gray-600">Taux de recyclage</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Leaf className="w-6 h-6 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold text-blue-600">{Math.round(dashboardData.totalWaste / 10)}</p>
                        <p className="text-xs text-gray-600">Arbres sauvés</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Conseil du jour
                  </h3>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Saviez-vous que le tri sélectif peut vous rapporter jusqu'à 50% de points en plus ? 
                    Séparez correctement vos déchets pour maximiser vos récompenses !
                  </p>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-green-700">
                      🎯 Objectif : Atteignez 500 points ce mois pour débloquer le niveau "Maître Recycleur"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Déclarations */}
        {activeSection === 'declarations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-6 h-6 text-green-600" />
                Mes déclarations
              </h1>
              <button
                onClick={() => setShowDeclarationForm(!showDeclarationForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle déclaration
              </button>
            </div>

            {/* Formulaire nouvelle déclaration */}
            {showDeclarationForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Nouvelle déclaration
                </h3>
                <form onSubmit={handleNewDeclaration} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de déchet *
                      </label>
                      <select
                        value={declarationForm.typeDechet}
                        onChange={(e) => setDeclarationForm({...declarationForm, typeDechet: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="plastique_pet">Plastique PET</option>
                        <option value="plastique_pehd">Plastique PEHD</option>
                        <option value="papier_carton">Papier/Carton</option>
                        <option value="metal">Métal</option>
                        <option value="verre">Verre</option>
                        <option value="organique">Organique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={declarationForm.quantite}
                        onChange={(e) => setDeclarationForm({...declarationForm, quantite: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unité *
                      </label>
                      <select
                        value={declarationForm.unite}
                        onChange={(e) => setDeclarationForm({...declarationForm, unite: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="kg">Kilogrammes (kg)</option>
                        <option value="sacs">Sacs</option>
                        <option value="unites">Unités</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mode de collecte *
                      </label>
                      <select
                        value={declarationForm.modeCollecte}
                        onChange={(e) => setDeclarationForm({...declarationForm, modeCollecte: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        <option value="collecte_domicile">Collecte à domicile</option>
                        <option value="depot_volontaire">Dépôt volontaire</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date souhaitée
                      </label>
                      <input
                        type="date"
                        value={declarationForm.dateSouhaitee}
                        onChange={(e) => setDeclarationForm({...declarationForm, dateSouhaitee: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Créneau horaire
                      </label>
                      <select
                        value={declarationForm.creneauHoraire}
                        onChange={(e) => setDeclarationForm({...declarationForm, creneauHoraire: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="9h-12h">9h - 12h</option>
                        <option value="14h-17h">14h - 17h</option>
                        <option value="18h-20h">18h - 20h</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optionnel)
                    </label>
                    <textarea
                      rows="3"
                      value={declarationForm.notes}
                      onChange={(e) => setDeclarationForm({...declarationForm, notes: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Informations supplémentaires..."
                    ></textarea>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeclarationForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{declarationStats.total}</span>
                </div>
                <p className="text-gray-600 font-medium">Total déclarations</p>
                <p className="text-sm text-gray-500 mt-1">Depuis le début</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{declarationStats.completed}</span>
                </div>
                <p className="text-gray-600 font-medium">Collectes terminées</p>
                <p className="text-sm text-gray-500 mt-1">Avec succès</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{declarationStats.totalWeight.toFixed(1)}</span>
                </div>
                <p className="text-gray-600 font-medium">Poids total collecté</p>
                <p className="text-sm text-gray-500 mt-1">Kilogrammes</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{declarationStats.totalPoints}</span>
                </div>
                <p className="text-gray-600 font-medium">Points cumulés</p>
                <p className="text-sm text-gray-500 mt-1">Récompenses</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par numéro, type de déchet..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={declarationFilter}
                    onChange={(e) => setDeclarationFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                  </select>

                  <button
                    onClick={loadDeclarations}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Actualiser
                  </button>
                </div>
              </div>
            </div>

            {/* Declarations List */}
            {!selectedDeclaration ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-green-600" />
                      Liste des déclarations ({filteredDeclarationsBySearch.length})
                    </h2>
                    <div className="text-sm text-gray-500">
                      {filteredDeclarationsBySearch.length} résultat{filteredDeclarationsBySearch.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredDeclarationsBySearch.length > 0 ? (
                    filteredDeclarationsBySearch.map(declaration => {
                      const StatusIcon = getStatusIcon(declaration.statut);
                      const statusColor = getStatusColor(declaration.statut);
                      
                      return (
                        <div key={declaration.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  #{declaration.id?.substring(0, 8)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                                  {getStatusText(declaration.statut)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{wasteTypes[declaration.type_dechet]?.icon || '📦'}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {declaration.quantite || 0} {declaration.unite || 'kg'}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(declaration.date_declaration)}
                                </div>
                                
                                {declaration.collecteur_nom && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {declaration.collecteur_nom}
                                  </div>
                                )}
                              </div>
                              
                              {declaration.statut === 'termine' && declaration.poids_reel && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm">
                                  <span className="text-green-600 font-medium">
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                    Poids: {declaration.poids_reel} kg
                                  </span>
                                  {declaration.points && (
                                    <span className="text-purple-600 font-medium">
                                      <Award className="w-3 h-3 inline mr-1" />
                                      +{declaration.points} points
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => showDeclarationDetail(declaration.id)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">Détails</span>
                              </button>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune déclaration trouvée</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Essayez de modifier vos filtres de recherche
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Declaration Details */
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={hideDeclarationDetail}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la liste
                </button>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-green-600" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Détails de la déclaration</h1>
                      <p className="text-gray-600">#{selectedDeclaration.id}</p>
                    </div>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full bg-${getStatusColor(selectedDeclaration.statut)}-100 text-${getStatusColor(selectedDeclaration.statut)}-800 font-medium`}>
                    {getStatusText(selectedDeclaration.statut)}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Declaration Info */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-green-600" />
                      Informations de la déclaration
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Type de déchet</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg">{wasteTypes[selectedDeclaration.type_dechet]?.icon || '📦'}</span>
                          <span className="text-sm font-medium text-gray-700">
                            {formatWasteType(selectedDeclaration.type_dechet)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Quantité</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Scale className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {selectedDeclaration.quantite || 0} {selectedDeclaration.unite || 'kg'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Mode de collecte</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatCollectionMode(selectedDeclaration.mode_collecte)}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Date de création</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDateTime(selectedDeclaration.date_declaration)}
                          </span>
                        </div>
                      </div>
                      
                      {selectedDeclaration.notes && (
                        <div>
                          <p className="text-sm text-gray-600">Instructions spéciales</p>
                          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1">
                            {selectedDeclaration.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Collector Info */}
                  {selectedDeclaration.collecteur_nom && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Informations du collecteur
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedDeclaration.collecteur_nom}</h4>
                        </div>
                        
                        {selectedDeclaration.collecteur_telephone && (
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{selectedDeclaration.collecteur_telephone}</span>
                          </div>
                        )}
                        
                        {selectedDeclaration.collecteur_vehicule && (
                          <div className="flex items-center gap-3">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{selectedDeclaration.collecteur_vehicule}</span>
                          </div>
                        )}
                        
                        <div className="mt-6 pt-6 border-t">
                          <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              <Phone className="w-4 h-4" />
                              Contacter
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {selectedDeclaration.statut === 'termine' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Résultats de la collecte
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Poids réel</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Scale className="w-4 h-4 text-gray-400" />
                            <span className="text-lg font-bold text-gray-900">
                              {selectedDeclaration.poids_reel || selectedDeclaration.quantite} kg
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Points gagnés</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-lg font-bold text-green-600">
                              +{selectedDeclaration.points || 0} points
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Date de collecte</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {selectedDeclaration.date_collecte ? formatDateTime(selectedDeclaration.date_collecte) : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedDeclaration.statut === 'en_attente' && (
                  <div className="mt-8 pt-6 border-t">
                    <button
                      onClick={() => annulerDeclaration(selectedDeclaration.id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Annuler la demande
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Section Mon Compte */}
        {activeSection === 'profile' && currentUser && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Mon Compte
            </h1>

            {/* Hero Section */}
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-8 text-white">
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      {currentUser.nomComplet}
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                        <Leaf className="h-4 w-4" />
                        Éco-producteur
                      </span>
                    </h1>
                    <p className="text-white/90 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg"
                    >
                      <Edit className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      <span className="font-medium">Modifier le profil</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          loadProfile();
                        }}
                        className="rounded-xl bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className="group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
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

              {/* Eco Stats */}
              <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/30 p-2">
                      <Recycle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Déchets collectés</p>
                      <p className="text-xl font-bold">{dashboardData.totalWaste} kg</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/30 p-2">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">CO₂ évité</p>
                      <p className="text-xl font-bold">{Math.round(dashboardData.totalWaste * 2)} kg</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/30 p-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/80">Points verts</p>
                      <p className="text-xl font-bold">{dashboardData.totalPointsEarned}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Informations personnelles
                  </h3>
                  
                  {!isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium text-gray-900">{currentUser.nomComplet || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{currentUser.email || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{currentUser.telephone || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium text-gray-900">{formatProducerType(currentUser.typeProducteur)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium text-gray-900">{currentUser.adresse || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium text-gray-900">
                          {[currentUser.quartier, currentUser.commune].filter(Boolean).join(', ') || '-'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Membre depuis</p>
                        <p className="font-medium text-gray-900">{currentUser.cree_le ? formatDate(currentUser.cree_le) : '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Statut</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Actif
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse
                        </label>
                        <textarea
                          rows="2"
                          value={profileForm.adresse}
                          onChange={(e) => setProfileForm({...profileForm, adresse: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quartier
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profileForm.quartier}
                              onChange={(e) => setProfileForm({...profileForm, quartier: e.target.value})}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={handleLocationClick}
                              disabled={locationLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {locationLoading ? '...' : 'GPS'}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Commune
                          </label>
                          <input
                            type="text"
                            value={profileForm.commune}
                            onChange={(e) => setProfileForm({...profileForm, commune: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Key className="w-5 h-5 text-green-600" />
                      Sécurité
                    </h3>
                    <button
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

              {/* Right Column - Token */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-green-600" />
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
        )}

        {/* Section Points de dépôt */}
        {activeSection === 'depot' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-600" />
              Points de dépôt à proximité
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {depotPoints.length > 0 ? (
                depotPoints.map((point, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{point.nom || 'Point de dépôt'}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {point.adresse || 'Adresse non disponible'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        {point.types_dechets_acceptes?.join(', ') || 'Tous types'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        {point.horaires_ouverture || 'Horaires non spécifiés'}
                      </p>
                      {point.distance_metres && (
                        <p className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          {(point.distance_metres / 1000).toFixed(2)} km
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun point de dépôt trouvé à proximité</p>
                  <button
                    onClick={loadDepotPoints}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Actualiser
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProducteurDashboard; 