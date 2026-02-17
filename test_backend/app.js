// Configuration
const CONFIG = {
    API_URL: localStorage.getItem('api_url') || 'http://localhost:3000',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user'
};

// État de l'application
let currentUser = null;
let currentToken = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    loadUserFromStorage();
});

function initApp() {
    // Mettre à jour l'URL de l'API affichée
    document.getElementById('apiUrl').textContent = CONFIG.API_URL;
    document.getElementById('apiUrlInput').value = CONFIG.API_URL;
    
    // Cacher toutes les sections sauf l'authentification
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('auth').classList.add('active');
    
    // Afficher le formulaire de connexion par défaut
    showTab('login');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
        });
    });
    
    // Tabs d'authentification
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // Formulaires d'authentification
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    
    // Toggle mot de passe
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Déclarations
    document.getElementById('newDeclarationBtn').addEventListener('click', showNewDeclarationForm);
    document.getElementById('cancelDeclarationBtn').addEventListener('click', hideNewDeclarationForm);
    document.getElementById('declarationForm').addEventListener('submit', handleNewDeclaration);
    document.getElementById('refreshDeclarationsBtn').addEventListener('click', loadDeclarations);
    document.getElementById('declarationFilter').addEventListener('change', loadDeclarations);
    document.getElementById('addWasteTypeBtn')?.addEventListener('click', addWasteType);
    document.getElementById('closeDetailBtn').addEventListener('click', hideDeclarationDetail);
    
    // Profil
    document.getElementById('updateProfileForm').addEventListener('submit', handleUpdateProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('copyTokenBtn').addEventListener('click', copyToken);
    
    // Tableau de bord
    document.getElementById('loadDepotPoints').addEventListener('click', loadDepotPoints);
    
    // Configuration API
    document.getElementById('changeApiUrlBtn').addEventListener('click', showApiUrlModal);
    document.getElementById('saveApiUrlBtn').addEventListener('click', saveApiUrl);
    document.getElementById('cancelApiUrlBtn').addEventListener('click', hideApiUrlModal);
}

// Fonctions d'affichage
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
    if (sectionId === 'dashboard') {
        loadDashboard();
    } else if (sectionId === 'declarations') {
        loadDeclarations();
    } else if (sectionId === 'profile') {
        loadProfile();
    }
}

