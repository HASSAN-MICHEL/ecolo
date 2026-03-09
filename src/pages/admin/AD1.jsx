// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../../Layouts/LayoutDashboard';
// import adminService from '../../services/adminService';
// import { 
//   FiUsers, FiUserCheck, FiPackage, FiDollarSign,
//   FiTrendingUp, FiCalendar, FiMap, FiFileText
// } from 'react-icons/fi';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
//     setUser(userData);
//     loadDashboard();
//   }, []);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const data = await adminService.getDashboard();
//       setStats(data.statistiques);
//     } catch (error) {
//       console.error('Erreur chargement dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: 'Superviseurs',
//       value: stats?.superviseurs?.total || 0,
//       icon: FiUserCheck,
//       color: 'bg-purple-100 text-purple-600',
//     },
//     {
//       title: 'Recycleurs',
//       value: stats?.recycleurs?.total || 0,
//       icon: FiPackage,
//       color: 'bg-green-100 text-green-600',
//     },
//     {
//       title: 'Collecteurs',
//       value: stats?.collecteurs?.total || 0,
//       icon: FiUsers,
//       color: 'bg-blue-100 text-blue-600',
//     },
//     {
//       title: 'Producteurs',
//       value: stats?.producteurs?.total || 0,
//       icon: FiUsers,
//       color: 'bg-yellow-100 text-yellow-600',
//     },
//     {
//       title: 'Producteurs Premium',
//       value: stats?.producteurs?.premium || 0,
//       icon: FiDollarSign,
//       color: 'bg-orange-100 text-orange-600',
//     },
//     {
//       title: 'Campagnes actives',
//       value: stats?.campagnes?.actives || 0,
//       icon: FiTrendingUp,
//       color: 'bg-indigo-100 text-indigo-600',
//     },
//     {
//       title: 'Missions validées',
//       value: stats?.missions?.validees || 0,
//       icon: FiCalendar,
//       color: 'bg-pink-100 text-pink-600',
//     },
//     {
//       title: 'KG collectés',
//       value: `${stats?.missions?.total_kg || 0} kg`,
//       icon: FiMap,
//       color: 'bg-teal-100 text-teal-600',
//     },
//   ];

//   const styles = `
//     .stats-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//       gap: 1.5rem;
//       margin-bottom: 2rem;
//     }

//     .stat-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       display: flex;
//       align-items: center;
//       gap: 1rem;
//       box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
//       border: 1px solid #d9e0d9;
//     }

//     .stat-icon {
//       width: 3rem;
//       height: 3rem;
//       border-radius: 0.75rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 1.5rem;
//     }

//     .stat-content {
//       flex: 1;
//     }

//     .stat-title {
//       font-size: 0.9rem;
//       color: #5a655a;
//       margin-bottom: 0.25rem;
//     }

//     .stat-value {
//       font-size: 1.8rem;
//       font-weight: 700;
//       color: #1a1e1a;
//     }

//     .charts-grid {
//       display: grid;
//       grid-template-columns: repeat(2, 1fr);
//       gap: 1.5rem;
//     }

//     .chart-card {
//       background: white;
//       border-radius: 1rem;
//       padding: 1.5rem;
//       border: 1px solid #d9e0d9;
//     }

//     .chart-title {
//       font-size: 1.1rem;
//       font-weight: 600;
//       margin-bottom: 1.5rem;
//       color: #1a1e1a;
//     }

//     .chart-container {
//       height: 300px;
//     }

//     @media (max-width: 768px) {
//       .charts-grid {
//         grid-template-columns: 1fr;
//       }
//     }
//   `;

