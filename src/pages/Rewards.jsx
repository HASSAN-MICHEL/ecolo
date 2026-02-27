import { useState } from 'react'
import { 
  Award, 
  Gift, 
  Star, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ShoppingBag,
  Leaf,
  Recycle,
  Zap,
  Crown,
  Medal,
  Gem
} from 'lucide-react'
import Layout from '../components/Layout'

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('available')
  const [userPoints] = useState(480)
  const [userLevel] = useState('Éco-Héros')
  const [nextLevelPoints] = useState(750)

  // Simulated rewards data
  const availableRewards = [
    {
      id: 1,
      title: "Sac de courses réutilisable",
      description: "Sac en coton bio avec logo EcoCollect",
      points: 100,
      category: "shopping",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",
      stock: 15,
      popular: true
    },
    {
      id: 2,
      title: "Kit de jardinage écologique",
      description: "Outils de jardinage en matériaux recyclés",
      points: 250,
      category: "garden",
      icon: Leaf,
      image: "https://images.unsplash.com/photo-1416879595962-4e6e6496c3b4?w=200&h=200&fit=crop",
      stock: 8,
      popular: false
    },
    {
      id: 3,
      title: "Bouteille isotherme réutilisable",
      description: "Gourde isotherme 750ml avec bouchon en liège",
      points: 150,
      category: "daily",
      icon: Recycle,
      image: "https://images.unsplash.com/photo-1600480144945-fc527599c8c2?w=200&h=200&fit=crop",
      stock: 25,
      popular: true
    },
    {
      id: 4,
      title: "Set de stylos recyclés",
      description: "4 stylos faits à partir de plastique recyclé",
      points: 80,
      category: "office",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1586953208475-12018a8a3b8?w=200&h=200&fit=crop",
      stock: 50,
      popular: false
    },
    {
      id: 5,
      title: "Tote bag éco-responsable",
      description: "Sac en jute avec motif environnemental",
      points: 120,
      category: "shopping",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",
      stock: 30,
      popular: false
    },
    {
      id: 6,
      title: "Boîte de compost de cuisine",
      description: "Boîte en bambou pour compost domestique",
      points: 200,
      category: "garden",
      icon: Leaf,
      image: "https://images.unsplash.com/photo-1586953208475-12018a8a3b8?w=200&h=200&fit=crop",
      stock: 12,
      popular: true
    }
  ]

  const redeemedRewards = [
    {
      id: 101,
      title: "Sac de courses réutilisable",
      description: "Récupéré le 15 janvier 2024",
      points: 100,
      category: "shopping",
      icon: ShoppingBag,
      image: "https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",
      redeemedAt: "2024-01-15"
    },
    {
      id: 102,
      title: "Bouteille isotherme réutilisable",
      description: "Récupéré le 10 janvier 2024",
      points: 150,
      category: "daily",
      icon: Recycle,
      image: "https://images.unsplash.com/photo-1600480144945-fc527599c8c2?w=200&h=200&fit=crop",
      redeemedAt: "2024-01-10"
    }
  ]

  const levels = [
    { 
      name: "Débutant Éco", 
      minPoints: 0, 
      maxPoints: 99, 
      icon: Gem, 
      color: "gray",
      benefits: ["Accès aux récompenses de base", "Badge de participation"]
    },
   
    { 
      name: "Légende Éco", 
      minPoints: 1000, 
      maxPoints: Infinity, 
      icon: Crown, 
      color: "yellow",
      benefits: ["Récompenses personnalisées", "Programme fidélité premium", "Reconnaissance publique"]
    }
  ]

  const currentLevel = levels.find(level => 
    userPoints >= level.minPoints && userPoints <= level.maxPoints
  ) || levels[0]

  const progressToNextLevel = ((userPoints - currentLevel.minPoints) / (currentLevel.maxPoints - currentLevel.minPoints)) * 100

  const handleRedeem = (rewardId) => {
    const reward = availableRewards.find(r => r.id === rewardId)
    if (reward && userPoints >= reward.points) {
      alert(`Félicitations ! Vous avez échangé ${reward.points} points contre "${reward.title}"`)
      // In a real app, this would call an API
    } else {
      alert("Points insuffisants pour cette récompense")
    }
  }

  return (
    <Layout 
      pageTitle="Mes Récompenses" 
      currentPage="rewards"
      notifications={[]}
    >
      <div className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0">
        {/* Header Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes Récompenses</h1>
              <p className="text-purple-100 max-w-2xl">
                Transformez vos points écologiques en récompenses concrètes et contribuez à un avenir durable.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Niveau actuel</div>
                    <div className="text-2xl font-bold">{currentLevel.name}</div>
                  </div>
                </div>
                <div className="text-sm text-purple-100">{userPoints} points</div>
                <div className="w-full bg-white/30 rounded-full h-2 mt-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{width: `${progressToNextLevel}%`}}
                  ></div>
                </div>
                <div className="text-xs text-purple-100 mt-1">
                  {nextLevelPoints - userPoints} points pour le niveau suivant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Parcours Écologique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {levels.map((level, index) => {
              const Icon = level.icon
              const isCurrentLevel = level.name === userLevel
              const isCompleted = userPoints >= level.maxPoints
              const isLocked = userPoints < level.minPoints
              
              return (
                <div 
                  key={level.name}
                  className={`
                    text-center p-4 rounded-lg border-2 transition-all
                    ${isCurrentLevel 
                      ? 'border-purple-500 bg-purple-50 shadow-md' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-50' 
                        : isLocked 
                          ? 'border-gray-200 bg-gray-50 opacity-50' 
                          : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    isCurrentLevel ? 'bg-purple-600' : 
                    isCompleted ? 'bg-green-600' : 
                    isLocked ? 'bg-gray-300' : 'bg-gray-400'
                  }`}>
                    <Icon className={`w-6 h-6 ${isCurrentLevel || isCompleted ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <h3 className={`font-semibold text-sm ${
                    isCurrentLevel ? 'text-purple-900' : 
                    isCompleted ? 'text-green-900' : 
                    isLocked ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {level.name}
                  </h3>
                  <p className={`text-xs ${
                    isCurrentLevel ? 'text-purple-700' : 
                    isCompleted ? 'text-green-700' : 
                    isLocked ? 'text-gray-500' : 'text-gray-600'
                  }`}>
                    {level.minPoints} - {level.maxPoints === Infinity ? '∞' : level.maxPoints} pts
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('available')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'available' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Récompenses disponibles
              </button>
              <button
                onClick={() => setActiveTab('redeemed')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'redeemed' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Mes récompenses
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'available' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map(reward => {
                  const Icon = reward.icon
                  const canRedeem = userPoints >= reward.points
                  
                  return (
                    <div key={reward.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        <img 
                          src={reward.image} 
                          alt={reward.title}
                          className="w-full h-48 object-cover"
                        />
                        {reward.popular && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Populaire
                          </div>
                        )}
                        {reward.stock <= 10 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Plus que {reward.stock} disponibles
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-purple-600">{reward.points}</span>
                            <span className="text-sm text-gray-500">points</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Stock: {reward.stock}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRedeem(reward.id)}
                          disabled={!canRedeem}
                          className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
                            canRedeem 
                              ? 'bg-purple-600 text-white hover:bg-purple-700' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {canRedeem ? 'Échanger' : `${reward.points - userPoints} pts manquants`}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {redeemedRewards.map(reward => {
                  const Icon = reward.icon
                  
                  return (
                    <div key={reward.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img 
                        src={reward.image} 
                        alt={reward.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">Échangé le {reward.redeemedAt}</span>
                          <span className="text-sm font-medium text-green-600">-{reward.points} points</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {redeemedRewards.length === 0 && (
                  <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Vous n'avez pas encore échangé de récompenses</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Gagnez des points en déclarant vos déchets pour débloquer des récompenses !
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Comment gagner plus de points ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800 mb-2">Actions quotidiennes</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Déclarez régulièrement vos déchets</li>
                <li>• Triez correctement vos déchets</li>
                <li>• Participez aux événements spéciaux</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">Bonus de points</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• +50% pour le tri sélectif parfait</li>
                <li>• +25% pour les gros volumes</li>
                <li>• +10% pour les collectes programmées</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Rewards
