// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import Register from './pages/Register'
// import RegisterCollector from './pages/collector/RegisterCollector'
// import DashboardCollector from './pages/collector/DashboardCollector'
// import ProfileCollector from './pages/collector/ProfileCollector'
// import MissionsCollector from './pages/collector/MissionsCollector'
// import WalletCollector from './pages/collector/WalletCollector'
// import DepositCollector from './pages/collector/DepositCollector'
// import NotificationsCollector from './pages/collector/NotificationsCollector'
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
// import  VerifyCode  from './pages/VerifyCode'
// import ProducteurDashboard from './pages/ProducteurDashboard.jsx'
// import CollecteurDashboard from './pages/CollecteurDashboard'
// import Index from './pages/Index'
// // routes 



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
//            <Route path="/verify-code" element={<VerifyCode />} />
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
          
//           {/* Collector Routes */}
//           <Route path="/collecteur" element={<DashboardCollector />} />
//           <Route path="/collecteur/missions" element={<MissionsCollector />} />
//           <Route path="/collecteur/wallet" element={<WalletCollector />} />
//           <Route path="/collecteur/profile" element={<ProfileCollector />} />
//           <Route path="/collecteur/deposit" element={<DepositCollector />} />
//           <Route path="/collecteur/notifications" element={<NotificationsCollector />} />
          
//           <Route path="*" element={<Home />} />
//         </Routes>
//       </div>
//     </Router>
//   )
// }

// export default App


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import RegisterCollector from './pages/collector/RegisterCollector'
import DashboardCollector from './pages/collector/DashboardCollector' 
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import DeclareWaste from './pages/DeclareWaste'
import CollectionTracking from './pages/CollectionTracking'
import TrackingList from './pages/TrackingList'
import History from './pages/History'
import DeclarationDetails from './pages/DeclarationDetails'
import Rewards from './pages/Rewards'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import VerifyCode from './pages/VerifyCode'
import ProducteurDashboard from './pages/ProducteurDashboard.jsx'
import DashboardGestionnaire from './pages/gestionnaire/DashboardGestionnaire'
import DashboardSuperviseur from './pages/superviseur/DashboardSuperviseur'
import Index from './pages/Index'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-collector" element={<RegisterCollector />} />
          <Route path="/login" element={<Login />} />
          <Route path="/producteur" element={<ProducteurDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/declare" element={<DeclareWaste />} />
          <Route path="/tracking/:id" element={<CollectionTracking />} />
          <Route path="/tracking" element={<TrackingList />} />
          <Route path="/history" element={<History />} />
          <Route path="/declaration/:id" element={<DeclarationDetails />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} /> 
          
          {/* ✅ UNE SEULE ROUTE pour tout l'espace collecteur */}
          <Route path="/collecteur/*" element={<DashboardCollector />} />
           <Route path="/gestionnaire/*" element={<DashboardGestionnaire />} />  
           <Route path="/superviseur/*" element={<DashboardSuperviseur />} /> 
          <Route path="*" element={<Index />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App