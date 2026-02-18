// ============================================
// app.js - Gestion de l'interface producteur
// ============================================


const CONFIG = {
    API_URL: window.API_BASE_URL || 'https://ecobackend-m3s8.vercel.app',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    ROLE_KEY: 'ecocollect_role'
};

console.log('🚀 login.js chargé');
console.log('📡 API URL utilisée:', CONFIG.API_URL);
// // Configuration
// const CONFIG = {
//     API_URL: localStorage.getItem('api_url') || 'http://localhost:3000',
//     TOKEN_KEY: 'ecocollect_token',
//     USER_KEY: 'ecocollect_user'
// };

// État de l'application
let currentUser = null;
let currentToken = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de app.js');
    
    // Afficher l'URL de l'API
    document.getElementById('apiUrl').textContent = CONFIG.API_URL;
    document.getElementById('apiUrlInput').value = CONFIG.API_URL;
    
    // Initialiser les écouteurs
    initEventListeners();
    
    // Vérifier la session existante
    loadUserFromStorage();
});

function initEventListeners() {
    // Rien de spécial ici car on utilise des fonctions globales
    console.log('✅ Écouteurs initialisés');
}

// ============================================
// GESTION DE LA SESSION
// ============================================

function loadUserFromStorage() {
    try {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        
        if (token && userJson && userJson !== 'undefined' && userJson !== 'null') {
            const user = JSON.parse(userJson);
            currentToken = token;
            currentUser = user;
            
            console.log('✅ Session restaurée:', user);
            
            // Mettre à jour l'interface
            updateUIForLoggedInUser();
            showSection('dashboard');
            loadDashboard();
        } else {
            // Afficher la section auth
            showSection('auth');
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement de la session:', error);
        clearSession();
    }
}

function saveAuthData(token, user) {
    currentToken = token;
    currentUser = user;
    
    try {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        console.log('✅ Données sauvegardées pour', user?.nomComplet);
    } catch (error) {
        console.error('❌ Erreur sauvegarde localStorage:', error);
    }
    
    updateUIForLoggedInUser();
}

function clearSession() {
    currentToken = null;
    currentUser = null;
    
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    
    // Mettre à jour le badge utilisateur
    document.getElementById('userName').textContent = currentUser.nomComplet || 'Utilisateur';
    document.getElementById('userAvatar').innerHTML = `<i class="fas fa-user"></i>`;
    
    // Afficher les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.classList.contains('logout')) {
            link.classList.remove('hidden');
        }
    });
    
    // Charger le profil
    loadProfile();
}

// ============================================
// AUTHENTIFICATION
// ============================================

function switchAuthTab(tabId) {
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Afficher le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const identifiant = document.getElementById('loginIdentifiant').value;
    const motDePasse = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        showLoading(messageDiv, 'Connexion en cours...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifiant, motDePasse })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erreur de connexion' }));
            throw new Error(errorData.message || 'Erreur de connexion');
        }
        
        const data = await response.json();
        
        if (!data.token) {
            throw new Error('Format de réponse invalide: token manquant');
        }
        
        const userData = data.producteur || data.user || data.utilisateur || data;
        
        if (!userData) {
            throw new Error('Format de réponse invalide: données utilisateur manquantes');
        }
        
        saveAuthData(data.token, userData);
        showSuccess(messageDiv, 'Connexion réussie!');
        
        // Rediriger vers le tableau de bord
        showSection('dashboard');
        loadDashboard();
        loadDeclarations();
        
    } catch (error) {
        console.error('Erreur login:', error);
        showError(messageDiv, error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('registerEmail').value,
        telephone: document.getElementById('registerPhone').value,
        motDePasse: document.getElementById('registerPassword').value,
        typeProducteur: document.getElementById('registerType').value,
        nomComplet: document.getElementById('registerFullName').value,
        adresse: document.getElementById('registerAddress').value,
        quartier: document.getElementById('registerNeighborhood').value,
        commune: document.getElementById('registerMunicipality').value,
        latitude: parseFloat(document.getElementById('registerLatitude').value) || null,
        longitude: parseFloat(document.getElementById('registerLongitude').value) || null,
        cguAcceptees: document.getElementById('registerCGU').checked
    };
    
    const messageDiv = document.getElementById('registerMessage');
    
    // Validation
    if (formData.motDePasse !== document.getElementById('registerConfirmPassword').value) {
        showError(messageDiv, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    try {
        showLoading(messageDiv, 'Inscription en cours...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erreur d\'inscription' }));
            throw new Error(errorData.message || 'Erreur d\'inscription');
        }
        
        const data = await response.json();
        
        if (!data.token) {
            throw new Error('Format de réponse invalide: token manquant');
        }
        
        const userData = data.producteur || data.user || data.utilisateur || data;
        
        if (!userData) {
            throw new Error('Format de réponse invalide: données utilisateur manquantes');
        }
        
        saveAuthData(data.token, userData);
        showSuccess(messageDiv, 'Inscription réussie! Bienvenue!');
        
        // Rediriger vers le tableau de bord
        showSection('dashboard');
        loadDashboard();
        loadDeclarations();
        
    } catch (error) {
        console.error('Erreur register:', error);
        showError(messageDiv, error.message);
    }
}

function handleLogout() {
    clearSession();
    
    // Réinitialiser l'interface
    document.getElementById('userName').textContent = 'Non connecté';
    document.getElementById('userAvatar').innerHTML = '<i class="fas fa-user"></i>';
    
    // Afficher la section auth
    showSection('auth');
    switchAuthTab('login');
    
    // Réinitialiser les formulaires
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    
    showSuccess(null, 'Déconnexion réussie');
}

// ============================================
// NAVIGATION
// ============================================

function showSection(sectionId) {
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Afficher la section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Charger les données si nécessaire
    if (sectionId === 'dashboard' && currentToken) {
        loadDashboard();
    } else if (sectionId === 'declarations' && currentToken) {
        loadDeclarations();
    } else if (sectionId === 'profile' && currentToken) {
        loadProfile();
    }
}

// ============================================
// TABLEAU DE BORD
// ============================================

async function loadDashboard() {
    if (!currentToken) return;
    
    try {
        // Charger les déclarations pour les stats
        const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Erreur de chargement');
        }
        
        const data = await response.json();
        const declarations = data.declarations || data || [];
        
        // Calculer les statistiques
        const totalDeclarations = declarations.length;
        const completedCollections = declarations.filter(d => d.statut === 'termine').length;
        const totalWaste = declarations
            .filter(d => d.statut === 'termine')
            .reduce((sum, d) => sum + (d.poids_estime || 0), 0);
        
        document.getElementById('dashboardPoints').textContent = currentUser?.points || '0';
        document.getElementById('dashboardDeclarations').textContent = totalDeclarations;
        document.getElementById('dashboardCollections').textContent = completedCollections;
        document.getElementById('dashboardWaste').textContent = totalWaste.toFixed(2);
        
        // Charger l'historique récent
        loadRecentHistory(declarations.slice(0, 5));
        
    } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
    }
}

