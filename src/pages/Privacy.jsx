import { ArrowLeft, Shield, Database, Eye, Lock, Users, Cookie, Server, CheckCircle } from 'lucide-react'

const Privacy = () => {
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
              <Shield className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Politique de Confidentialité</h1>
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
              <Shield className="w-6 h-6 text-green-600" />
              Introduction
            </h2>
            <div className="prose prose-green max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Chez EcoCollect, nous nous engageons à protéger votre vie privée et à sécuriser vos données 
                personnelles. Cette politique de confidentialité explique quelles informations nous collectons, 
                comment nous les utilisons, et comment nous les protégeons conformément à la législation camerounaise.
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-green-600" />
              1. Données que nous collectons
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données d'identification</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Nom et prénom</li>
                  <li>Adresse email et/ou numéro de téléphone</li>
                  <li>Type de producteur (ménage, commerce, entreprise)</li>
                  <li>Localisation (ville, quartier, point de collecte)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données de service</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Historique des déclarations de déchets</li>
                  <li>Types et quantités de déchets déclarés</li>
                  <li>Statut des collectes et suivi</li>
                  <li>Points et récompenses accumulés</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données techniques</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Adresse IP et type d'appareil</li>
                  <li>Données de localisation GPS (avec consentement)</li>
                  <li>Préférences et paramètres de l'application</li>
                  <li>Cookies et données de navigation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Données sensibles</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Copie de pièce d'identité (CNI recto/verso)</li>
                  <li>Images et documents uploadés</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              2. Comment nous utilisons vos données
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Nous utilisons vos données pour :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fournir et améliorer nos services de collecte de déchets</li>
                <li>Coordonner les collectes avec nos partenaires</li>
                <li>Calculer et attribuer les points de récompense</li>
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Communiquer avec vous concernant votre compte et les services</li>
                <li>Analyser les tendances pour optimiser notre réseau de collecte</li>
                <li>Assurer la sécurité et prévenir les fraudes</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </div>
          </section>

          {/* Base légale */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              3. Base légale du traitement
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Le traitement de vos données repose sur les bases légales suivantes conformément à la législation camerounaise :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Consentement :</strong> Pour les données sensibles et la géolocalisation</li>
                <li><strong>Exécution du contrat :</strong> Pour fournir nos services</li>
                <li><strong>Obligation légale :</strong> Pour la lutte contre le blanchiment et la fraude</li>
                <li><strong>Intérêt légitime :</strong> Pour l'amélioration de nos services</li>
              </ul>
            </div>
          </section>

          {/* Conservation */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-green-600" />
              4. Durée de conservation
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Périodes de conservation</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Compte utilisateur :</strong> Tant que le compte est actif</li>
                  <li><strong>Données de service :</strong> 5 ans après la dernière collecte</li>
                  <li><strong>CNI et documents :</strong> 10 ans après clôture du compte</li>
                  <li><strong>Données techniques :</strong> 13 mois maximum</li>
                  <li><strong>Cookies :</strong> Session ou 12 mois selon le type</li>
                </ul>
              </div>
              <p>
                À l'expiration de ces délais, les données sont définitivement supprimées ou anonymisées.
              </p>
            </div>
          </section>

          {/* Partage des données */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-green-600" />
              5. Partage de vos données
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Nous ne partageons vos données que dans les cas suivants :</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Collecteurs agréés :</strong> Pour coordonner les collectes</li>
                <li><strong>Partenaires services :</strong> Pour les récompenses et avantages</li>
                <li><strong>Autorités compétentes :</strong> Sur demande légale ou judiciaire</li>
                <li><strong>Prestataires techniques :</strong> Hébergement et maintenance</li>
              </ul>
              <p>
                Tous nos partenaires sont tenus par des contrats de confidentialité stricts.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-green-600" />
              6. Sécurité des données
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                <li>Chiffrement des données sensibles dans notre base de données</li>
                <li>Contrôle d'accès strict et authentification multi-facteurs</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Audits de sécurité réguliers</li>
                <li>Formation du personnel à la protection des données</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-green-600" />
              7. Cookies et traceurs
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous utilisons des cookies pour améliorer votre expérience :
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Cookies essentiels :</strong> Pour le fonctionnement de base du site</li>
                <li><strong>Cookies de performance :</strong> Pour analyser l'utilisation du service</li>
                <li><strong>Cookies de fonctionnalité :</strong> Pour mémoriser vos préférences</li>
              </ul>
              <p>
                Vous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Droits utilisateurs */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              8. Vos droits sur vos données
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Conformément à la législation, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Droit d'accès :</strong> Consulter vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
                <li><strong>Droit de suppression :</strong> Demander la suppression de vos données</li>
                <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
                <li><strong>Droit de portabilité :</strong> Recevoir vos données dans un format lisible</li>
                <li><strong>Droit d'opposition :</strong> Vous opposer au traitement pour motifs légitimes</li>
              </ul>
              <p>
                Pour exercer ces droits, contactez-nous à privacy@ecocollect.bf
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Modifications de la politique</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous pouvons modifier cette politique de confidentialité pour refléter les changements 
                dans nos pratiques ou pour des raisons réglementaires.
              </p>
              <p>
                Les modifications seront publiées sur cette page avec la date de mise à jour. 
                Les changements importants feront l'objet d'une notification directe aux utilisateurs.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Contact DPO</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Pour toute question concernant cette politique ou pour exercer vos droits, 
                contactez notre Délégué à la Protection des Données :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li><strong>Email :</strong> dpo@ecocollect.cm</li>
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

export default Privacy
