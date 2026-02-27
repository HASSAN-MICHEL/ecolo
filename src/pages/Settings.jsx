import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Smartphone, 
  Mail, 
  Shield, 
  HelpCircle, 
  Info, 
  ChevronRight,
  Moon,
  Sun,
  Volume2,
  Wifi,
  Database,
  FileText,
  User,
  MapPin,
  CreditCard,
  LogOut,
  Trash2,
  Download,
  Upload
} from 'lucide-react'
import Layout from '../components/Layout'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [darkMode, setDarkMode] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    browser: true
  })
  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    marketing: false
  })

  const tabs = [
    { id: 'general', label: 'Général', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Lock },
    // { id: 'account', label: 'Compte', icon: User },
    { id: 'about', label: 'À propos', icon: Info }
  ]

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    console.log('Déconnexion...')
    window.location.href = '/'
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Suppression du compte...')
    }
  }

  const handleExportData = () => {
    console.log('Export des données...')
    alert('Vos données sont en cours d\'exportation...')
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Apparence</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-600" />}
              <div>
                <p className="font-medium text-gray-900">Mode sombre</p>
                <p className="text-sm text-gray-500">Activer le thème sombre</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Langue</p>
                <p className="text-sm text-gray-500">Choisir la langue de l'application</p>
              </div>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Français</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Localisation</p>
                <p className="text-sm text-gray-500">Autoriser l'accès à votre position</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Mode hors ligne</p>
                <p className="text-sm text-gray-500">Télécharger les données pour utilisation hors ligne</p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications push</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications mobile</p>
                <p className="text-sm text-gray-500">Recevoir des notifications sur votre téléphone</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, push: !notificationSettings.push})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.push ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.push ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications email</p>
                <p className="text-sm text-gray-500">Recevoir des mises à jour par email</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, email: !notificationSettings.email})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.email ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.email ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications SMS</p>
                <p className="text-sm text-gray-500">Recevoir des alertes par SMS</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSettings({...notificationSettings, sms: !notificationSettings.sms})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.sms ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationSettings.sms ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de notifications</h3>
        
        <div className="space-y-3">
          {[
            'Nouvelles collectes',
            'Mises à jour de statut',
            'Messages des collecteurs',
            'Promotions et récompenses',
            'Actualités EcoCollect'
          ].map((type, index) => (
            <label key={index} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={index < 3}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidentialité des données</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Partage de données</p>
                <p className="text-sm text-gray-500">Partager des données anonymisées pour améliorer le service</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({...privacy, shareData: !privacy.shareData})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.shareData ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacy.shareData ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">Autoriser les cookies analytiques</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({...privacy, analytics: !privacy.analytics})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.analytics ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacy.analytics ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Marketing</p>
                <p className="text-sm text-gray-500">Recevoir des offres promotionnelles</p>
              </div>
            </div>
            <button
              onClick={() => setPrivacy({...privacy, marketing: !privacy.marketing})}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy.marketing ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privacy.marketing ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des données</h3>
        
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Exporter mes données</p>
                <p className="text-sm text-gray-500">Télécharger toutes vos données personnelles</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Supprimer mes données</p>
                <p className="text-sm text-gray-500">Supprimer définitivement toutes vos données</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )

  // const renderAccountSettings = () => (
  //   <div className="space-y-6">
  //     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  //       <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h3>
        
  //       <div className="space-y-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
  //           <input
  //             type="text"
  //             defaultValue="Jean Dupont"
  //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  //           <input
  //             type="email"
  //             defaultValue="jean.dupont@example.com"
  //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
  //           <input
  //             type="tel"
  //             defaultValue="+237 6 123 456 789"
  //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
  //           />
  //         </div>

  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
  //           <textarea
  //             rows={3}
  //             defaultValue="Douala, Cameroun"
  //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
  //           />
  //         </div>
  //       </div>

  //       <div className="mt-6 flex gap-3">
  //         <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
  //           Enregistrer les modifications
  //         </button>
  //         <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
  //           Annuler
  //         </button>
  //       </div>
  //     </div>

  //     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
  //       <h3 className="text-lg font-semibold text-gray-900 mb-4">Sécurité</h3>
        
  //       <div className="space-y-4">
  //         <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
  //           <div className="flex items-center gap-3">
  //             <Lock className="w-5 h-5 text-gray-600" />
  //             <div className="text-left">
  //               <p className="font-medium text-gray-900">Changer le mot de passe</p>
  //               <p className="text-sm text-gray-500">Mettre à jour votre mot de passe</p>
  //             </div>
  //           </div>
  //           <ChevronRight className="w-5 h-5 text-gray-400" />
  //         </button>

  //         <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
  //           <div className="flex items-center gap-3">
  //             <Smartphone className="w-5 h-5 text-gray-600" />
  //             <div className="text-left">
  //               <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
  //               <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
  //             </div>
  //           </div>
  //           <ChevronRight className="w-5 h-5 text-gray-400" />
  //         </button>
  //       </div>
  //     </div>

  //     <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
  //       <h3 className="text-lg font-semibold text-red-600 mb-4">Actions dangereuses</h3>
        
  //       <div className="space-y-4">
  //         <button
  //           onClick={handleLogout}
  //           className="w-full flex items-center justify-between p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
  //         >
  //           <div className="flex items-center gap-3">
  //             <LogOut className="w-5 h-5 text-orange-600" />
  //             <div className="text-left">
  //               <p className="font-medium text-gray-900">Déconnexion</p>
  //               <p className="text-sm text-gray-500">Se déconnecter de votre compte</p>
  //             </div>
  //           </div>
  //           <ChevronRight className="w-5 h-5 text-gray-400" />
  //         </button>

  //         <button
  //           onClick={handleDeleteAccount}
  //           className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
  //         >
  //           <div className="flex items-center gap-3">
  //             <Trash2 className="w-5 h-5 text-red-600" />
  //             <div className="text-left">
  //               <p className="font-medium text-red-600">Supprimer le compte</p>
  //               <p className="text-sm text-gray-500">Supprimer définitivement votre compte</p>
  //             </div>
  //           </div>
  //           <ChevronRight className="w-5 h-5 text-gray-400" />
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // )

  const renderAboutSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos d'EcoCollect</h3>
        
        <div className="space-y-4">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">EcoCollect</h4>
            <p className="text-gray-600 mb-4">Version 1.0.0</p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Plateforme de collecte de déchets pour un Cameroun plus propre. 
              Connectez les citoyens avec les collecteurs de déchets pour une gestion durable.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Développeur</span>
              <span className="font-medium text-gray-900">EcoCollect Team</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Contact</span>
              <span className="font-medium text-gray-900">support@ecocollect.cm</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Site web</span>
              <a href="#" className="font-medium text-green-600 hover:underline">www.ecocollect.cm</a>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Licence</span>
              <span className="font-medium text-gray-900">MIT License</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources</h3>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Conditions d'utilisation</p>
                <p className="text-sm text-gray-500">Lire nos conditions générales</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Politique de confidentialité</p>
                <p className="text-sm text-gray-500">Comment nous protégeons vos données</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Centre d'aide</p>
                <p className="text-sm text-gray-500">Obtenir de l'aide et des conseils</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings()
      case 'notifications': return renderNotificationSettings()
      case 'privacy': return renderPrivacySettings()
      // case 'account': return renderAccountSettings()
      case 'about': return renderAboutSettings()
      default: return renderGeneralSettings()
    }
  }

  return (
    <Layout 
      pageTitle="Paramètres" 
      currentPage="settings"
      notifications={[]}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres</h2>
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-green-50 text-green-600 border-l-4 border-l-green-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Déconnexion</h3>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
              <div className="flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Settings
