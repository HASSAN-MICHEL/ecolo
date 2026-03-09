import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import {
  FiUsers, FiUserCheck, FiPackage, FiDollarSign,
  FiTrendingUp, FiCalendar, FiMap, FiFileText,
  FiBriefcase, FiHeart, FiAward, FiActivity,
  FiShoppingCart, FiArrowRight, FiPlus
} from 'react-icons/fi';
import { FaRecycle, FaTruck, FaLeaf } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCollecteurs, setTopCollecteurs] = useState([]);
  const [achatsStats, setAchatsStats] = useState(null);
  const [collectesStats, setCollectesStats] = useState(null);
  const [stocksPoints, setStocksPoints] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDashboard();
    loadRecentActivities();
    loadAchatsStats();
    loadCollectesStats();
    loadStocksPoints();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboard();
      setStats(data.statistiques);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const data = await adminService.getRecentActivities();
      setRecentActivities(data.activites || []);
      setTopCollecteurs(data.topCollecteurs || []);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
    }
  };

  const loadAchatsStats = async () => {
    try {
      const data = await adminService.getStatistiquesAchats();
      setAchatsStats(data);
    } catch (error) {
      console.error('Erreur chargement achats:', error);
    }
  };

  const loadCollectesStats = async () => {
    try {
      const data = await adminService.getStatistiquesCollectes();
      setCollectesStats(data);
    } catch (error) {
      console.error('Erreur chargement collectes:', error);
    }
  };

  const loadStocksPoints = async () => {
    try {
      const data = await adminService.getStocksPoints();
      setStocksPoints(data.stocks || []);
    } catch (error) {
      console.error('Erreur chargement stocks:', error);
    }
  };

  const COLORS = ['#2d8a5e', '#e0a020', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c'];

  // Préparer les données pour les graphiques
  const userRepartition = [
    { type: 'Superviseurs', nombre: stats?.superviseurs?.total || 0, color: '#8e44ad' },
    { type: 'Recycleurs', nombre: stats?.recycleurs?.total || 0, color: '#2ecc71' },
    { type: 'Collecteurs', nombre: stats?.collecteurs?.total || 0, color: '#3498db' },
    { type: 'Gestionnaires', nombre: stats?.gestionnaires?.total || 0, color: '#f39c12' },
    { type: 'Producteurs', nombre: stats?.producteurs?.total || 0, color: '#e67e22' },
    { type: 'ONG', nombre: stats?.ongs?.total || 0, color: '#e74c3c' },
    { type: 'Sponsors', nombre: stats?.sponsors?.total || 0, color: '#9b59b6' },
  ].filter(item => item.nombre > 0);

  const collecteursStatus = [
    { name: 'Actifs', value: stats?.collecteurs?.actifs || 0, color: '#2d8a5e' },
    { name: 'En attente', value: stats?.collecteurs?.en_attente || 0, color: '#e0a020' },
  ].filter(item => item.value > 0);

  const evolutionData = stats?.evolution || [];
  const evolutionAchats = achatsStats?.evolution_mensuelle || [];

  // Cartes principales avec des designs modernes
  const statCards = [
    { title: 'Superviseurs', value: stats?.superviseurs?.total || 0, icon: FiUserCheck, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50', link: '/admin/superviseurs' },
    { title: 'Recycleurs', value: stats?.recycleurs?.total || 0, icon: FiPackage, color: 'from-green-500 to-green-600', bgLight: 'bg-green-50', link: '/admin/recycleurs' },
    { title: 'Collecteurs', value: stats?.collecteurs?.total || 0, icon: FiUsers, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', link: '/admin/collecteurs' },
    { title: 'Gestionnaires', value: stats?.gestionnaires?.total || 0, icon: FiBriefcase, color: 'from-indigo-500 to-indigo-600', bgLight: 'bg-indigo-50', link: '/admin/gestionnaires' },
    { title: 'Producteurs', value: stats?.producteurs?.total || 0, icon: FiUsers, color: 'from-yellow-500 to-yellow-600', bgLight: 'bg-yellow-50', link: '/admin/producteurs' },
    { title: 'Producteurs Premium', value: stats?.producteurs?.premium || 0, icon: FiAward, color: 'from-orange-500 to-orange-600', bgLight: 'bg-orange-50', link: '/admin/producteurs-premium' },
    { title: 'ONG', value: stats?.ongs?.total || 0, icon: FiHeart, color: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50', link: '/admin/ongs' },
    { title: 'Sponsors', value: stats?.sponsors?.total || 0, icon: FiDollarSign, color: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50', link: '/admin/sponsors' },
  ];

  const globalCards = [
    { title: 'Campagnes actives', value: stats?.globales?.campagnes_actives || 0, icon: FiTrendingUp, color: 'from-indigo-500 to-indigo-600', bgLight: 'bg-indigo-50', link: '/admin/campagnes' },
    { title: 'Missions validées', value: stats?.globales?.missions_validees || 0, icon: FiCalendar, color: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50', link: '/admin/missions' },
    { title: 'KG collectés', value: `${(stats?.globales?.total_kg_collectes || 0).toLocaleString()} kg`, icon: FiMap, color: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50', link: '#' },
    { title: 'Crédits distribués', value: (stats?.globales?.total_credits_distribues || 0).toLocaleString() + ' FCFA', icon: FiActivity, color: 'from-cyan-500 to-cyan-600', bgLight: 'bg-cyan-50', link: '#' },
  ];

  const achatsCards = achatsStats ? [
    { title: 'Poids total acheté', value: `${achatsStats.global.poids_total_achete.toLocaleString()} kg`, icon: FiPackage, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { title: 'Montant total achats', value: `${achatsStats.global.montant_total_achete.toLocaleString()} FCFA`, icon: FiDollarSign, color: 'from-green-500 to-green-600', bgLight: 'bg-green-50' },
    { title: "Nombre d'achats", value: achatsStats.global.nombre_achats, icon: FiShoppingCart, color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Admin" user={user}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaLeaf className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Chargement de votre tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de bord" user={user}>
      {/* En-tête avec bienvenue */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-white rounded-2xl p-6 border border-green-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Bonjour, {user?.nomComplet || 'Admin'} 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Voici un aperçu de l'activité de votre plateforme EcoCollect.
        </p>
      </div>

      {/* Cartes statistiques utilisateurs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiUsers className="mr-2 text-green-600" /> Utilisateurs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, idx) => (
            <Link
              key={idx}
              to={stat.link}
              className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-green-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgLight} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color.split('-')[1]}-600`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cartes globales */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiActivity className="mr-2 text-green-600" /> Activité globale
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {globalCards.map((stat, idx) => (
            <Link
              key={idx}
              to={stat.link}
              className="group bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:border-green-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgLight} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color.split('-')[1]}-600`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cartes achats si disponibles */}
      {achatsCards.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiShoppingCart className="mr-2 text-green-600" /> Achats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {achatsCards.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgLight}`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color.split('-')[1]}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Graphique évolution collectes */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4">Évolution des collectes (7 derniers jours)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="jour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value} kg`} />
                <Line type="monotone" dataKey="poids" stroke="#2d8a5e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statut des collecteurs (camembert) */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-4">Statut des collecteurs</h4>
          <div className="h-64 flex items-center justify-center">
            {collecteursStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collecteursStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {collecteursStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">Aucune donnée</p>
            )}
          </div>
        </div>

        {/* Répartition utilisateurs */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4">Répartition des utilisateurs</h4>
          <div className="h-64">
            {userRepartition.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userRepartition} layout="vertical" margin={{ left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="nombre" fill="#2d8a5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">Aucune donnée</p>
            )}
          </div>
        </div>

        {/* Top collecteurs */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-4">Top 5 collecteurs</h4>
          <div className="space-y-3">
            {topCollecteurs.slice(0, 5).map((collecteur, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{collecteur.nom_complet}</p>
                    <p className="text-xs text-gray-500">{collecteur.missions_realisees} missions</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600 text-sm">{collecteur.kg_collectes} kg</span>
              </div>
            ))}
            {topCollecteurs.length === 0 && (
              <p className="text-gray-400 text-center py-4">Aucun collecteur</p>
            )}
          </div>
        </div>

        {/* Évolution mensuelle des achats */}
        {evolutionAchats.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-gray-100 lg:col-span-3">
            <h4 className="font-semibold text-gray-800 mb-4">Évolution mensuelle des achats</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionAchats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="poids_total" stroke="#2d8a5e" name="Poids (kg)" />
                  <Line yAxisId="right" type="monotone" dataKey="montant_total" stroke="#f39c12" name="Montant (FCFA)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Deux colonnes : Activités récentes et stocks / liens rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FiActivity className="mr-2 text-green-600" /> Activités récentes
          </h4>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 6).map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Liens rapides et stocks */}
        <div className="space-y-6">
          {/* Liens rapides */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <FiArrowRight className="mr-2 text-green-600" /> Actions rapides
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/admin/superviseurs/nouveau" className="flex items-center justify-center gap-1 bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition text-sm">
                <FiPlus /> Superviseur
              </Link>
              <Link to="/admin/recycleurs/nouveau" className="flex items-center justify-center gap-1 bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition text-sm">
                <FiPlus /> Recycleur
              </Link>
              <Link to="/admin/campagnes/nouveau" className="flex items-center justify-center gap-1 bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition text-sm">
                <FiPlus /> Campagne
              </Link>
              <Link to="/admin/sponsors/nouveau" className="flex items-center justify-center gap-1 bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition text-sm">
                <FiPlus /> Sponsor
              </Link>
            </div>
          </div>

          {/* Stocks des points de collecte (si disponibles) */}
          {stocksPoints.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FiPackage className="mr-2 text-green-600" /> Stocks actuels
              </h4>
              <div className="space-y-2">
                {stocksPoints.slice(0, 4).map((stock, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{stock.point_depot_nom}</span>
                    <span className="font-medium">{stock.quantite} kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;