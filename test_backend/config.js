// config.js - Configuration automatique selon l'environnement
(function() {
    // Détection de l'environnement
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isNetlify = hostname.includes('netlify.app');
    
    // // Configuration des URLs
    // const CONFIG = {
    //     // URL de votre backend Vercel (à remplacer si différent)
    //     API_URL: 'https://ecobackend-excz.vercel.app',
        
    //     // Clés pour localStorage
    //     TOKEN_KEY: 'ecocollect_token',
    //     USER_KEY: 'ecocollect_user',
    //     ROLE_KEY: 'ecocollect_role'
    // };

    // Configuration
const CONFIG = {
    API_URL: window.API_BASE_URL || 'https://ecobackend-three.vercel.app',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    ROLE_KEY: 'ecocollect_role'
};
    
    // En local, on peut utiliser localhost si le backend tourne en local
    if (isLocalhost) {
        CONFIG.API_URL = 'http://localhost:3000';
        console.log('🌍 Mode développement local détecté');
    }
    
    // Rendre la configuration disponible globalement
    window.APP_CONFIG = CONFIG;
    
    console.log('🚀 Configuration chargée:', {
        environnement: isLocalhost ? 'développement' : 'production',
        api_url: CONFIG.API_URL,
        plateforme: isNetlify ? 'Netlify' : (isLocalhost ? 'Local' : 'Autre')
    });
})();