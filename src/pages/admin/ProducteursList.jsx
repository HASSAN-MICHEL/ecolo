import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiAward } from 'react-icons/fi';
import { FaRecycle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProducteursList = () => {
  const [producteurs, setProducteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadProducteurs();
  }, []);

  const loadProducteurs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducteurs();
      setProducteurs(data.producteurs || []);
    } catch (error) {
      console.error('Erreur chargement producteurs:', error);
      toast.error('Erreur lors du chargement des producteurs');
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques
  const stats = {
    total: producteurs.length,
    particuliers: producteurs.filter(p => p.type_producteur === 'particulier').length,
    entreprises: producteurs.filter(p => p.type_producteur === 'entreprise').length,
    premium: producteurs.filter(p => p.type_compte === 'premium').length,
    standard: producteurs.filter(p => p.type_compte === 'standard').length,
  };

  return (
    <DashboardLayout title="Producteurs" user={user}>
      {/* Cartes statistiques */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 uppercase tracking-wider">Total</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Producteurs inscrits</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FiUser className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">Particuliers</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.particuliers}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.particuliers/stats.total)*100 || 0).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 uppercase tracking-wider">Entreprises</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.entreprises}</p>
              <p className="text-xs text-gray-500 mt-1">{((stats.entreprises/stats.total)*100 || 0).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <FiAward className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-wider">Premium</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.premium}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.standard} standard</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiAward className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des producteurs */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaRecycle className="w-6 h-6 text-green-500 animate-pulse" />
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des producteurs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Nom', 'Email', 'Téléphone', 'Type', 'Localisation', 'Compte', 'Inscription'].map(header => (
                      <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {producteurs.map((p, index) => (
                    <tr key={p.id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-medium">
                              {p.nom_complet?.charAt(0) || 'P'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{p.nom_complet}</p>
                            <p className="text-xs text-gray-500">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiMail className="mr-2 text-green-500" />
                          {p.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiPhone className="mr-2 text-green-500" />
                          {p.telephone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                          ${p.type_producteur === 'particulier' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                          }`}>
                          {p.type_producteur}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-700">
                          <FiMapPin className="mr-2 text-green-500 flex-shrink-0" />
                          <span>{p.quartier}, {p.commune}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          p.type_compte === 'premium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {p.type_compte === 'premium' ? (
                            <span className="flex items-center">
                              <FiAward className="mr-1" /> Premium
                            </span>
                          ) : 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-green-500" />
                          {new Date(p.cree_le).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {producteurs.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FiUser className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun producteur</h3>
                <p className="text-gray-500">La liste des producteurs est vide pour le moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProducteursList;