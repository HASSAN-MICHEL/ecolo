import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiPackage, FiDollarSign, 
  FiFileText, FiLogOut, FiMenu, FiX,
  FiUserPlus, FiList
} from 'react-icons/fi';

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ecocollect_token');
    localStorage.removeItem('ecocollect_user');
    localStorage.removeItem('ecocollect_role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/superviseurs', icon: FiUsers, label: 'Superviseurs' },
    { path: '/admin/superviseurs/nouveau', icon: FiUserPlus, label: 'Nouveau superviseur' },
    { path: '/admin/recycleurs', icon: FiPackage, label: 'Recycleurs' },
    { path: '/admin/recycleurs/nouveau', icon: FiUserPlus, label: 'Créer recycleur' },
    { path: '/admin/producteurs-premium', icon: FiDollarSign, label: 'Producteurs premium' },
    { path: '/admin/demandes', icon: FiFileText, label: 'Demandes' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 fixed h-full`}>
        <div className="p-4 flex justify-between items-center border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-primary-600">Eco<span className="text-gray-800">Admin</span></h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 mb-1 transition-colors"
            >
              <item.icon className="text-xl" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 mt-4 transition-colors"
          >
            <FiLogOut className="text-xl" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;