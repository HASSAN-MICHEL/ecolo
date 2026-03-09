// // pages/Recycleur/MonStock.jsx
// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import recycleurService from '../../services/recycleurService';
// import { FiPackage, FiClock, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const MonStock = () => {
//   const [stocks, setStocks] = useState([]);
//   const [historique, setHistorique] = useState([]);
//   const [statistiques, setStatistiques] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadStock();
//   }, []);

//   const loadStock = async () => {
//     try {
//       setLoading(true);
//       // À implémenter dans recycleurService
//       const response = await fetch('/api/recycleurs/mon-stock', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('ecocollect_token')}` }
//       });
//       const data = await response.json();
//       if (data.success) {
//         setStocks(data.stocks || []);
//         setHistorique(data.historique || []);
//         setStatistiques(data.statistiques || []);
//       }
//     } catch (error) {
//       console.error('Erreur chargement stock:', error);
//       toast.error('Erreur lors du chargement du stock');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTypeLabel = (type) => {
//     const labels = {
//       'plastique_pet': 'Plastique PET',
//       'plastique_pehd': 'Plastique PEHD',
//       'papier_carton': 'Papier/Carton',
//       'metal': 'Métal',
//       'verre': 'Verre',
//       'organique': 'Organique'
//     };
//     return labels[type] || type;
//   };

//   const getMouvementIcon = (type) => {
//     switch(type) {
//       case 'reception': return '📥';
//       case 'recyclage': return '♻️';
//       default: return '📦';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <DashboardLayout title="Mon Stock" user={user}>
//         <div className="text-center p-8">
//           <div className="spinner"></div>
//           <p className="mt-4 text-gray-600">Chargement de votre stock...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout title="Mon Stock de déchets" user={user}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Statistiques */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
//             <FiPackage className="h-8 w-8 mb-3" />
//             <p className="text-3xl font-bold">
//               {stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0).toFixed(1)} kg
//             </p>
//             <p className="text-sm opacity-90">Stock total</p>
//           </div>
//           <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
//             <FiBarChart2 className="h-8 w-8 mb-3" />
//             <p className="text-3xl font-bold">{stocks.length}</p>
//             <p className="text-sm opacity-90">Types de déchets</p>
//           </div>
//           <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
//             <FiTrendingUp className="h-8 w-8 mb-3" />
//             <p className="text-3xl font-bold">
//               {statistiques.reduce((acc, s) => acc + parseFloat(s.total_recycle || 0), 0).toFixed(1)} kg
//             </p>
//             <p className="text-sm opacity-90">Déjà recyclés</p>
//           </div>
//         </div>

//         {/* Stock par type */}
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Mon stock par type</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {stocks.map((stock) => (
//               <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="font-semibold text-gray-900">{getTypeLabel(stock.type_dechet)}</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
//                     {parseFloat(stock.quantite_disponible).toFixed(1)} kg
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   Dernier mouvement: {formatDate(stock.dernier_mouvement)}
//                 </p>
//               </div>
//             ))}
//           </div>
//           {stocks.length === 0 && (
//             <p className="text-center text-gray-500 py-8">
//               Vous n'avez pas encore de stock. Les stocks apparaîtront après validation de vos demandes.
//             </p>
//           )}
//         </div>

//         {/* Historique des mouvements */}
//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des mouvements</h2>
//           <div className="space-y-4">
//             {historique.map((item) => (
//               <div key={item.id} className="border border-gray-200 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{getMouvementIcon(item.type_mouvement)}</div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-semibold text-gray-900">
//                           {item.type_mouvement === 'reception' ? '📥 Réception' : '♻️ Recyclage'}
//                         </p>
//                         <p className="text-sm text-gray-600 mt-1">
//                           {getTypeLabel(item.type_dechet)}: {parseFloat(item.quantite).toFixed(1)} kg
//                         </p>
//                       </div>
//                       <span className="text-sm text-gray-500">{formatDate(item.cree_le)}</span>
//                     </div>
//                     <div className="mt-2 text-sm text-gray-500">
//                       Stock avant: {parseFloat(item.stock_avant).toFixed(1)} kg → 
//                       après: {parseFloat(item.stock_apres).toFixed(1)} kg
//                     </div>
//                     {item.notes && (
//                       <p className="mt-1 text-xs text-gray-400">{item.notes}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {historique.length === 0 && (
//               <p className="text-center text-gray-500 py-8">Aucun mouvement pour le moment</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default MonStock;


// pages/Recycleur/MonStock.jsx - Version corrigée

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { FiPackage, FiClock, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MonStock = () => {
  const [stocks, setStocks] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [statistiques, setStatistiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      setLoading(true);
      
      // ✅ Utiliser le service au lieu de fetch direct
      const data = await recycleurService.getMonStock();
      console.log('📦 Données reçues:', data);
      
      if (data.success) {
        setStocks(data.stocks || []);
        setHistorique(data.historique || []);
        setStatistiques(data.statistiques || []);
      } else {
        toast.error(data.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('❌ Erreur chargement stock:', error);
      toast.error('Erreur lors du chargement du stock');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique'
    };
    return labels[type] || type;
  };

  const getMouvementIcon = (type) => {
    switch(type) {
      case 'reception': return '📥';
      case 'recyclage': return '♻️';
      default: return '📦';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Mon Stock" user={user}>
        <div className="text-center p-8">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Chargement de votre stock...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mon Stock de déchets" user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <FiPackage className="h-8 w-8 mb-3" />
            <p className="text-3xl font-bold">
              {stocks.reduce((acc, s) => acc + parseFloat(s.quantite_disponible), 0).toFixed(1)} kg
            </p>
            <p className="text-sm opacity-90">Stock total</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
            <FiBarChart2 className="h-8 w-8 mb-3" />
            <p className="text-3xl font-bold">{stocks.length}</p>
            <p className="text-sm opacity-90">Types de déchets</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <FiTrendingUp className="h-8 w-8 mb-3" />
            <p className="text-3xl font-bold">
              {statistiques.reduce((acc, s) => acc + parseFloat(s.total_recycle || 0), 0).toFixed(1)} kg
            </p>
            <p className="text-sm opacity-90">Déjà recyclés</p>
          </div>
        </div>

        {/* Stock par type */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mon stock par type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stocks.map((stock) => (
              <div key={stock.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{getTypeLabel(stock.type_dechet)}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    {parseFloat(stock.quantite_disponible).toFixed(1)} kg
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Dernier mouvement: {formatDate(stock.dernier_mouvement)}
                </p>
              </div>
            ))}
          </div>
          {stocks.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Vous n'avez pas encore de stock. Les stocks apparaîtront après validation de vos demandes.
            </p>
          )}
        </div>

        {/* Historique des mouvements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des mouvements</h2>
          <div className="space-y-4">
            {historique.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getMouvementIcon(item.type_mouvement)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.type_mouvement === 'reception' ? '📥 Réception' : '♻️ Recyclage'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getTypeLabel(item.type_dechet)}: {parseFloat(item.quantite).toFixed(1)} kg
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(item.cree_le)}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Stock avant: {parseFloat(item.stock_avant).toFixed(1)} kg → 
                      après: {parseFloat(item.stock_apres).toFixed(1)} kg
                    </div>
                    {item.notes && (
                      <p className="mt-1 text-xs text-gray-400">{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {historique.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucun mouvement pour le moment</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MonStock;