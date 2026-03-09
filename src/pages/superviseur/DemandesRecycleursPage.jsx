// components/Superviseur/DemandesRecycleursPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, CheckCircle, XCircle, Clock, Eye,
  Filter, Search, RefreshCw, Info, Calendar,
  User, MapPin, Phone, Mail, Scale, ChevronRight
} from 'lucide-react';

const DemandesRecycleursPage = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [mesTraitements, setMesTraitements] = useState([]);
  const [stats, setStats] = useState({
    total_demandes: 0,
    demandes_en_attente: 0,
    demandes_validees: 0,
    demandes_refusees: 0,
    kg_valides: 0
  });
  const [statsPersonnelles, setStatsPersonnelles] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en_attente');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showRefusModal, setShowRefusModal] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [user, setUser] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('tous');

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
    loadData();
  }, []);

  const loadData = async () => {
    const token = getToken();
    setLoading(true);

    try {
      // Charger toutes les demandes
      const demandesRes = await fetch(`${API_URL}/api/superviseurs/demandes-recycleurs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const demandesData = await demandesRes.json();
      if (demandesData.success) {
        setDemandes(demandesData.demandes || []);
      }

      // Charger les demandes traitées par le superviseur connecté
      const mesTraitementsRes = await fetch(`${API_URL}/api/superviseurs/demandes-recycleurs/mes-traitements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const mesTraitementsData = await mesTraitementsRes.json();
      if (mesTraitementsData.success) {
        setMesTraitements(mesTraitementsData.demandes || []);
        setStatsPersonnelles(mesTraitementsData.statistiques || {});
      }

      // Charger les statistiques globales
      const statsRes = await fetch(`${API_URL}/api/superviseurs/demandes-recycleurs/statistiques`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats || {});
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async () => {
    if (!selectedDemande) return;

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/demandes-recycleurs/${selectedDemande.id}/valider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Demande validée avec succès');
        setShowValidationModal(false);
        setSelectedDemande(null);
        loadData();
      } else {
        alert(data.message || 'Erreur lors de la validation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la validation');
    }
  };

  const handleRefuser = async () => {
    if (!selectedDemande || !motifRefus.trim()) {
      alert('Veuillez fournir un motif de refus');
      return;
    }

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/api/superviseurs/demandes-recycleurs/${selectedDemande.id}/refuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motif: motifRefus })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Demande refusée');
        setShowRefusModal(false);
        setSelectedDemande(null);
        setMotifRefus('');
        loadData();
      } else {
        alert(data.message || 'Erreur lors du refus');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du refus');
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'en_attente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> En attente</span>;
      case 'validee':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Validée</span>;
      case 'refusee':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1"><XCircle size={12} /> Refusée</span>;
      case 'realisee':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1"><Package size={12} /> Réalisée</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{statut}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDemandes = demandes.filter(d => {
    if (activeTab !== 'toutes' && d.statut !== activeTab) return false;
    if (!searchTerm) return true;
    return (
      d.recycleur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.type_dechet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.point_nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const demandesEnAttente = demandes.filter(d => d.statut === 'en_attente');

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-6 w-6 text-purple-600" />
          Demandes des recycleurs
        </h1>
        <p className="text-gray-600 mt-1">Gérez les demandes d'enlèvement des recycleurs</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total demandes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_demandes || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.demandes_en_attente || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Validées</p>
          <p className="text-2xl font-bold text-green-600">{stats.demandes_validees || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">KG validés</p>
          <p className="text-2xl font-bold text-blue-600">{stats.kg_valides || 0} kg</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-600">Mes traitements</p>
          <p className="text-2xl font-bold text-indigo-600">{mesTraitements.length}</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('en_attente')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'en_attente'
              ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          En attente ({demandesEnAttente.length})
        </button>
        <button
          onClick={() => setActiveTab('validee')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'validee'
              ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Validées
        </button>
        <button
          onClick={() => setActiveTab('refusee')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'refusee'
              ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Refusées
        </button>
        <button
          onClick={() => setActiveTab('toutes')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'toutes'
              ? 'text-purple-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Toutes
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
            placeholder="Rechercher par recycleur, type de déchet, point..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {filteredDemandes.length > 0 ? (
          <div className="space-y-4">
            {filteredDemandes.map((demande) => (
              <div key={demande.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Demande #{demande.id.substring(0, 8)}
                      </h3>
                      {getStatusBadge(demande.statut)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Recycleur</p>
                        <p className="font-medium flex items-center gap-1">
                          <User size={14} className="text-gray-400" />
                          {demande.recycleur_nom}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Type déchet</p>
                        <p className="font-medium">{demande.type_dechet}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Quantité</p>
                        <p className="font-medium flex items-center gap-1">
                          <Scale size={14} className="text-gray-400" />
                          {demande.quantite_demandee} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Point</p>
                        <p className="font-medium flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          {demande.point_nom}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(demande.date_souhaitee)}
                      </span>
                      {demande.valide_par_nom && (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-600" />
                          Traité par: {demande.valide_par_nom}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {demande.statut === 'en_attente' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDemande(demande);
                            setShowValidationModal(true);
                          }}
                          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={14} />
                          Valider
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDemande(demande);
                            setShowRefusModal(true);
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          Refuser
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {/* Voir détails */}}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600">Il n'y a pas de demande correspondant aux critères</p>
          </div>
        )}
      </div>

      {/* Modal de validation */}
      {showValidationModal && selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl font-bold text-gray-900">Confirmer la validation</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p><strong>Recycleur:</strong> {selectedDemande.recycleur_nom}</p>
                <p><strong>Type déchet:</strong> {selectedDemande.type_dechet}</p>
                <p><strong>Quantité:</strong> {selectedDemande.quantite_demandee} kg</p>
                <p><strong>Point:</strong> {selectedDemande.point_nom}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Êtes-vous sûr de vouloir valider cette demande ? Cette action réservera le stock correspondant.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleValider}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de refus */}
      {showRefusModal && selectedDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
              <h2 className="text-xl font-bold text-gray-900">Motif du refus</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p><strong>Recycleur:</strong> {selectedDemande.recycleur_nom}</p>
                <p><strong>Type déchet:</strong> {selectedDemande.type_dechet}</p>
                <p><strong>Quantité:</strong> {selectedDemande.quantite_demandee} kg</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif du refus
                </label>
                <textarea
                  value={motifRefus}
                  onChange={(e) => setMotifRefus(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                  placeholder="Expliquez la raison du refus..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRefusModal(false);
                    setMotifRefus('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRefuser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesRecycleursPage;