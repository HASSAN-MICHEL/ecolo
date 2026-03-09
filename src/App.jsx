

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import Register from './pages/Register'
// import RegisterCollector from './pages/collector/RegisterCollector'
// import DashboardCollector from './pages/collector/DashboardCollector' 
// import Login from './pages/Login'
// import ForgotPassword from './pages/ForgotPassword'
// import ResetPassword from './pages/ResetPassword'
// import Profile from './pages/Profile'
// import Dashboard from './pages/Dashboard'
// import DeclareWaste from './pages/DeclareWaste'
// import CollectionTracking from './pages/CollectionTracking'
// import TrackingList from './pages/TrackingList'
// import History from './pages/History'
// import DeclarationDetails from './pages/DeclarationDetails'
// import Rewards from './pages/Rewards'
// import Notifications from './pages/Notifications'
// import Settings from './pages/Settings'
// import Terms from './pages/Terms'
// import Privacy from './pages/Privacy'
// import VerifyCode from './pages/VerifyCode'
// import ProducteurDashboard from './pages/ProducteurDashboard.jsx'
// import DashboardGestionnaire from './pages/gestionnaire/DashboardGestionnaire'
// import DashboardSuperviseur from './pages/superviseur/DashboardSuperviseur'
// import Index from './pages/Index'
// // Composants Admin
// import AdminDashboard from './pages/admin/AdminDashboard';
// import CreerRecycleur from './pages/admin/CreerRecycleur';

// import RecycleurDashboard from './pages/recycleur/RecycleurDashboard';
// import StocksList from './pages/recycleur/StocksList';
// import DemandeEnlevement from './pages/recycleur/DemandeEnlevement';
// import MesDemandes from './pages/recycleur/MesDemandes';
// import DeclarationRecyclage from './pages/recycleur/DeclarationRecyclage';

// // Composants Sponsor


// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/register-collector" element={<RegisterCollector />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/producteur" element={<ProducteurDashboard />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/verify-code" element={<VerifyCode />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/declare" element={<DeclareWaste />} />
//           <Route path="/tracking/:id" element={<CollectionTracking />} />
//           <Route path="/tracking" element={<TrackingList />} />
//           <Route path="/history" element={<History />} />
//           <Route path="/declaration/:id" element={<DeclarationDetails />} />
//           <Route path="/rewards" element={<Rewards />} />
//           <Route path="/notifications" element={<Notifications />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy" element={<Privacy />} /> 
          
//           {/* ✅ UNE SEULE ROUTE pour tout l'espace collecteur */}
//           <Route path="/collecteur/*" element={<DashboardCollector />} />
//            <Route path="/gestionnaire/*" element={<DashboardGestionnaire />} />  
//            <Route path="/superviseur/*" element={<DashboardSuperviseur />} /> 


//           <Route path="*" element={<Index />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages existantes
import Home from './pages/Home';
import Index from './pages/Index';
import Register from './pages/Register';
import RegisterCollector from './pages/collector/RegisterCollector';
import DashboardCollector from './pages/collector/DashboardCollector';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyCode from './pages/VerifyCode';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import DeclareWaste from './pages/DeclareWaste';
import CollectionTracking from './pages/CollectionTracking';
import TrackingList from './pages/TrackingList';
import History from './pages/History';
import DeclarationDetails from './pages/DeclarationDetails';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ProducteurDashboard from './pages/ProducteurDashboard.jsx';
import DashboardGestionnaire from './pages/gestionnaire/DashboardGestionnaire';
import DashboardSuperviseur from './pages/superviseur/DashboardSuperviseur';

// Nouveaux composants Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CreerRecycleur from './pages/admin/CreerRecycleur';
import SuperviseurList from './pages/admin/SuperviseurList';
import CreerSuperviseur from './pages/admin/CreerSuperviseur';
import RecycleursList from './pages/admin/RecycleursList';
import SponsorsList from './pages/sponsors/SponsorsList';
import CreerSponsor from './pages/sponsors/CreerSponsor';
import CampagnesList  from './pages/campagnes/CampagnesList';
import CreerCampagne from './pages/campagnes/CreerCampagne';
import OngsList from './pages/admin/OngsList';
import CreerOng from './pages/admin/CreerOng';
import RecycleurDashboard from './pages/recycleur/RecycleurDashboard';
import StocksList from './pages/recycleur/StocksList';
import DemandeEnlevement from './pages/recycleur/DemandeEnlevement';
import MesDemandes from './pages/recycleur/MesDemandes';
import DeclarationRecyclage from './pages/recycleur/DeclarationRecyclage';
import MesDeclarations from './pages/recycleur/MesDeclarations'; 
import MonStock from './pages/recycleur/MonStock';
import DemandesSuppressionList from './pages/superviseur/DemandesSuppressionList';
import ProducteursPremiumList  from './pages/product/ProducteursPremiumList';
import ProducteursList from './pages/admin/ProducteursList';
import CollecteursList from './pages/admin/CollecteursList';
import GestionnairesList from './pages/admin/GestionnairesList';

import DashboardONG from './pages/Ongs/DashboardONG';

// // Nouveaux composants Sponsor
 import DashboardSponsor from './pages/sponsors/DashboardSponsor';


