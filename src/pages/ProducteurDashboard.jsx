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
  LogOut as LogOutIcon, Trash2 as Trash2Icon, Fingerprint, MapPin as MapPinIcon,
  Menu, Settings as SettingsIcon, History, X as XIcon
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const ProducteurDashboard = () => {
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
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingDeclaration, setTrackingDeclaration] = useState(null);
  const [declarationStats, setDeclarationStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    totalWeight: 0,
    totalPoints: 0
  });

  // Dans ProducteurDashboard.jsx, après les autres useState
const [showPremiumModal, setShowPremiumModal] = useState(false);
const [userSubscription, setUserSubscription] = useState(null);
const [premiumBenefits, setPremiumBenefits] = useState({
  priorityCollection: true,
  bonusPoints: 20,
  supportPrioritaire: true
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

  // États UI
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);



  
  //  const API_URL = 'http://localhost:3000';
  const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };


  useEffect(() => {
  if (currentToken && currentUser) {
    checkSubscription();
  }
}, [currentToken, currentUser]);

// Dans ProducteurDashboard.jsx, après loadDashboard
const checkSubscription = async () => {
  if (!currentToken) return;
  
  try {
    const response = await fetch(`${API_URL}/api/producteur-premium/mon-abonnement`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    const data = await response.json();
    if (data.success && data.abonnement) {
      setUserSubscription(data.abonnement);
      // Mettre à jour currentUser avec type_compte premium
      if (currentUser) {
        setCurrentUser({...currentUser, type_compte: 'premium'});
      }
    }
  } catch (error) {
    console.error('Erreur vérification abonnement:', error);
  }
};

// Appeler checkSubscription après chargement du user
useEffect(() => {
  if (currentToken && currentUser) {
    checkSubscription();
  }
}, [currentToken, currentUser]);

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
      affecte: 'orange',
      affectee: 'orange',
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
      assigned: 'En cours',
      scheduled: 'Programmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      termine: 'Terminé',
      terminee: 'Terminée',
      validee: 'Validée',
      en_attente: 'En attente',
      en_attente_affectation: 'En attente',
      en_attente_collecte: 'En attente',
      affecte: 'En cours',
      affectee: 'En cours',
      collecteur_affecte: 'En cours',
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
      assigned: Truck,
      scheduled: Calendar,
      in_progress: Truck,
      completed: CheckCircle,
      termine: CheckCircle,
      terminee: CheckCircle,
      validee: CheckCircle,
      en_attente: Clock,
      affecte: Truck,
      affectee: Truck,
      programme: Calendar,
      programmee: Calendar,
      en_cours: Truck,
      annule: XIcon,
      annulee: XIcon
    };
    return icons[status] || Clock;
  };

  // ========== INITIALISATION ==========
  useEffect(() => {
    console.log('🔄 Initialisation du ProducteurDashboard');
    checkSession();
    return () => {
      if (refreshInterval) {
        console.log('🧹 Nettoyage de l\'intervalle de rafraîchissement');
        clearInterval(refreshInterval);
      }
    };
  }, []);

  // Effet pour charger les données quand le token est disponible
  useEffect(() => {
    if (currentToken && currentUser) {
      console.log('✅ Token et utilisateur disponibles, chargement des données...');
      loadDashboard();
      loadDeclarations();
      loadNotifications();
      loadProfile();
    }
  }, [currentToken, currentUser]);

  const checkSession = () => {
    console.log('🔍 Vérification de la session...');
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);

    console.log('Token présent:', !!token);
    console.log('User présent:', !!userJson);
    console.log('Rôle:', role);

    if (!token || !userJson || role !== 'producteur') {
      console.log('❌ Session invalide, redirection vers login');
      window.location.href = '/login';
      return;
    }

    try {
      const user = JSON.parse(userJson);
      console.log('✅ Utilisateur connecté:', user);
      setCurrentToken(token);
      setCurrentUser(user);
      
      // Démarrer l'auto-raffraîchissement
      startAutoRefresh();
    } catch (error) {
      console.error('❌ Erreur lors du parsing des données utilisateur:', error);
      clearSession();
    }
  };

  const startAutoRefresh = () => {
    if (refreshInterval) clearInterval(refreshInterval);
    const interval = setInterval(() => {
      console.log('🔄 Auto-raffraîchissement...');
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
    console.log('🧹 Nettoyage de la session');
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

  // ========== DÉCONNEXION ==========
  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      clearSession();
    }
  };

  // ========== TABLEAU DE BORD ==========
  const loadDashboard = async () => {
    if (!currentToken) {
      console.log('❌ loadDashboard: Pas de token');
      return;
    }

    console.log('📊 Chargement du tableau de bord...');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/declarations`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      console.log('📡 Réponse API declarations:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        
        let declarations = data.declarations || data;
        
        if (!Array.isArray(declarations)) {
          console.warn('⚠️ Les données ne sont pas un tableau, conversion...');
          declarations = [];
        }

        console.log(`📊 ${declarations.length} déclarations trouvées`);

        declarations = declarations.map(d => ({
          ...d,
          statut: (d.statut || '').toLowerCase().trim()
        }));

        const totalDeclarations = declarations.length;
        const pendingCollections = declarations.filter(d => 
          d.statut === 'affecte' || d.statut === 'en_attente_affectation' || d.statut === 'en_attente_collecte'
        ).length;
        const completedCollections = declarations.filter(d => 
          d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee'
        ).length;
        const programmedCollections = declarations.filter(d => 
        d.statut === 'programme' || 
        d.statut === 'programmee' || 
        d.statut === 'scheduled'
      ).length;
        const totalWaste = declarations
          .filter(d => d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee')
          .reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0);

        const totalPoints = declarations
          .filter(d => d.points)
          .reduce((sum, d) => sum + (parseInt(d.points) || 0), 0);

        console.log('📊 Statistiques calculées:', {
          totalDeclarations,
          pendingCollections,
          completedCollections,
          programmedCollections,
          totalWaste,
          totalPoints
        });

        setDashboardData({
          points: currentUser?.points || 0,
          totalDeclarations,
          pendingCollections,
          completedCollections,
          programmedCollections,
          totalWaste: totalWaste.toFixed(1),
          totalPointsEarned: totalPoints
        });

        setRecentDeclarations(declarations.slice(0, 5));
        setDataLoaded(true);
      } else {
        console.error('❌ Erreur API:', response.status);
        showMessage('dashboard', 'error', 'Erreur lors du chargement des données');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      showMessage('dashboard', 'error', 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
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
        setShowDeclarationModal(false);
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
    if (!currentToken) {
      console.log('❌ loadDeclarations: Pas de token');
      return;
    }

    console.log('📥 Chargement des déclarations...');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/declarations`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      console.log('📡 Réponse API declarations:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        
        let declarations = data.declarations || data;
        
        if (!Array.isArray(declarations)) {
          console.warn('⚠️ Les données ne sont pas un tableau, conversion...');
          declarations = [];
        }

        console.log(`📊 ${declarations.length} déclarations trouvées`);

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
          pending: declarations.filter(d => d.statut === 'affecte' || d.statut === 'en_attente_affectation' || d.statut === 'en_attente_collecte').length,
          inProgress: declarations.filter(d => d.statut === 'en_cours' || d.statut === 'affecte' || d.statut === 'programme' || d.statut === 'assigned').length,
          totalWeight: declarations.filter(d => d.quantite).reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0),
          totalPoints: declarations.filter(d => d.points).reduce((sum, d) => sum + (parseInt(d.points) || 0), 0)
        };
        
        console.log('📊 Stats calculées:', stats);
        setDeclarationStats(stats);
      } else {
        console.error('❌ Erreur API:', response.status);
        showMessage('declarations', 'error', 'Erreur lors du chargement des déclarations');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      showMessage('declarations', 'error', 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
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

  // ========== SUIVI EN TEMPS RÉEL ==========
  const showTracking = async (declarationId) => {
    if (!currentToken) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/declarations/${declarationId}/suivre`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingDeclaration(data.declaration || data);
        setShowTrackingModal(true);
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

  const hideTracking = () => {
    setShowTrackingModal(false);
    setTrackingDeclaration(null);
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

  // ========== SIDEBAR MENU ITEMS ==========
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'declare',
      label: 'Déclarer des déchets',
      icon: Trash2,
      badge: 'CTA',
      badgeColor: 'green',
      action: () => setShowDeclarationModal(true)
    },
    {
      id: 'declarations',
      label: 'Mes déclarations',
      icon: Package,
      badge: null
    },
    {
      id: 'history',
      label: 'Historique',
      icon: History,
      badge: null
    },
    {
      id: 'rewards',
      label: 'Récompenses',
      icon: Award,
      badge: dashboardData.totalPointsEarned.toString(),
      badgeColor: 'purple'
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
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
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
        setShowDeclarationModal={setShowDeclarationModal}
      />

      {/* Main Content - avec marge à gauche pour desktop */}
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
              recentDeclarations={recentDeclarations}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              showDeclarationDetail={showDeclarationDetail}
              showTracking={showTracking}
              setShowDeclarationModal={setShowDeclarationModal}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
              dataLoaded={dataLoaded}
              setShowPremiumModal={setShowPremiumModal}  
              setActiveSection={setActiveSection}
            />
          )}

          {/* Section Déclarations */}
          {activeSection === 'declarations' && (
            <DeclarationsList
              declarations={filteredDeclarationsBySearch}
              declarationStats={declarationStats}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              declarationFilter={declarationFilter}
              setDeclarationFilter={setDeclarationFilter}
              loadDeclarations={loadDeclarations}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              showDeclarationDetail={showDeclarationDetail}
              showTracking={showTracking}
              setShowDeclarationModal={setShowDeclarationModal}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
            />
          )}

          {/* Section Historique */}
          {activeSection === 'history' && (
            <HistorySection
              declarations={filteredDeclarationsBySearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              declarationFilter={declarationFilter}
              setDeclarationFilter={setDeclarationFilter}
              loadDeclarations={loadDeclarations}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatDate={formatDate}
              formatWasteType={formatWasteType}
              showDeclarationDetail={showDeclarationDetail}
              wasteTypes={wasteTypes}
              isLoading={isLoading}
            />
          )}

          {/* Section Récompenses */}
          {activeSection === 'rewards' && (
            <RewardsSection
              totalPoints={dashboardData.totalPointsEarned}
              totalWaste={dashboardData.totalWaste}
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
              handleLocationClick={handleLocationClick}
              locationLoading={locationLoading}
              showPasswordFields={showPasswordFields}
              setShowPasswordFields={setShowPasswordFields}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              handleChangePassword={handleChangePassword}
              copyToken={copyToken}
              currentToken={currentToken}
              formatProducerType={formatProducerType}
              formatDate={formatDate}
              handleLogout={handleLogout}
            />
          )}

         
        </main>
      </div>

      {/* Modal Nouvelle Déclaration */}
      {showDeclarationModal && (
        <DeclarationModal
          declarationForm={declarationForm}
          setDeclarationForm={setDeclarationForm}
          handleSubmit={handleNewDeclaration}
          isLoading={isLoading}
          onClose={() => setShowDeclarationModal(false)}
        />
      )}

      {/* Modal Détails Déclaration */}
      {selectedDeclaration && (
        <DeclarationDetailsModal
          declaration={selectedDeclaration}
          onClose={hideDeclarationDetail}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatWasteType={formatWasteType}
          formatCollectionMode={formatCollectionMode}
          formatDateTime={formatDateTime}
          annulerDeclaration={annulerDeclaration}
          showTracking={showTracking}
          wasteTypes={wasteTypes}
        />
      )}
// Dans ProducteurDashboard.jsx, lors de l'appel du modal
{showPremiumModal && (
  <PremiumSubscriptionModal
    isOpen={showPremiumModal}
    onClose={() => setShowPremiumModal(false)}
    onSubscribe={(abonnement) => {
      setUserSubscription(abonnement);
      setCurrentUser({...currentUser, type_compte: 'premium'});
    }}
    currentToken={currentToken}
    apiUrl={API_URL}  // ← AJOUTEZ CETTE LIGNE
  />
)}
      {/* Modal Suivi en temps réel */}
      {showTrackingModal && trackingDeclaration && (
        <TrackingModal
          declaration={trackingDeclaration}
          onClose={hideTracking}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          formatWasteType={formatWasteType}
          formatCollectionMode={formatCollectionMode}
          formatDateTime={formatDateTime}
          wasteTypes={wasteTypes}
        />
      )}
    </div>
  );
};

// ========== COMPOSANT SIDEBAR ==========
const Sidebar = ({ isOpen, toggleSidebar, currentPage, setActivePage, menuItems, secondaryMenuItems, currentUser, getInitials, handleLogout, setShowDeclarationModal }) => {
  const handleItemClick = (item) => {
    if (item.id === 'declare' && setShowDeclarationModal) {
      setShowDeclarationModal(true);
    } else {
      setActivePage(item.id);
    }
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
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
            <div className="flex items-center justify-between">
              
              <button
                onClick={toggleSidebar}
                className="text-gradient hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(currentUser?.nomComplet)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.nomComplet || 'Producteur'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'producteur@ecocollect.cm'}</p>
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
                            ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        
                        {item.badge && item.badge !== 'CTA' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.badgeColor === 'green' 
                              ? 'bg-green-100 text-green-700' 
                              : item.badgeColor === 'purple'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        
                        {item.badge === 'CTA' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white">
                            Nouveau
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
                            ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
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
      <div className="hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col">
       

        <div className="p-4 border-b">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
      {getInitials(currentUser?.nomComplet)}
    </div>
    <div>
      <p className="font-medium text-gray-900 flex items-center gap-2">
        {currentUser?.nomComplet || 'Producteur'}
        {currentUser?.type_compte === 'premium' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            <Star className="w-3 h-3 fill-current" />
            PREMIUM
          </span>
        )}
      </p>
      <p className="text-xs text-gray-500">{currentUser?.email || 'producteur@ecocollect.cm'}</p>
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
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      
                      {item.badge && item.badge !== 'CTA' && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.badgeColor === 'green' 
                            ? 'bg-green-100 text-green-700' 
                            : item.badgeColor === 'purple'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      
                      {item.badge === 'CTA' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white">
                          Nouveau
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
                          ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
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

// ========== COMPOSANT ABONNEMENT PREMIUM AMÉLIORÉ - CORRIGÉ ==========
const PremiumSubscriptionModal = ({ isOpen, onClose, onSubscribe, currentToken, apiUrl }) => {
  const [operateur, setOperateur] = useState('ORANGE');
  const [montant, setMontant] = useState(5000);
  const [telephone, setTelephone] = useState('');
  const [codeUSSD, setCodeUSSD] = useState('');
  const [numeroDestinataire, setNumeroDestinataire] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState('');

  // Numéros de l'entreprise (fixes)
  const NUMEROS_ENTREPRISE = {
    ORANGE: '656739704',
    MTN: '677003287'
  };

  // Fonction pour générer le code USSD avec le numéro de l'entreprise (PAS celui du client)
  const genererCodeUSSDEntreprise = (op, montant) => {
    if (op === 'ORANGE') {
      return `#150*1*1*${NUMEROS_ENTREPRISE.ORANGE}*${montant}#`;
    } else if (op === 'MTN') {
      return `*126*1*1*${NUMEROS_ENTREPRISE.MTN}*${montant}#`;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation du téléphone
    const telephonePropre = telephone.replace(/[^0-9]/g, '');
    if (telephonePropre.length < 9) {
      setError('Numéro de téléphone invalide');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📤 Envoi de la requête à:', `${apiUrl}/api/paiements/initier-abonnement`);
      
      const response = await fetch(`${apiUrl}/api/paiements/initier-abonnement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ 
          operateur, 
          montant: parseInt(montant), 
          telephone: telephonePropre 
        })
      });

      const data = await response.json();
      console.log('📦 Réponse du serveur:', data);

      if (data.success) {
        // IMPORTANT: On utilise NOTRE propre génération de code USSD avec le numéro de l'entreprise
        // et NON celui du serveur qui pourrait contenir le numéro du client
        const codeEntreprise = genererCodeUSSDEntreprise(operateur, montant);
        
        setCodeUSSD(codeEntreprise);
        setNumeroDestinataire(NUMEROS_ENTREPRISE[operateur]);
        setTransactionId(data.transactionId);
        setStep(2);
        startPolling(data.transactionId);
      } else {
        setError(data.message || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (txId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${apiUrl}/api/paiements/transaction/${txId}`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        });
        const data = await response.json();

        if (data.success && data.transaction.statut === 'reussi') {
          clearInterval(interval);
          setStep(3);
          if (onSubscribe) {
            onSubscribe(data.abonnement);
          }
        }
      } catch (error) {
        console.error('Erreur polling:', error);
      }
    }, 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeUSSD);
    alert('Code copié !');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Abonnement Premium
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  Avantages Premium
                </h4>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    Collecte prioritaire
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    +20% de points bonus sur toutes les collectes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    Badge Premium exclusif ⭐
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                    Support prioritaire 24/7
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opérateur de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOperateur('ORANGE')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      operateur === 'ORANGE'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <span className="text-3xl block mb-2">📱</span>
                    <span className="font-medium text-sm">Orange Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperateur('MTN')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      operateur === 'MTN'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-200'
                    }`}
                  >
                    <span className="text-3xl block mb-2">📱</span>
                    <span className="font-medium text-sm">MTN Mobile Money</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant de l'abonnement mensuel (FCFA)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={montant}
                  onChange={(e) => setMontant(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: 1000 FCFA - Maximum: 100000 FCFA
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre numéro de téléphone {operateur === 'ORANGE' ? 'Orange Money' : 'MTN Money'}
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="612345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le numéro avec lequel vous allez payer
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement...
                  </span>
                ) : (
                  'Générer le code de paiement'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Instructions de paiement
                </h4>
                
                <div className="bg-white p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Composez le code suivant sur votre téléphone {operateur === 'ORANGE' ? 'Orange Money' : 'MTN Money'} :
                  </p>
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <code className="font-mono text-lg font-bold text-gray-800">
                      {codeUSSD}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="ml-2 p-2 bg-white hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copier le code"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-yellow-700 font-medium mb-2">
                    📝 Détails du paiement :
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Montant:</span> {montant} FCFA
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Destinataire:</span> {numeroDestinataire}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Opérateur:</span> {operateur === 'ORANGE' ? 'Orange Money' : 'MTN Mobile Money'}
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-100 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    📱 Étapes à suivre :
                  </p>
                  <ol className="text-sm text-blue-700 list-decimal list-inside space-y-2">
                    <li>Ouvrez l'application {operateur === 'ORANGE' ? 'Orange Money' : 'MTN Money'}</li>
                    <li>Composez le code <span className="font-mono font-bold">{codeUSSD}</span></li>
                    <li>Confirmez le paiement de <span className="font-bold">{montant} FCFA</span></li>
                    <li>Le paiement sera envoyé au numéro <span className="font-bold">{numeroDestinataire}</span></li>
                    <li>Patientez quelques instants pour la confirmation</li>
                  </ol>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">
                    En attente de confirmation du paiement...
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Cette page se mettra à jour automatiquement dès que le paiement sera confirmé
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800 text-lg mb-2">
                  Félicitations !
                </h4>
                <p className="text-green-600 mb-4">
                  Votre abonnement premium est maintenant actif. Profitez de vos avantages exclusifs !
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4 text-left">
                  <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    Vos avantages activés :
                  </h5>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Collecte prioritaire
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      +20% de points bonus
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Badge Premium sur votre profil ⭐
                    </li>
                  </ul>
                </div>

                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800"
                >
                  Commencer à profiter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT TABLEAU DE BORD ==========
const Dashboard = ({ currentUser,
   dashboardData,
    recentDeclarations,
    getStatusColor, getStatusText,
    getStatusIcon,
    formatDate,
    formatWasteType, 
    setShowPremiumModal,
    showDeclarationDetail,
    showTracking, 
    setShowDeclarationModal, wasteTypes, isLoading, dataLoaded , setActiveSection 
}) => {
  
  // Calculer le pourcentage de progression pour la barre
  const getProgressPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.min(Math.round((value / total) * 100), 100);
  };

  // Fonction pour aller à l'historique
  const goToHistory = () => {
    if (setActiveSection) {
      setActiveSection('history');
    }
  };

  return (
    <div>
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
               
                <div className="text-sm text-green-100">Encore {Math.max(0, 20 - dashboardData.totalWaste).toFixed(1)} kg à atteindre</div>
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
            <span className="text-2xl font-bold text-gray-900">{dashboardData.pendingCollections} </span>
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
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{dashboardData.programmedCollections} </span>
          </div>
          <p className="text-gray-600 font-medium">Collectes en chemin</p>
          <p className="text-sm text-gray-500 mt-1">En cours</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{width: `${dashboardData.totalDeclarations > 0 ? (dashboardData.programmedCollections / dashboardData.totalDeclarations) * 100 : 0}%`}}
              ></div>
            </div>
          </div>
        </div>

        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-green-600" />
            Historique des collectes
          </h2>
           <button 
                  onClick={goToHistory}  // UTILISER LA FONCTION
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
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showDeclarationDetail(declaration.id)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                          >
                            <span className="text-sm font-medium">Détails</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  {isLoading ? 'Chargement...' : 'Aucune déclaration récente'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Actions rapides
            </h2>
            
            <div className="space-y-3">
  <button
    onClick={() => setShowDeclarationModal(true)}
    className="block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2"
  >
    <Trash2 className="w-4 h-4" />
    Déclarer des déchets
  </button>
  
  {/* BOUTON PREMIUM */}
     {currentUser?.type_compte !== 'premium' ? (
             <button
             onClick={() => setShowPremiumModal(true)} 
            className="block w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-center font-medium flex items-center justify-center gap-2 relative overflow-hidden group"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Star className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Passer à Premium ⭐</span>
             </button>
          ) : (
            <div className="block w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg text-center font-medium flex items-center justify-center gap-2">
      <Star className="w-4 h-4 fill-current" />
      <span>Premium Actif</span>
      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
        {userSubscription?.date_fin ? `Jusqu'au ${new Date(userSubscription.date_fin).toLocaleDateString()}` : ''}
      </span>
           </div>
          )}
  
            <button
           onClick={goToHistory}
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
           >
            Voir l'historique complet
         </button>
         </div>
          </div>

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
  );
};

// ========== COMPOSANT LISTE DES DÉCLARATIONS ==========
const DeclarationsList = ({ 
  declarations, declarationStats, searchTerm, setSearchTerm, declarationFilter, 
  setDeclarationFilter, loadDeclarations, getStatusColor, getStatusText, getStatusIcon,
  formatDate, formatWasteType, showDeclarationDetail, showTracking, setShowDeclarationModal,
  wasteTypes, isLoading
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-green-600" />
          Mes déclarations
        </h1>
        <button
          onClick={() => setShowDeclarationModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle déclaration
        </button>
      </div>

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
              <option value="affecte">En cours</option>
              <option value="programme">Programmé</option>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-green-600" />
              Liste des déclarations ({declarations.length})
            </h2>
            <div className="text-sm text-gray-500">
              {declarations.length} résultat{declarations.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {declarations.length > 0 ? (
            declarations.map(declaration => {
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
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => showDeclarationDetail(declaration.id)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showTracking(declaration.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                        title="Suivre en temps réel"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isLoading ? 'Chargement des déclarations...' : 'Aucune déclaration trouvée'}
              </p>
              {!isLoading && (
                <p className="text-sm text-gray-400 mt-1">
                  Essayez de modifier vos filtres de recherche ou créez une nouvelle déclaration
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT MODAL NOUVELLE DÉCLARATION ==========
const DeclarationModal = ({ declarationForm, setDeclarationForm, handleSubmit, isLoading, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Nouvelle déclaration
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
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
    </div>
  );
};

// ========== COMPOSANT MODAL DÉTAILS DÉCLARATION ==========
const DeclarationDetailsModal = ({ declaration, onClose, getStatusColor, getStatusText, formatWasteType, formatCollectionMode, formatDateTime, annulerDeclaration, showTracking, wasteTypes }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Détails de la déclaration</h2>
              <p className="text-gray-600">#{declaration.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full bg-${getStatusColor(declaration.statut)}-100 text-${getStatusColor(declaration.statut)}-800 font-medium`}>
              {getStatusText(declaration.statut)}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-green-600" />
                Informations de la déclaration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Type de déchet</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{wasteTypes[declaration.type_dechet]?.icon || '📦'}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatWasteType(declaration.type_dechet)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Quantité</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Scale className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {declaration.quantite || 0} {declaration.unite || 'kg'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Mode de collecte</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatCollectionMode(declaration.mode_collecte)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Date de création</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatDateTime(declaration.date_declaration)}
                    </span>
                  </div>
                </div>
                
                {declaration.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Instructions spéciales</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1">
                      {declaration.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {declaration.collecteur_nom && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Informations du collecteur
                </h3>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">{declaration.collecteur_nom}</h4>
                  
                  {declaration.collecteur_telephone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{declaration.collecteur_telephone}</span>
                    </div>
                  )}
                  
                  {declaration.collecteur_vehicule && (
                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{declaration.collecteur_vehicule}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {declaration.statut === 'termine' && (
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
                        {declaration.poids_reel || declaration.quantite} kg
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Points gagnés</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-bold text-green-600">
                        +{declaration.points || 0} points
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t flex gap-3">
            {declaration.statut === 'en_attente' && (
              <button
                onClick={() => annulerDeclaration(declaration.id)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Annuler la demande
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                showTracking(declaration.id);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Suivre en temps réel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



// ========== COMPOSANT MODAL SUIVI EN TEMPS RÉEL ==========
const TrackingModal = ({ declaration, onClose, getStatusColor, getStatusText, formatWasteType, formatCollectionMode, formatDateTime, wasteTypes }) => {
  const statusTimeline = [
    {
      id: 'pending',
      label: 'En attente d\'affectation',
      description: 'Nous recherchons un collecteur disponible',
      timestamp: declaration.date_declaration,
      completed: declaration.statut !== 'en_attente',
      icon: Clock,
      color: 'amber'
    },
    {
      id: 'assigned',
      label: 'Collecteur affecté',
      description: declaration.collecteur_nom ? `${declaration.collecteur_nom} a été assigné à votre demande` : 'En attente d\'affectation',
      timestamp: declaration.date_affectation,
      completed: declaration.statut === 'affecte' || declaration.statut === 'programme' || declaration.statut === 'en_cours' || declaration.statut === 'termine',
      icon: User,
      color: 'blue'
    },
    {
      id: 'scheduled',
      label: 'Collecte programmée',
      description: declaration.date_souhaitee ? `Rendez-vous fixé pour le ${formatDateTime(declaration.date_souhaitee)}` : 'En attente de programmation',
      timestamp: declaration.date_souhaitee,
      completed: declaration.statut === 'programme' || declaration.statut === 'en_cours' || declaration.statut === 'termine',
      icon: Calendar,
      color: 'purple'
    },
    {
      id: 'in_progress',
      label: 'En cours de collecte',
      description: declaration.statut === 'en_cours' ? 'Le collecteur est en route' : 'Collecte en attente',
      timestamp: declaration.date_debut_collecte,
      completed: declaration.statut === 'en_cours' || declaration.statut === 'termine',
      icon: Truck,
      color: 'orange'
    },
    {
      id: 'completed',
      label: 'Collecte effectuée',
      description: 'La collecte a été réalisée avec succès',
      timestamp: declaration.date_collecte,
      completed: declaration.statut === 'termine',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Suivi en temps réel</h2>
              <p className="text-gray-600">Déclaration #{declaration.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full bg-${getStatusColor(declaration.statut)}-100 text-${getStatusColor(declaration.statut)}-800 font-medium`}>
              {getStatusText(declaration.statut)}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Progression de la collecte
              </h3>
              
              <div className="space-y-4">
                {statusTimeline.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === statusTimeline.length - 1;
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? `bg-${step.color}-100 text-${step.color}-600` 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-16 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${
                              step.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              step.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                          {step.timestamp && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                              {formatDateTime(step.timestamp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              {declaration.collecteur_nom && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Collecteur assigné
                  </h3>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">{declaration.collecteur_nom}</h4>
                    
                    {declaration.collecteur_telephone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{declaration.collecteur_telephone}</span>
                      </div>
                    )}
                    
                    {declaration.collecteur_vehicule && (
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{declaration.collecteur_vehicule}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {declaration.date_souhaitee && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Programmation
                  </h3>
                  
                  <p className="font-medium text-gray-900">
                    {formatDateTime(declaration.date_souhaitee)}
                  </p>
                </div>
              )}

              {declaration.statut === 'termine' && declaration.points && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Résultat
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Poids réel</p>
                      <p className="font-medium text-gray-900">
                        {declaration.poids_reel || declaration.quantite} kg
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Points gagnés</p>
                      <p className="font-medium text-green-600">
                        +{declaration.points} points
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== COMPOSANT HISTORIQUE ==========
const HistorySection = ({ declarations, searchTerm, setSearchTerm, declarationFilter, setDeclarationFilter, loadDeclarations, getStatusColor, getStatusText, formatDate, formatWasteType, showDeclarationDetail, wasteTypes, isLoading }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <History className="w-6 h-6 text-green-600" />
        Historique des déclarations
      </h1>

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
              <option value="termine">Terminé</option>
              <option value="affecte">En cours</option>
              <option value="programme">En chemin</option>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {declarations.length > 0 ? (
            declarations.map(declaration => {
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
                        <span className="text-lg">{wasteTypes[declaration.type_dechet]?.icon || '📦'}</span>
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
                      
                      {declaration.statut === 'termine' && declaration.points && (
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm">
                          <span className="text-purple-600 font-medium">
                            <Award className="w-3 h-3 inline mr-1" />
                            +{declaration.points} points
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => showDeclarationDetail(declaration.id)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Détails</span>
                    </button>
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

// ========== COMPOSANT RÉCOMPENSES ==========
const RewardsSection = ({ totalPoints, totalWaste }) => {
  const nextLevelPoints = 500;
  const progress = Math.min((totalPoints / nextLevelPoints) * 100, 100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-green-600" />
        Mes récompenses
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Programme de fidélité</h2>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Points accumulés</span>
              <span className="text-2xl font-bold">{totalPoints} / {nextLevelPoints}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-yellow-400 h-3 rounded-full" style={{width: `${progress}%`}}></div>
            </div>
            <p className="text-sm mt-2">{nextLevelPoints - totalPoints} points avant le prochain niveau</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm opacity-90">Déchets collectés</p>
              <p className="text-2xl font-bold">{totalWaste} kg</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm opacity-90">Niveau actuel</p>
              <p className="text-2xl font-bold">Éco-Héros</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Avantages du niveau</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Collecte prioritaire</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>+15% de points bonus</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Badge "Éco-Héros"</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Accès aux récompenses exclusives</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};



// ========== COMPOSANT PROFIL ==========
const ProfileSection = ({ 
  currentUser, dashboardData, profileForm, setProfileForm, isEditing, setIsEditing,
  isLoading, handleUpdateProfile, handleLocationClick, locationLoading,
  showPasswordFields, setShowPasswordFields, passwordForm, setPasswordForm,
  handleChangePassword, copyToken, currentToken, formatProducerType, formatDate, handleLogout
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-green-600" />
        Mon Compte
      </h1>

      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-8 text-white">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                {currentUser?.nomComplet}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <Leaf className="h-4 w-4" />
                  Éco-producteur
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
                {/* Dans la section des informations personnelles */}
       {currentUser?.type_compte === 'premium' && (
           <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          <Star className="w-3 h-3 fill-current" />
    Premium
        </div>
        )}
              </>
            )}
          </div>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{formatProducerType(currentUser?.typeProducteur)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-900">{currentUser?.adresse || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p className="font-medium text-gray-900">
                    {[currentUser?.quartier, currentUser?.commune].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-medium text-gray-900">{currentUser?.cree_le ? formatDate(currentUser.cree_le) : '-'}</p>
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
  );
};

// ========== COMPOSANT PARAMÈTRES ==========
const SettingsSection = ({ copyToken, currentToken, handleLogout }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-green-600" />
        Paramètres
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences générales</h3>
            <p className="text-gray-500">Cette section est en cours de développement.</p>
          </div>
        </div>

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
  );
};

export default ProducteurDashboard;