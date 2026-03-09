import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiEye, FiX, FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiDollarSign, FiPackage, FiAward } from 'react-icons/fi';
import { FaRecycle, FaWeightHanging, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CollecteursList = () => {
  const [collecteurs, setCollecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCollecteur, setSelectedCollecteur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statsCollecteur, setStatsCollecteur] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadCollecteurs();
  }, []);

  const loadCollecteurs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCollecteurs();
      setCollecteurs(data.collecteurs || []);
    } catch (error) {
      console.error('Erreur chargement collecteurs:', error);
      toast.error('Erreur lors du chargement des collecteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleVoirStats = async (collecteur) => {
    setSelectedCollecteur(collecteur);
    try {
      const response = await adminService.getCollecteurStats(collecteur.id);
      setStatsCollecteur(response);
    } catch (error) {
      console.error('Erreur chargement stats collecteur:', error);
      toast.error('Erreur lors du chargement des statistiques');
    }
    setShowModal(true);
  };

  // Statistiques globales
  const totalCollecteurs = collecteurs.length;
  const actifs = collecteurs.filter(c => c.statut === 'actif').length;
  const enAttente = collecteurs.filter(c => c.statut === 'en_attente').length;
  const inactifs = collecteurs.filter(c => c.statut === 'inactif').length;
  const totalPoints = collecteurs.reduce((acc, c) => acc + (c.points_total || 0), 0);
  const totalGains = collecteurs.reduce((acc, c) => acc + (c.gains_total || 0), 0);

  return (
    <DashboardLayout title="Collecteurs" user={user}>
      {/* Statistiques globales */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Total collecteurs</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalCollecteurs}</p>
              <p className="text-xs text-gray-500 mt-1">Inscrits</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FaTruck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Actifs</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{actifs}</p>
              <p className="text-xs text-gray-500 mt-1">En service</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiEye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">En attente</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{enAttente}</p>
              <p className="text-xs text-gray-500 mt-1">Validation</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiAward className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Points totaux</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalPoints}</p>
              <p className="text-xs text-gray-500 mt-1">Gains: {totalGains.toLocaleString()} FCFA</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des collecteurs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaRecycle className="w-6 h-6 text-green-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des collecteurs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nom', 'Email', 'Téléphone', 'Type', 'Statut', 'Points', 'Gains (FCFA)', 'Inscription', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {collecteurs.map((c, index) => (
                    <tr key={c.id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-medium">
                              {c.nom_complet?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{c.nom_complet}</p>
                            <p className="text-xs text-gray-500">ID: {c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiMail className="mr-2 text-green-500" />
                          {c.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiPhone className="mr-2 text-green-500" />
                          {c.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full capitalize">
                          {c.type_collecteur}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          c.statut === 'actif' ? 'bg-green-100 text-green-800 border border-green-200' :
                          c.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {c.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.points_total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.gains_total?.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-green-500" />
                          {new Date(c.cree_le).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleVoirStats(c)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <FiEye className="mr-2" /> Stats
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {collecteurs.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FaTruck className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun collecteur</h3>
                <p className="text-gray-500">La liste des collecteurs est vide pour le moment.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal statistiques collecteur */}
      {showModal && selectedCollecteur && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* En-tête du modal */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FaTruck className="mr-2" /> {selectedCollecteur.nom_complet}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Corps du modal */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                {statsCollecteur ? (
                  <div className="space-y-6">
                    {/* Cartes stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Total collecté</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{statsCollecteur.total_kg} kg</p>
                          </div>
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FaWeightHanging className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Missions</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{statsCollecteur.nb_missions}</p>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FiPackage className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Par type de déchet */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <FaRecycle className="mr-2 text-green-600" /> Répartition par type de déchet
                      </h4>
                      {statsCollecteur.par_type && statsCollecteur.par_type.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                          {statsCollecteur.par_type.map(t => (
                            <div key={t.type_dechet} className="p-3 flex justify-between items-center hover:bg-white transition-colors">
                              <span className="text-sm font-medium text-gray-800">{t.type_dechet}</span>
                              <span className="text-sm font-semibold text-green-600">{t.kg} kg</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucune donnée disponible</p>
                      )}
                    </div>

                    {/* Dernières missions (si disponibles) */}
                    {statsCollecteur.dernieres_missions && statsCollecteur.dernieres_missions.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <FiCalendar className="mr-2 text-green-600" /> Dernières missions
                        </h4>
                        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                          {statsCollecteur.dernieres_missions.slice(0, 5).map(m => (
                            <div key={m.id} className="p-3 flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{m.type_dechet}</p>
                                <p className="text-xs text-gray-500">{new Date(m.date_mission).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <span className="text-sm font-semibold text-green-600">{m.poids} kg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Pied du modal */}
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CollecteursList;