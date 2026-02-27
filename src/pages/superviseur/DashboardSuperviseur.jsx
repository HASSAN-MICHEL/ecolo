


import { useState, useEffect, useCallback, useRef, useMemo, useDeferredValue } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import {
  // Icônes principales
  User, Users, UserPlus, UserCheck, UserX, UserCog,
  Building, MapPin, Phone, Mail, Calendar, Clock,
  CheckCircle, XCircle, AlertCircle, Info, Eye,
  Edit2, Trash2, Save, X, Plus, Search, Filter,
  RefreshCw, Download, Upload, FileText, Printer,
  BarChart3, PieChart, TrendingUp, Award, Star,
  Shield, Key, LogOut, Menu, Home, LayoutDashboard,
  Package, Truck, Wallet, History, HelpCircle, Settings,
  ChevronRight, ChevronDown, ChevronUp, ArrowLeft,
  Scale, Gift, AlertTriangle, Check, Copy, ExternalLink
} from 'lucide-react';

// ==================== COMPOSANT MODAL GESTIONNAIRE ====================
const GestionnaireModal = ({ isOpen, onClose, gestionnaire, pointsDepot, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    telephone: '',
    motDePasse: '',
    nomComplet: '',
    pointCollecteId: '',
    fonction: 'Gestionnaire'
  });

  // Initialisation quand le modal s'ouvre
  useEffect(() => {
    if (gestionnaire) {
      setFormData({
        email: gestionnaire.email || '',
        telephone: gestionnaire.telephone || '',
        motDePasse: '', // Ne pas afficher le mot de passe existant
        nomComplet: gestionnaire.nomComplet || gestionnaire.nom_complet || '',
        pointCollecteId: gestionnaire.pointCollecteId || gestionnaire.point_collecte_id || '',
        fonction: gestionnaire.fonction || 'Gestionnaire'
      });
    } else {
      setFormData({
        email: '',
        telephone: '',
        motDePasse: '',
        nomComplet: '',
        pointCollecteId: '',
        fonction: 'Gestionnaire'
      });
    }
  }, [gestionnaire, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {gestionnaire ? 'Modifier le gestionnaire' : 'Créer un gestionnaire'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
              <input
                type="text"
                name="nomComplet"
                value={formData.nomComplet}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            {!gestionnaire && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fonction</label>
              <input
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Point de collecte</label>
              <select
                name="pointCollecteId"
                value={formData.pointCollecteId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Non assigné</option>
                {pointsDepot.map(p => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {gestionnaire ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== COMPOSANT MODAL POINT DÉPÔT CORRIGÉ ====================
const PointDepotModal = ({ isOpen, onClose, point, onSubmit }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    quartier: '',
    commune: '',
    typesDechetsAcceptes: []
  });

  // Initialisation quand le modal s'ouvre
  useEffect(() => {
    if (point) {
      // S'assurer que typesDechetsAcceptes est toujours un tableau
      let typesAcceptes = [];
      
      // Vérifier les différentes propriétés possibles
      if (point.typesDechetsAcceptes && Array.isArray(point.typesDechetsAcceptes)) {
        typesAcceptes = point.typesDechetsAcceptes;
      } else if (point.types_dechets_acceptes && Array.isArray(point.types_dechets_acceptes)) {
        typesAcceptes = point.types_dechets_acceptes;
      } else if (point.typesDechetsAcceptes && typeof point.typesDechetsAcceptes === 'string') {
        // Si c'est une chaîne JSON, la parser
        try {
          const parsed = JSON.parse(point.typesDechetsAcceptes);
          typesAcceptes = Array.isArray(parsed) ? parsed : [];
        } catch {
          typesAcceptes = [];
        }
      } else if (point.types_dechets_acceptes && typeof point.types_dechets_acceptes === 'string') {
        try {
          const parsed = JSON.parse(point.types_dechets_acceptes);
          typesAcceptes = Array.isArray(parsed) ? parsed : [];
        } catch {
          typesAcceptes = [];
        }
      }
      
      setFormData({
        nom: point.nom || '',
        adresse: point.adresse || '',
        quartier: point.quartier || '',
        commune: point.commune || '',
        typesDechetsAcceptes: typesAcceptes
      });
    } else {
      setFormData({
        nom: '',
        adresse: '',
        quartier: '',
        commune: '',
        typesDechetsAcceptes: []
      });
    }
  }, [point, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, typesDechetsAcceptes: values }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {point ? 'Modifier le point de collecte' : 'Créer un point de collecte'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
                autoFocus
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
              <input
                type="text"
                name="quartier"
                value={formData.quartier}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
              <input
                type="text"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Types de déchets acceptés</label>
              <select
                multiple
                value={formData.typesDechetsAcceptes}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                size="6"
              >
                <option value="plastique">Plastique</option>
                <option value="verre">Verre</option>
                <option value="papier">Papier</option>
                <option value="carton">Carton</option>
                <option value="metal">Métal</option>
                <option value="organique">Organique</option>
                <option value="electronique">Électronique</option>
                <option value="textile">Textile</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs types
              </p>
              
              {/* Vérification de sécurité avant d'utiliser map */}
              {formData.typesDechetsAcceptes && Array.isArray(formData.typesDechetsAcceptes) && formData.typesDechetsAcceptes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.typesDechetsAcceptes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {point ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const DashboardSuperviseur = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userData, setUserData] = useState({
    id: '',
    nomComplet: '',
    email: '',
    telephone: '',
    role: '',
    photoUrl: ''
  });

  // États pour les données
  const [stats, setStats] = useState({
    totalCollecteurs: 0,
    collecteursActifs: 0,
    collecteursEnAttente: 0,
    totalGestionnaires: 0,
    gestionnairesActifs: 0,
    totalMissions: 0,
    missionsValidees: 0,
    totalDechetsCollectes: 0,
    totalGainsDistribues: 0
  });

  const [collecteursEnAttente, setCollecteursEnAttente] = useState([]);
  const [collecteurs, setCollecteurs] = useState([]);
  const [gestionnaires, setGestionnaires] = useState([]);
  const [pointsDepot, setPointsDepot] = useState([]);
  const [missionsDisponibles, setMissionsDisponibles] = useState([]);
  const [collecteursActifs, setCollecteursActifs] = useState([]);
  
  // États pour les statistiques avancées
  const [evolutionHebdomadaire, setEvolutionHebdomadaire] = useState([]);
  
  // États pour les modals
  const [showCollecteurDetails, setShowCollecteurDetails] = useState(false);
  const [selectedCollecteur, setSelectedCollecteur] = useState(null);
  const [showGestionnaireModal, setShowGestionnaireModal] = useState(false);
  const [showPointDepotModal, setShowPointDepotModal] = useState(false);
  const [editingGestionnaire, setEditingGestionnaire] = useState(null);
  const [editingPointDepot, setEditingPointDepot] = useState(null);
  
  // États pour les formulaires
  const [gestionnaireForm, setGestionnaireForm] = useState({
    email: '',
    telephone: '',
    motDePasse: '',
    nomComplet: '',
    pointCollecteId: '',
    fonction: 'Gestionnaire'
  });
  
  const [pointDepotForm, setPointDepotForm] = useState({
    nom: '',
    adresse: '',
    quartier: '',
    commune: '',
    typesDechetsAcceptes: []
  });

  // États pour la recherche avec optimisation
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [validationNotes, setValidationNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Références pour éviter les re-rendus inutiles
  const initialLoadDone = useRef(false);
  const intervalRef = useRef(null);
  const formTimeouts = useRef({});

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = 'https://ecobackend-y6nd.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);
  
  const getInitials = (name) => {
    if (!name) return 'S';
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
      const response = await fetch(`${API_URL}/api/superviseurs/profil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        const profil = result.superviseur || result;
        
        setUserData({
          id: profil.id || '',
          nomComplet: profil.nomComplet || profil.nom_complet || '',
          email: profil.email || '',
          telephone: profil.telephone || '',
          role: profil.role || 'Superviseur',
          photoUrl: profil.photoUrl || ''
        });
      } else {
        console.warn('Profil non chargé, utilisation des données du localStorage');
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
        setUserData({
          id: user.id || '',
          nomComplet: user.nomComplet || user.nom || 'Superviseur',
          email: user.email || '',
          telephone: user.telephone || '',
          role: 'Superviseur',
          photoUrl: ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
      // Utiliser les données du localStorage en cas d'erreur
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
      setUserData({
        id: user.id || '',
        nomComplet: user.nomComplet || user.nom || 'Superviseur',
        email: user.email || '',
        telephone: user.telephone || '',
        role: 'Superviseur',
        photoUrl: ''
      });
    }
  }, [API_URL]);

  const loadAllData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Charger les données disponibles
      const promises = [];

      // Statistiques
      promises.push(
        fetch(`${API_URL}/api/superviseurs/statistiques`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : null)
      );

      // Collecteurs en attente
      promises.push(
        fetch(`${API_URL}/api/superviseurs/collecteurs/en-attente`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { collecteurs: [] })
      );

      // Tous les collecteurs (actifs + en attente)
      promises.push(
        fetch(`${API_URL}/api/superviseurs/collecteurs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { collecteurs: [] })
      );

      // Gestionnaires
      promises.push(
        fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { gestionnaires: [] })
      );

      // Points de dépôt
      promises.push(
        fetch(`${API_URL}/api/points-depot`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { points: [] })
      );

      // Missions disponibles
      promises.push(
        fetch(`${API_URL}/api/superviseurs/missions/disponibles`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { missions: [] })
      );

      // Évolution
      promises.push(
        fetch(`${API_URL}/api/superviseurs/statistiques/evolution?jours=7`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { evolution: [] })
      );

      const [statsRes, collecteursAttenteRes, collecteursRes, gestionnairesRes, pointsRes, missionsRes, evolutionRes] = await Promise.all(promises);

      // Statistiques
      if (statsRes?.success) {
        const s = statsRes.stats || {};
        setStats({
          totalCollecteurs: s.total_collecteurs || 0,
          collecteursActifs: s.collecteurs_actifs || 0,
          collecteursEnAttente: s.collecteurs_en_attente || 0,
          totalGestionnaires: s.total_gestionnaires || 0,
          gestionnairesActifs: s.gestionnaires_actifs || 0,
          totalMissions: s.total_missions || 0,
          missionsValidees: s.missions_validees || 0,
          totalDechetsCollectes: s.total_dechets_collectes || 0,
          totalGainsDistribues: s.total_gains_distribues || 0
        });
      }

      // Collecteurs en attente
      if (collecteursAttenteRes?.success) {
        setCollecteursEnAttente(collecteursAttenteRes.collecteurs || []);
      }

      // Tous les collecteurs
      if (collecteursRes?.success) {
        setCollecteurs(collecteursRes.collecteurs || []);
      }

      // Gestionnaires
      if (gestionnairesRes?.success) {
        setGestionnaires(gestionnairesRes.gestionnaires || []);
      }

      // Points de dépôt
      if (pointsRes?.success) {
        setPointsDepot(pointsRes.points || []);
      }

      // Missions disponibles
      if (missionsRes?.success) {
        setMissionsDisponibles(missionsRes.missions || []);
      }

      // Évolution
      if (evolutionRes?.success) {
        setEvolutionHebdomadaire(evolutionRes.evolution || []);
      }

      // Collecteurs actifs (simulés pour l'instant)
      setCollecteursActifs([
        { id: '1', nomComplet: 'Collecteur 1', telephone: '771234567' },
        { id: '2', nomComplet: 'Collecteur 2', telephone: '778765432' }
      ]);

      setDataLoaded(true);
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      setError('Impossible de charger les données');
      
      // Données simulées pour le développement
      setCollecteursEnAttente([
        { 
          id: '1', 
          nomComplet: 'Collecteur Test', 
          email: 'test@test.com', 
          telephone: '771234567',
          statut: 'en_attente',
          cree_le: new Date().toISOString()
        }
      ]);
      setCollecteurs([
        { 
          id: '1', 
          nomComplet: 'Collecteur Test', 
          email: 'test@test.com', 
          telephone: '771234567',
          statut: 'en_attente',
          cree_le: new Date().toISOString()
        }
      ]);
      setGestionnaires([
        { id: '1', nomComplet: 'Gestionnaire Test', email: 'test@test.com', telephone: '771234567', fonction: 'Principal', est_actif: true, point_collecte_nom: 'Point Central' }
      ]);
      setPointsDepot([
        { id: '1', nom: 'Point Central', adresse: 'Dakar Centre', types_dechets_acceptes: ['plastique', 'verre'] }
      ]);
      setDataLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, navigate]);

  // ==================== CHARGEMENT INITIAL ====================
  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    
    if (!token || role !== 'superviseur') {
      navigate('/login');
      return;
    }

    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      
      const initializeData = async () => {
        await loadUserData();
        await loadAllData();
      };
      
      initializeData();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [navigate, loadUserData, loadAllData]);

  // ==================== RAFRAÎCHISSEMENT PÉRIODIQUE ====================
  useEffect(() => {
    if (dataLoaded && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        loadAllData();
      }, 60000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dataLoaded, loadAllData]);

  // ==================== ACTIONS ====================
  const handleValiderCollecteur = async (collecteurId, notes) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/valider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });

      if (response.ok) {
        alert('✅ Collecteur validé avec succès');
        setShowCollecteurDetails(false);
        await loadAllData();
      } else {
        throw new Error('Erreur lors de la validation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleRejeterCollecteur = async (collecteurId, notes) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/rejeter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notes || 'Rejeté par le superviseur' })
      });

      if (response.ok) {
        alert('❌ Collecteur rejeté');
        setShowCollecteurDetails(false);
        await loadAllData();
      } else {
        throw new Error('Erreur lors du rejet');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  // Version optimisée pour les formulaires - avec debounce
  const debouncedSetForm = (setter, field, value) => {
    // Annuler le timeout précédent pour ce champ
    if (formTimeouts.current[field]) {
      clearTimeout(formTimeouts.current[field]);
    }
    
    // Mettre à jour immédiatement l'état local
    setter(prev => ({ ...prev, [field]: value }));
  };

  const handleCreerGestionnaire = async (formData) => {
    const token = getToken();
    
    // Validation des champs requis
    if (!formData.email || !formData.telephone || !formData.motDePasse || !formData.nomComplet) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.motDePasse,
          nomComplet: formData.nomComplet,
          pointCollecteId: formData.pointCollecteId || null,
          fonction: formData.fonction || 'Gestionnaire'
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Gestionnaire créé avec succès');
        setShowGestionnaireModal(false);
        setEditingGestionnaire(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleModifierGestionnaire = async (formData) => {
    const token = getToken();
    
    // Vérifier que editingGestionnaire n'est pas null
    if (!editingGestionnaire || !editingGestionnaire.id) {
      alert('Erreur : Aucun gestionnaire sélectionné');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${editingGestionnaire.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          telephone: formData.telephone,
          nomComplet: formData.nomComplet,
          pointCollecteId: formData.pointCollecteId || null,
          fonction: formData.fonction,
          estActif: editingGestionnaire.estActif
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Gestionnaire modifié avec succès');
        setShowGestionnaireModal(false);
        setEditingGestionnaire(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleActiverGestionnaire = async (gestionnaireId, estActif) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires/${gestionnaireId}/activer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estActif })
      });

      if (response.ok) {
        alert(estActif ? '✅ Gestionnaire activé' : '✅ Gestionnaire désactivé');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de l\'activation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleCreerPointDepot = async (formData) => {
    const token = getToken();
    
    if (!formData.nom || !formData.adresse) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/points-depot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Point de collecte créé avec succès');
        setShowPointDepotModal(false);
        setEditingPointDepot(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleModifierPointDepot = async (formData) => {
    const token = getToken();
    
    if (!editingPointDepot || !editingPointDepot.id) {
      alert('Erreur : Aucun point de collecte sélectionné');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/points-depot/${editingPointDepot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Point de collecte modifié avec succès');
        setShowPointDepotModal(false);
        setEditingPointDepot(null);
        await loadAllData();
      } else {
        throw new Error(result.message || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleSupprimerPointDepot = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver ce point de collecte ?')) return;
    
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/points-depot/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Point de collecte désactivé');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de la désactivation');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert(error.message);
    }
  };

  const handleAttribuerMission = async (missionId, collecteurId) => {
    if (!collecteurId) {
      alert('Veuillez sélectionner un collecteur');
      return;
    }
    
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/missions/${missionId}/attribuer/${collecteurId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Mission attribuée avec succès');
        await loadAllData();
      } else {
        throw new Error('Erreur lors de l\'attribution');
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
      year: 'numeric'
    });
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'actif':
      case 'valide':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Actif</span>;
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">En attente</span>;
      case 'suspendu':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Suspendu</span>;
      case 'inactif':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Inactif</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
    }
  };

  // ==================== COMPOSANT SIDEBAR ====================
  const Sidebar = () => {
    const menuItems = {
      principal: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/superviseur' },
        { id: 'collecteurs', label: 'Gestion collecteurs', icon: Users, path: '/superviseur/collecteurs', badge: stats.collecteursEnAttente },
        { id: 'gestionnaires', label: 'Gestion gestionnaires', icon: UserCog, path: '/superviseur/gestionnaires' },
        { id: 'points-depot', label: 'Points de collecte', icon: Building, path: '/superviseur/points-depot' },
        { id: 'missions', label: 'Gestion missions', icon: Package, path: '/superviseur/missions' }
      ],
      compte: [
        { id: 'profil', label: 'Mon profil', icon: User, path: '/superviseur/profil' },
        { id: 'securite', label: 'Sécurité', icon: Shield, path: '/superviseur/securite' },
        { id: 'aide', label: 'Aide', icon: HelpCircle, path: '/superviseur/aide' }
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
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
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
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-8 h-8 text-white" />
                  <span className="text-xl font-bold text-white">Superviseur</span>
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(userData.nomComplet)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
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
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex items-center gap-2">
              <User className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Superviseur</span>
            </div>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getInitials(userData.nomComplet)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{userData.nomComplet || 'Superviseur'}</p>
                <p className="text-xs text-gray-500">{userData.role}</p>
                <p className="text-xs text-gray-500 mt-1">{userData.email}</p>
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-purple-600" />
          Tableau de bord
        </h1>
        <p className="text-gray-600">Bienvenue, {userData.nomComplet?.split(' ')[0] || 'Superviseur'} !</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalCollecteurs}</span>
          </div>
          <p className="text-purple-100">Collecteurs</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Actifs: {stats.collecteursActifs}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">
              En attente: {stats.collecteursEnAttente}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <UserCog className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalGestionnaires}</span>
          </div>
          <p className="text-blue-100">Gestionnaires</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Actifs: {stats.gestionnairesActifs}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.missionsValidees}</span>
          </div>
          <p className="text-green-100">Missions validées</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Total: {stats.totalMissions}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Scale className="h-8 w-8" />
            <span className="text-3xl font-bold">{stats.totalDechetsCollectes} kg</span>
          </div>
          <p className="text-orange-100">Déchets collectés</p>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span>Gains: {stats.totalGainsDistribues.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      {/* Collecteurs en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Collecteurs en attente
              {collecteursEnAttente.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  {collecteursEnAttente.length}
                </span>
              )}
            </h3>
            <Link to="/superviseur/collecteurs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Voir tout
            </Link>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {collecteursEnAttente.length > 0 ? (
              collecteursEnAttente.slice(0, 5).map((collecteur) => (
                <div
                  key={collecteur.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedCollecteur(collecteur);
                    setShowCollecteurDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{collecteur.nomComplet || collecteur.nom_complet}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <Mail className="inline h-3 w-3 mr-1" /> {collecteur.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Phone className="inline h-3 w-3 mr-1" /> {collecteur.telephone}
                      </p>
                    </div>
                    {getStatusBadge(collecteur.statut)}
                  </div>
                  <div className="text-sm text-gray-500">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Inscrit le {formatDate(collecteur.cree_le)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucun collecteur en attente</p>
            )}
          </div>
        </div>

        {/* Évolution récente */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Évolution des 7 derniers jours
            </h3>
          </div>
          
          <div className="space-y-4">
            {evolutionHebdomadaire.length > 0 ? (
              evolutionHebdomadaire.map((jour, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {new Date(jour.jour).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {jour.missions_validees || 0} missions
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Poids: {jour.poids_total || 0} kg</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune donnée disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Gestionnaires récents */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCog className="h-5 w-5 text-purple-600" />
            Gestionnaires récents
          </h3>
          <Link to="/superviseur/gestionnaires" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            Voir tout
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gestionnaires.slice(0, 3).map((gestionnaire) => (
            <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{gestionnaire.nomComplet || gestionnaire.nom_complet}</p>
                  <p className="text-sm text-gray-600 mt-1">{gestionnaire.fonction}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <MapPin className="inline h-3 w-3 mr-1" />
                {gestionnaire.point_collecte_nom || 'Non assigné'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==================== PAGE GESTION COLLECTEURS ====================
  const CollecteursPage = () => {
    // Filtrer les collecteurs avec le terme de recherche différé
    const filteredCollecteurs = useMemo(() => {
      if (!deferredSearchTerm) return collecteurs;
      return collecteurs.filter(c => 
        (c.nomComplet || c.nom_complet || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (c.telephone || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [collecteurs, deferredSearchTerm]);

    const collecteursEnAttenteListe = useMemo(() => {
      return filteredCollecteurs.filter(c => c.statut === 'en_attente');
    }, [filteredCollecteurs]);

    const collecteursActifsListe = useMemo(() => {
      return filteredCollecteurs.filter(c => c.statut === 'actif' || c.statut === 'valide');
    }, [filteredCollecteurs]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-600" />
            Gestion des collecteurs
          </h1>
          <p className="text-gray-600 mt-1">Total: {collecteurs.length} collecteurs</p>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un collecteur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Collecteurs en attente */}
        {collecteursEnAttenteListe.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Collecteurs en attente ({collecteursEnAttenteListe.length})
            </h2>
            <div className="space-y-4">
              {collecteursEnAttenteListe.map((collecteur) => (
                <div
                  key={collecteur.id}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => {
                    setSelectedCollecteur(collecteur);
                    setShowCollecteurDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {collecteur.nomComplet || collecteur.nom_complet}
                        </h3>
                        {getStatusBadge(collecteur.statut)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{collecteur.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{collecteur.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Inscrit le {formatDate(collecteur.cree_le)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCollecteur(collecteur);
                        setShowCollecteurDetails(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Traiter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collecteurs actifs */}
        {collecteursActifsListe.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Collecteurs actifs ({collecteursActifsListe.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collecteursActifsListe.map((collecteur) => (
                <div key={collecteur.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{collecteur.nomComplet || collecteur.nom_complet}</h3>
                      <p className="text-sm text-gray-600 mt-1">{collecteur.email}</p>
                    </div>
                    {getStatusBadge(collecteur.statut)}
                  </div>
                  <p className="text-sm text-gray-600">
                    <Phone className="inline h-3 w-3 mr-1" /> {collecteur.telephone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredCollecteurs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun collecteur trouvé</h3>
            <p className="text-gray-600">Aucun collecteur ne correspond à votre recherche</p>
          </div>
        )}

        {/* Modal de validation */}
        {showCollecteurDetails && selectedCollecteur && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Validation du collecteur</h2>
                  <button
                    onClick={() => setShowCollecteurDetails(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Informations du collecteur</p>
                      <p className="text-sm text-blue-600 mt-1">
                        <span className="font-semibold">Nom:</span> {selectedCollecteur.nomComplet || selectedCollecteur.nom_complet}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-semibold">Email:</span> {selectedCollecteur.email}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-semibold">Téléphone:</span> {selectedCollecteur.telephone}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optionnel)
                  </label>
                  <textarea
                    rows="3"
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                    placeholder="Ajouter des notes..."
                  />
                </div>

                <div className="flex gap-3">
            
                  <button
                    onClick={() => {
                      handleValiderCollecteur(selectedCollecteur.id, validationNotes);
                      setValidationNotes('');
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==================== PAGE GESTION GESTIONNAIRES (OPTIMISÉE) ====================
  const GestionnairesPage = () => {
    const [localEditingGestionnaire, setLocalEditingGestionnaire] = useState(null);
    const [localShowModal, setLocalShowModal] = useState(false);

    // Version locale du formulaire avec gestion optimisée
    const [localGestionnaireForm, setLocalGestionnaireForm] = useState({
      email: '',
      telephone: '',
      motDePasse: '',
      nomComplet: '',
      pointCollecteId: '',
      fonction: 'Gestionnaire'
    });

    const handleOpenCreateModal = () => {
      setLocalEditingGestionnaire(null);
      setLocalGestionnaireForm({
        email: '',
        telephone: '',
        motDePasse: '',
        nomComplet: '',
        pointCollecteId: '',
        fonction: 'Gestionnaire'
      });
      setGestionnaireForm({
        email: '',
        telephone: '',
        motDePasse: '',
        nomComplet: '',
        pointCollecteId: '',
        fonction: 'Gestionnaire'
      });
      setLocalShowModal(true);
      setShowGestionnaireModal(true);
    };

    const handleOpenEditModal = (gestionnaire) => {
      if (gestionnaire && gestionnaire.id) {
        const editData = {
          id: gestionnaire.id,
          email: gestionnaire.email || '',
          telephone: gestionnaire.telephone || '',
          nomComplet: gestionnaire.nomComplet || gestionnaire.nom_complet || '',
          pointCollecteId: gestionnaire.point_collecte_id || '',
          fonction: gestionnaire.fonction || 'Gestionnaire',
          estActif: gestionnaire.est_actif !== undefined ? gestionnaire.est_actif : true
        };
        setLocalEditingGestionnaire(editData);
        setEditingGestionnaire(editData);
        setLocalShowModal(true);
        setShowGestionnaireModal(true);
      } else {
        console.error('Gestionnaire invalide:', gestionnaire);
        alert('Erreur : gestionnaire invalide');
      }
    };

    const handleCloseModal = () => {
      setLocalShowModal(false);
      setShowGestionnaireModal(false);
      setLocalEditingGestionnaire(null);
      setEditingGestionnaire(null);
    };

    const handleSubmit = (formData) => {
      if (editingGestionnaire) {
        handleModifierGestionnaire(formData);
      } else {
        handleCreerGestionnaire(formData);
      }
    };

    // Filtrer les gestionnaires avec le terme de recherche différé
    const filteredGestionnaires = useMemo(() => {
      if (!deferredSearchTerm) return gestionnaires;
      return gestionnaires.filter(g => 
        (g.nomComplet || g.nom_complet || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (g.email || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (g.telephone || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [gestionnaires, deferredSearchTerm]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="h-6 w-6 text-purple-600" />
              Gestion des gestionnaires
            </h1>
            <p className="text-gray-600 mt-1">{gestionnaires.length} gestionnaires</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Nouveau gestionnaire
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un gestionnaire..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Liste des gestionnaires */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {filteredGestionnaires.length > 0 ? (
              filteredGestionnaires.map((gestionnaire) => (
                <div key={gestionnaire.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {gestionnaire.nomComplet || gestionnaire.nom_complet}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gestionnaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {gestionnaire.est_actif ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{gestionnaire.point_collecte_nom || 'Non assigné'}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        <UserCog className="inline h-3 w-3 mr-1" />
                        {gestionnaire.fonction}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(gestionnaire)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleActiverGestionnaire(gestionnaire.id, !gestionnaire.est_actif)}
                        className={`p-2 ${
                          gestionnaire.est_actif ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        } rounded-lg`}
                      >
                        {gestionnaire.est_actif ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <UserCog className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun gestionnaire trouvé</h3>
                <p className="text-gray-600">Cliquez sur "Nouveau gestionnaire" pour en créer un</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de création/édition */}
        <GestionnaireModal
          isOpen={showGestionnaireModal}
          onClose={handleCloseModal}
          gestionnaire={editingGestionnaire}
          pointsDepot={pointsDepot}
          onSubmit={handleSubmit}
        />
      </div>
    );
  };

  // ==================== PAGE POINTS DE COLLECTE ====================
  const PointsDepotPage = () => {
    const [localEditingPoint, setLocalEditingPoint] = useState(null);
    const [localShowModal, setLocalShowModal] = useState(false);

    // Version locale du formulaire avec gestion optimisée
    const [localPointDepotForm, setLocalPointDepotForm] = useState({
      nom: '',
      adresse: '',
      quartier: '',
      commune: '',
      typesDechetsAcceptes: []
    });

    const handleOpenCreateModal = () => {
      setLocalEditingPoint(null);
      setEditingPointDepot(null);
      setLocalPointDepotForm({
        nom: '',
        adresse: '',
        quartier: '',
        commune: '',
        typesDechetsAcceptes: []
      });
      setPointDepotForm({
        nom: '',
        adresse: '',
        quartier: '',
        commune: '',
        typesDechetsAcceptes: []
      });
      setLocalShowModal(true);
      setShowPointDepotModal(true);
    };

    const handleOpenEditModal = (point) => {
      if (point && point.id) {
        const editData = {
          id: point.id,
          nom: point.nom || '',
          adresse: point.adresse || '',
          quartier: point.quartier || '',
          commune: point.commune || '',
          typesDechetsAcceptes: point.types_dechets_acceptes || []
        };
        setLocalEditingPoint(point);
        setEditingPointDepot(editData);
        setLocalShowModal(true);
        setShowPointDepotModal(true);
      }
    };

    const handleCloseModal = () => {
      setLocalShowModal(false);
      setShowPointDepotModal(false);
      setLocalEditingPoint(null);
      setEditingPointDepot(null);
    };

    const handleSubmit = (formData) => {
      if (editingPointDepot) {
        handleModifierPointDepot(formData);
      } else {
        handleCreerPointDepot(formData);
      }
    };

    // Filtrer les points avec le terme de recherche différé
    const filteredPoints = useMemo(() => {
      if (!deferredSearchTerm) return pointsDepot;
      return pointsDepot.filter(p => 
        (p.nom || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (p.adresse || '').toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
        (p.quartier || '').toLowerCase().includes(deferredSearchTerm.toLowerCase())
      );
    }, [pointsDepot, deferredSearchTerm]);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="h-6 w-6 text-purple-600" />
              Points de collecte
            </h1>
            <p className="text-gray-600 mt-1">{pointsDepot.length} points actifs</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau point
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un point de collecte..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Liste des points */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.length > 0 ? (
            filteredPoints.map((point) => (
              <div key={point.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{point.nom}</h3>
                    <p className="text-sm text-gray-600 mt-1">{point.adresse}</p>
                    {point.quartier && <p className="text-sm text-gray-500">{point.quartier}</p>}
                    {point.commune && <p className="text-sm text-gray-500">{point.commune}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(point)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleSupprimerPointDepot(point.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Déchets acceptés</p>
                  <div className="flex flex-wrap gap-2">
                    {point.types_dechets_acceptes && Array.isArray(point.types_dechets_acceptes) && point.types_dechets_acceptes.length > 0 ? (
                      point.types_dechets_acceptes.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {type}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Aucun type spécifié</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white rounded-xl shadow-lg p-12 text-center">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun point de collecte trouvé</h3>
              <p className="text-gray-600">Cliquez sur "Nouveau point" pour en créer un</p>
            </div>
          )}
        </div>

        {/* Modal de création/édition */}
        <PointDepotModal
          isOpen={showPointDepotModal}
          onClose={handleCloseModal}
          point={editingPointDepot}
          onSubmit={handleSubmit}
        />
      </div>
    );
  };

  // ==================== AUTRES PAGES ====================
  const MissionsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-600" />
          Gestion des missions
        </h1>
        <p className="text-gray-600">Page en cours de développement</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalité à venir</h3>
        <p className="text-gray-600">La gestion des missions sera bientôt disponible</p>
      </div>
    </div>
  );

  const ProfilPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-purple-600" />
          Mon profil
        </h1>
        <p className="text-gray-600">Gérez vos informations personnelles</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nom complet</label>
            <p className="text-lg font-semibold">{userData.nomComplet}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{userData.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Téléphone</label>
            <p className="text-lg">{userData.telephone || 'Non renseigné'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Rôle</label>
            <p className="text-lg">{userData.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SecuritePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          Sécurité
        </h1>
        <p className="text-gray-600">Gérez la sécurité de votre compte</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md">
        <p className="text-gray-600 mb-4">Fonctionnalité de changement de mot de passe à venir</p>
      </div>
    </div>
  );

  const AidePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-purple-600" />
          Centre d'aide
        </h1>
        <p className="text-gray-600">Guide d'utilisation du superviseur</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Gestion des gestionnaires</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Créez de nouveaux comptes gestionnaires</li>
            <li>• Assignez-les à des points de collecte</li>
            <li>• Activez ou désactivez leurs comptes</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Points de collecte</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Ajoutez de nouveaux points de collecte</li>
            <li>• Définissez les types de déchets acceptés</li>
            <li>• Modifiez ou désactivez des points existants</li>
          </ul>
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(userData.nomComplet)}
                </div>
              </div>
            </div>
          </header>
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
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
                onClick={loadAllData}
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
              {getInitials(userData.nomComplet)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content avec routage interne */}
      <div className="lg:ml-80 min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/collecteurs" element={<CollecteursPage />} />
          <Route path="/gestionnaires" element={<GestionnairesPage />} />
          <Route path="/points-depot" element={<PointsDepotPage />} />
          <Route path="/missions" element={<MissionsPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/securite" element={<SecuritePage />} />
          <Route path="/aide" element={<AidePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardSuperviseur;