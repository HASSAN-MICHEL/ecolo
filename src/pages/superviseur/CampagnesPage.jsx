

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Target, DollarSign, Map, Package, Plus,
  Edit2, Trash2, Eye, CheckCircle, XCircle, Clock,
  Filter, Search, RefreshCw, Download, Users, Award,
  TrendingUp, BarChart3, PieChart, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CampagnesPage = () => {
  const navigate = useNavigate();
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [campagneDetails, setCampagneDetails] = useState(null);
  const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [promoteurs, setPromoteurs] = useState({
    sponsors: [],
    ongs: []
  });
  const [user, setUser] = useState(null);
 const [formData, setFormData] = useState({
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
    zonesIntervention: [],
    promoteurs: []
  });


  // const API_URL = 'http://localhost:3000';
  const API_URL = 'https://ecobackend-zeds.vercel.app';
  const STORAGE_KEYS = {
    TOKEN: 'ecocollect_token',
    USER: 'ecocollect_user',
    ROLE: 'ecocollect_role'
  };
 

  const getToken = () => localStorage.getItem(STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    setUser(userData);
    loadCampagnes();
    loadPromoteurs();
  }, [filtreStatut]);

  const loadCampagnes = async () => {
    const token = getToken();
    setLoading(true);

    try {
      const url = new URL(`${API_URL}/api/campagnes`);
      if (filtreStatut !== 'tous') {
        url.searchParams.append('statut', filtreStatut);
      }

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        // ✅ S'assurer que types_dechets est toujours un tableau
        const campagnesFormatees = (data.campagnes || []).map(c => ({
          ...c,
          types_dechets: Array.isArray(c.types_dechets) ? c.types_dechets : 
                         (c.types_dechets ? [c.types_dechets] : [])
        }));
        setCampagnes(campagnesFormatees);
      }
    } catch (error) {
      console.error('Erreur chargement campagnes:', error);
      toast.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };
 const loadCampagneDetails = async (campagneId) => {
  const token = getToken();
  setLoadingDetails(true); // ← ACTIVER LE CHARGEMENT
  try {
    const response = await fetch(`${API_URL}/api/campagnes/${campagneId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (data.success) {
      setCampagneDetails(data.campagne);
      setEvolutionJournaliere(data.campagne.evolution || []);
      setPointsDetails(data.campagne.points_couverts || []);
    }
  } catch (error) {
    console.error('Erreur chargement détails:', error);
    toast.error('Erreur lors du chargement des détails');
  } finally {
    setLoadingDetails(false); // ← DÉSACTIVER LE CHARGEMENT
  }
};

  const handleObjectifChange = (index, field, value) => {
    const nouveauxObjectifs = [...formData.objectifs];
    nouveauxObjectifs[index][field] = value;
    setFormData(prev => ({ ...prev, objectifs: nouveauxObjectifs }));
  };

// Modifiez le gestionnaire de clic sur le bouton Voir détails
const handleViewDetails = (campagne) => {
  setSelectedCampagne(campagne);
  loadCampagneDetails(campagne.id);
  setShowDetailsModal(true);
};

  const loadPromoteurs = async () => {
    const token = getToken();
    try {
      // ✅ Utiliser les routes superviseurs pour récupérer les promoteurs
      const [sponsorsRes, ongsRes] = await Promise.all([
        fetch(`${API_URL}/api/superviseurs/sponsors`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/superviseurs/ongs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : { sponsors: [] };
      const ongsData = ongsRes.ok ? await ongsRes.json() : { ongs: [] };

      setPromoteurs({
        sponsors: sponsorsData.sponsors || [],
        ongs: ongsData.ongs || []
      });
    } catch (error) {
      console.error('Erreur chargement promoteurs:', error);
      // Données mockées pour le développement
      setPromoteurs({
        sponsors: [
          { id: '1', nom_organisation: 'Sponsor Test 1' },
          { id: '2', nom_organisation: 'Sponsor Test 2' }
        ],
        ongs: [
          { id: '3', nom_ong: 'ONG Test 1' },
          { id: '4', nom_ong: 'ONG Test 2' }
        ]
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCampagnes();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Gestion des checkboxes pour les types de déchets
  const handleTypeDechetChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      typesDechets: checked 
        ? [...prev.typesDechets, value]
        : prev.typesDechets.filter(t => t !== value)
    }));
  };

  const handleZoneChange = (e) => {
    const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
    setFormData(prev => ({ ...prev, zonesIntervention: zones }));
  };

  const handlePromoteurChange = (e) => {
    const { value, checked } = e.target;
    const [type, id] = value.split(':');
    
    setFormData(prev => ({
      ...prev,
      promoteurs: checked
        ? [...prev.promoteurs, { type, id }]
        : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validations
  //   if (!formData.nom || !formData.dateDebut || !formData.dateFin || 
  //       !formData.typesDechets.length || !formData.poidsAttendue || !formData.prixParKg) {
  //     toast.error('Veuillez remplir tous les champs obligatoires');
  //     return;
  //   }

  //   if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
  //     toast.error('La date de début doit être antérieure à la date de fin');
  //     return;
  //   }

  //   const token = getToken();
  //   try {
  //     const response = await fetch(`${API_URL}/api/campagnes`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(formData)
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       toast.success('✅ Campagne créée avec succès');
  //       setShowCreateModal(false);
  //       setFormData({
  //         nom: '',
  //         description: '',
  //         dateDebut: '',
  //         dateFin: '',
  //         typesDechets: [],
  //         zonesIntervention: [],
  //         poidsAttendue: '',
  //         prixParKg: '',
  //         promoteurs: []
  //       });
  //       loadCampagnes();
  //     } else {
  //       throw new Error(data.message || 'Erreur lors de la création');
  //     }
  //   } catch (error) {
  //     console.error('❌ Erreur:', error);
  //     toast.error(error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.nom || !formData.dateDebut || !formData.dateFin) {
      toast.error('Veuillez remplir le nom et les dates de la campagne');
      return;
    }

    // Valider les objectifs
    if (formData.objectifs.length === 0) {
      toast.error('Ajoutez au moins un objectif');
      return;
    }

    for (const obj of formData.objectifs) {
      if (!obj.typeDechet || !obj.poidsAttendue || !obj.prixParKg) {
        toast.error('Tous les objectifs doivent être complets');
        return;
      }
      if (parseFloat(obj.poidsAttendue) <= 0 || parseFloat(obj.prixParKg) <= 0) {
        toast.error('Les poids et prix doivent être positifs');
        return;
      }
    }

    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      toast.error('La date de début doit être antérieure à la date de fin');
      return;
    }

    const token = getToken();
    try {
      console.log('📤 Envoi campagne:', formData);
      
      const response = await fetch(`${API_URL}/api/campagnes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // ← formData ne contient plus poidsAttendue global
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Campagne créée avec succès');
        setShowCreateModal(false);
        setFormData({
          nom: '',
          description: '',
          dateDebut: '',
          dateFin: '',
          objectifs: [{ typeDechet: '', poidsAttendue: '', prixParKg: '' }],
          zonesIntervention: [],
          promoteurs: []
        });
        loadCampagnes();
      } else {
        throw new Error(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error(error.message);
    }
  };

  
  // Fonctions pour gérer les objectifs
  const handleAjouterObjectif = () => {
    setFormData(prev => ({
      ...prev,
      objectifs: [...prev.objectifs, { typeDechet: '', poidsAttendue: '', prixParKg: '' }]
    }));
  };

 
  // const handleZoneChange = (e) => {
  //   const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
  //   setFormData(prev => ({ ...prev, zonesIntervention: zones }))
  // };

  // const handlePromoteurChange = (e) => {
  //   const { value, checked } = e.target;
  //   const [type, id] = value.split(':');
    
  //   setFormData(prev => ({
  //     ...prev,
  //     promoteurs: checked
  //       ? [...prev.promoteurs, { type, id }]
  //       : prev.promoteurs.filter(p => !(p.type === type && p.id === id))
  //   }));
  // };

  const handleChangerStatut = async (campagneId, nouveauStatut) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/campagnes/${campagneId}/statut`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statut: nouveauStatut })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Campagne ${nouveauStatut === 'active' ? 'activée' : 'mise à jour'}`);
        loadCampagnes();
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'planifiee': { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Planifiée' },
      'active': { color: 'bg-green-100 text-green-800', icon: TrendingUp, label: 'Active' },
      'suspendue': { color: 'bg-yellow-100 text-yellow-800', icon: XCircle, label: 'Suspendue' },
      'terminee': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminée' }
    };
    const badge = badges[statut] || badges.planifiee;
    const Icon = badge.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique',
      'plastique': 'Plastique',
      'papier': 'Papier',
      'carton': 'Carton'
    };
    return labels[type] || type;
  };

  const filteredCampagnes = campagnes.filter(c => {
    if (!searchTerm) return true;
    return c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const typesDechetDisponibles = [
    { value: 'plastique_pet', label: 'Plastique PET' },
    { value: 'plastique_pehd', label: 'Plastique PEHD' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'metal', label: 'Métal' },
    { value: 'verre', label: 'Verre' },
    { value: 'organique', label: 'Organique' }
  ];

  const styles = `
    .campagnes-container {
      padding: 1.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-btn {
      padding: 0.6rem 1.5rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 100px;
      background: white;
      color: #1a1e1a;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .search-bar {
      flex: 1;
      display: flex;
      gap: 0.5rem;
    }

    .search-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.9rem;
    }

    .search-input:focus {
      border-color: #667eea;
      outline: none;
    }

    .refresh-btn {
      background: white;
      border: 1px solid #d9e0d9;
      border-radius: 0.75rem;
      padding: 0.6rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #e8f3e8;
      border-color: #667eea;
    }

    .btn-primary {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary:hover {
      background: #5a67d8;
    }

    .campagnes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }

    .campagne-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      transition: all 0.3s;
    }

    .campagne-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(102, 126, 234, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .campagne-nom {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 0.5rem;
    }

    .campagne-description {
      color: #5a655a;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #e8f3e8;
      border-radius: 1rem;
      overflow: hidden;
      margin: 1rem 0;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 1rem;
      transition: width 0.3s ease;
    }

    .campagne-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin: 1rem 0;
      padding: 1rem 0;
      border-top: 1px solid #d9e0d9;
      border-bottom: 1px solid #d9e0d9;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-weight: 700;
      color: #1a1e1a;
      font-size: 1.1rem;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #5a655a;
    }

    .types-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .type-badge {
      background: #e8f3e8;
      color: #2d8a5e;
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
      font-size: 0.8rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 700px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1a1e1a;
    }

    .form-group label span {
      color: #dc2626;
      margin-left: 0.25rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* ✅ Style pour les checkboxes */
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      padding: 1rem;
      background: #f8faf8;
      border-radius: 0.75rem;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .checkbox-item input[type="checkbox"] {
      width: 1.2rem;
      height: 1.2rem;
      accent-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn-secondary {
      background: #f8faf8;
      color: #1a1e1a;
      border: 1.5px solid #d9e0d9;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background: #e8f3e8;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #d9e0d9;
      grid-column: 1 / -1;
    }

    .spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

    @media (max-width: 768px) {
      .filters-bar {
        flex-direction: column;
      }
      
      .search-bar {
        width: 100%;
      }
      
      .campagnes-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .form-group.full-width {
        grid-column: span 1;
      }
      
      .checkbox-group {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="campagnes-container">
        {/* En-tête */}
        <div className="header-actions">
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
            Gestion des campagnes
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={18} className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Nouvelle campagne
            </button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="filters-bar">
          <button 
            className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('tous')}
          >
            <Filter size={16} />
            Toutes
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'planifiee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('planifiee')}
          >
            <Clock size={16} />
            Planifiées
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'active' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('active')}
          >
            <TrendingUp size={16} />
            Actives
          </button>
          <button 
            className={`filter-btn ${filtreStatut === 'terminee' ? 'active' : ''}`}
            onClick={() => setFiltreStatut('terminee')}
          >
            <CheckCircle size={16} />
            Terminées
          </button>
          
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une campagne..."
              className="search-input"
            />
          </div>
        </div>

        {/* Liste des campagnes */}
        {filteredCampagnes.length > 0 ? (
          <div className="campagnes-grid">
            {filteredCampagnes.map((campagne) => {
              const progression = campagne.poids_attendue ? 
                ((campagne.poids_collecte_actuel || 0) / campagne.poids_attendue * 100).toFixed(1) : 0;
              
              return (
                <div key={campagne.id} className="campagne-card">
                  <div className="card-header">
                    <div>
                      <div className="campagne-nom">{campagne.nom}</div>
                      {campagne.description && (
                        <div className="campagne-description">{campagne.description}</div>
                      )}
                    </div>
                    {getStatusBadge(campagne.statut)}
                  </div>

                  <div className="types-container">
                    {/* ✅ Vérification que types_dechets est un tableau */}
                    {Array.isArray(campagne.types_dechets) && campagne.types_dechets.map((type, idx) => (
                      <span key={idx} className="type-badge">{getTypeLabel(type)}</span>
                    ))}
                  </div>

                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progression}%` }} />
                  </div>

                  <div className="campagne-stats">
                    <div className="stat-item">
                      <div className="stat-value">{progression}%</div>
                      <div className="stat-label">Réalisé</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{campagne.poids_collecte_actuel || 0} kg</div>
                      <div className="stat-label">Collecté</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{campagne.poids_attendue} kg</div>
                      <div className="stat-label">Objectif</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedCampagne(campagne);
                          setShowDetailsModal(true);
                        }}
                        style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem' }}
                      >
                        <Eye size={18} />
                      </button>
                      {campagne.statut === 'planifiee' && (
                        <button
                          className="btn-view"
                          onClick={() => handleChangerStatut(campagne.id, 'active')}
                          style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#10b981' }}
                          title="Activer"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {campagne.statut === 'active' && (
                        <button
                          className="btn-view"
                          onClick={() => handleChangerStatut(campagne.id, 'suspendue')}
                          style={{ padding: '0.5rem', background: '#f8faf8', borderRadius: '0.5rem', color: '#f59e0b' }}
                          title="Suspendre"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', color: '#5a655a', fontSize: '0.9rem' }}>
                      <Calendar size={16} />
                      <span>Fin: {new Date(campagne.date_fin).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
            <p className="text-gray-600 mb-4">Créez votre première campagne pour commencer</p>
            <button
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Créer une campagne
            </button>
          </div>
        )}
        
    {/* MODAL DE DÉTAILS DE LA CAMPAGNE */}
{showDetailsModal && selectedCampagne && (
  <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="modal-title">{selectedCampagne.nom}</h2>
        <button
          onClick={() => setShowDetailsModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      {loadingDetails ? (  // ← CORRIGÉ : utilise loadingDetails
        <div className="text-center py-8">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Statut</p>
              <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Période</p>
              <p className="font-medium">
                {new Date(selectedCampagne.date_debut).toLocaleDateString()} - {new Date(selectedCampagne.date_fin).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Objectif</p>
              <p className="text-2xl font-bold text-purple-600">{selectedCampagne.poids_attendue} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Déjà collecté</p>
              <p className="text-2xl font-bold text-green-600">{selectedCampagne.poids_collecte_actuel || 0} kg</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Reste à collecter</p>
              <p className="text-2xl font-bold text-orange-600">
                {(selectedCampagne.poids_attendue - (selectedCampagne.poids_collecte_actuel || 0)).toFixed(1)} kg
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Budget total</p>
              <p className="text-2xl font-bold text-blue-600">
                {((selectedCampagne.poids_attendue || 0) * (selectedCampagne.prix_par_kg || 0)).toLocaleString()} FCFA
              </p>
            </div>
          </div>

          {/* Types de déchets */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Types de déchets acceptés</p>
            <div className="flex flex-wrap gap-2">
              {selectedCampagne.types_dechets?.map((type, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {getTypeLabel(type)}
                </span>
              ))}
            </div>
          </div>

          {/* Zones d'intervention */}
          {selectedCampagne.zones_intervention?.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Zones couvertes</p>
              <div className="flex flex-wrap gap-2">
                {selectedCampagne.zones_intervention.map((zone, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {zone}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Évolution journalière */}
          {evolutionJournaliere.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-4">Évolution journalière</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {evolutionJournaliere.map((jour, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {new Date(jour.jour).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {jour.nombre_missions} mission(s) • {jour.points_actifs} point(s) actif(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{jour.poids_total} kg</p>
                        <p className="text-sm text-gray-500">{jour.gains_total?.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Détails par point de collecte */}
          {pointsDetails.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-4">Collectes par point</p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {pointsDetails.map((point, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{point.point_nom}</p>
                        <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {point.nombre_missions} mission(s) • {point.collecteurs_actifs} collecteur(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{point.poids_collecte} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre de progression détaillée */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Progression</p>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                style={{ 
                  width: `${Math.min((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">{selectedCampagne.poids_collecte_actuel || 0} kg collectés</span>
              <span className="font-medium text-purple-600">
                {((selectedCampagne.poids_collecte_actuel || 0) / selectedCampagne.poids_attendue * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              className="btn-secondary"
              onClick={() => setShowDetailsModal(false)}
            >
              Fermer
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                toast.info('Export en cours de développement');
              }}
            >
              <Download size={16} />
              Exporter le rapport
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Créer une nouvelle campagne</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Informations générales */}
                  <div className="form-group full-width">
                    <label>Nom de la campagne <span>*</span></label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Ex: Campagne de recyclage 2024"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Description de la campagne..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de début <span>*</span></label>
                    <input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de fin <span>*</span></label>
                    <input
                      type="date"
                      name="dateFin"
                      value={formData.dateFin}
                      onChange={handleInputChange}
                      min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  {/* ✅ Objectifs par type de déchet (remplace typesDechets, poidsAttendue, prixParKg) */}
                  <div className="form-group full-width">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs par type de déchet <span className="text-red-500">*</span>
                    </label>
                    
                    {formData.objectifs.map((objectif, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-purple-700">Objectif #{index + 1}</h4>
                          {formData.objectifs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleSupprimerObjectif(index)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                              title="Supprimer cet objectif"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <select
                            value={objectif.typeDechet}
                            onChange={(e) => handleObjectifChange(index, 'typeDechet', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            required
                          >
                            <option value="">Type de déchet</option>
                            <option value="plastique_pet">Plastique PET</option>
                            <option value="plastique_pehd">Plastique PEHD</option>
                            <option value="papier_carton">Papier/Carton</option>
                            <option value="metal">Métal</option>
                            <option value="verre">Verre</option>
                            <option value="organique">Organique</option>
                          </select>
                          
                          <input
                            type="number"
                            placeholder="Poids (kg)"
                            value={objectif.poidsAttendue}
                            onChange={(e) => handleObjectifChange(index, 'poidsAttendue', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            min="1"
                            step="0.1"
                            required
                          />
                          
                          <input
                            type="number"
                            placeholder="Prix/kg (FCFA)"
                            value={objectif.prixParKg}
                            onChange={(e) => handleObjectifChange(index, 'prixParKg', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
                            min="1"
                            step="1"
                            required
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handleAjouterObjectif}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Ajouter un type de déchet
                    </button>
                  </div>

                  {/* Zones d'intervention */}
                  <div className="form-group full-width">
                    <label>Zones d'intervention</label>
                    <input
                      type="text"
                      name="zones"
                      value={formData.zonesIntervention.join(', ')}
                      onChange={handleZoneChange}
                      placeholder="Dakar, Pikine, Guédiawaye (séparés par des virgules)"
                    />
                  </div>

                  {/* Promoteurs */}
                  <div className="form-group full-width">
                    <label>Promoteurs (sponsors/ONG)</label>
                    <div className="checkbox-group">
                      {promoteurs.sponsors.map(sponsor => (
                        <div key={`sponsor:${sponsor.id}`} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={`sponsor-${sponsor.id}`}
                            value={`sponsor:${sponsor.id}`}
                            checked={formData.promoteurs.some(p => p.type === 'sponsor' && p.id === sponsor.id)}
                            onChange={handlePromoteurChange}
                          />
                          <label htmlFor={`sponsor-${sponsor.id}`}>
                            🏢 Sponsor: {sponsor.nom_organisation}
                          </label>
                        </div>
                      ))}
                      {promoteurs.ongs.map(ong => (
                        <div key={`ong:${ong.id}`} className="checkbox-item">
                          <input
                            type="checkbox"
                            id={`ong-${ong.id}`}
                            value={`ong:${ong.id}`}
                            checked={formData.promoteurs.some(p => p.type === 'ong' && p.id === ong.id)}
                            onChange={handlePromoteurChange}
                          />
                          <label htmlFor={`ong-${ong.id}`}>
                            🤝 ONG: {ong.nom_ong}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Créer la campagne
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CampagnesPage;