// Composant de route privée
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('ecocollect_token') || localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('ecocollect_user') || localStorage.getItem('user'));
  const role = localStorage.getItem('ecocollect_role') || user?.type;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Rediriger vers le dashboard approprié selon le rôle
    const redirectPaths = {
      'producteur': '/producteur',
      'collecteur': '/collecteur',
      'gestionnaire': '/gestionnaire',
      'superviseur': '/superviseur',
      'admin': '/admin',
      'recycleur': '/recycleur',
      'sponsor': '/sponsor'
    };
    return <Navigate to={redirectPaths[role] || '/'} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#2d8a5e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div className="App">
        <Routes>
          {/* ========== ROUTES PUBLIQUES ========== */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-collector" element={<RegisterCollector />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* ========== ROUTES PRODUCTEUR ========== */}
          <Route path="/producteur/*" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <ProducteurDashboard />
            </PrivateRoute>
          } />
          
          {/* Routes producteur spécifiques (si nécessaire) */}
          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['producteur', 'collecteur', 'recycleur', 'sponsor']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/declare" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <DeclareWaste />
            </PrivateRoute>
          } />
          <Route path="/tracking/:id" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <CollectionTracking />
            </PrivateRoute>
          } />
          <Route path="/tracking" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <TrackingList />
            </PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <History />
            </PrivateRoute>
          } />
          <Route path="/declaration/:id" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <DeclarationDetails />
            </PrivateRoute>
          } />
          <Route path="/rewards" element={
            <PrivateRoute allowedRoles={['producteur']}>
              <Rewards />
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute allowedRoles={['producteur', 'collecteur', 'recycleur', 'sponsor']}>
              <Notifications />
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute allowedRoles={['producteur', 'collecteur', 'recycleur', 'sponsor']}>
              <Settings />
            </PrivateRoute>
          } />

          {/* ========== ROUTES COLLECTEUR ========== */}
          <Route path="/collecteur/*" element={
            <PrivateRoute allowedRoles={['collecteur']}>
              <DashboardCollector />
            </PrivateRoute>
          } />

          {/* ========== ROUTES GESTIONNAIRE ========== */}
          <Route path="/gestionnaire/*" element={
            <PrivateRoute allowedRoles={['gestionnaire']}>
              <DashboardGestionnaire />
            </PrivateRoute>
          } />

          {/* ========== ROUTES SUPERVISEUR ========== */}
          <Route path="/superviseur/*" element={
            <PrivateRoute allowedRoles={['superviseur']}>
              <DashboardSuperviseur />
            </PrivateRoute>
          } />

          {/* ========== ROUTES ADMIN ========== */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin/superviseurs" element={
            <PrivateRoute allowedRoles={['admin']}>
              <SuperviseurList />
            </PrivateRoute>
          } />
          
          <Route path="/admin/superviseurs/nouveau" element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreerSuperviseur />
            </PrivateRoute>
          } />
          
            <Route path="/admin/recycleurs" element={
            <PrivateRoute allowedRoles={['admin']}>
              <RecycleursList />
            </PrivateRoute>
          } />
          <Route path="/admin/recycleurs/nouveau" element={<CreerRecycleur />} />
          
<Route path="/admin/ongs" element={
  <PrivateRoute allowedRoles={['admin']}>
    <OngsList />
  </PrivateRoute>
} />

<Route path="/admin/ongs/nouveau" element={
  <PrivateRoute allowedRoles={['admin']}>
    <CreerOng />
  </PrivateRoute>
} />

<Route path="/admin/ongs/:id/edit" element={
  <PrivateRoute allowedRoles={['admin']}>
    <CreerOng />
  </PrivateRoute>
} />
          {/* ========== ROUTES RECYCLEUR ==========  */}
          <Route path="/recycleur" element={
            <PrivateRoute allowedRoles={['recycleur']}>  
              <RecycleurDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/recycleur/stocks" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <StocksList />
            </PrivateRoute>
          } />
           <Route path="/recycleur/Mesdeclarations" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <MesDeclarations/>
            </PrivateRoute>
          } />

          <Route path="/recycleur/demandes" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <MesDemandes />
            </PrivateRoute>
          } />

           <Route path="/recycleur/monStock" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <MonStock />
            </PrivateRoute>
          } />
          
          <Route path="/recycleur/demandes/nouvelle" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <DemandeEnlevement />
            </PrivateRoute>
          } />
        
          
          <Route path="/recycleur/declarations" element={
            <PrivateRoute allowedRoles={['recycleur']}>
              <DeclarationRecyclage />
            </PrivateRoute>
          } />
          
          
          <Route path="/admin/sponsors" element={<SponsorsList />} />
        <Route path="/admin/sponsors/nouveau" element={<CreerSponsor />} />
        {/* <Route path="/admin/sponsors/:id" element={<SponsorDetails />} /> */}
        <Route path="/admin/sponsors/:id/edit" element={<CreerSponsor />} />



      <Route path="/admin/campagnes" element={<CampagnesList />} />
      <Route path="/admin/campagnes/nouveau" element={<CreerCampagne />} />
      {/* <Route path="/admin/campagnes/:id" element={<CampagneDetails />} /> */}
      {/* <Route path="/admin/campagnes/:id/edit" element={<CreerCampagne />} />

      <Route path="/admin/producteurs-premium" element={<ProducteursPremiumList />} />
      <Route path="/admin/producteurs-premium/:id" element={<ProducteurPremiumDetails />} /> */}

      <Route path="/admin/producteurs" element={<ProducteursList />} />
       <Route path="/admin/collecteurs" element={<CollecteursList />} />
       <Route path="/admin/gestionnaires" element={<GestionnairesList />} />

      <Route path="/sponsor" element={<DashboardSponsor />} />
      <Route path="/ong" element={<DashboardONG />} />
         

          {/* ========== ROUTE 404 ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;