function loadRecentHistory(declarations) {
    const container = document.getElementById('recentHistory');
    
    if (!declarations || declarations.length === 0) {
        container.innerHTML = '<p class="empty-message">Aucun historique disponible</p>';
        return;
    }
    
    container.innerHTML = '';
    declarations.forEach(decl => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = decl.date_declaration 
            ? new Date(decl.date_declaration).toLocaleDateString('fr-FR')
            : 'Date inconnue';
        const type = formatWasteType(decl.type_dechet);
        const quantity = `${decl.quantite || 0} ${decl.unite || ''}`;
        const status = decl.statut || 'inconnu';
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500;">${type}</span>
                <span class="badge ${getStatusClass(status)}">${status}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--muted-foreground);">${date} • ${quantity}</div>
        `;
        
        container.appendChild(item);
    });
}

// ============================================
// DÉCLARATIONS
// ============================================

function showNewDeclarationForm() {
    document.getElementById('declarationFormContainer').classList.remove('hidden');
    document.getElementById('declarationsList').style.display = 'none';
    document.getElementById('declarationDetail').classList.add('hidden');
    document.getElementById('declarationForm').reset();
}

function hideNewDeclarationForm() {
    document.getElementById('declarationFormContainer').classList.add('hidden');
    document.getElementById('declarationsList').style.display = 'block';
}

async function handleNewDeclaration(e) {
    e.preventDefault();
    
    if (!currentToken) {
        showError(document.getElementById('declarationMessage'), 'Vous devez être connecté');
        return;
    }
    
    const declarationData = {
        typeDechet: document.getElementById('declarationType').value,
        quantite: parseFloat(document.getElementById('declarationQuantity').value),
        unite: document.getElementById('declarationUnit').value,
        modeCollecte: document.getElementById('declarationMode').value,
        dateSouhaitee: document.getElementById('declarationDate').value || null,
        creneauHoraire: document.getElementById('declarationTime').value || null,
        notes: document.getElementById('declarationNotes').value || null
    };
    
    const messageDiv = document.getElementById('declarationMessage');
    
    try {
        showLoading(messageDiv, 'Création de la déclaration...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(declarationData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erreur lors de la création' }));
            throw new Error(errorData.message || 'Erreur lors de la création');
        }
        
        const data = await response.json();
        
        showSuccess(messageDiv, 'Déclaration créée avec succès!');
        hideNewDeclarationForm();
        loadDeclarations();
        loadDashboard();
        
    } catch (error) {
        console.error('Erreur création déclaration:', error);
        showError(messageDiv, error.message);
    }
}

async function loadDeclarations() {
    if (!currentToken) return;
    
    const filter = document.getElementById('declarationFilter').value;
    const container = document.getElementById('declarationsList');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Erreur de chargement des déclarations');
        }
        
        const data = await response.json();
        
        let declarations = data.declarations || data || [];
        
        // Filtrer si nécessaire
        if (filter !== 'all') {
            declarations = declarations.filter(d => d.statut === filter);
        }
        
        // Afficher les déclarations
        if (declarations.length === 0) {
            container.innerHTML = '<p class="empty-message">Aucune déclaration trouvée</p>';
            return;
        }
        
        container.innerHTML = '';
        declarations.forEach(declaration => {
            const element = createDeclarationElement(declaration);
            container.appendChild(element);
        });
        
        // Ajouter les événements de suivi
        document.querySelectorAll('.view-detail-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const declarationId = this.closest('.declaration-item').dataset.id;
                showDeclarationDetail(declarationId);
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des déclarations:', error);
        container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
    }
}

function createDeclarationElement(declaration) {
    const template = document.getElementById('declarationTemplate');
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.declaration-item');
    
    element.dataset.id = declaration.id;
    
    const statusMap = {
        'en_attente': { text: 'En attente', class: 'badge-warning' },
        'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
        'programme': { text: 'Programmée', class: 'badge-info' },
        'termine': { text: 'Terminée', class: 'badge-success' },
        'annule': { text: 'Annulée', class: 'badge-danger' }
    };
    
    const status = statusMap[declaration.statut] || { text: declaration.statut, class: 'badge-info' };
    
    element.querySelector('.declaration-id').textContent = `#${declaration.id.substring(0, 8)}`;
    element.querySelector('.declaration-date').textContent = 
        new Date(declaration.date_declaration).toLocaleDateString('fr-FR');
    element.querySelector('.declaration-status').textContent = status.text;
    element.querySelector('.declaration-status').className = `badge ${status.class}`;
    element.querySelector('.declaration-type').textContent = formatWasteType(declaration.type_dechet);
    element.querySelector('.declaration-quantity').textContent = `${declaration.quantite} ${declaration.unite}`;
    element.querySelector('.declaration-mode').textContent = formatCollectionMode(declaration.mode_collecte);
    
    return element;
}

