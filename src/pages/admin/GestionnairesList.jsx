import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiEye, FiX, FiUser, FiPhone, FiMail, FiCalendar, FiMapPin, FiDollarSign, FiPackage } from 'react-icons/fi';
import { FaRecycle, FaWeightHanging } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GestionnairesList = () => {
  const [gestionnaires, setGestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedGestionnaire, setSelectedGestionnaire] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailsGestionnaire, setDetailsGestionnaire] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadGestionnaires();
  }, []);

  const loadGestionnaires = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGestionnaires();
      setGestionnaires(data.gestionnaires || []);
    } catch (error) {
      console.error('Erreur chargement gestionnaires:', error);
      toast.error('Erreur lors du chargement des gestionnaires');
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = async (gestionnaire) => {
    setSelectedGestionnaire(gestionnaire);
    try {
      const response = await adminService.getGestionnaireDetails(gestionnaire.id);
      setDetailsGestionnaire(response);
    } catch (error) {
      console.error('Erreur chargement détails gestionnaire:', error);
      toast.error('Erreur lors du chargement des détails');
    }
    setShowModal(true);
  };

  return (
    <DashboardLayout title="Gestionnaires des points de collecte" user={user}>
      {/* En-tête avec statistiques rapides */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{gestionnaires.length}</p>
              <p className="text-xs text-gray-500 mt-1">Gestionnaires enregistrés</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FiUser className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Actifs</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {gestionnaires.filter(g => g.est_actif).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Comptes actifs</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiEye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Inactifs</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {gestionnaires.filter(g => !g.est_actif).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Comptes inactifs</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiX className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des gestionnaires */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaRecycle className="w-6 h-6 text-green-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des gestionnaires...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nom', 'Email', 'Téléphone', 'Fonction', 'Point de collecte', 'Statut', 'Inscription', 'Actions'].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {gestionnaires.map((g, index) => (
                    <tr key={g.id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-medium">
                              {g.nom_complet?.charAt(0) || 'G'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{g.nom_complet}</p>
                            <p className="text-xs text-gray-500">ID: {g.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiMail className="mr-2 text-green-500" />
                          {g.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiPhone className="mr-2 text-green-500" />
                          {g.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {g.fonction || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiMapPin className="mr-2 text-green-500" />
                          {g.point_depot_nom || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          g.est_actif 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {g.est_actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-green-500" />
                          {new Date(g.cree_le).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDetails(g)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <FiEye className="mr-2" /> Détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {gestionnaires.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FiUser className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun gestionnaire</h3>
                <p className="text-gray-500">La liste des gestionnaires est vide pour le moment.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal détails gestionnaire */}
      {showModal && selectedGestionnaire && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              {/* En-tête du modal */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiUser className="mr-2" /> {selectedGestionnaire.nom_complet}
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
                {detailsGestionnaire ? (
                  <div className="space-y-8">
                    {/* Cartes statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Achats</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{detailsGestionnaire.achats?.nombre || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Total transactions</p>
                          </div>
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FiDollarSign className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Poids total</span>
                            <span className="font-semibold text-gray-800">{detailsGestionnaire.achats?.poids_total || 0} kg</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Collectes validées</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{detailsGestionnaire.collectes?.nombre || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Validations</p>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FaWeightHanging className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Poids total</span>
                            <span className="font-semibold text-gray-800">{detailsGestionnaire.collectes?.poids_total || 0} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Derniers achats */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <FiPackage className="mr-2 text-green-600" /> Derniers achats
                      </h4>
                      {detailsGestionnaire.achats?.liste?.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                          {detailsGestionnaire.achats.liste.slice(0, 5).map(a => (
                            <div key={a.id} className="p-3 flex justify-between items-center hover:bg-white transition-colors">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{a.type_dechet}</p>
                                <p className="text-xs text-gray-500">{new Date(a.date_achat).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">{a.poids} kg</p>
                                <p className="text-xs text-gray-600">{a.total} FCFA</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucun achat récent</p>
                      )}
                    </div>

                    {/* Dernières collectes validées */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <FaRecycle className="mr-2 text-green-600" /> Dernières collectes validées
                      </h4>
                      {detailsGestionnaire.collectes?.liste?.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                          {detailsGestionnaire.collectes.liste.slice(0, 5).map(c => (
                            <div key={c.id} className="p-3 flex justify-between items-center hover:bg-white transition-colors">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{c.type_dechet}</p>
                                <p className="text-xs text-gray-500">{new Date(c.date_validation).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">{c.poids_depose} kg</p>
                                <p className="text-xs text-gray-600">{c.gains_attribues} FCFA</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucune collecte validée récente</p>
                      )}
                    </div>
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

export default GestionnairesList;