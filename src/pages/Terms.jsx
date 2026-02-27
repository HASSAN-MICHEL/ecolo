import { ArrowLeft, FileText, Shield, Users, Trash2, MapPin, Award, AlertTriangle } from 'lucide-react'

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <a 
              href="/register" 
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </a>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
              Introduction
            </h2>
            <div className="prose prose-green max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Bienvenue sur EcoCollect, la plateforme numérique de gestion des déchets au Cameroun. 
                En utilisant nos services, vous acceptez les présentes conditions générales d'utilisation (CGU). 
                Veuillez les lire attentivement avant de vous inscrire et d'utiliser la plateforme.
              </p>
            </div>
          </section>

          {/* Acceptation */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              1. Acceptation des conditions
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                L'accès et l'utilisation de la plateforme EcoCollect sont soumis à l'acceptation pleine et entière 
                des présentes CGU. En cochant la case d'acceptation lors de votre inscription, vous reconnaissez 
                avoir lu, compris et accepté sans réserve ces conditions.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme EcoCollect.
              </p>
            </div>
          </section>

          {/* Objet du service */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-green-600" />
              2. Objet du service
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                EcoCollect est une plateforme qui met en relation les producteurs de déchets (ménages, commerces, 
                entreprises, administrations) avec les collecteurs de déchets agréés.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Services proposés :</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Déclaration en ligne des types et quantités de déchets</li>
                  <li>Suivi en temps réel du statut de collecte</li>
                  <li>Prise de rendez-vous pour la collecte</li>
                  <li>Accès aux points de collecte agréés</li>
                  <li>Système de récompenses et points fidélité</li>
                  <li>Tableau de bord statistique personnalisé</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Inscription */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              3. Inscription et compte utilisateur
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Pour utiliser la plateforme, vous devez créer un compte en fournissant des informations exactes 
                et complètes. L'inscription est réservée aux personnes majeures et aux entités légalement constituées.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Informations requises
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                  <li>Identité complète (nom, prénom)</li>
                  <li>Coordonnées valides (email et/ou téléphone)</li>
                  <li>Type de producteur (ménage, commerce, entreprise)</li>
                  <li>Localisation précise (ville, quartier, point de collecte)</li>
                  <li>Pièce d'identité valide (CNI recto/verso)</li>
                </ul>
              </div>
              <p>
                Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité 
                sur votre compte.
              </p>
            </div>
          </section>

          {/* Obligations */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-600" />
              4. Obligations des utilisateurs
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>En tant qu'utilisateur de la plateforme EcoCollect, vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fournir des informations exactes et à jour</li>
                <li>Déclarer fidèlement les types et quantités de déchets</li>
                <li>Respecter les horaires et modalités de collecte convenus</li>
                <li>Préparer les déchets selon les normes environnementales en vigueur</li>
                <li>Ne pas déposer de déchets interdits ou dangereux sans autorisation</li>
                <li>Respecter les collecteurs et le personnel d'EcoCollect</li>
                <li>Payer les frais de service applicables selon les conditions en vigueur</li>
              </ul>
            </div>
          </section>

          {/* Récompenses */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-green-600" />
              5. Système de récompenses
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                EcoCollect propose un système de récompenses pour encourager les bonnes pratiques de gestion 
                des déchets :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Points accumulés pour chaque déclaration et collecte effectuée</li>
                <li>Bonus pour le tri sélectif et la régularité des déclarations</li>
                <li>Avantages et réductions chez les partenaires locaux</li>
                <li>Classement et reconnaissance des utilisateurs les plus actifs</li>
              </ul>
              <p>
                Les points sont non-transférables et ne peuvent être échangés contre de l'argent liquide.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              6. Protection des données personnelles
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                EcoCollect s'engage à protéger vos données personnelles conformément à la législation 
                burkinabè sur la protection des données. Vos informations sont collectées, traitées et 
                stockées de manière sécurisée.
              </p>
              <p>
                Nous ne partageons vos données personnelles qu'avec les collecteurs agréés dans le cadre 
                de l'exécution du service de collecte, et avec les autorités compétentes si la loi l'exige.
              </p>
              <p>
                Pour plus d'informations, consultez notre Politique de Confidentialité.
              </p>
            </div>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-green-600" />
              7. Limitation de responsabilité
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                EcoCollect agit comme intermédiaire entre les producteurs et les collecteurs. 
                La plateforme ne peut être tenue responsable :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Des retards ou absences de collecte dus à des cas de force majeure</li>
                <li>Des dommages survenus pendant la manipulation des déchets par les collecteurs</li>
                <li>De la qualité du service fourni par les collecteurs indépendants</li>
                <li>Des pertes de données dues à des interventions frauduleuses externes</li>
              </ul>
            </div>
          </section>

          {/* Modification */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Modification des conditions</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                EcoCollect se réserve le droit de modifier ces conditions générales à tout moment. 
                Les modifications prendront effet dès leur publication sur la plateforme.
              </p>
              <p>
                Les utilisateurs seront notifiés des modifications importantes par email ou via la plateforme.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact et support</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Pour toute question concernant ces conditions générales, vous pouvez nous contacter :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li><strong>Email :</strong> support@ecocollect.cm</li>
                  <li><strong>Téléphone :</strong> +237 XX XX XX XX</li>
                  <li><strong>Adresse :</strong> Douala, Cameroun</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <p className="text-center text-sm text-gray-600">
              © 2024 EcoCollect. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