async function showDeclarationDetail(declarationId) {
    if (!currentToken) return;
    
    const container = document.getElementById('declarationDetail');
    const content = document.getElementById('detailContent');
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/declarations/${declarationId}/suivre`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (!response.ok) {
            throw new Error('Erreur de chargement du détail');
        }
        
        const data = await response.json();
        
        content.innerHTML = createDetailHTML(data.declaration || data);
        document.getElementById('declarationsList').style.display = 'none';
        container.classList.remove('hidden');
        
    } catch (error) {
        console.error('Erreur lors du chargement du détail:', error);
        content.innerHTML = '<p class="error">Erreur de chargement</p>';
    }
}

function hideDeclarationDetail() {
    document.getElementById('declarationDetail').classList.add('hidden');
    document.getElementById('declarationsList').style.display = 'block';
}

function createDetailHTML(declaration) {
    const statusMap = {
        'en_attente': { text: 'En attente d\'affectation', color: '#ff9800' },
        'affecte': { text: 'Collecteur affecté', color: '#2196f3' },
        'programme': { text: 'Collecte programmée', color: '#2196f3' },
        'termine': { text: 'Collecte terminée', color: '#4caf50' },
        'annule': { text: 'Annulée', color: '#f44336' }
    };
    
    const status = statusMap[declaration.statut] || { text: declaration.statut, color: '#666' };
    
    return `
        <div style="border-left: 4px solid ${status.color}; padding-left: 1rem;">
            <h4 style="margin-bottom: 1rem;">Déclaration #${declaration.id.substring(0, 8)}</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div><strong>Type:</strong> ${formatWasteType(declaration.type_dechet)}</div>
                <div><strong>Quantité:</strong> ${declaration.quantite} ${declaration.unite}</div>
                <div><strong>Mode:</strong> ${formatCollectionMode(declaration.mode_collecte)}</div>
                <div><strong>Date:</strong> ${new Date(declaration.date_declaration).toLocaleDateString('fr-FR')}</div>
            </div>
            
            <div style="background: var(--muted); padding: 1rem; border-radius: var(--radius);">
                <strong>Statut actuel:</strong> ${status.text}
            </div>
        </div>
    `;
}

// ============================================
// PROFIL
// ============================================

function loadProfile() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.nomComplet || 'Non renseigné';
    document.getElementById('profileEmail').textContent = currentUser.email || 'Non renseigné';
    document.getElementById('profilePhone').textContent = currentUser.telephone || 'Non renseigné';
    document.getElementById('profileType').textContent = formatProducerType(currentUser.typeProducteur) || 'Non renseigné';
    document.getElementById('profileAddress').textContent = currentUser.adresse || 'Non spécifiée';
    
    const locationParts = [];
    if (currentUser.quartier) locationParts.push(currentUser.quartier);
    if (currentUser.commune) locationParts.push(currentUser.commune);
    document.getElementById('profileLocation').textContent = locationParts.length > 0 ? locationParts.join(', ') : 'Non spécifié';
    
    if (currentUser.cree_le) {
        document.getElementById('profileSince').textContent = new Date(currentUser.cree_le).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } else {
        document.getElementById('profileSince').textContent = 'Non disponible';
    }
    
    // Remplir les formulaires de mise à jour
    document.getElementById('updateFullName').value = currentUser.nomComplet || '';
    document.getElementById('updatePhone').value = currentUser.telephone || '';
    document.getElementById('updateAddress').value = currentUser.adresse || '';
    document.getElementById('updateNeighborhood').value = currentUser.quartier || '';
    document.getElementById('updateMunicipality').value = currentUser.commune || '';
    
    // Afficher le token
    const tokenElement = document.getElementById('currentToken');
    if (tokenElement && currentToken) {
        tokenElement.textContent = currentToken.length > 50 ? 
            currentToken.substring(0, 50) + '...' : 
            currentToken;
    }
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    
    if (!currentToken) {
        showError(document.getElementById('updateProfileMessage'), 'Vous devez être connecté');
        return;
    }
    
    const updateData = {
        nomComplet: document.getElementById('updateFullName').value.trim(),
        telephone: document.getElementById('updatePhone').value.trim(),
        adresse: document.getElementById('updateAddress').value.trim(),
        quartier: document.getElementById('updateNeighborhood').value.trim(),
        commune: document.getElementById('updateMunicipality').value.trim()
    };
    
    const messageDiv = document.getElementById('updateProfileMessage');
    
    if (!updateData.nomComplet) {
        showError(messageDiv, 'Le nom complet est obligatoire');
        return;
    }
    
    if (!updateData.telephone || !/^[0-9]{10,15}$/.test(updateData.telephone)) {
        showError(messageDiv, 'Numéro de téléphone invalide');
        return;
    }
    
    try {
        showLoading(messageDiv, 'Mise à jour en cours...');
        
        // Simuler la mise à jour pour l'instant
        setTimeout(() => {
            Object.assign(currentUser, updateData);
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(currentUser));
            showSuccess(messageDiv, 'Profil mis à jour avec succès!');
            loadProfile();
        }, 1000);
        
    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        showError(messageDiv, error.message);
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    if (!currentToken) {
        showError(document.getElementById('changePasswordMessage'), 'Vous devez être connecté');
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    const messageDiv = document.getElementById('changePasswordMessage');
    
    if (newPassword !== confirmNewPassword) {
        showError(messageDiv, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    if (newPassword.length < 8) {
        showError(messageDiv, 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    try {
        showLoading(messageDiv, 'Changement en cours...');
        
        // Simuler le changement pour l'instant
        setTimeout(() => {
            showSuccess(messageDiv, 'Mot de passe changé avec succès!');
            document.getElementById('changePasswordForm').reset();
        }, 1000);
        
    } catch (error) {
        console.error('Erreur changement mot de passe:', error);
        showError(messageDiv, error.message);
    }
}

// ============================================
// POINTS DE DÉPÔT
// ============================================

async function loadDepotPoints() {
    if (!currentToken) {
        showError(document.getElementById('depotPointsList'), 'Vous devez être connecté');
        return;
    }
    
    const container = document.getElementById('depotPointsList');
    
    try {
        const latitude = currentUser?.latitude || 48.8566;
        const longitude = currentUser?.longitude || 2.3522;
        
        const response = await fetch(
            `${CONFIG.API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=5`,
            { headers: { 'Authorization': `Bearer ${currentToken}` } }
        );
        
        if (!response.ok) {
            throw new Error('Erreur de chargement des points de dépôt');
        }
        
        const data = await response.json();
        const points = data.points || data || [];
        
        if (points.length === 0) {
            container.innerHTML = '<p class="empty-message">Aucun point de dépôt trouvé à proximité</p>';
            return;
        }
        
        container.innerHTML = '';
        points.forEach(point => {
            const element = document.createElement('div');
            element.className = 'depot-point-item';
            
            const distance = point.distance_metres 
                ? `${(point.distance_metres / 1000).toFixed(2)} km`
                : 'Distance inconnue';
            
            element.innerHTML = `
                <h4>${point.nom || 'Point de dépôt'}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${point.adresse || 'Adresse non disponible'}</p>
                <p><i class="fas fa-trash"></i> ${point.types_dechets_acceptes?.join(', ') || 'Tous types'}</p>
                <p><i class="fas fa-clock"></i> ${point.horaires_ouverture ? 'Horaires disponibles' : 'Horaires non spécifiés'}</p>
                <p><i class="fas fa-ruler"></i> ${distance}</p>
            `;
            
            container.appendChild(element);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des points de dépôt:', error);
        container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
    }
}

// ============================================
// UTILITAIRES
// ============================================

function togglePassword(inputId, btn) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.innerHTML = inp.type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
}

function showLoading(element, message) {
    element.className = 'message info';
    element.textContent = message;
    element.style.display = 'block';
}

function showSuccess(element, message) {
    if (!element) {
        const tempDiv = document.createElement('div');
        tempDiv.className = 'message success';
        tempDiv.textContent = message;
        tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(tempDiv);
        setTimeout(() => tempDiv.remove(), 3000);
        return;
    }
    
    element.className = 'message success';
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 3000);
}

function showError(element, message) {
    if (!element) {
        const tempDiv = document.createElement('div');
        tempDiv.className = 'message error';
        tempDiv.textContent = message;
        tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(tempDiv);
        setTimeout(() => tempDiv.remove(), 3000);
        return;
    }
    
    element.className = 'message error';
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 5000);
}

function copyToken() {
    if (!currentToken) {
        showError(null, 'Aucun token disponible');
        return;
    }
    
    navigator.clipboard.writeText(currentToken)
        .then(() => showSuccess(null, 'Token copié dans le presse-papier!'))
        .catch(err => showError(null, 'Erreur lors de la copie'));
}

function formatWasteType(type) {
    const types = {
        'plastique_pet': 'Plastique PET',
        'plastique_pehd': 'Plastique PEHD',
        'papier_carton': 'Papier/Carton',
        'metal': 'Métal',
        'verre': 'Verre',
        'organique': 'Organique'
    };
    return types[type] || type;
}

function formatCollectionMode(mode) {
    const modes = {
        'collecte_domicile': 'Collecte à domicile',
        'depot_volontaire': 'Dépôt volontaire'
    };
    return modes[mode] || mode;
}

function formatProducerType(type) {
    const types = {
        'menage': 'Ménage',
        'commerce': 'Commerce',
        'entreprise': 'Entreprise',
        'administration': 'Administration'
    };
    return types[type] || type;
}

function getStatusClass(status) {
    const classes = {
        'en_attente': 'badge-warning',
        'affecte': 'badge-info',
        'programme': 'badge-info',
        'termine': 'badge-success',
        'annule': 'badge-danger'
    };
    return classes[status] || 'badge-info';
}

// ============================================
// CONFIGURATION API
// ============================================

function showApiUrlModal() {
    document.getElementById('apiUrlModal').classList.remove('hidden');
}

function hideApiUrlModal() {
    document.getElementById('apiUrlModal').classList.add('hidden');
}

function saveApiUrl() {
    const newUrl = document.getElementById('apiUrlInput').value.trim();
    
    if (!newUrl) {
        showError(null, 'L\'URL ne peut pas être vide');
        return;
    }
    
    CONFIG.API_URL = newUrl;
    localStorage.setItem('api_url', newUrl);
    document.getElementById('apiUrl').textContent = newUrl;
    hideApiUrlModal();
    showSuccess(null, 'URL de l\'API mise à jour avec succès');
}

// Exposer les fonctions globalement
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.showSection = showSection;
window.showNewDeclarationForm = showNewDeclarationForm;
window.hideNewDeclarationForm = hideNewDeclarationForm;
window.handleNewDeclaration = handleNewDeclaration;
window.loadDeclarations = loadDeclarations;
window.showDeclarationDetail = showDeclarationDetail;
window.hideDeclarationDetail = hideDeclarationDetail;
window.handleUpdateProfile = handleUpdateProfile;
window.handleChangePassword = handleChangePassword;
window.loadDepotPoints = loadDepotPoints;
window.togglePassword = togglePassword;
window.copyToken = copyToken;
window.showApiUrlModal = showApiUrlModal;
window.hideApiUrlModal = hideApiUrlModal;
window.saveApiUrl = saveApiUrl;