import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiPlus, 
  FiCalendar, 
  FiActivity,
  FiUser,
  FiMapPin,
  FiTrash2,
  FiX,
  FiDownload,
  FiFilter,
  FiSearch,
  FiRefreshCw
} from 'react-icons/fi';
import {
  Clock, CheckCircle, XCircle, TrendingUp,
  Target, Package, Map, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CampagnesList = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [campagneDetails, setCampagneDetails] = useState(null);
  const [evolutionJournaliere, setEvolutionJournaliere] = useState([]);
  const [pointsDetails, setPointsDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user') || '{}');
    setUser(userData);
    loadCampagnes();
  }, [filtreStatut]);

  const loadCampagnes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCampagnes();
      
      if (response.success) {
        // Formater les données pour l'affichage comme dans CampagnesPage
        const campagnesFormatees = (response.campagnes || []).map(c => ({
          ...c,
          types_dechets: Array.isArray(c.types_dechets) ? c.types_dechets : 
                         (c.types_dechets ? [c.types_dechets] : []),
          objectifs: c.objectifs || [],
          poids_total_attendue: c.objectifs?.reduce((sum, obj) => sum + (parseFloat(obj.poids_attendue) || 0), 0) || c.poids_attendue || 0,
          prix_moyen: c.objectifs?.length > 0 
            ? c.objectifs.reduce((sum, obj) => sum + (parseFloat(obj.prix_par_kg) || 0), 0) / c.objectifs.length 
            : c.prix_par_kg || 0,
          createur_nom: c.createur ? `${c.createur.prenom || ''} ${c.createur.nom || ''}`.trim() || c.createur.email || 'Système' : 'Système'
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
    setLoadingDetails(true);
    try {
      const response = await adminService.getCampagne(campagneId);
      
      if (response.success) {
        setCampagneDetails(response.campagne);
        setEvolutionJournaliere(response.campagne.evolution || []);
        setPointsDetails(response.campagne.points_couverts || []);
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
      toast.error('Erreur lors du chargement des détails');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCampagnes();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la campagne "${nom}" ?`)) {
      try {
        const response = await adminService.deleteCampagne(id);
        if (response.success) {
          toast.success('Campagne supprimée avec succès');
          loadCampagnes();
        }
      } catch (error) {
        console.error('Erreur suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleViewDetails = (campagne) => {
    setSelectedCampagne(campagne);
    loadCampagneDetails(campagne.id);
    setShowDetailsModal(true);
  };

  const handleChangerStatut = async (campagneId, nouveauStatut) => {
    try {
      const response = await adminService.updateCampagne(campagneId, { statut: nouveauStatut });
      
      if (response.success) {
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
      'terminee': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Terminée' },
      'annulee': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulée' }
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

  // Filtrage
  const campagnesFiltrees = campagnes.filter(c => {
    const matchStatut = filtreStatut === 'tous' || c.statut === filtreStatut;
    const matchSearch = !searchTerm || 
      c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.createur_nom?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatut && matchSearch;
  });

  // Fonction pour extraire les types de déchets
  const getTypesList = (campagne) => {
    if (campagne.objectifs && Array.isArray(campagne.objectifs) && campagne.objectifs.length > 0) {
      return campagne.objectifs.map(obj => ({
        type: obj.typeDechet,
        label: getTypeLabel(obj.typeDechet),
        poids: obj.poidsAttendue,
        prix: obj.prixParKg
      }));
    }
    
    if (campagne.types_dechets) {
      if (typeof campagne.types_dechets === 'string') {
        if (campagne.types_dechets.includes(',')) {
          return campagne.types_dechets.split(',').map(t => ({
            type: t.trim(),
            label: getTypeLabel(t.trim())
          }));
        }
        return [{
          type: campagne.types_dechets,
          label: getTypeLabel(campagne.types_dechets)
        }];
      }
      
      if (Array.isArray(campagne.types_dechets)) {
        return campagne.types_dechets.map(type => ({
          type: type,
          label: getTypeLabel(type)
        }));
      }
    }
    
    return [];
  };

  return (
    <DashboardLayout title="Gestion des campagnes" user={user}>
      {/* En-tête avec boutons d'action */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Toutes les campagnes</h2>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            disabled={refreshing}
          >
            <FiRefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <Link
            to="/admin/campagnes/nouveau"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FiPlus /> Nouvelle campagne
          </Link>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltreStatut('tous')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'tous' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiFilter size={16} />
            Toutes
          </button>
          <button
            onClick={() => setFiltreStatut('planifiee')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'planifiee' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Clock size={16} />
            Planifiées
          </button>
          <button
            onClick={() => setFiltreStatut('active')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp size={16} />
            Actives
          </button>
          <button
            onClick={() => setFiltreStatut('terminee')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filtreStatut === 'terminee' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckCircle size={16} />
            Terminées
          </button>
        </div>

        <div className="flex-1 max-w-md relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher une campagne ou un créateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Liste des campagnes en mode grille comme CampagnesPage */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Chargement des campagnes...</p>
        </div>
      ) : campagnesFiltrees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campagnesFiltrees.map((campagne) => {
            const progression = campagne.poids_total_attendue > 0 
              ? ((campagne.poids_collecte_actuel || 0) / campagne.poids_total_attendue * 100).toFixed(1)
              : 0;
            
            const typesList = getTypesList(campagne);

            return (
              <div key={campagne.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
                {/* En-tête de la carte */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{campagne.nom}</h3>
                    {campagne.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{campagne.description}</p>
                    )}
                  </div>
                  {getStatusBadge(campagne.statut)}
                </div>

                {/* Types de déchets */}
                {typesList.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {typesList.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {item.label}
                      </span>
                    ))}
                    {typesList.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{typesList.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Créateur */}
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <FiUser size={14} />
                  <span>Créé par: {campagne.createur_nom || 'Système'}</span>
                </div>

                {/* Barre de progression */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium text-purple-600">{progression}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                      style={{ width: `${progression}%` }}
                    />
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <Package size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Collecté</p>
                    <p className="font-bold text-sm">{campagne.poids_collecte_actuel || 0} kg</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <Target size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Objectif</p>
                    <p className="font-bold text-sm">{campagne.poids_total_attendue} kg</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center">
                    <DollarSign size={16} className="mx-auto mb-1 text-purple-600" />
                    <p className="text-xs text-gray-500">Prix/kg</p>
                    <p className="font-bold text-sm">{campagne.prix_moyen} FCFA</p>
                  </div>
                </div>

                {/* Période */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <FiCalendar size={14} />
                  <span>
                    {new Date(campagne.date_debut).toLocaleDateString('fr-FR')} - {new Date(campagne.date_fin).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(campagne)}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiEye size={16} />
                    Détails
                  </button>
                
                  <button
                    onClick={() => handleDelete(campagne.id, campagne.nom)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center transition-colors"
                    title="Supprimer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {/* Boutons de changement de statut (si applicable) */}
                {campagne.statut === 'planifiee' && (
                  <button
                    onClick={() => handleChangerStatut(campagne.id, 'active')}
                    className="mt-2 w-full px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <CheckCircle size={14} />
                    Activer la campagne
                  </button>
                )}
                {campagne.statut === 'active' && (
                  <button
                    onClick={() => handleChangerStatut(campagne.id, 'suspendue')}
                    className="mt-2 w-full px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 flex items-center justify-center gap-2 text-sm transition-colors"
                  >
                    <XCircle size={14} />
                    Suspendre la campagne
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Target size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filtreStatut !== 'tous' 
              ? 'Aucune campagne ne correspond à vos critères'
              : 'Créez votre première campagne pour commencer'}
          </p>
          {(searchTerm || filtreStatut !== 'tous') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltreStatut('tous');
              }}
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* MODAL DE DÉTAILS Campagnes */}
      {showDetailsModal && selectedCampagne && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCampagne.nom}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {loadingDetails ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Chargement des détails...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Statut</p>
                    <div className="mt-1">{getStatusBadge(selectedCampagne.statut)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Période</p>
                    <p className="font-medium text-sm">
                      {new Date(selectedCampagne.date_debut).toLocaleDateString('fr-FR')} - {new Date(selectedCampagne.date_fin).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Créé par</p>
                    <p className="font-medium text-sm">{selectedCampagne.createur_nom || 'Système'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Objectif total</p>
                    <p className="text-xl font-bold text-purple-600">{selectedCampagne.poids_total_attendue || 0} kg</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Déjà collecté</p>
                    <p className="text-xl font-bold text-green-600">{selectedCampagne.poids_collecte_actuel || 0} kg</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Reste à collecter</p>
                    <p className="text-xl font-bold text-orange-600">
                      {((selectedCampagne.poids_total_attendue || 0) - (selectedCampagne.poids_collecte_actuel || 0)).toFixed(1)} kg
                    </p>
                  </div>
                </div>

                {/* Objectifs par type */}
                {campagneDetails?.objectifs?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Objectifs par type de déchet</h3>
                    <div className="space-y-4">
                      {campagneDetails.objectifs.map((obj, idx) => {
                        const progressionObj = obj.poids_attendue ? 
                          ((obj.poids_collecte_actuel || 0) / obj.poids_attendue * 100).toFixed(1) : 0;
                        
                        return (
                          <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="font-medium text-purple-600">{getTypeLabel(obj.type_dechet)}</span>
                                <span className="ml-2 text-sm text-gray-500">Prix: {obj.prix_par_kg} FCFA/kg</span>
                              </div>
                              <span className="text-sm font-medium text-purple-600">{progressionObj}%</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div className="bg-purple-50 p-2 rounded text-center">
                                <p className="text-xs text-gray-500">Objectif</p>
                                <p className="text-lg font-bold text-gray-900">{obj.poids_attendue} kg</p>
                              </div>
                              <div className="bg-green-50 p-2 rounded text-center">
                                <p className="text-xs text-gray-500">Collecté</p>
                                <p className="text-lg font-bold text-green-600">{obj.poids_collecte_actuel || 0} kg</p>
                              </div>
                              <div className="bg-orange-50 p-2 rounded text-center">
                                <p className="text-xs text-gray-500">Reste</p>
                                <p className="text-lg font-bold text-orange-600">
                                  {(obj.poids_attendue - (obj.poids_collecte_actuel || 0)).toFixed(1)} kg
                                </p>
                              </div>
                            </div>
                            
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                                style={{ width: `${progressionObj}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Types de déchets (si pas d'objectifs) */}
                {!campagneDetails?.objectifs?.length && selectedCampagne.types_dechets?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Types de déchets acceptés</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampagne.types_dechets.map((type, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {getTypeLabel(type)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zones d'intervention */}
                {selectedCampagne.zones_intervention?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Zones couvertes</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampagne.zones_intervention.map((zone, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          <FiMapPin size={12} className="inline mr-1" />
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
                      {pointsDetails
                        .filter(point => point.poids_collecte > 0)
                        .sort((a, b) => b.poids_collecte - a.poids_collecte)
                        .map((point, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{point.point_nom}</p>
                                <p className="text-sm text-gray-500">{point.commune} - {point.quartier}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {point.nombre_missions || 1} mission(s)
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
                  <p className="text-sm text-gray-500 mb-2">Progression globale</p>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                      style={{ 
                        width: `${Math.min(((selectedCampagne.poids_collecte_actuel || 0) / (selectedCampagne.poids_total_attendue || 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">{selectedCampagne.poids_collecte_actuel || 0} kg collectés</span>
                    <span className="font-medium text-purple-600">
                      {((selectedCampagne.poids_collecte_actuel || 0) / (selectedCampagne.poids_total_attendue || 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    onClick={() => {
                      toast.info('Export en cours de développement');
                    }}
                  >
                    <FiDownload size={16} />
                    Exporter le rapport
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CampagnesList;