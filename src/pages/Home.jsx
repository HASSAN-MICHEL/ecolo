import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Users, 
  Truck, 
  Leaf, 
  Recycle, 
  ArrowRight, 
  Shield, 
  TrendingUp,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Package,
  Home as HomeIcon,
  Building2,
  Store
} from 'lucide-react'

const Home = () => {
  const [selectedRole, setSelectedRole] = useState('')
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setTimeout(() => {
      if (role === 'producer') {
        navigate('/register')
      } else if (role === 'collector') {
        navigate('/register-collector')
      }
    }, 300)
  }

  const producerStats = [
    { icon: Users, label: '10,000+', description: 'Producteurs actifs' },
    { icon: Package, label: '50,000 kg', description: 'Déchets collectés' },
    { icon: Leaf, label: '85%', description: 'Taux de recyclage' }
  ]

  const collectorStats = [
    { icon: Truck, label: '500+', description: 'Collecteurs certifiés' },
    { icon: Star, label: '4.8/5', description: 'Note moyenne' },
    { icon: TrendingUp, label: '98%', description: 'Satisfaction client' }
  ]

  const producerFeatures = [
    {
      icon: HomeIcon,
      title: 'Ménages',
      description: 'Particuliers et familles',
      points: '2-5 pts/kg',
      color: 'emerald'
    },
    {
      icon: Store,
      title: 'Commerces',
      description: 'Boutiques et restaurants',
      points: '3-7 pts/kg',
      color: 'green'
    },
    {
      icon: Building2,
      title: 'Entreprises',
      description: 'PME et industries',
      points: '5-10 pts/kg',
      color: 'teal'
    }
  ]

  const collectorBenefits = [
    {
      icon: TrendingUp,
      title: 'Revenus flexibles',
      description: 'Gagnez jusqu\'à 200,000 FCFA/mois'
    },
    {
      icon: MapPin,
      title: 'Zone définie',
      description: 'Choisissez votre secteur de prédilection'
    },
    {
      icon: Shield,
      title: 'Assurance incluse',
      description: 'Protection complète pendant vos collectes'
    },
    {
      icon: Clock,
      title: 'Horaires flexibles',
      description: 'Travaillez selon votre disponibilité'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EcoCollect</h1>
                <p className="text-sm text-gray-600">Plateforme de collecte écologique</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                Se connecter
              </Link>
              <button
                onClick={() => navigate('/about')}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                À propos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl animate-pulse" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-green-300 blur-3xl animate-pulse" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Rejoignez la révolution verte
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              EcoCollect connecte les producteurs de déchets avec des collecteurs certifiés 
              pour un environnement plus propre au Cameroun
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Producer Card */}
            <div 
              className={`relative bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-3xl hover:scale-105 ${
                selectedRole === 'producer' 
                  ? 'ring-4 ring-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50' 
                  : 'hover:ring-2 hover:ring-emerald-300'
              }`}
              onClick={() => handleRoleSelect('producer')}
            >
              {selectedRole === 'producer' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Sélectionné
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Je suis Producteur</h3>
                <p className="text-gray-600">
                  Je veux déclarer mes déchets pour les faire collecter
                </p>
              </div>

              {/* Producer Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {producerStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 mb-2">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{stat.label}</p>
                      <p className="text-xs text-gray-600">{stat.description}</p>
                    </div>
                  )
                })}
              </div>

              {/* Producer Types */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Types de producteurs</h4>
                {producerFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className={`rounded-lg p-2 bg-${feature.color}-100`}>
                        <Icon className={`h-5 w-5 text-${feature.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                      <div className={`text-xs font-medium text-${feature.color}-600`}>
                        {feature.points}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                <span>Commencer en tant que Producteur</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Collector Card */}
            <div 
              className={`relative bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-3xl hover:scale-105 ${
                selectedRole === 'collector' 
                  ? 'ring-4 ring-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50' 
                  : 'hover:ring-2 hover:ring-blue-300'
              }`}
              onClick={() => handleRoleSelect('collector')}
            >
              {selectedRole === 'collector' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Sélectionné
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
                  <Truck className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Je suis Collecteur</h3>
                <p className="text-gray-600">
                  Je veux collecter les déchets et contribuer à l'économie circulaire
                </p>
              </div>

              {/* Collector Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {collectorStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 mb-2">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{stat.label}</p>
                      <p className="text-xs text-gray-600">{stat.description}</p>
                    </div>
                  )
                })}
              </div>

              {/* Collector Benefits */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Avantages</h4>
                {collectorBenefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="rounded-lg p-2 bg-blue-100">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{benefit.title}</p>
                        <p className="text-xs text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                <span>Commencer en tant que Collecteur</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Comment ça marche ?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Inscription</h4>
                <p className="text-gray-600 text-sm">
                  Créez votre compte en quelques minutes avec vérification d'identité
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Matching</h4>
                <p className="text-gray-600 text-sm">
                  Notre algorithme vous connecte avec les collecteurs disponibles
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Collecte</h4>
                <p className="text-gray-600 text-sm">
                  Suivez en temps réel et recevez une notification à l'arrivée
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui contribuent déjà à un environnement plus propre
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleRoleSelect('producer')}
                className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-2 group"
              >
                <Users className="h-5 w-5" />
                <span>Devenir Producteur</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleRoleSelect('collector')}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 group"
              >
                <Truck className="h-5 w-5" />
                <span>Devenir Collecteur</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">EcoCollect</h4>
              <p className="text-gray-400 text-sm">
                Plateforme leader de collecte de déchets au Cameroun
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Aide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>contact@ecocollect.cm</p>
                <p>+237 243 000 000</p>
                <p>Douala, Cameroun</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 EcoCollect. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