//   if (loading) {
//     return (
//       <DashboardLayout title="Dashboard Admin" user={user}>
//         <div style={{ textAlign: 'center', padding: '3rem' }}>
//           <div className="spinner" style={{ margin: '0 auto' }}></div>
//           <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <>
//       <style>{styles}</style>
//       <DashboardLayout title="Dashboard Admin" user={user}>
//         {/* Statistiques */}
//         <div className="stats-grid">
//           {statCards.map((stat, index) => (
//             <div key={index} className="stat-card">
//               <div className={`stat-icon ${stat.color}`}>
//                 <stat.icon />
//               </div>
//               <div className="stat-content">
//                 <div className="stat-title">{stat.title}</div>
//                 <div className="stat-value">{stat.value}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Graphiques */}
//         <div className="charts-grid">
//           <div className="chart-card">
//             <h3 className="chart-title">Évolution des collectes</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={stats?.evolution || []}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="jour" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="poids" stroke="#2d8a5e" name="KG collectés" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="chart-card">
//             <h3 className="chart-title">Répartition par type</h3>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={stats?.repartition || []}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="type" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="nombre" fill="#2d8a5e" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </DashboardLayout>
//     </>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import adminService from '../../services/adminService';
import { 
  FiUsers, FiUserCheck, FiPackage, FiDollarSign,
  FiTrendingUp, FiCalendar, FiMap, FiFileText,
  FiBriefcase, FiHeart, FiAward, FiActivity
} from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCollecteurs, setTopCollecteurs] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDashboard();
    loadRecentActivities();
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

  const COLORS = ['#2d8a5e', '#e0a020', '#3498db', '#e74c3c', '#9b59b6', '#1abc9c'];

  // const statCards = [
  //   {
  //     title: 'Superviseurs',
  //     value: stats?.superviseurs?.total || 0,
  //     icon: FiUserCheck,
  //     color: 'bg-purple-100 text-purple-600',
  //     link: '/admin/superviseurs'
  //   },
  //   {
  //     title: 'Recycleurs',
  //     value: stats?.recycleurs?.total || 0,
  //     icon: FiPackage,
  //     color: 'bg-green-100 text-green-600',
  //     link: '/admin/recycleurs'
  //   },
  //   {
  //     title: 'Collecteurs',
  //     value: stats?.collecteurs?.total || 0,
  //     icon: FiUsers,
  //     color: 'bg-blue-100 text-blue-600',
  //     link: '/admin/collecteurs'
  //   },
  //   {
  //     title: 'Gestionnaires',
  //     value: stats?.gestionnaires?.total || 0,
  //     icon: FiBriefcase,
  //     color: 'bg-indigo-100 text-indigo-600',
  //     link: '/admin/gestionnaires'
  //   },
  //   {
  //     title: 'Producteurs',
  //     value: stats?.producteurs?.total || 0,
  //     icon: FiUsers,
  //     color: 'bg-yellow-100 text-yellow-600',
  //     link: '/admin/producteurs'
  //   },
  //   {
  //     title: 'Producteurs Premium',
  //     value: stats?.producteurs?.premium || 0,
  //     icon: FiAward,
  //     color: 'bg-orange-100 text-orange-600',
  //     link: '/admin/producteurs-premium'
  //   },
  //   {
  //     title: 'ONG',
  //     value: stats?.ongs?.total || 0,
  //     icon: FiHeart,
  //     color: 'bg-pink-100 text-pink-600',
  //     link: '/admin/ongs'
  //   },
  //   {
  //     title: 'Sponsors',
  //     value: stats?.sponsors?.total || 0,
  //     icon: FiDollarSign,
  //     color: 'bg-teal-100 text-teal-600',
  //     link: '/admin/sponsors'
  //   },
  //   {
  //     title: 'Campagnes actives',
  //     value: stats?.campagnes?.actives || 0,
  //     icon: FiTrendingUp,
  //     color: 'bg-indigo-100 text-indigo-600',
  //     link: '/admin/campagnes'
  //   },
  //   {
  //     title: 'Missions validées',
  //     value: stats?.missions?.validees || 0,
  //     icon: FiCalendar,
  //     color: 'bg-pink-100 text-pink-600',
  //     link: '/admin/missions'
  //   },
  //   {
  //     title: 'KG collectés',
  //     value: `${(stats?.missions?.total_kg || 0).toLocaleString()} kg`,
  //     icon: FiMap,
  //     color: 'bg-teal-100 text-teal-600',
  //     link: '#'
  //   },
  //   {
  //     title: 'Points distribués',
  //     value: (stats?.producteurs?.points || 0).toLocaleString(),
  //     icon: FiActivity,
  //     color: 'bg-cyan-100 text-cyan-600',
  //     link: '#'
  //   },
  // ];

  const statCards = [
  {
    title: 'Superviseurs',
    value: stats?.superviseurs?.total || 0,
    icon: FiUserCheck,
    color: 'bg-purple-100 text-purple-600',
    link: '/admin/superviseurs'
  },
  {
    title: 'Recycleurs',
    value: stats?.recycleurs?.total || 0,
    icon: FiPackage,
    color: 'bg-green-100 text-green-600',
    link: '/admin/recycleurs'
  },
  {
    title: 'Collecteurs',
    value: stats?.collecteurs?.total || 0,
    icon: FiUsers,
    color: 'bg-blue-100 text-blue-600',
    link: '/admin/collecteurs'
  },
  {
    title: 'Gestionnaires',
    value: stats?.gestionnaires?.total || 0,
    icon: FiBriefcase,
    color: 'bg-indigo-100 text-indigo-600',
    link: '/admin/gestionnaires'
  },
  {
    title: 'Producteurs',
    value: stats?.producteurs?.total || 0,
    icon: FiUsers,
    color: 'bg-yellow-100 text-yellow-600',
    link: '/admin/producteurs'
  },
  {
    title: 'Producteurs Premium',
    value: stats?.producteurs?.premium || 0,
    icon: FiAward,
    color: 'bg-orange-100 text-orange-600',
    link: '/admin/producteurs-premium'
  },
  {
    title: 'ONG',
    value: stats?.ongs?.total || 0,
    icon: FiHeart,
    color: 'bg-pink-100 text-pink-600',
    link: '/admin/ongs'
  },
  {
    title: 'Sponsors',
    value: stats?.sponsors?.total || 0,
    icon: FiDollarSign,
    color: 'bg-teal-100 text-teal-600',
    link: '/admin/sponsors'
  },
  {
    title: 'Campagnes actives',
    value: stats?.globales?.campagnes_actives || 0,
    icon: FiTrendingUp,
    color: 'bg-indigo-100 text-indigo-600',
    link: '/admin/campagnes'
  },
  {
    title: 'Missions validées',
    value: stats?.globales?.missions_validees || 0,
    icon: FiCalendar,
    color: 'bg-pink-100 text-pink-600',
    link: '/admin/missions'
  },
  {
    title: 'KG collectés',
    value: `${(stats?.globales?.total_kg_collectes || 0).toLocaleString()} kg`,
    icon: FiMap,
    color: 'bg-teal-100 text-teal-600',
    link: '#'
  },
  {
    title: 'Crédits distribués (FCFA)',
    value: (stats?.globales?.total_credits_distribues || 0).toLocaleString() + ' FCFA',
    icon: FiActivity,
    color: 'bg-cyan-100 text-cyan-600',
    link: '#'
  },
];

  // Données pour le graphique d'évolution
  const evolutionData = stats?.evolution || [
    { jour: 'Lun', poids: 240 },
    { jour: 'Mar', poids: 300 },
    { jour: 'Mer', poids: 280 },
    { jour: 'Jeu', poids: 320 },
    { jour: 'Ven', poids: 290 },
    { jour: 'Sam', poids: 310 },
    { jour: 'Dim', poids: 270 },
  ];

  // Données pour la répartition
  const repartitionData = [
    { type: 'Superviseurs', nombre: stats?.superviseurs?.total || 0 },
    { type: 'Recycleurs', nombre: stats?.recycleurs?.total || 0 },
    { type: 'Collecteurs', nombre: stats?.collecteurs?.total || 0 },
    { type: 'Gestionnaires', nombre: stats?.gestionnaires?.total || 0 },
    { type: 'Producteurs', nombre: stats?.producteurs?.total || 0 },
    { type: 'ONG', nombre: stats?.ongs?.total || 0 },
    { type: 'Sponsors', nombre: stats?.sponsors?.total || 0 },
  ].filter(item => item.nombre > 0);

  // Données pour le pie chart
  const pieData = [
    { name: 'Actifs', value: stats?.collecteurs?.actifs || 0 },
    { name: 'En attente', value: stats?.collecteurs?.en_attente || 0 },
  ];

  const styles = `
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
      border: 1px solid #d9e0d9;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      text-decoration: none;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-title {
      font-size: 0.9rem;
      color: #5a655a;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #1a1e1a;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .chart-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
    }

    .chart-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #1a1e1a;
    }

    .chart-container {
      height: 300px;
    }

    .activities-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f3f0;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: #2d8a5e;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      font-weight: 500;
      color: #1a1e1a;
    }

    .activity-time {
      font-size: 0.75rem;
      color: #5a655a;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Admin" user={user}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement des données...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Dashboard Admin" user={user}>
        {/* Cartes de statistiques */}
        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon />
              </div>
              <div className="stat-content">
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Graphiques et activités récentes */}
        <div className="dashboard-grid">
          <div className="charts-grid">
            {/* Évolution des collectes */}
            <div className="chart-card">
              <h3 className="chart-title">Évolution des collectes (7 derniers jours)</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jour" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend />
                    <Line type="monotone" dataKey="poids" stroke="#2d8a5e" name="KG collectés" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition des utilisateurs */}
            <div className="chart-card">
              <h3 className="chart-title">Répartition par type</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repartitionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="nombre" fill="#2d8a5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Statut des collecteurs */}
            <div className="chart-card">
              <h3 className="chart-title">Statut des collecteurs</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top collecteurs */}
            <div className="chart-card">
              <h3 className="chart-title">Top 5 collecteurs</h3>
              <div className="space-y-3">
                {topCollecteurs.length > 0 ? topCollecteurs.map((collecteur, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-600">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{collecteur.nom_complet}</p>
                        <p className="text-xs text-gray-500">{collecteur.missions_realisees} missions</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary-600">{collecteur.kg_collectes} kg</span>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center">Aucune donnée disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Activités récentes */}
          <div className="activities-card">
            <h3 className="chart-title">Activités récentes</h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.action}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-text">Aucune activité récente</p>
                    <p className="activity-time">-</p>
                  </div>
                </div>
              )}
            </div>

            {/* Liens rapides */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Actions rapides</h4>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/admin/superviseurs/nouveau" className="text-sm bg-primary-50 text-primary-700 p-2 rounded-lg text-center hover:bg-primary-100">
                  + Superviseur
                </Link>
                <Link to="/admin/recycleurs/nouveau" className="text-sm bg-primary-50 text-primary-700 p-2 rounded-lg text-center hover:bg-primary-100">
                  + Recycleur
                </Link>
                <Link to="/admin/campagnes/nouveau" className="text-sm bg-primary-50 text-primary-700 p-2 rounded-lg text-center hover:bg-primary-100">
                  + Campagne
                </Link>
                <Link to="/admin/sponsors/nouveau" className="text-sm bg-primary-50 text-primary-700 p-2 rounded-lg text-center hover:bg-primary-100">
                  + Sponsor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;