function showTab(tabId) {
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Afficher le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// Gestion de l'authentification
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
        
        const data = await response.json();
        
        if (response.ok) {
            saveAuthData(data.token, data.producteur);
            showSuccess(messageDiv, 'Connexion réussie!');
            showSection('dashboard');
            resetForm('loginForm');
        } else {
            throw new Error(data.message || 'Erreur de connexion');
        }
    } catch (error) {
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
        longitude: parseFloat(document.getElementById('registerLongitude').value),
        latitude: parseFloat(document.getElementById('registerLatitude').value),
        quartier: document.getElementById('registerNeighborhood').value,
        commune: document.getElementById('registerMunicipality').value,
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
        
        const data = await response.json();
        
        if (response.ok) {
            saveAuthData(data.token, data.producteur);
            showSuccess(messageDiv, 'Inscription réussie! Bienvenue!');
            showSection('dashboard');
            resetForm('registerForm');
        } else {
            throw new Error(data.message || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        showError(messageDiv, error.message);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    const messageDiv = document.getElementById('forgotMessage');
    
    try {
        showLoading(messageDiv, 'Envoi de la demande...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/demande-reinitialisation-mdp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(messageDiv, data.message);
            document.getElementById('resetPasswordSection').classList.remove('hidden');
            resetForm('forgotPasswordForm');
        } else {
            throw new Error(data.message || 'Erreur lors de la demande');
        }
    } catch (error) {
        showError(messageDiv, error.message);
    }
}

async function handleResetPassword(e) {
    e.preventDefault();
    
    const token = document.getElementById('resetToken').value;
    const nouveauMotDePasse = document.getElementById('resetNewPassword').value;
    const messageDiv = document.getElementById('resetMessage');
    
    if (nouveauMotDePasse !== document.getElementById('resetConfirmPassword').value) {
        showError(messageDiv, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    try {
        showLoading(messageDiv, 'Réinitialisation en cours...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/reinitialiser-mdp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, nouveauMotDePasse })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(messageDiv, data.message);
            resetForm('resetPasswordForm');
            showTab('login');
        } else {
            throw new Error(data.message || 'Erreur lors de la réinitialisation');
        }
    } catch (error) {
        showError(messageDiv, error.message);
    }
}

// Gestion des déclarations
function showNewDeclarationForm() {
    document.getElementById('declarationFormContainer').classList.remove('hidden');
    document.getElementById('declarationsList').classList.add('hidden');
    resetForm('declarationForm');
}

function hideNewDeclarationForm() {
    document.getElementById('declarationFormContainer').classList.add('hidden');
    document.getElementById('declarationsList').classList.remove('hidden');
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
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(messageDiv, 'Déclaration créée avec succès!');
            hideNewDeclarationForm();
            loadDeclarations();
            loadDashboard();
        } else {
            throw new Error(data.message || 'Erreur lors de la création');
        }
    } catch (error) {
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
        
        const data = await response.json();
        
        if (response.ok) {
            let declarations = data.declarations || [];
            
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
        }
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
    
    // Définir le statut avec une classe CSS
    const statusMap = {
        'en_attente': { text: 'En attente', class: 'badge-warning' },
        'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
        'programme': { text: 'Programmée', class: 'badge-info' },
        'termine': { text: 'Terminée', class: 'badge-success' },
        'annule': { text: 'Annulée', class: 'badge-danger' }
    };
    
    const status = statusMap[declaration.statut] || { text: declaration.statut, class: '' };
    
    // Remplir les données
    element.querySelector('.declaration-id').textContent = `#${declaration.id.substring(0, 8)}`;
    element.querySelector('.declaration-date').textContent = 
        new Date(declaration.date_declaration).toLocaleDateString('fr-FR');
    element.querySelector('.declaration-status').textContent = status.text;
    element.querySelector('.declaration-status').className = `badge ${status.class}`;
    
    element.querySelector('.declaration-type span').textContent = 
        formatWasteType(declaration.type_dechet);
    element.querySelector('.declaration-quantity span').textContent = 
        `${declaration.quantite} ${declaration.unite}`;
    element.querySelector('.declaration-mode span').textContent = 
        formatCollectionMode(declaration.mode_collecte);
    
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
        
        const data = await response.json();
        
        if (response.ok) {
            content.innerHTML = createDetailHTML(data.declaration, data.suivre);
            document.getElementById('declarationsList').classList.add('hidden');
            container.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Erreur lors du chargement du détail:', error);
        content.innerHTML = '<p class="error">Erreur de chargement</p>';
    }
}

function createDetailHTML(declaration, suivre) {
    const statusMap = {
        'en_attente': { text: 'En attente d\'affectation', color: '#ff9800' },
        'affecte': { text: 'Collecteur affecté', color: '#2196f3' },
        'programme': { text: 'Collecte programmée', color: '#2196f3' },
        'termine': { text: 'Collecte terminée', color: '#4caf50' },
        'annule': { text: 'Annulée', color: '#f44336' }
    };
    
    const status = statusMap[declaration.statut] || { text: declaration.statut, color: '#666' };
    
    return `
        <div class="detail-card">
            <div class="detail-header" style="border-left: 4px solid ${status.color}">
                <h4>Déclaration #${declaration.id.substring(0, 8)}</h4>
                <span class="badge" style="background: ${status.color}">${status.text}</span>
            </div>
            
            <div class="detail-info">
                <div class="info-row">
                    <span class="label">Type de déchet:</span>
                    <span class="value">${formatWasteType(declaration.type_dechet)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Quantité:</span>
                    <span class="value">${declaration.quantite} ${declaration.unite}</span>
                </div>
                <div class="info-row">
                    <span class="label">Poids estimé:</span>
                    <span class="value">${declaration.poids_estime || 'N/A'} kg</span>
                </div>
                <div class="info-row">
                    <span class="label">Mode de collecte:</span>
                    <span class="value">${formatCollectionMode(declaration.mode_collecte)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Date souhaitée:</span>
                    <span class="value">${declaration.date_souhaitee ? new Date(declaration.date_souhaitee).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Créneau horaire:</span>
                    <span class="value">${declaration.creneau_horaire || 'Non spécifié'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Date de déclaration:</span>
                    <span class="value">${new Date(declaration.date_declaration).toLocaleDateString('fr-FR')}</span>
                </div>
            </div>
            
            <div class="suivi-info">
                <h4><i class="fas fa-map-signs"></i> Suivi</h4>
                <div class="etape">
                    <i class="fas fa-circle" style="color: ${status.color}"></i>
                    <span>${suivre.etapeActuelle}</span>
                </div>
                <div class="prochaine-action">
                    <i class="fas fa-arrow-right"></i>
                    <span>${suivre.prochaineAction}</span>
                </div>
                ${suivre.estTerminee ? 
                    '<p class="success"><i class="fas fa-check-circle"></i> Cette collecte est terminée</p>' : 
                    ''}
            </div>
            
            ${declaration.notes ? `
                <div class="notes">
                    <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                    <p>${declaration.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function hideDeclarationDetail() {
    document.getElementById('declarationDetail').classList.add('hidden');
    document.getElementById('declarationsList').classList.remove('hidden');
}

// Gestion du profil
function loadProfile() {
    if (!currentUser) return;
    
    // Afficher les informations
    document.getElementById('profileName').textContent = currentUser.nomComplet;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.telephone;
    document.getElementById('profileType').textContent = formatProducerType(currentUser.typeProducteur);
    document.getElementById('profileAddress').textContent = 'Adresse chargée...'; // À compléter
    document.getElementById('profileLocation').textContent = `${currentUser.quartier || ''}, ${currentUser.commune || ''}`;
    document.getElementById('profileSince').textContent = new Date().toLocaleDateString('fr-FR');
    
    // Remplir les formulaires
    document.getElementById('updateFullName').value = currentUser.nomComplet;
    document.getElementById('updatePhone').value = currentUser.telephone;
    document.getElementById('updateAddress').value = '';
    document.getElementById('updateNeighborhood').value = currentUser.quartier || '';
    document.getElementById('updateMunicipality').value = currentUser.commune || '';
    
    // Afficher le token
    document.getElementById('currentToken').textContent = currentToken 
        ? `${currentToken.substring(0, 50)}...` 
        : 'Non connecté';
}

async function handleUpdateProfile(e) {
    e.preventDefault();
    
    if (!currentToken) return;
    
    const updateData = {
        nomComplet: document.getElementById('updateFullName').value,
        telephone: document.getElementById('updatePhone').value,
        adresse: document.getElementById('updateAddress').value || undefined,
        quartier: document.getElementById('updateNeighborhood').value || undefined,
        commune: document.getElementById('updateMunicipality').value || undefined
    };
    
    const messageDiv = document.getElementById('updateProfileMessage');
    
    try {
        showLoading(messageDiv, 'Mise à jour en cours...');
        
        // Ici, vous devriez appeler l'endpoint de mise à jour du profil
        // Pour l'instant, on simule la mise à jour
        setTimeout(() => {
            showSuccess(messageDiv, 'Profil mis à jour avec succès!');
            // Mettre à jour l'utilisateur localement
            Object.assign(currentUser, updateData);
            saveUserToStorage();
            loadProfile();
        }, 1000);
        
    } catch (error) {
        showError(messageDiv, error.message);
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    if (!currentToken) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    const messageDiv = document.getElementById('changePasswordMessage');
    
    if (newPassword !== confirmNewPassword) {
        showError(messageDiv, 'Les mots de passe ne correspondent pas');
        return;
    }
    
    try {
        showLoading(messageDiv, 'Changement en cours...');
        
        // Ici, vous devriez appeler l'endpoint de changement de mot de passe
        setTimeout(() => {
            showSuccess(messageDiv, 'Mot de passe changé avec succès!');
            resetForm('changePasswordForm');
        }, 1000);
        
    } catch (error) {
        showError(messageDiv, error.message);
    }
}

// Tableau de bord
// async function loadDashboard() {
//     if (!currentToken) return;
    
//     // Simuler le chargement des données du tableau de bord
//     document.getElementById('dashboardPoints').textContent = currentUser?.points || '0';
    
//     try {
//         // Charger les déclarations pour les stats
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             const declarations = data.declarations || [];
            
//             // Calculer les statistiques
//             const totalDeclarations = declarations.length;
//             const completedCollections = declarations.filter(d => d.statut === 'termine').length;
//             const totalWaste = declarations
//                 .filter(d => d.statut === 'termine')
//                 .reduce((sum, d) => sum + (d.poids_estime || 0), 0);
            
//             document.getElementById('dashboardDeclarations').textContent = totalDeclarations;
//             document.getElementById('dashboardCollections').textContent = completedCollections;
//             document.getElementById('dashboardWaste').textContent = totalWaste.toFixed(2);
            
//             // Charger l'historique récent
//             loadRecentHistory(declarations);
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement du dashboard:', error);
//     }
// }


async function loadDashboard() {
    if (!currentToken) return;
    
    try {
        // Charger les données du tableau de bord
        const dashboardResponse = await fetch(`${CONFIG.API_URL}/api/dashboard`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const dashboardData = await dashboardResponse.json();
        
        if (dashboardResponse.ok && dashboardData.success) {
            const data = dashboardData.data;
            
            document.getElementById('dashboardPoints').textContent = data.points || '0';
            document.getElementById('dashboardDeclarations').textContent = data.total_declarations || '0';
            document.getElementById('dashboardCollections').textContent = data.total_collectes || '0';
            document.getElementById('dashboardWaste').textContent = 
                data.total_dechets_collectes ? data.total_dechets_collectes.toFixed(2) : '0';
            
            // Charger l'historique
            const historyResponse = await fetch(`${CONFIG.API_URL}/api/dashboard/historique?limite=5`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            
            const historyData = await historyResponse.json();
            if (historyResponse.ok && historyData.success) {
                loadRecentHistory(historyData.historique);
            }
            
            // Charger les notifications
            const notificationsResponse = await fetch(`${CONFIG.API_URL}/api/dashboard/notifications?limite=5`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            
            const notificationsData = await notificationsResponse.json();
            if (notificationsResponse.ok && notificationsData.success) {
                loadRecentNotifications(notificationsData.notifications);
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
        showError(document.getElementById('dashboard'), 'Erreur de chargement du tableau de bord');
    }
}


function loadRecentNotifications(notifications) {
    const container = document.getElementById('recentNotifications');
    
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<p class="empty-message">Aucune notification</p>';
        return;
    }
    
    container.innerHTML = '';
    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = 'notification-item';
        
        const timeAgo = getTimeAgo(new Date(notification.cree_le));
        
        item.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${notification.titre}</span>
                <span class="notification-time">${timeAgo}</span>
            </div>
            <div class="notification-message">${notification.message}</div>
        `;
        
        container.appendChild(item);
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
}

function loadRecentHistory(declarations) {
    const container = document.getElementById('recentHistory');
    
    if (declarations.length === 0) {
        container.innerHTML = '<p class="empty-message">Aucun historique disponible</p>';
        return;
    }
    
    // Prendre les 5 dernières déclarations
    const recent = declarations.slice(0, 5);
    container.innerHTML = '';
    
    recent.forEach(declaration => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(declaration.date_declaration).toLocaleDateString('fr-FR');
        const type = formatWasteType(declaration.type_dechet);
        const quantity = `${declaration.quantite} ${declaration.unite}`;
        
        item.innerHTML = `
            <div class="history-date">${date}</div>
            <div class="history-description">${type} (${quantity})</div>
            <div class="history-status ${declaration.statut}">${declaration.statut}</div>
        `;
        
        container.appendChild(item);
    });
}

async function loadDepotPoints() {
    if (!currentUser) return;
    
    const container = document.getElementById('depotPointsList');
    
    try {
        // Utiliser les coordonnées de l'utilisateur
        const latitude = currentUser.latitude || 48.8566;
        const longitude = currentUser.longitude || 2.3522;
        
        const response = await fetch(
            `${CONFIG.API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=5`,
            {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            }
        );
        
        const data = await response.json();
        
        if (response.ok) {
            const points = data.points || [];
            
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
                    <h4>${point.nom}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${point.adresse}</p>
                    <p><i class="fas fa-trash"></i> ${point.types_dechets_acceptes?.join(', ') || 'Tous types'}</p>
                    <p><i class="fas fa-clock"></i> Horaires: Voir détails</p>
                    <p><i class="fas fa-ruler"></i> ${distance}</p>
                `;
                
                container.appendChild(element);
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des points de dépôt:', error);
        container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
    }
}

// Gestion de la session
function saveAuthData(token, user) {
    currentToken = token;
    currentUser = user;
    
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    
    // Mettre à jour l'interface
    updateUIForLoggedInUser();
}

function loadUserFromStorage() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const userJson = localStorage.getItem(CONFIG.USER_KEY);
    
    if (token && userJson) {
        currentToken = token;
        currentUser = JSON.parse(userJson);
        updateUIForLoggedInUser();
        showSection('dashboard');
    }
}

function updateUIForLoggedInUser() {
    // Cacher l'authentification, montrer les autres sections
    document.getElementById('auth').classList.remove('active');
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') !== '#auth') {
            link.classList.remove('hidden');
        }
    });
    
    // Mettre à jour le nom dans la navigation
    const userLinks = document.querySelectorAll('.user-info');
    userLinks.forEach(link => {
        link.textContent = currentUser.nomComplet;
    });
}

function handleLogout() {
    currentToken = null;
    currentUser = null;
    
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    
    // Réinitialiser l'interface
    document.getElementById('auth').classList.add('active');
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'auth') {
            section.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') !== '#auth') {
            link.classList.add('hidden');
        } else {
            link.classList.add('active');
        }
    });
    
    showTab('login');
    resetAllForms();
}

// Configuration API
function showApiUrlModal() {
    document.getElementById('apiUrlModal').classList.remove('hidden');
}

function hideApiUrlModal() {
    document.getElementById('apiUrlModal').classList.add('hidden');
}

function saveApiUrl() {
    const newUrl = document.getElementById('apiUrlInput').value;
    CONFIG.API_URL = newUrl;
    localStorage.setItem('api_url', newUrl);
    document.getElementById('apiUrl').textContent = newUrl;
    hideApiUrlModal();
    showSuccess(null, 'URL de l\'API mise à jour');
}

// Utilitaires
function showLoading(element, message) {
    if (!element) return;
    
    element.className = 'message info';
    element.textContent = message;
    element.style.display = 'block';
}

function showSuccess(element, message) {
    if (!element) return;
    
    element.className = 'message success';
    element.textContent = message;
    element.style.display = 'block';
    
    // Cacher après 3 secondes
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function showError(element, message) {
    if (!element) return;
    
    element.className = 'message error';
    element.textContent = message;
    element.style.display = 'block';
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

function resetAllForms() {
    ['loginForm', 'registerForm', 'forgotPasswordForm', 'resetPasswordForm', 
     'declarationForm', 'updateProfileForm', 'changePasswordForm'].forEach(resetForm);
}

function copyToken() {
    if (!currentToken) return;
    
    navigator.clipboard.writeText(currentToken)
        .then(() => {
            showSuccess(null, 'Token copié dans le presse-papier!');
        })
        .catch(err => {
            console.error('Erreur lors de la copie:', err);
        });
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

function addWasteType() {
    const container = document.getElementById('additionalWasteList');
    const template = document.getElementById('wasteTypeTemplate');
    const clone = template.content.cloneNode(true);
    
    const removeBtn = clone.querySelector('.remove-waste-type-btn');
    removeBtn.addEventListener('click', function() {
        this.closest('.waste-type-item').remove();
    });
    
    container.appendChild(clone);
}




// // Configuration
// const CONFIG = {
//     API_URL: localStorage.getItem('api_url') || 'http://localhost:3000',
//     TOKEN_KEY: 'ecocollect_token',
//     USER_KEY: 'ecocollect_user'
// };

// // État de l'application
// let currentUser = null;
// let currentToken = null;

// // Initialisation
// document.addEventListener('DOMContentLoaded', () => {
//     initApp();
//     setupEventListeners();
//     loadUserFromStorage();
// });

// function initApp() {
//     // Mettre à jour l'URL de l'API affichée
//     document.getElementById('apiUrl').textContent = CONFIG.API_URL;
//     document.getElementById('apiUrlInput').value = CONFIG.API_URL;
    
//     // Cacher toutes les sections sauf l'authentification
//     document.querySelectorAll('.section').forEach(section => {
//         section.classList.remove('active');
//     });
//     document.getElementById('auth').classList.add('active');
    
//     // Afficher le formulaire de connexion par défaut
//     showTab('login');
// }

// function setupEventListeners() {
//     // Navigation
//     document.querySelectorAll('.nav-link').forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const target = link.getAttribute('href').substring(1);
//             showSection(target);
//         });
//     });
    
//     // Tabs d'authentification
//     document.querySelectorAll('.tab-btn').forEach(btn => {
//         btn.addEventListener('click', () => {
//             const tabId = btn.getAttribute('data-tab');
//             showTab(tabId);
//         });
//     });
    
//     // Formulaires d'authentification
//     document.getElementById('loginForm').addEventListener('submit', handleLogin);
//     document.getElementById('registerForm').addEventListener('submit', handleRegister);
//     document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
//     document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    
//     // Toggle mot de passe
//     document.querySelectorAll('.toggle-password').forEach(btn => {
//         btn.addEventListener('click', function() {
//             const targetId = this.getAttribute('data-target');
//             const input = document.getElementById(targetId);
//             const icon = this.querySelector('i');
            
//             if (input.type === 'password') {
//                 input.type = 'text';
//                 icon.className = 'fas fa-eye-slash';
//             } else {
//                 input.type = 'password';
//                 icon.className = 'fas fa-eye';
//             }
//         });
//     });
    
//     // Déclarations
//     document.getElementById('newDeclarationBtn').addEventListener('click', showNewDeclarationForm);
//     document.getElementById('cancelDeclarationBtn').addEventListener('click', hideNewDeclarationForm);
//     document.getElementById('declarationForm').addEventListener('submit', handleNewDeclaration);
//     document.getElementById('refreshDeclarationsBtn').addEventListener('click', loadDeclarations);
//     document.getElementById('declarationFilter').addEventListener('change', loadDeclarations);
//     document.getElementById('addWasteTypeBtn')?.addEventListener('click', addWasteType);
//     document.getElementById('closeDetailBtn').addEventListener('click', hideDeclarationDetail);
    
//     // Profil
//     document.getElementById('updateProfileForm').addEventListener('submit', handleUpdateProfile);
//     document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
//     document.getElementById('logoutBtn').addEventListener('click', handleLogout);
//     document.getElementById('copyTokenBtn').addEventListener('click', copyToken);
    
//     // Tableau de bord
//     document.getElementById('loadDepotPoints').addEventListener('click', loadDepotPoints);
    
//     // Configuration API
//     document.getElementById('changeApiUrlBtn').addEventListener('click', showApiUrlModal);
//     document.getElementById('saveApiUrlBtn').addEventListener('click', saveApiUrl);
//     document.getElementById('cancelApiUrlBtn').addEventListener('click', hideApiUrlModal);
// }

// // Fonctions d'affichage
// function showSection(sectionId) {
//     // Mettre à jour la navigation
//     document.querySelectorAll('.nav-link').forEach(link => {
//         link.classList.remove('active');
//         if (link.getAttribute('href') === `#${sectionId}`) {
//             link.classList.add('active');
//         }
//     });
    
//     // Afficher la section
//     document.querySelectorAll('.section').forEach(section => {
//         section.classList.remove('active');
//     });
//     document.getElementById(sectionId).classList.add('active');
    
//     // Charger les données si nécessaire
//     if (sectionId === 'dashboard') {
//         loadDashboard();
//     } else if (sectionId === 'declarations') {
//         loadDeclarations();
//     } else if (sectionId === 'profile') {
//         loadProfile();
//     }
// }

// function showTab(tabId) {
//     // Mettre à jour les boutons
//     document.querySelectorAll('.tab-btn').forEach(btn => {
//         btn.classList.remove('active');
//         if (btn.getAttribute('data-tab') === tabId) {
//             btn.classList.add('active');
//         }
//     });
    
//     // Afficher le contenu
//     document.querySelectorAll('.tab-content').forEach(content => {
//         content.classList.remove('active');
//     });
//     document.getElementById(tabId).classList.add('active');
// }

// // Gestion de l'authentification
// async function handleLogin(e) {
//     e.preventDefault();
    
//     const identifiant = document.getElementById('loginIdentifiant').value;
//     const motDePasse = document.getElementById('loginPassword').value;
//     const messageDiv = document.getElementById('loginMessage');
    
//     try {
//         showLoading(messageDiv, 'Connexion en cours...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/connexion`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ identifiant, motDePasse })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             saveAuthData(data.token, data.producteur);
//             showSuccess(messageDiv, 'Connexion réussie!');
//             showSection('dashboard');
//             resetForm('loginForm');
//         } else {
//             throw new Error(data.message || 'Erreur de connexion');
//         }
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// async function handleRegister(e) {
//     e.preventDefault();
    
//     const formData = {
//         email: document.getElementById('registerEmail').value,
//         telephone: document.getElementById('registerPhone').value,
//         motDePasse: document.getElementById('registerPassword').value,
//         typeProducteur: document.getElementById('registerType').value,
//         nomComplet: document.getElementById('registerFullName').value,
//         adresse: document.getElementById('registerAddress').value,
//         longitude: parseFloat(document.getElementById('registerLongitude').value),
//         latitude: parseFloat(document.getElementById('registerLatitude').value),
//         quartier: document.getElementById('registerNeighborhood').value,
//         commune: document.getElementById('registerMunicipality').value,
//         cguAcceptees: document.getElementById('registerCGU').checked
//     };
    
//     const messageDiv = document.getElementById('registerMessage');
    
//     // Validation
//     if (formData.motDePasse !== document.getElementById('registerConfirmPassword').value) {
//         showError(messageDiv, 'Les mots de passe ne correspondent pas');
//         return;
//     }
    
//     try {
//         showLoading(messageDiv, 'Inscription en cours...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(formData)
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             saveAuthData(data.token, data.producteur);
//             showSuccess(messageDiv, 'Inscription réussie! Bienvenue!');
//             showSection('dashboard');
//             resetForm('registerForm');
//         } else {
//             throw new Error(data.message || 'Erreur lors de l\'inscription');
//         }
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// async function handleForgotPassword(e) {
//     e.preventDefault();
    
//     const email = document.getElementById('forgotEmail').value;
//     const messageDiv = document.getElementById('forgotMessage');
    
//     try {
//         showLoading(messageDiv, 'Envoi de la demande...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/demande-reinitialisation-mdp`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             showSuccess(messageDiv, data.message);
//             document.getElementById('resetPasswordSection').classList.remove('hidden');
//             resetForm('forgotPasswordForm');
//         } else {
//             throw new Error(data.message || 'Erreur lors de la demande');
//         }
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// async function handleResetPassword(e) {
//     e.preventDefault();
    
//     const token = document.getElementById('resetToken').value;
//     const nouveauMotDePasse = document.getElementById('resetNewPassword').value;
//     const messageDiv = document.getElementById('resetMessage');
    
//     if (nouveauMotDePasse !== document.getElementById('resetConfirmPassword').value) {
//         showError(messageDiv, 'Les mots de passe ne correspondent pas');
//         return;
//     }
    
//     try {
//         showLoading(messageDiv, 'Réinitialisation en cours...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/reinitialiser-mdp`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ token, nouveauMotDePasse })
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             showSuccess(messageDiv, data.message);
//             resetForm('resetPasswordForm');
//             showTab('login');
//         } else {
//             throw new Error(data.message || 'Erreur lors de la réinitialisation');
//         }
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// // Gestion des déclarations
// function showNewDeclarationForm() {
//     document.getElementById('declarationFormContainer').classList.remove('hidden');
//     document.getElementById('declarationsList').classList.add('hidden');
//     resetForm('declarationForm');
// }

// function hideNewDeclarationForm() {
//     document.getElementById('declarationFormContainer').classList.add('hidden');
//     document.getElementById('declarationsList').classList.remove('hidden');
// }

// async function handleNewDeclaration(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('declarationMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const declarationData = {
//         typeDechet: document.getElementById('declarationType').value,
//         quantite: parseFloat(document.getElementById('declarationQuantity').value),
//         unite: document.getElementById('declarationUnit').value,
//         modeCollecte: document.getElementById('declarationMode').value,
//         dateSouhaitee: document.getElementById('declarationDate').value || null,
//         creneauHoraire: document.getElementById('declarationTime').value || null,
//         notes: document.getElementById('declarationNotes').value || null
//     };
    
//     const messageDiv = document.getElementById('declarationMessage');
    
//     try {
//         showLoading(messageDiv, 'Création de la déclaration...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${currentToken}`
//             },
//             body: JSON.stringify(declarationData)
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             showSuccess(messageDiv, 'Déclaration créée avec succès!');
//             hideNewDeclarationForm();
//             loadDeclarations();
//             loadDashboard();
//         } else {
//             throw new Error(data.message || 'Erreur lors de la création');
//         }
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// async function loadDeclarations() {
//     if (!currentToken) return;
    
//     const filter = document.getElementById('declarationFilter').value;
//     const container = document.getElementById('declarationsList');
    
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             let declarations = data.declarations || [];
            
//             // Filtrer si nécessaire
//             if (filter !== 'all') {
//                 declarations = declarations.filter(d => d.statut === filter);
//             }
            
//             // Afficher les déclarations
//             if (declarations.length === 0) {
//                 container.innerHTML = '<p class="empty-message">Aucune déclaration trouvée</p>';
//                 return;
//             }
            
//             container.innerHTML = '';
//             declarations.forEach(declaration => {
//                 const element = createDeclarationElement(declaration);
//                 container.appendChild(element);
//             });
            
//             // Ajouter les événements de suivi
//             document.querySelectorAll('.view-detail-btn').forEach(btn => {
//                 btn.addEventListener('click', function() {
//                     const declarationId = this.closest('.declaration-item').dataset.id;
//                     showDeclarationDetail(declarationId);
//                 });
//             });
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement des déclarations:', error);
//         container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
//     }
// }

// function createDeclarationElement(declaration) {
//     const template = document.getElementById('declarationTemplate');
//     const clone = template.content.cloneNode(true);
//     const element = clone.querySelector('.declaration-item');
    
//     element.dataset.id = declaration.id;
    
//     // Définir le statut avec une classe CSS
//     const statusMap = {
//         'en_attente': { text: 'En attente', class: 'badge-warning' },
//         'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
//         'programme': { text: 'Programmée', class: 'badge-info' },
//         'termine': { text: 'Terminée', class: 'badge-success' },
//         'annule': { text: 'Annulée', class: 'badge-danger' }
//     };
    
//     const status = statusMap[declaration.statut] || { text: declaration.statut, class: '' };
    
//     // Remplir les données
//     element.querySelector('.declaration-id').textContent = `#${declaration.id.substring(0, 8)}`;
//     element.querySelector('.declaration-date').textContent = 
//         new Date(declaration.date_declaration).toLocaleDateString('fr-FR');
//     element.querySelector('.declaration-status').textContent = status.text;
//     element.querySelector('.declaration-status').className = `badge ${status.class}`;
    
//     element.querySelector('.declaration-type span').textContent = 
//         formatWasteType(declaration.type_dechet);
//     element.querySelector('.declaration-quantity span').textContent = 
//         `${declaration.quantite} ${declaration.unite}`;
//     element.querySelector('.declaration-mode span').textContent = 
//         formatCollectionMode(declaration.mode_collecte);
    
//     return element;
// }

// async function showDeclarationDetail(declarationId) {
//     if (!currentToken) return;
    
//     const container = document.getElementById('declarationDetail');
//     const content = document.getElementById('detailContent');
    
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations/${declarationId}/suivre`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             content.innerHTML = createDetailHTML(data.declaration, data.suivre);
//             document.getElementById('declarationsList').classList.add('hidden');
//             container.classList.remove('hidden');
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement du détail:', error);
//         content.innerHTML = '<p class="error">Erreur de chargement</p>';
//     }
// }

// function createDetailHTML(declaration, suivre) {
//     const statusMap = {
//         'en_attente': { text: 'En attente d\'affectation', color: '#ff9800' },
//         'affecte': { text: 'Collecteur affecté', color: '#2196f3' },
//         'programme': { text: 'Collecte programmée', color: '#2196f3' },
//         'termine': { text: 'Collecte terminée', color: '#4caf50' },
//         'annule': { text: 'Annulée', color: '#f44336' }
//     };
    
//     const status = statusMap[declaration.statut] || { text: declaration.statut, color: '#666' };
    
//     return `
//         <div class="detail-card">
//             <div class="detail-header" style="border-left: 4px solid ${status.color}">
//                 <h4>Déclaration #${declaration.id.substring(0, 8)}</h4>
//                 <span class="badge" style="background: ${status.color}">${status.text}</span>
//             </div>
            
//             <div class="detail-info">
//                 <div class="info-row">
//                     <span class="label">Type de déchet:</span>
//                     <span class="value">${formatWasteType(declaration.type_dechet)}</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Quantité:</span>
//                     <span class="value">${declaration.quantite} ${declaration.unite}</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Poids estimé:</span>
//                     <span class="value">${declaration.poids_estime || 'N/A'} kg</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Mode de collecte:</span>
//                     <span class="value">${formatCollectionMode(declaration.mode_collecte)}</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Date souhaitée:</span>
//                     <span class="value">${declaration.date_souhaitee ? new Date(declaration.date_souhaitee).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Créneau horaire:</span>
//                     <span class="value">${declaration.creneau_horaire || 'Non spécifié'}</span>
//                 </div>
//                 <div class="info-row">
//                     <span class="label">Date de déclaration:</span>
//                     <span class="value">${new Date(declaration.date_declaration).toLocaleDateString('fr-FR')}</span>
//                 </div>
//             </div>
            
//             <div class="suivi-info">
//                 <h4><i class="fas fa-map-signs"></i> Suivi</h4>
//                 <div class="etape">
//                     <i class="fas fa-circle" style="color: ${status.color}"></i>
//                     <span>${suivre.etapeActuelle}</span>
//                 </div>
//                 <div class="prochaine-action">
//                     <i class="fas fa-arrow-right"></i>
//                     <span>${suivre.prochaineAction}</span>
//                 </div>
//                 ${suivre.estTerminee ? 
//                     '<p class="success"><i class="fas fa-check-circle"></i> Cette collecte est terminée</p>' : 
//                     ''}
//             </div>
            
//             ${declaration.notes ? `
//                 <div class="notes">
//                     <h4><i class="fas fa-sticky-note"></i> Notes</h4>
//                     <p>${declaration.notes}</p>
//                 </div>
//             ` : ''}
//         </div>
//     `;
// }

// function hideDeclarationDetail() {
//     document.getElementById('declarationDetail').classList.add('hidden');
//     document.getElementById('declarationsList').classList.remove('hidden');
// }

// // Gestion du profil
// function loadProfile() {
//     if (!currentUser) return;
    
//     // Afficher les informations
//     document.getElementById('profileName').textContent = currentUser.nomComplet;
//     document.getElementById('profileEmail').textContent = currentUser.email;
//     document.getElementById('profilePhone').textContent = currentUser.telephone;
//     document.getElementById('profileType').textContent = formatProducerType(currentUser.typeProducteur);
//     document.getElementById('profileAddress').textContent = currentUser.adresse || 'Non spécifiée';
//     document.getElementById('profileLocation').textContent = `${currentUser.quartier || ''}, ${currentUser.commune || ''}`;
//     document.getElementById('profileSince').textContent = currentUser.cree_le 
//         ? new Date(currentUser.cree_le).toLocaleDateString('fr-FR')
//         : new Date().toLocaleDateString('fr-FR');
    
//     // Remplir les formulaires
//     document.getElementById('updateFullName').value = currentUser.nomComplet;
//     document.getElementById('updatePhone').value = currentUser.telephone;
//     document.getElementById('updateAddress').value = currentUser.adresse || '';
//     document.getElementById('updateNeighborhood').value = currentUser.quartier || '';
//     document.getElementById('updateMunicipality').value = currentUser.commune || '';
    
//     // Afficher le token
//     document.getElementById('currentToken').textContent = currentToken 
//         ? `${currentToken.substring(0, 50)}...` 
//         : 'Non connecté';
// }

// async function handleUpdateProfile(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('updateProfileMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const updateData = {
//         nomComplet: document.getElementById('updateFullName').value.trim(),
//         telephone: document.getElementById('updatePhone').value.trim(),
//         adresse: document.getElementById('updateAddress').value.trim(),
//         quartier: document.getElementById('updateNeighborhood').value.trim(),
//         commune: document.getElementById('updateMunicipality').value.trim()
//     };
    
//     const messageDiv = document.getElementById('updateProfileMessage');
    
//     // Validation
//     if (!updateData.nomComplet) {
//         showError(messageDiv, 'Le nom complet est obligatoire');
//         return;
//     }
    
//     if (!updateData.telephone || !/^[0-9]{10,15}$/.test(updateData.telephone)) {
//         showError(messageDiv, 'Numéro de téléphone invalide (10-15 chiffres)');
//         return;
//     }
    
//     try {
//         showLoading(messageDiv, 'Mise à jour en cours...');
        
//         // Ici, vous devriez appeler l'endpoint de mise à jour du profil
//         // Pour l'instant, on simule la mise à jour avec une API réelle
//         const response = await fetch(`${CONFIG.API_URL}/api/profil`, { // Note: Vous devez créer cette route
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${currentToken}`
//             },
//             body: JSON.stringify(updateData)
//         });
        
//         if (response.ok) {
//             const data = await response.json();
            
//             // Mettre à jour l'utilisateur localement
//             Object.assign(currentUser, updateData);
//             saveUserToStorage(currentUser); // Correction ici
//             showSuccess(messageDiv, 'Profil mis à jour avec succès!');
//             loadProfile(); // Recharger les infos affichées
            
//             // Mettre à jour les données dans localStorage
//             localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(currentUser));
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Erreur lors de la mise à jour');
//         }
        
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// // Fonction manquante - Ajoutez-la
// function saveUserToStorage(user) {
//     if (user) {
//         localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
//         currentUser = user;
//     }
// }

// async function handleChangePassword(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('changePasswordMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const currentPassword = document.getElementById('currentPassword').value;
//     const newPassword = document.getElementById('newPassword').value;
//     const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
//     const messageDiv = document.getElementById('changePasswordMessage');
    
//     if (newPassword !== confirmNewPassword) {
//         showError(messageDiv, 'Les mots de passe ne correspondent pas');
//         return;
//     }
    
//     if (newPassword.length < 8) {
//         showError(messageDiv, 'Le mot de passe doit contenir au moins 8 caractères');
//         return;
//     }
    
//     try {
//         showLoading(messageDiv, 'Changement en cours...');
        
//         // Ici, vous devriez appeler l'endpoint de changement de mot de passe
//         const response = await fetch(`${CONFIG.API_URL}/api/changer-mot-de-passe`, { // Note: Créer cette route
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${currentToken}`
//             },
//             body: JSON.stringify({
//                 motDePasseActuel: currentPassword,
//                 nouveauMotDePasse: newPassword
//             })
//         });
        
//         if (response.ok) {
//             const data = await response.json();
//             showSuccess(messageDiv, data.message || 'Mot de passe changé avec succès!');
//             resetForm('changePasswordForm');
//         } else {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
//         }
        
//     } catch (error) {
//         showError(messageDiv, error.message);
//     }
// }

// // Tableau de bord
// async function loadDashboard() {
//     if (!currentToken) return;
    
//     try {
//         // Charger les données du tableau de bord
//         const dashboardResponse = await fetch(`${CONFIG.API_URL}/api/dashboard`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         const dashboardData = await dashboardResponse.json();
        
//         if (dashboardResponse.ok && dashboardData.success) {
//             const data = dashboardData.data;
            
//             document.getElementById('dashboardPoints').textContent = data.points || '0';
//             document.getElementById('dashboardDeclarations').textContent = data.total_declarations || '0';
//             document.getElementById('dashboardCollections').textContent = data.total_collectes || '0';
//             document.getElementById('dashboardWaste').textContent = 
//                 data.total_dechets_collectes ? data.total_dechets_collectes.toFixed(2) : '0';
            
//             // Charger l'historique
//             const historyResponse = await fetch(`${CONFIG.API_URL}/api/dashboard/historique?limite=5`, {
//                 headers: { 'Authorization': `Bearer ${currentToken}` }
//             });
            
//             const historyData = await historyResponse.json();
//             if (historyResponse.ok && historyData.success) {
//                 loadRecentHistory(historyData.historique);
//             }
            
//             // Charger les notifications
//             const notificationsResponse = await fetch(`${CONFIG.API_URL}/api/dashboard/notifications?limite=5`, {
//                 headers: { 'Authorization': `Bearer ${currentToken}` }
//             });
            
//             const notificationsData = await notificationsResponse.json();
//             if (notificationsResponse.ok && notificationsData.success) {
//                 loadRecentNotifications(notificationsData.notifications);
//             }
//         } else {
//             // Fallback si l'API dashboard n'existe pas encore
//             loadDashboardFallback();
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement du dashboard:', error);
//         // Fallback en cas d'erreur
//         loadDashboardFallback();
//     }
// }

// // Fallback pour le dashboard si l'API n'est pas disponible
// async function loadDashboardFallback() {
//     if (!currentToken) return;
    
//     try {
//         // Charger les déclarations pour les stats
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         const data = await response.json();
        
//         if (response.ok) {
//             const declarations = data.declarations || [];
            
//             // Calculer les statistiques
//             const totalDeclarations = declarations.length;
//             const completedCollections = declarations.filter(d => d.statut === 'termine').length;
//             const totalWaste = declarations
//                 .filter(d => d.statut === 'termine')
//                 .reduce((sum, d) => sum + (d.poids_estime || 0), 0);
            
//             document.getElementById('dashboardPoints').textContent = currentUser?.points || '0';
//             document.getElementById('dashboardDeclarations').textContent = totalDeclarations;
//             document.getElementById('dashboardCollections').textContent = completedCollections;
//             document.getElementById('dashboardWaste').textContent = totalWaste.toFixed(2);
            
//             // Charger l'historique récent
//             loadRecentHistory(declarations.slice(0, 5));
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement du fallback:', error);
//     }
// }

// function loadRecentNotifications(notifications) {
//     const container = document.getElementById('recentNotifications');
    
//     if (!notifications || notifications.length === 0) {
//         container.innerHTML = '<p class="empty-message">Aucune notification</p>';
//         return;
//     }
    
//     container.innerHTML = '';
//     notifications.forEach(notification => {
//         const item = document.createElement('div');
//         item.className = 'notification-item';
        
//         const timeAgo = getTimeAgo(new Date(notification.cree_le));
        
//         item.innerHTML = `
//             <div class="notification-header">
//                 <span class="notification-title">${notification.titre}</span>
//                 <span class="notification-time">${timeAgo}</span>
//             </div>
//             <div class="notification-message">${notification.message}</div>
//         `;
        
//         container.appendChild(item);
//     });
// }

// function getTimeAgo(date) {
//     const now = new Date();
//     const diff = now - date;
//     const minutes = Math.floor(diff / 60000);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);
    
//     if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
//     if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
//     if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
//     return 'À l\'instant';
// }

// function loadRecentHistory(declarations) {
//     const container = document.getElementById('recentHistory');
    
//     if (!declarations || declarations.length === 0) {
//         container.innerHTML = '<p class="empty-message">Aucun historique disponible</p>';
//         return;
//     }
    
//     container.innerHTML = '';
//     declarations.forEach(declaration => {
//         const item = document.createElement('div');
//         item.className = 'history-item';
        
//         const date = declaration.date_declaration 
//             ? new Date(declaration.date_declaration).toLocaleDateString('fr-FR')
//             : 'Date inconnue';
//         const type = formatWasteType(declaration.type_dechet);
//         const quantity = `${declaration.quantite || 0} ${declaration.unite || ''}`;
//         const status = declaration.statut || 'inconnu';
        
//         item.innerHTML = `
//             <div class="history-date">${date}</div>
//             <div class="history-description">${type} (${quantity})</div>
//             <div class="history-status ${status}">${status}</div>
//         `;
        
//         container.appendChild(item);
//     });
// }

// async function loadDepotPoints() {
//     if (!currentUser || !currentToken) {
//         showError(document.getElementById('depotPointsList'), 'Vous devez être connecté');
//         return;
//     }
    
//     const container = document.getElementById('depotPointsList');
    
//     try {
//         // Utiliser les coordonnées de l'utilisateur ou des valeurs par défaut
//         const latitude = currentUser.latitude || 48.8566;
//         const longitude = currentUser.longitude || 2.3522;
        
//         const response = await fetch(
//             `${CONFIG.API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=5`,
//             {
//                 headers: { 'Authorization': `Bearer ${currentToken}` }
//             }
//         );
        
//         const data = await response.json();
        
//         if (response.ok) {
//             const points = data.points || [];
            
//             if (points.length === 0) {
//                 container.innerHTML = '<p class="empty-message">Aucun point de dépôt trouvé à proximité</p>';
//                 return;
//             }
            
//             container.innerHTML = '';
//             points.forEach(point => {
//                 const element = document.createElement('div');
//                 element.className = 'depot-point-item';
                
//                 const distance = point.distance_metres 
//                     ? `${(point.distance_metres / 1000).toFixed(2)} km`
//                     : 'Distance inconnue';
                
//                 element.innerHTML = `
//                     <h4>${point.nom || 'Point de dépôt'}</h4>
//                     <p><i class="fas fa-map-marker-alt"></i> ${point.adresse || 'Adresse non disponible'}</p>
//                     <p><i class="fas fa-trash"></i> ${point.types_dechets_acceptes?.join(', ') || 'Tous types'}</p>
//                     <p><i class="fas fa-clock"></i> Horaires: ${point.horaires_ouverture ? 'Disponibles' : 'Non spécifiés'}</p>
//                     <p><i class="fas fa-ruler"></i> ${distance}</p>
//                 `;
                
//                 container.appendChild(element);
//             });
//         } else {
//             throw new Error(data.message || 'Erreur de chargement');
//         }
//     } catch (error) {
//         console.error('Erreur lors du chargement des points de dépôt:', error);
//         container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
//     }
// }

// // Gestion de la session
// function saveAuthData(token, user) {
//     currentToken = token;
//     currentUser = user;
    
//     localStorage.setItem(CONFIG.TOKEN_KEY, token);
//     localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    
//     // Mettre à jour l'interface
//     updateUIForLoggedInUser();
// }

// function loadUserFromStorage() {
//     const token = localStorage.getItem(CONFIG.TOKEN_KEY);
//     const userJson = localStorage.getItem(CONFIG.USER_KEY);
    
//     if (token && userJson) {
//         try {
//             currentToken = token;
//             currentUser = JSON.parse(userJson);
//             updateUIForLoggedInUser();
//             showSection('dashboard');
//         } catch (error) {
//             console.error('Erreur lors du parsing des données utilisateur:', error);
//             // Nettoyer les données corrompues
//             localStorage.removeItem(CONFIG.TOKEN_KEY);
//             localStorage.removeItem(CONFIG.USER_KEY);
//         }
//     }
// }

// function updateUIForLoggedInUser() {
//     if (!currentUser) return;
    
//     // Cacher l'authentification, montrer les autres sections
//     document.getElementById('auth').classList.remove('active');
//     document.querySelectorAll('.nav-link').forEach(link => {
//         if (link.getAttribute('href') !== '#auth') {
//             link.classList.remove('hidden');
//         }
//     });
    
//     // Mettre à jour le nom dans la navigation si vous avez un élément .user-info
//     const userLinks = document.querySelectorAll('.user-info');
//     userLinks.forEach(link => {
//         link.textContent = currentUser.nomComplet || 'Utilisateur';
//     });
// }

// function handleLogout() {
//     currentToken = null;
//     currentUser = null;
    
//     localStorage.removeItem(CONFIG.TOKEN_KEY);
//     localStorage.removeItem(CONFIG.USER_KEY);
    
//     // Réinitialiser l'interface
//     document.getElementById('auth').classList.add('active');
//     document.querySelectorAll('.section').forEach(section => {
//         if (section.id !== 'auth') {
//             section.classList.remove('active');
//         }
//     });
    
//     document.querySelectorAll('.nav-link').forEach(link => {
//         if (link.getAttribute('href') !== '#auth') {
//             link.classList.add('hidden');
//         } else {
//             link.classList.add('active');
//         }
//     });
    
//     showTab('login');
//     resetAllForms();
// }

// // Configuration API
// function showApiUrlModal() {
//     document.getElementById('apiUrlModal').classList.remove('hidden');
// }

// function hideApiUrlModal() {
//     document.getElementById('apiUrlModal').classList.add('hidden');
// }

// function saveApiUrl() {
//     const newUrl = document.getElementById('apiUrlInput').value.trim();
    
//     if (!newUrl) {
//         showError(null, 'L\'URL ne peut pas être vide');
//         return;
//     }
    
//     CONFIG.API_URL = newUrl;
//     localStorage.setItem('api_url', newUrl);
//     document.getElementById('apiUrl').textContent = newUrl;
//     hideApiUrlModal();
//     showSuccess(null, 'URL de l\'API mise à jour avec succès');
// }

// // Utilitaires
// function showLoading(element, message) {
//     if (!element) return;
    
//     element.className = 'message info';
//     element.textContent = message;
//     element.style.display = 'block';
// }

// function showSuccess(element, message) {
//     if (!element) {
//         // Créer un message temporaire si aucun élément n'est fourni
//         const tempDiv = document.createElement('div');
//         tempDiv.className = 'message success';
//         tempDiv.textContent = message;
//         tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
//         document.body.appendChild(tempDiv);
        
//         setTimeout(() => {
//             tempDiv.remove();
//         }, 3000);
//         return;
//     }
    
//     element.className = 'message success';
//     element.textContent = message;
//     element.style.display = 'block';
    
//     // Cacher après 3 secondes
//     setTimeout(() => {
//         element.style.display = 'none';
//     }, 3000);
// }

// function showError(element, message) {
//     if (!element) {
//         // Créer un message temporaire si aucun élément n'est fourni
//         const tempDiv = document.createElement('div');
//         tempDiv.className = 'message error';
//         tempDiv.textContent = message;
//         tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
//         document.body.appendChild(tempDiv);
        
//         setTimeout(() => {
//             tempDiv.remove();
//         }, 3000);
//         return;
//     }
    
//     element.className = 'message error';
//     element.textContent = message;
//     element.style.display = 'block';
    
//     // Cacher après 5 secondes
//     setTimeout(() => {
//         element.style.display = 'none';
//     }, 5000);
// }

// function resetForm(formId) {
//     const form = document.getElementById(formId);
//     if (form) form.reset();
// }

// function resetAllForms() {
//     ['loginForm', 'registerForm', 'forgotPasswordForm', 'resetPasswordForm', 
//      'declarationForm', 'updateProfileForm', 'changePasswordForm'].forEach(resetForm);
// }

// function copyToken() {
//     if (!currentToken) {
//         showError(null, 'Aucun token disponible');
//         return;
//     }
    
//     navigator.clipboard.writeText(currentToken)
//         .then(() => {
//             showSuccess(null, 'Token copié dans le presse-papier!');
//         })
//         .catch(err => {
//             console.error('Erreur lors de la copie:', err);
//             showError(null, 'Erreur lors de la copie du token');
//         });
// }

// function formatWasteType(type) {
//     const types = {
//         'plastique_pet': 'Plastique PET',
//         'plastique_pehd': 'Plastique PEHD',
//         'papier_carton': 'Papier/Carton',
//         'metal': 'Métal',
//         'verre': 'Verre',
//         'organique': 'Organique'
//     };
//     return types[type] || type;
// }

// function formatCollectionMode(mode) {
//     const modes = {
//         'collecte_domicile': 'Collecte à domicile',
//         'depot_volontaire': 'Dépôt volontaire'
//     };
//     return modes[mode] || mode;
// }

// function formatProducerType(type) {
//     const types = {
//         'menage': 'Ménage',
//         'commerce': 'Commerce',
//         'entreprise': 'Entreprise',
//         'administration': 'Administration'
//     };
//     return types[type] || type;
// }

// function addWasteType() {
//     const container = document.getElementById('additionalWasteList');
//     if (!container) return;
    
//     const template = document.getElementById('wasteTypeTemplate');
//     if (!template) {
//         console.error('Template wasteTypeTemplate non trouvé');
//         return;
//     }
    
//     const clone = template.content.cloneNode(true);
    
//     const removeBtn = clone.querySelector('.remove-waste-type-btn');
//     if (removeBtn) {
//         removeBtn.addEventListener('click', function() {
//             this.closest('.waste-type-item').remove();
//         });
//     }
    
//     container.appendChild(clone);
// }

// // Fonction pour vérifier si l'utilisateur est connecté
// function estConnecte() {
//     return currentToken !== null && currentUser !== null;
// }

// // Fonction pour obtenir les headers d'authentification
// function getAuthHeaders() {
//     return {
//         'Authorization': `Bearer ${currentToken}`,
//         'Content-Type': 'application/json'
//     };
// }