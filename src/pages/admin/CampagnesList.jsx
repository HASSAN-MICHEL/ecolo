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
  FiTrash2 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DashboardLayout from '../../Layouts/LayoutDashboard';

const CampagnesList = () => {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user') || '{}');
    setUser(userData);
    loadCampagnes();
  }, []);

  const loadCampagnes = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCampagnes();
      
      if (response.success) {
        // Formater les données pour l'affichage
        const campagnesFormatees = (response.campagnes || []).map(c => ({
          ...c,
          objectifs: c.objectifs || [],
          types_dechets: c.types_dechets || [],
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

  const getStatusBadge = (statut) => {
    const badges = {
      planifiee: { color: 'bg-gray-100 text-gray-800', label: 'Planifiée' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      suspendue: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspendue' },
      terminee: { color: 'bg-blue-100 text-blue-800', label: 'Terminée' },
      annulee: { color: 'bg-red-100 text-red-800', label: 'Annulée' }
    };
    const badge = badges[statut] || badges.planifiee;
    return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
      {badge.label}
    </span>;
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

  return (
    <DashboardLayout title="Gestion des campagnes" user={user}>
      {/* En-tête avec bouton de création */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Toutes les campagnes</h2>
        <Link 
          to="/admin/campagnes/nouveau" 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <FiPlus /> Nouvelle campagne
        </Link>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltreStatut('tous')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtreStatut === 'tous' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFiltreStatut('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtreStatut === 'active' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Actives
          </button>
          <button
            onClick={() => setFiltreStatut('planifiee')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtreStatut === 'planifiee' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Planifiées
          </button>
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher une campagne ou un créateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tableau des campagnes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Chargement des campagnes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campagne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé par
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objectif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Types
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
             <tbody className="bg-white divide-y divide-gray-200">
  {campagnesFiltrees.length > 0 ? (
    campagnesFiltrees.map((campagne) => {
      const progression = campagne.poids_total_attendue > 0 
        ? ((campagne.poids_collecte_actuel || 0) / campagne.poids_total_attendue * 100).toFixed(1)
        : 0;

      // Fonction pour extraire les types de déchets de manière sécurisée
      const getTypesList = () => {
        // Cas 1: objectifs (nouveau format)
        if (campagne.objectifs && Array.isArray(campagne.objectifs) && campagne.objectifs.length > 0) {
          return campagne.objectifs.map(obj => ({
            type: obj.typeDechet,
            label: getTypeLabel(obj.typeDechet),
            poids: obj.poidsAttendue,
            prix: obj.prixParKg
          }));
        }
        
        // Cas 2: types_dechets (ancien format)
        if (campagne.types_dechets) {
          // Si c'est une chaîne de caractères
          if (typeof campagne.types_dechets === 'string') {
            // Si la chaîne contient des virgules, la splitter
            if (campagne.types_dechets.includes(',')) {
              return campagne.types_dechets.split(',').map(t => ({
                type: t.trim(),
                label: getTypeLabel(t.trim())
              }));
            }
            // Sinon, un seul type
            return [{
              type: campagne.types_dechets,
              label: getTypeLabel(campagne.types_dechets)
            }];
          }
          
          // Si c'est un tableau
          if (Array.isArray(campagne.types_dechets)) {
            return campagne.types_dechets.map(type => ({
              type: type,
              label: getTypeLabel(type)
            }));
          }
        }
        
        return [];
      };

      const typesList = getTypesList();
      const totalTypes = typesList.length;

      return (
        <tr key={campagne.id} className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4">
            <div className="font-medium text-gray-900">{campagne.nom}</div>
            {campagne.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {campagne.description}
              </div>
            )}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-gray-400" size={14} />
              <span className="text-sm text-gray-900">{campagne.createur_nom || 'Système'}</span>
            </div>
            {campagne.createur_role && (
              <span className="text-xs text-gray-500">
                {campagne.createur_role === 'superviseur' ? 'Superviseur' : 'Admin'}
              </span>
            )}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <FiCalendar className="text-gray-400" size={14} />
              <div>
                <div>{new Date(campagne.date_debut).toLocaleDateString('fr-FR')}</div>
                <div className="text-gray-500">au {new Date(campagne.date_fin).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="font-medium">{campagne.poids_total_attendue || 0} kg</div>
            <div className="text-sm text-gray-500">{campagne.prix_moyen || 0} FCFA/kg</div>
          </td>
          <td className="px-6 py-4">
            {getStatusBadge(campagne.statut)}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(progression, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progression}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {campagne.poids_collecte_actuel || 0} kg collectés
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex flex-wrap gap-1 max-w-xs">
              {totalTypes > 0 ? (
                <>
                  {/* Afficher les 2 premiers types */}
                  {typesList.slice(0, 2).map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                      title={item.poids ? `${item.poids} kg à ${item.prix} FCFA/kg` : item.label}
                    >
                      {item.label}
                    </span>
                  ))}
                  
                  {/* Afficher le nombre de types supplémentaires */}
                  {totalTypes > 2 && (
                    <span 
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      title={typesList.slice(2).map(t => t.label).join(', ')}
                    >
                      +{totalTypes - 2}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-gray-400">-</span>
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex gap-2">
              <Link
                to={`/admin/campagnes/${campagne.id}`}
                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                title="Voir les détails"
              >
                <FiEye size={18} />
              </Link>
              <Link
                to={`/admin/campagnes/${campagne.id}/edit`}
                className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded transition-colors"
                title="Modifier"
              >
                <FiEdit2 size={18} />
              </Link>
              <Link
                to={`/admin/campagnes/${campagne.id}/suivi`}
                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                title="Suivi"
              >
                <FiActivity size={18} />
              </Link>
              <button
                onClick={() => handleDelete(campagne.id, campagne.nom)}
                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                title="Supprimer"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <FiMapPin size={40} className="text-gray-300" />
          <p>Aucune campagne trouvée</p>
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
      </td>
    </tr>
  )}
</tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampagnesList;