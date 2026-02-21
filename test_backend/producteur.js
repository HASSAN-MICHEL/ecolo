


// const CONFIG = {
//     API_URL: 'https://ecobackend-three.vercel.app',
//     TOKEN_KEY: 'ecocollect_token',
//     USER_KEY: 'ecocollect_user',
//     ROLE_KEY: 'ecocollect_role'
// };

// console.log('🚀 producteur.js chargé');
// console.log('📡 API URL utilisée:', CONFIG.API_URL);

// // État de l'application
// let currentUser = null;
// let currentToken = null;

// // ============================================
// // INITIALISATION - Vérification de session
// // ============================================
// document.addEventListener('DOMContentLoaded', async () => {
//     console.log('🚀 Initialisation de producteur.js');
    
//     // Afficher l'URL de l'API
//     const apiUrlEl = document.getElementById('apiUrl');
//     const apiUrlInput = document.getElementById('apiUrlInput');
//     if (apiUrlEl) apiUrlEl.textContent = CONFIG.API_URL;
//     if (apiUrlInput) apiUrlInput.value = CONFIG.API_URL;
    
//     // Récupérer les données de session
//     const token = localStorage.getItem(CONFIG.TOKEN_KEY);
//     const userJson = localStorage.getItem(CONFIG.USER_KEY);
//     const role = localStorage.getItem(CONFIG.ROLE_KEY);
    
//     console.log('🔍 Token présent:', !!token);
//     console.log('🔍 User présent:', !!userJson);
//     console.log('🔍 Rôle:', role);
    
//     // Vérifier que tout est présent et que c'est bien un producteur
//     if (!token || !userJson || role !== 'producteur') {
//         console.log('❌ Session invalide ou mauvais rôle');
//         window.location.href = 'in.html';
//         return;
//     }
    
//     try {
//         currentToken = token;
//         currentUser = JSON.parse(userJson);
        
//         console.log('✅ Utilisateur connecté:', currentUser);
        
//         // Mettre à jour l'affichage utilisateur
//         updateUserDisplay();
        
//         // Afficher le tableau de bord
//         showSection('dashboard');
        
//         // Charger les données
//         await loadDashboard();
//         await loadDeclarations();
//         await loadProfile();
//         await loadNotifications();
        
//         // Initialiser les écouteurs
//         initEventListeners();
        
//     } catch (error) {
//         console.error('❌ Erreur lors du chargement:', error);
//         clearSession();
//         window.location.href = 'in.html';
//     }
// });

// function initEventListeners() {
//     console.log('✅ Écouteurs initialisés');
// }

// // ============================================
// // GESTION DE SESSION
// // ============================================

// function updateUserDisplay() {
//     console.log('🔄 Mise à jour affichage utilisateur');
    
//     if (!currentUser) return;
    
//     // Mettre à jour le badge utilisateur
//     const userName = document.getElementById('userName');
//     if (userName) {
//         userName.textContent = currentUser.nomComplet || currentUser.email || 'Producteur';
//     }
    
//     const userAvatar = document.getElementById('userAvatar');
//     if (userAvatar) {
//         // Initiales pour l'avatar
//         const initiales = (currentUser.nomComplet || 'P')
//             .split(' ')
//             .map(n => n[0])
//             .join('')
//             .toUpperCase()
//             .substring(0, 2);
//         userAvatar.innerHTML = initiales || '<i class="fas fa-user"></i>';
//     }
    
//     // Afficher les liens de navigation
//     document.querySelectorAll('.nav-link').forEach(link => {
//         if (!link.classList.contains('logout')) {
//             link.classList.remove('hidden');
//         }
//     });
// }

// function saveAuthData(token, user) {
//     currentToken = token;
//     currentUser = user;
    
//     try {
//         localStorage.setItem(CONFIG.TOKEN_KEY, token);
//         localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
//         localStorage.setItem(CONFIG.ROLE_KEY, 'producteur');
//         console.log('✅ Données sauvegardées pour', user?.nomComplet);
//     } catch (error) {
//         console.error('❌ Erreur sauvegarde localStorage:', error);
//     }
    
//     updateUserDisplay();
// }

// function clearSession() {
//     console.log('🧹 Nettoyage de la session');
//     currentToken = null;
//     currentUser = null;
    
//     localStorage.removeItem(CONFIG.TOKEN_KEY);
//     localStorage.removeItem(CONFIG.USER_KEY);
//     localStorage.removeItem(CONFIG.ROLE_KEY);
// }

// // ============================================
// // DÉCONNEXION
// // ============================================
// function handleLogout() {
//     console.log('🚪 Déconnexion...');
//     clearSession();
    
//     // Réinitialiser l'interface
//     const userName = document.getElementById('userName');
//     if (userName) userName.textContent = 'Non connecté';
    
//     const userAvatar = document.getElementById('userAvatar');
//     if (userAvatar) userAvatar.innerHTML = '<i class="fas fa-user"></i>';
    
//     showSuccess(null, 'Déconnexion réussie');
//     setTimeout(() => {
//         window.location.href = 'index.html';
//     }, 500);
// }

// // ============================================
// // NAVIGATION
// // ============================================
// function showSection(sectionId) {
//     if (!currentToken) {
//         window.location.href = 'in.html';
//         return;
//     }
    
//     // Mettre à jour la navigation
//     document.querySelectorAll('.nav-link').forEach(link => {
//         link.classList.remove('active');
//         const linkHref = link.getAttribute('href');
//         if (linkHref === `#${sectionId}`) {
//             link.classList.add('active');
//         }
//     });
    
//     // Afficher la section
//     document.querySelectorAll('.section').forEach(section => {
//         section.classList.remove('active');
//     });
    
//     const targetSection = document.getElementById(sectionId);
//     if (targetSection) {
//         targetSection.classList.add('active');
//     }
    
//     // Charger les données si nécessaire
//     if (sectionId === 'dashboard' && currentToken) {
//         loadDashboard();
//     } else if (sectionId === 'declarations' && currentToken) {
//         loadDeclarations();
//     } else if (sectionId === 'profile' && currentToken) {
//         loadProfile();
//     }
// }

// // ============================================
// // TABLEAU DE BORD
// // ============================================
// // async function loadDashboard() {
// //     if (!currentToken) return;
    
// //     try {
// //         console.log('📊 Chargement du tableau de bord');
        
// //         // Points
// //         const pointsEl = document.getElementById('dashboardPoints');
// //         if (pointsEl) pointsEl.textContent = currentUser?.points || '0';
        
// //         // Charger les déclarations pour les stats
// //         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
// //             headers: { 'Authorization': `Bearer ${currentToken}` }
// //         }).catch(() => null);
        
// //         if (response && response.ok) {
// //             const data = await response.json();
// //             const declarations = data.declarations || data || [];
            
// //             const totalDeclarations = declarations.length;
// //             const completedCollections = declarations.filter(d => d.statut === 'termine').length;
// //             const totalWaste = declarations
// //                 .filter(d => d.statut === 'termine')
// //                 .reduce((sum, d) => sum + (d.poids_estime || 0), 0);
            
// //             const declEl = document.getElementById('dashboardDeclarations');
// //             if (declEl) declEl.textContent = totalDeclarations;
            
// //             const collectionsEl = document.getElementById('dashboardCollections');
// //             if (collectionsEl) collectionsEl.textContent = completedCollections;
            
// //             const wasteEl = document.getElementById('dashboardWaste');
// //             if (wasteEl) wasteEl.textContent = totalWaste.toFixed(2);
            
// //             // Charger l'historique récent
// //             loadRecentHistory(declarations.slice(0, 5));
// //         } else {
// //             // Fallback
// //             const declEl = document.getElementById('dashboardDeclarations');
// //             if (declEl) declEl.textContent = '0';
            
// //             const collectionsEl = document.getElementById('dashboardCollections');
// //             if (collectionsEl) collectionsEl.textContent = '0';
            
// //             const wasteEl = document.getElementById('dashboardWaste');
// //             if (wasteEl) wasteEl.textContent = '0';
// //         }
        
// //     } catch (error) {
// //         console.error('❌ Erreur dashboard:', error);
// //     }
// // }


// async function loadDashboard() {
//     if (!currentToken) return;
    
//     try {
//         console.log('📊 Chargement du tableau de bord');
        
//         // Points
//         const pointsEl = document.getElementById('dashboardPoints');
//         if (pointsEl) pointsEl.textContent = currentUser?.points || '0';
        
//         // Charger les déclarations pour les stats
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         if (response.ok) {
//             const data = await response.json();
//             let declarations = data.declarations || data;
            
//             if (!Array.isArray(declarations)) {
//                 declarations = [];
//             }
            
//             // Normaliser les statuts
//             declarations = declarations.map(d => ({
//                 ...d,
//                 statut: (d.statut || '').toLowerCase().trim()
//             }));
            
//             const totalDeclarations = declarations.length;
            
//             // Compter les collectes terminées avec différents statuts possibles
//             const completedCollections = declarations.filter(d => 
//                 d.statut === 'termine' || 
//                 d.statut === 'terminee' || 
//                 d.statut === 'validee'
//             ).length;
            
//             // Calculer le poids total des déchets validés
//             const totalWaste = declarations
//                 .filter(d => d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee')
//                 .reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0);
            
//             console.log('📊 Stats calculées:', {
//                 total: totalDeclarations,
//                 completed: completedCollections,
//                 poids: totalWaste
//             });
            
//             const declEl = document.getElementById('dashboardDeclarations');
//             if (declEl) declEl.textContent = totalDeclarations;
            
//             const collectionsEl = document.getElementById('dashboardCollections');
//             if (collectionsEl) collectionsEl.textContent = completedCollections;
            
//             const wasteEl = document.getElementById('dashboardWaste');
//             if (wasteEl) wasteEl.textContent = totalWaste.toFixed(2);
            
//             // Charger l'historique récent
//             loadRecentHistory(declarations.slice(0, 5));
//         } else {
//             // Fallback
//             document.getElementById('dashboardDeclarations').textContent = '0';
//             document.getElementById('dashboardCollections').textContent = '0';
//             document.getElementById('dashboardWaste').textContent = '0';
//         }
        
//     } catch (error) {
//         console.error('❌ Erreur dashboard:', error);
//     }
// }

// function loadRecentHistory(declarations) {
//     const container = document.getElementById('recentHistory');
//     if (!container) return;
    
//     if (!declarations || declarations.length === 0) {
//         container.innerHTML = '<p class="empty-message">Aucun historique disponible</p>';
//         return;
//     }
    
//     container.innerHTML = '';
//     declarations.forEach(decl => {
//         const item = document.createElement('div');
//         item.className = 'history-item';
        
//         const date = decl.date_declaration 
//             ? new Date(decl.date_declaration).toLocaleDateString('fr-FR')
//             : 'Date inconnue';
//         const type = formatWasteType(decl.type_dechet);
//         const quantity = `${decl.quantite || 0} ${decl.unite || ''}`;
//         const status = decl.statut || 'inconnu';
        
//         item.innerHTML = `
//             <div style="display: flex; justify-content: space-between;">
//                 <span style="font-weight: 500;">${type}</span>
//                 <span class="badge ${getStatusClass(status)}">${status}</span>
//             </div>
//             <div style="font-size: 0.85rem; color: var(--muted-foreground);">${date} • ${quantity}</div>
//         `;
        
//         container.appendChild(item);
//     });
// }

// // ============================================
// // DÉCLARATIONS
// // ============================================
// function showNewDeclarationForm() {
//     const container = document.getElementById('declarationFormContainer');
//     if (!container) return;
    
//     container.classList.remove('hidden');
//     const declarationsList = document.getElementById('declarationsList');
//     if (declarationsList) declarationsList.style.display = 'none';
    
//     const declarationDetail = document.getElementById('declarationDetail');
//     if (declarationDetail) declarationDetail.classList.add('hidden');
    
//     const declarationForm = document.getElementById('declarationForm');
//     if (declarationForm) declarationForm.reset();
// }

// function hideNewDeclarationForm() {
//     const container = document.getElementById('declarationFormContainer');
//     if (container) container.classList.add('hidden');
    
//     const declarationsList = document.getElementById('declarationsList');
//     if (declarationsList) declarationsList.style.display = 'block';
// }

// async function handleNewDeclaration(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('declarationMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const declarationData = {
//         typeDechet: document.getElementById('declarationType')?.value,
//         quantite: parseFloat(document.getElementById('declarationQuantity')?.value),
//         unite: document.getElementById('declarationUnit')?.value,
//         modeCollecte: document.getElementById('declarationMode')?.value,
//         dateSouhaitee: document.getElementById('declarationDate')?.value || null,
//         creneauHoraire: document.getElementById('declarationTime')?.value || null,
//         notes: document.getElementById('declarationNotes')?.value || null
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
//         }).catch(err => {
//             throw new Error('Erreur réseau: ' + err.message);
//         });
        
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({ message: 'Erreur lors de la création' }));
//             throw new Error(errorData.message || 'Erreur lors de la création');
//         }
        
//         const data = await response.json();
        
//         showSuccess(messageDiv, 'Déclaration créée avec succès!');
//         hideNewDeclarationForm();
//         loadDeclarations();
//         loadDashboard();
        
//     } catch (error) {
//         console.error('❌ Erreur création déclaration:', error);
//         showError(messageDiv, error.message);
//     }
// }


// // async function loadDeclarations() {
// //     if (!currentToken) return;
    
// //     const filter = document.getElementById('declarationFilter')?.value || 'all';
// //     const container = document.getElementById('declarationsList');
// //     if (!container) return;
    
// //     try {
// //         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
// //             headers: { 'Authorization': `Bearer ${currentToken}` }
// //         }).catch(() => null);
        
// //         if (!response || !response.ok) {
// //             container.innerHTML = '<p class="empty-message">Erreur de chargement des déclarations</p>';
// //             return;
// //         }
        
// //         const data = await response.json();
// //         let declarations = data.declarations || data || [];
        
// //         // Filtrer si nécessaire
// //         if (filter !== 'all') {
// //             declarations = declarations.filter(d => d.statut === filter);
// //         }
        
// //         // Afficher les déclarations
// //         if (declarations.length === 0) {
// //             container.innerHTML = '<p class="empty-message">Aucune déclaration trouvée</p>';
// //             return;
// //         }
        
// //         container.innerHTML = '';
// //         declarations.forEach(declaration => {
// //             const element = createDeclarationElement(declaration);
// //             if (element) container.appendChild(element);
// //         });
        
// //     } catch (error) {
// //         console.error('❌ Erreur déclarations:', error);
// //         container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
// //     }
// // }

// async function loadDeclarations() {
//     if (!currentToken) return;
    
//     const filter = document.getElementById('declarationFilter')?.value || 'all';
//     const container = document.getElementById('declarationsList');
//     if (!container) return;
    
//     // Afficher un indicateur de chargement
//     container.innerHTML = '<p class="empty-message"><i class="fas fa-spinner fa-spin"></i> Chargement...</p>';
    
//     try {
//         console.log('📥 Chargement des déclarations...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         if (!response.ok) {
//             throw new Error(`Erreur HTTP: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('📦 Données reçues:', data);
        
//         // Normaliser les données (peuvent être dans data.declarations ou directement data)
//         let declarations = data.declarations || data;
        
//         // S'assurer que c'est un tableau
//         if (!Array.isArray(declarations)) {
//             console.warn('⚠️ Les données ne sont pas un tableau:', declarations);
//             declarations = [];
//         }
        
//         // Afficher les statuts pour debug
//         declarations.forEach(d => {
//             console.log(`Déclaration ${d.id}: statut="${d.statut}"`);
//         });
        
//         // Filtrer si nécessaire
//         if (filter !== 'all') {
//             declarations = declarations.filter(d => d.statut === filter);
//         }
        
//         // Afficher les déclarations
//         if (declarations.length === 0) {
//             container.innerHTML = '<p class="empty-message">Aucune déclaration trouvée</p>';
//             return;
//         }
        
//         container.innerHTML = '';
//         declarations.forEach(declaration => {
//             const element = createDeclarationElement(declaration);
//             if (element) container.appendChild(element);
//         });
        
//     } catch (error) {
//         console.error('❌ Erreur déclarations:', error);
//         container.innerHTML = `<p class="empty-message error">Erreur de chargement: ${error.message}</p>`;
//     }
// } 


// // function createDeclarationElement(declaration) {
// //     const template = document.getElementById('declarationTemplate');
// //     if (!template) return null;
    
// //     const clone = template.content.cloneNode(true);
// //     const element = clone.querySelector('.declaration-item');
// //     if (!element) return null;
    
// //     element.dataset.id = declaration.id;
    
// //     const statusMap = {
// //         'en_attente': { text: 'En attente', class: 'badge-warning' },
// //         'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
// //         'programme': { text: 'Programmée', class: 'badge-info' },
// //         'termine': { text: 'Terminée', class: 'badge-success' },
// //         'annule': { text: 'Annulée', class: 'badge-danger' }
// //     };
    
// //     const status = statusMap[declaration.statut] || { text: declaration.statut, class: 'badge-info' };
    
// //     const idEl = element.querySelector('.declaration-id');
// //     if (idEl) idEl.textContent = `#${declaration.id?.substring(0, 8) || '???'}`;
    
// //     const dateEl = element.querySelector('.declaration-date');
// //     if (dateEl) dateEl.textContent = declaration.date_declaration 
// //         ? new Date(declaration.date_declaration).toLocaleDateString('fr-FR')
// //         : 'Date inconnue';
    
// //     const statusEl = element.querySelector('.declaration-status');
// //     if (statusEl) {
// //         statusEl.textContent = status.text;
// //         statusEl.className = `badge ${status.class}`;
// //     }
    
// //     const typeEl = element.querySelector('.declaration-type');
// //     if (typeEl) typeEl.textContent = formatWasteType(declaration.type_dechet);
    
// //     const quantityEl = element.querySelector('.declaration-quantity');
// //     if (quantityEl) quantityEl.textContent = `${declaration.quantite || 0} ${declaration.unite || ''}`;
    
// //     const modeEl = element.querySelector('.declaration-mode');
// //     if (modeEl) modeEl.textContent = formatCollectionMode(declaration.mode_collecte);
    
// //     // === AJOUT DE L'ÉVÉNEMENT DE SUIVI ===
// //     const viewDetailBtn = element.querySelector('.view-detail-btn');
// //     if (viewDetailBtn) {
// //         viewDetailBtn.addEventListener('click', function() {
// //             const declarationId = element.dataset.id;
// //             showDeclarationDetail(declarationId);
// //         });
// //     }
    
// //     return element;
// // }






// function createDeclarationElement(declaration) {
//     const template = document.getElementById('declarationTemplate');
//     if (!template) {
//         console.error('❌ Template declarationTemplate non trouvé');
//         return null;
//     }
    
//     const clone = template.content.cloneNode(true);
//     const element = clone.querySelector('.declaration-item');
//     if (!element) return null;
    
//     // Stocker l'ID dans l'élément
//     element.dataset.id = declaration.id;
//     element.dataset.statut = declaration.statut || 'inconnu';
    
//     // Normaliser le statut (gérer les différents formats possibles)
//     let statut = declaration.statut || 'en_attente';
//     statut = statut.toLowerCase().trim();
    
//     // Mapping des statuts pour l'affichage
//     const statusMap = {
//         'en_attente': { text: 'En attente', class: 'badge-warning' },
//         'en_attente_affectation': { text: 'En attente', class: 'badge-warning' },
//         'en_attente_collecte': { text: 'En attente', class: 'badge-warning' },
//         'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
//         'affectee': { text: 'Collecteur affecté', class: 'badge-info' },
//         'collecteur_affecte': { text: 'Collecteur affecté', class: 'badge-info' },
//         'programme': { text: 'Programmée', class: 'badge-info' },
//         'programmee': { text: 'Programmée', class: 'badge-info' },
//         'en_cours': { text: 'En cours', class: 'badge-info' },
//         'termine': { text: 'Terminée', class: 'badge-success' },
//         'terminee': { text: 'Terminée', class: 'badge-success' },
//         'validee': { text: 'Validée', class: 'badge-success' },
//         'annule': { text: 'Annulée', class: 'badge-danger' },
//         'annulee': { text: 'Annulée', class: 'badge-danger' }
//     };
    
//     const status = statusMap[statut] || { text: statut, class: 'badge-info' };
    
//     // Remplir les informations
//     const idEl = element.querySelector('.declaration-id');
//     if (idEl) idEl.textContent = `#${declaration.id?.substring(0, 8) || '???'}`;
    
//     const dateEl = element.querySelector('.declaration-date');
//     if (dateEl) {
//         dateEl.textContent = declaration.date_declaration 
//             ? new Date(declaration.date_declaration).toLocaleDateString('fr-FR', {
//                 day: '2-digit',
//                 month: '2-digit',
//                 year: 'numeric'
//               })
//             : 'Date inconnue';
//     }
    
//     const statusEl = element.querySelector('.declaration-status');
//     if (statusEl) {
//         statusEl.textContent = status.text;
//         statusEl.className = `badge ${status.class}`;
//     }
    
//     const typeEl = element.querySelector('.declaration-type');
//     if (typeEl) typeEl.textContent = formatWasteType(declaration.type_dechet);
    
//     const quantityEl = element.querySelector('.declaration-quantity');
//     if (quantityEl) {
//         quantityEl.textContent = `${declaration.quantite || 0} ${declaration.unite || ''}`;
//     }
    
//     const modeEl = element.querySelector('.declaration-mode');
//     if (modeEl) modeEl.textContent = formatCollectionMode(declaration.mode_collecte);
    
//     // Ajouter l'événement de suivi
//     const viewDetailBtn = element.querySelector('.view-detail-btn');
//     if (viewDetailBtn) {
//         viewDetailBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             const declarationId = element.dataset.id;
//             showDeclarationDetail(declarationId);
//         });
//     }
    
//     return element;
// }

// // ============================================
// // FONCTIONS DE SUIVI DES DÉCLARATIONS (RESTAURÉES)
// // ============================================

// async function showDeclarationDetail(declarationId) {
//     if (!currentToken) return;
    
//     console.log('🔍 Affichage du détail de la déclaration:', declarationId);
    
//     const container = document.getElementById('declarationDetail');
//     const content = document.getElementById('detailContent');
    
//     if (!container || !content) {
//         console.error('❌ Éléments declarationDetail ou detailContent non trouvés');
//         return;
//     }
    
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/api/declarations/${declarationId}/suivre`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         });
        
//         if (!response.ok) {
//             throw new Error('Erreur de chargement du détail');
//         }
        
//         const data = await response.json();
        
//         content.innerHTML = createDetailHTML(data.declaration || data);
        
//         // Cacher la liste des déclarations et afficher le détail
//         const declarationsList = document.getElementById('declarationsList');
//         if (declarationsList) declarationsList.style.display = 'none';
        
//         container.classList.remove('hidden');
        
//     } catch (error) {
//         console.error('❌ Erreur lors du chargement du détail:', error);
//         content.innerHTML = '<p class="error">Erreur de chargement du détail</p>';
//     }
// }

// function hideDeclarationDetail() {
//     const container = document.getElementById('declarationDetail');
//     if (container) container.classList.add('hidden');
    
//     const declarationsList = document.getElementById('declarationsList');
//     if (declarationsList) declarationsList.style.display = 'block';
// }

// function createDetailHTML(declaration) {
//     const statusMap = {
//         'en_attente': { text: 'En attente d\'affectation', color: '#ff9800' },
//         'affecte': { text: 'Collecteur affecté', color: '#2196f3' },
//         'programme': { text: 'Collecte programmée', color: '#2196f3' },
//         'termine': { text: 'Collecte terminée', color: '#4caf50' },
//         'annule': { text: 'Annulée', color: '#f44336' }
//     };
    
//     const status = statusMap[declaration.statut] || { text: declaration.statut, color: '#666' };
    
//     return `
//         <div style="border-left: 4px solid ${status.color}; padding-left: 1rem;">
//             <h4 style="margin-bottom: 1rem;">Déclaration #${declaration.id?.substring(0, 8) || '???'}</h4>
            
//             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
//                 <div><strong>Type:</strong> ${formatWasteType(declaration.type_dechet)}</div>
//                 <div><strong>Quantité:</strong> ${declaration.quantite || 0} ${declaration.unite || ''}</div>
//                 <div><strong>Mode:</strong> ${formatCollectionMode(declaration.mode_collecte)}</div>
//                 <div><strong>Date:</strong> ${declaration.date_declaration ? new Date(declaration.date_declaration).toLocaleDateString('fr-FR') : 'N/A'}</div>
//             </div>
            
//             <div style="background: var(--muted); padding: 1rem; border-radius: var(--radius);">
//                 <strong>Statut actuel:</strong> ${status.text}
//             </div>
            
//             <button class="btn btn-secondary" style="margin-top: 1rem; width: auto;" onclick="hideDeclarationDetail()">
//                 <i class="fas fa-arrow-left"></i> Retour à la liste
//             </button>
//         </div>
//     `;
// }

// // ============================================
// // PROFIL
// // ============================================
// function loadProfile() {
//     console.log('👤 Chargement du profil');
    
//     if (!currentUser) return;
    
//     const fields = {
//         'profileName': currentUser.nomComplet,
//         'profileEmail': currentUser.email,
//         'profilePhone': currentUser.telephone,
//         'profileType': formatProducerType(currentUser.typeProducteur),
//         'profileAddress': currentUser.adresse,
//         'profileLocation': [currentUser.quartier, currentUser.commune].filter(Boolean).join(', '),
//         'profileSince': currentUser.cree_le ? new Date(currentUser.cree_le).toLocaleDateString('fr-FR') : '-'
//     };
    
//     Object.entries(fields).forEach(([id, value]) => {
//         const el = document.getElementById(id);
//         if (el) el.textContent = value || '-';
//     });
    
//     // Remplir les formulaires de modification
//     const updateFields = {
//         'updateFullName': currentUser.nomComplet,
//         'updatePhone': currentUser.telephone,
//         'updateAddress': currentUser.adresse,
//         'updateNeighborhood': currentUser.quartier,
//         'updateMunicipality': currentUser.commune
//     };
    
//     Object.entries(updateFields).forEach(([id, value]) => {
//         const el = document.getElementById(id);
//         if (el) el.value = value || '';
//     });
    
//     // Afficher le token
//     const tokenElement = document.getElementById('currentToken');
//     if (tokenElement && currentToken) {
//         tokenElement.textContent = currentToken.length > 50 ? 
//             currentToken.substring(0, 50) + '...' : 
//             currentToken;
//     }
// }

// async function handleUpdateProfile(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('updateProfileMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const updateData = {
//         nomComplet: document.getElementById('updateFullName')?.value.trim(),
//         telephone: document.getElementById('updatePhone')?.value.trim(),
//         adresse: document.getElementById('updateAddress')?.value.trim(),
//         quartier: document.getElementById('updateNeighborhood')?.value.trim(),
//         commune: document.getElementById('updateMunicipality')?.value.trim()
//     };
    
//     const messageDiv = document.getElementById('updateProfileMessage');
    
//     if (!updateData.nomComplet) {
//         showError(messageDiv, 'Le nom complet est obligatoire');
//         return;
//     }
    
//     if (!updateData.telephone || !/^[0-9]{10,15}$/.test(updateData.telephone)) {
//         showError(messageDiv, 'Numéro de téléphone invalide');
//         return;
//     }
    
//     try {
//         showLoading(messageDiv, 'Mise à jour en cours...');
        
//         // Simuler la mise à jour pour l'instant
//         setTimeout(() => {
//             Object.assign(currentUser, updateData);
//             localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(currentUser));
//             showSuccess(messageDiv, 'Profil mis à jour avec succès!');
//             loadProfile();
//         }, 1000);
        
//     } catch (error) {
//         console.error('❌ Erreur mise à jour profil:', error);
//         showError(messageDiv, error.message);
//     }
// }

// async function handleChangePassword(e) {
//     e.preventDefault();
    
//     if (!currentToken) {
//         showError(document.getElementById('changePasswordMessage'), 'Vous devez être connecté');
//         return;
//     }
    
//     const currentPassword = document.getElementById('currentPassword')?.value;
//     const newPassword = document.getElementById('newPassword')?.value;
//     const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;
    
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
        
//         // Simuler le changement pour l'instant
//         setTimeout(() => {
//             showSuccess(messageDiv, 'Mot de passe changé avec succès!');
//             const form = document.getElementById('changePasswordForm');
//             if (form) form.reset();
//         }, 1000);
        
//     } catch (error) {
//         console.error('❌ Erreur changement mot de passe:', error);
//         showError(messageDiv, error.message);
//     }
// }

// async function loadNotifications() {
//     console.log('🔔 Chargement des notifications');
    
//     const container = document.getElementById('recentNotifications');
//     if (!container) return;
    
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/api/notifications`, {
//             headers: { 'Authorization': `Bearer ${currentToken}` }
//         }).catch(() => null);
        
//         if (!response || !response.ok) {
//             container.innerHTML = '<p class="empty-message">Aucune notification</p>';
//             return;
//         }
        
//         const data = await response.json();
        
//         if (!data.notifications || data.notifications.length === 0) {
//             container.innerHTML = '<p class="empty-message">Aucune notification</p>';
//             return;
//         }
        
//         container.innerHTML = data.notifications.slice(0, 5).map(notif => `
//             <div class="notification-item">
//                 <strong>${notif.titre || 'Notification'}</strong>
//                 <p>${notif.message || ''}</p>
//                 <small>${notif.cree_le ? new Date(notif.cree_le).toLocaleString() : ''}</small>
//             </div>
//         `).join('');
        
//     } catch (error) {
//         console.error('❌ Erreur notifications:', error);
//         container.innerHTML = '<p class="empty-message">Erreur de chargement</p>';
//     }
// }

// // ============================================
// // UTILITAIRES
// // ============================================
// function togglePassword(inputId, btn) {
//     const inp = document.getElementById(inputId);
//     if (!inp) return;
    
//     inp.type = inp.type === 'password' ? 'text' : 'password';
//     btn.innerHTML = inp.type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
// }

// function showLoading(element, message) {
//     if (!element) return;
//     element.className = 'message info';
//     element.textContent = message;
//     element.style.display = 'block';
// }

// function showSuccess(element, message) {
//     if (!element) {
//         const tempDiv = document.createElement('div');
//         tempDiv.className = 'message success';
//         tempDiv.textContent = message;
//         tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 1rem; border-radius: 0.5rem;';
//         document.body.appendChild(tempDiv);
//         setTimeout(() => tempDiv.remove(), 3000);
//         return;
//     }
    
//     element.className = 'message success';
//     element.textContent = message;
//     element.style.display = 'block';
//     setTimeout(() => element.style.display = 'none', 3000);
// }

// function showError(element, message) {
//     if (!element) {
//         const tempDiv = document.createElement('div');
//         tempDiv.className = 'message error';
//         tempDiv.textContent = message;
//         tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 1rem; border-radius: 0.5rem;';
//         document.body.appendChild(tempDiv);
//         setTimeout(() => tempDiv.remove(), 5000);
//         return;
//     }
    
//     element.className = 'message error';
//     element.textContent = message;
//     element.style.display = 'block';
//     setTimeout(() => element.style.display = 'none', 5000);
// }

// function copyToken() {
//     if (!currentToken) {
//         showError(null, 'Aucun token disponible');
//         return;
//     }
    
//     navigator.clipboard.writeText(currentToken)
//         .then(() => showSuccess(null, 'Token copié dans le presse-papier!'))
//         .catch(() => showError(null, 'Erreur lors de la copie'));
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
//     return types[type] || type || 'Non spécifié';
// }

// function formatCollectionMode(mode) {
//     const modes = {
//         'collecte_domicile': 'À domicile',
//         'depot_volontaire': 'Dépôt volontaire'
//     };
//     return modes[mode] || mode || 'Non spécifié';
// }

// function formatProducerType(type) {
//     const types = {
//         'menage': 'Ménage',
//         'commerce': 'Commerce',
//         'entreprise': 'Entreprise',
//         'administration': 'Administration'
//     };
//     return types[type] || type || 'Non spécifié';
// }

// function getStatusClass(status) {
//     const classes = {
//         'en_attente': 'badge-warning',
//         'affecte': 'badge-info',
//         'programme': 'badge-info',
//         'termine': 'badge-success',
//         'annule': 'badge-danger'
//     };
//     return classes[status] || 'badge-info';
// }

// // ============================================
// // CONFIGURATION API
// // ============================================
// function showApiUrlModal() {
//     const modal = document.getElementById('apiUrlModal');
//     if (modal) modal.classList.remove('hidden');
// }

// function hideApiUrlModal() {
//     const modal = document.getElementById('apiUrlModal');
//     if (modal) modal.classList.add('hidden');
// }

// function saveApiUrl() {
//     const input = document.getElementById('apiUrlInput');
//     if (!input) return;
    
//     const newUrl = input.value.trim();
    
//     if (!newUrl) {
//         showError(null, 'L\'URL ne peut pas être vide');
//         return;
//     }
    
//     CONFIG.API_URL = newUrl;
//     localStorage.setItem('api_url', newUrl);
    
//     const apiUrlEl = document.getElementById('apiUrl');
//     if (apiUrlEl) apiUrlEl.textContent = newUrl;
    
//     hideApiUrlModal();
//     showSuccess(null, 'URL de l\'API mise à jour avec succès');
// }

// // ============================================
// // POINTS DE DÉPÔT
// // ============================================
// async function loadDepotPoints() {
//     if (!currentToken) {
//         showError(document.getElementById('depotPointsList'), 'Vous devez être connecté');
//         return;
//     }
    
//     const container = document.getElementById('depotPointsList');
//     if (!container) return;
    
//     try {
//         const latitude = currentUser?.latitude || 48.8566;
//         const longitude = currentUser?.longitude || 2.3522;
        
//         const response = await fetch(
//             `${CONFIG.API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=5`,
//             { headers: { 'Authorization': `Bearer ${currentToken}` } }
//         ).catch(() => null);
        
//         if (!response || !response.ok) {
//             container.innerHTML = '<p class="empty-message">Erreur de chargement des points de dépôt</p>';
//             return;
//         }
        
//         const data = await response.json();
//         const points = data.points || data || [];
        
//         if (points.length === 0) {
//             container.innerHTML = '<p class="empty-message">Aucun point de dépôt trouvé à proximité</p>';
//             return;
//         }
        
//         container.innerHTML = '';
//         points.forEach(point => {
//             const element = document.createElement('div');
//             element.className = 'depot-point-item';
            
//             const distance = point.distance_metres 
//                 ? `${(point.distance_metres / 1000).toFixed(2)} km`
//                 : 'Distance inconnue';
            
//             element.innerHTML = `
//                 <h4>${point.nom || 'Point de dépôt'}</h4>
//                 <p><i class="fas fa-map-marker-alt"></i> ${point.adresse || 'Adresse non disponible'}</p>
//                 <p><i class="fas fa-trash"></i> ${point.types_dechets_acceptes?.join(', ') || 'Tous types'}</p>
//                 <p><i class="fas fa-clock"></i> ${point.horaires_ouverture ? 'Horaires disponibles' : 'Horaires non spécifiés'}</p>
//                 <p><i class="fas fa-ruler"></i> ${distance}</p>
//             `;
            
//             container.appendChild(element);
//         });
        
//     } catch (error) {
//         console.error('❌ Erreur points de dépôt:', error);
//         container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
//     }
// }

// // Exposer les fonctions globalement
// window.showSection = showSection;
// window.togglePassword = togglePassword;
// window.copyToken = copyToken;
// window.loadDeclarations = loadDeclarations;
// window.showNewDeclarationForm = showNewDeclarationForm;
// window.hideNewDeclarationForm = hideNewDeclarationForm;
// window.handleNewDeclaration = handleNewDeclaration;
// window.showDeclarationDetail = showDeclarationDetail;
// window.hideDeclarationDetail = hideDeclarationDetail;
// window.handleUpdateProfile = handleUpdateProfile;
// window.handleChangePassword = handleChangePassword;
// window.handleLogout = handleLogout;
// window.loadDepotPoints = loadDepotPoints;
// window.showApiUrlModal = showApiUrlModal;
// window.hideApiUrlModal = hideApiUrlModal;
// window.saveApiUrl = saveApiUrl;



// producteur.js - Version complète et corrigée

const CONFIG = {
    API_URL: 'https://ecobackend-three.vercel.app',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    ROLE_KEY: 'ecocollect_role'
};

console.log('🚀 producteur.js chargé');
console.log('📡 API URL utilisée:', CONFIG.API_URL);

// État de l'application
let currentUser = null;
let currentToken = null;
let refreshInterval = null;

// ============================================
// INITIALISATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation de producteur.js');
    
    // Récupérer les données de session
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const userJson = localStorage.getItem(CONFIG.USER_KEY);
    const role = localStorage.getItem(CONFIG.ROLE_KEY);
    
    console.log('🔍 Token présent:', !!token);
    console.log('🔍 User présent:', !!userJson);
    console.log('🔍 Rôle:', role);
    
    // Vérifier que tout est présent et que c'est bien un producteur
    if (!token || !userJson || role !== 'producteur') {
        console.log('❌ Session invalide ou mauvais rôle');
        window.location.href = 'in.html';
        return;
    }
    
    try {
        currentToken = token;
        currentUser = JSON.parse(userJson);
        
        console.log('✅ Utilisateur connecté:', currentUser);
        
        // Mettre à jour l'affichage utilisateur
        updateUserDisplay();
        
        // Afficher le tableau de bord
        showSection('dashboard');
        
        // Charger les données
        await Promise.all([
            loadDashboard(),
            loadDeclarations(),
            loadProfile(),
            loadNotifications()
        ]);
        
        // Initialiser les écouteurs
        initEventListeners();
        
        // Démarrer l'auto-raffraîchissement
        startAutoRefresh();
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        clearSession();
        window.location.href = 'in.html';
    }
});

function initEventListeners() {
    console.log('✅ Écouteurs initialisés');
}

function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    
    refreshInterval = setInterval(() => {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            if (activeSection.id === 'dashboard') {
                loadDashboard();
            } else if (activeSection.id === 'declarations') {
                loadDeclarations();
            }
        }
    }, 30000); // 30 secondes
}

// ============================================
// GESTION DE SESSION
// ============================================

function updateUserDisplay() {
    console.log('🔄 Mise à jour affichage utilisateur');
    
    if (!currentUser) return;
    
    // Mettre à jour le badge utilisateur
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = currentUser.nomComplet || currentUser.email || 'Producteur';
    }
    
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        const initiales = (currentUser.nomComplet || 'P')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        userAvatar.innerHTML = initiales || '<i class="fas fa-user"></i>';
    }
    
    // Afficher les liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        if (!link.classList.contains('logout')) {
            link.classList.remove('hidden');
        }
    });
}

function saveAuthData(token, user) {
    currentToken = token;
    currentUser = user;
    
    try {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        localStorage.setItem(CONFIG.ROLE_KEY, 'producteur');
        console.log('✅ Données sauvegardées pour', user?.nomComplet);
    } catch (error) {
        console.error('❌ Erreur sauvegarde localStorage:', error);
    }
    
    updateUserDisplay();
}

function clearSession() {
    console.log('🧹 Nettoyage de la session');
    
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    
    currentToken = null;
    currentUser = null;
    
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
}

// ============================================
// DÉCONNEXION
// ============================================
function handleLogout() {
    console.log('🚪 Déconnexion...');
    clearSession();
    
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = 'Non connecté';
    
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) userAvatar.innerHTML = '<i class="fas fa-user"></i>';
    
    showSuccess(null, 'Déconnexion réussie');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ============================================
// NAVIGATION
// ============================================
function showSection(sectionId) {
    if (!currentToken) {
        window.location.href = 'in.html';
        return;
    }
    
    // Mettre à jour la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Afficher la section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
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
        console.log('📊 Chargement du tableau de bord');
        
        // Points
        const pointsEl = document.getElementById('dashboardPoints');
        if (pointsEl) pointsEl.textContent = currentUser?.points || '0';
        
        // Charger les déclarations pour les stats
        const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            let declarations = data.declarations || data;
            
            if (!Array.isArray(declarations)) {
                declarations = [];
            }
            
            // Normaliser les statuts
            declarations = declarations.map(d => ({
                ...d,
                statut: (d.statut || '').toLowerCase().trim()
            }));
            
            const totalDeclarations = declarations.length;
            
            // Compter les collectes terminées
            const completedCollections = declarations.filter(d => 
                d.statut === 'termine' || 
                d.statut === 'terminee' || 
                d.statut === 'validee'
            ).length;
            
            // Calculer le poids total des déchets validés
            const totalWaste = declarations
                .filter(d => d.statut === 'termine' || d.statut === 'terminee' || d.statut === 'validee')
                .reduce((sum, d) => sum + (parseFloat(d.quantite) || 0), 0);
            
            console.log('📊 Stats calculées:', {
                total: totalDeclarations,
                completed: completedCollections,
                poids: totalWaste
            });
            
            const declEl = document.getElementById('dashboardDeclarations');
            if (declEl) declEl.textContent = totalDeclarations;
            
            const collectionsEl = document.getElementById('dashboardCollections');
            if (collectionsEl) collectionsEl.textContent = completedCollections;
            
            const wasteEl = document.getElementById('dashboardWaste');
            if (wasteEl) wasteEl.textContent = totalWaste.toFixed(2);
            
            // Charger l'historique récent
            loadRecentHistory(declarations.slice(0, 5));
        } else {
            // Fallback
            document.getElementById('dashboardDeclarations').textContent = '0';
            document.getElementById('dashboardCollections').textContent = '0';
            document.getElementById('dashboardWaste').textContent = '0';
        }
        
    } catch (error) {
        console.error('❌ Erreur dashboard:', error);
    }
}

function loadRecentHistory(declarations) {
    const container = document.getElementById('recentHistory');
    if (!container) return;
    
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
                <span class="badge ${getStatusClass(status)}">${getStatusText(status)}</span>
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
    const container = document.getElementById('declarationFormContainer');
    if (!container) return;
    
    container.classList.remove('hidden');
    const declarationsList = document.getElementById('declarationsList');
    if (declarationsList) declarationsList.style.display = 'none';
    
    const declarationDetail = document.getElementById('declarationDetail');
    if (declarationDetail) declarationDetail.classList.add('hidden');
    
    const declarationForm = document.getElementById('declarationForm');
    if (declarationForm) declarationForm.reset();
}

function hideNewDeclarationForm() {
    const container = document.getElementById('declarationFormContainer');
    if (container) container.classList.add('hidden');
    
    const declarationsList = document.getElementById('declarationsList');
    if (declarationsList) declarationsList.style.display = 'block';
}

async function handleNewDeclaration(e) {
    e.preventDefault();
    
    if (!currentToken) {
        showError(document.getElementById('declarationMessage'), 'Vous devez être connecté');
        return;
    }
    
    const declarationData = {
        typeDechet: document.getElementById('declarationType')?.value,
        quantite: parseFloat(document.getElementById('declarationQuantity')?.value),
        unite: document.getElementById('declarationUnit')?.value,
        modeCollecte: document.getElementById('declarationMode')?.value,
        dateSouhaitee: document.getElementById('declarationDate')?.value || null,
        creneauHoraire: document.getElementById('declarationTime')?.value || null,
        notes: document.getElementById('declarationNotes')?.value || null
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
        console.error('❌ Erreur création déclaration:', error);
        showError(messageDiv, error.message);
    }
}

async function loadDeclarations() {
    if (!currentToken) return;
    
    const filter = document.getElementById('declarationFilter')?.value || 'all';
    const container = document.getElementById('declarationsList');
    if (!container) return;
    
    // Afficher un indicateur de chargement
    container.innerHTML = '<p class="empty-message"><i class="fas fa-spinner fa-spin"></i> Chargement...</p>';
    
    try {
        console.log('📥 Chargement des déclarations...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/declarations`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        
        // Normaliser les données
        let declarations = data.declarations || data;
        
        // S'assurer que c'est un tableau
        if (!Array.isArray(declarations)) {
            console.warn('⚠️ Les données ne sont pas un tableau:', declarations);
            declarations = [];
        }
        
        // Normaliser les statuts
        declarations = declarations.map(d => ({
            ...d,
            statut: (d.statut || 'en_attente').toLowerCase().trim()
        }));
        
        // Afficher les statuts pour debug
        declarations.forEach(d => {
            console.log(`Déclaration ${d.id?.substring(0,8)}: statut="${d.statut}"`);
        });
        
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
            if (element) container.appendChild(element);
        });
        
    } catch (error) {
        console.error('❌ Erreur déclarations:', error);
        container.innerHTML = `<p class="empty-message error">Erreur de chargement: ${error.message}</p>`;
    }
}

function createDeclarationElement(declaration) {
    const template = document.getElementById('declarationTemplate');
    if (!template) {
        console.error('❌ Template declarationTemplate non trouvé');
        return null;
    }
    
    const clone = template.content.cloneNode(true);
    const element = clone.querySelector('.declaration-item');
    if (!element) return null;
    
    // Stocker l'ID dans l'élément
    element.dataset.id = declaration.id;
    element.dataset.statut = declaration.statut || 'inconnu';
    
    // Mapping complet des statuts
    const statusMap = {
        'en_attente': { text: 'En attente', class: 'badge-warning' },
        'en_attente_affectation': { text: 'En attente', class: 'badge-warning' },
        'en_attente_collecte': { text: 'En attente', class: 'badge-warning' },
        'affecte': { text: 'Collecteur affecté', class: 'badge-info' },
        'affectee': { text: 'Collecteur affecté', class: 'badge-info' },
        'collecteur_affecte': { text: 'Collecteur affecté', class: 'badge-info' },
        'programme': { text: 'Programmée', class: 'badge-info' },
        'programmee': { text: 'Programmée', class: 'badge-info' },
        'en_cours': { text: 'En cours', class: 'badge-info' },
        'termine': { text: 'Terminée', class: 'badge-success' },
        'terminee': { text: 'Terminée', class: 'badge-success' },
        'validee': { text: 'Validée', class: 'badge-success' },
        'annule': { text: 'Annulée', class: 'badge-danger' },
        'annulee': { text: 'Annulée', class: 'badge-danger' }
    };
    
    const status = statusMap[declaration.statut] || { text: declaration.statut, class: 'badge-info' };
    
    // Remplir les informations
    const idEl = element.querySelector('.declaration-id');
    if (idEl) idEl.textContent = `#${declaration.id?.substring(0, 8) || '???'}`;
    
    const dateEl = element.querySelector('.declaration-date');
    if (dateEl) {
        dateEl.textContent = declaration.date_declaration 
            ? new Date(declaration.date_declaration).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            : 'Date inconnue';
    }
    
    const statusEl = element.querySelector('.declaration-status');
    if (statusEl) {
        statusEl.textContent = status.text;
        statusEl.className = `badge ${status.class}`;
    }
    
    const typeEl = element.querySelector('.declaration-type');
    if (typeEl) typeEl.textContent = formatWasteType(declaration.type_dechet);
    
    const quantityEl = element.querySelector('.declaration-quantity');
    if (quantityEl) {
        quantityEl.textContent = `${declaration.quantite || 0} ${declaration.unite || ''}`;
    }
    
    const modeEl = element.querySelector('.declaration-mode');
    if (modeEl) modeEl.textContent = formatCollectionMode(declaration.mode_collecte);
    
    // Ajouter l'événement de suivi
    const viewDetailBtn = element.querySelector('.view-detail-btn');
    if (viewDetailBtn) {
        viewDetailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const declarationId = element.dataset.id;
            showDeclarationDetail(declarationId);
        });
    }
    
    return element;
}

// ============================================
// SUIVI DES DÉCLARATIONS
// ============================================
async function showDeclarationDetail(declarationId) {
    if (!currentToken) {
        showError(null, 'Vous devez être connecté');
        return;
    }
    
    console.log('🔍 Affichage du détail de la déclaration:', declarationId);
    
    const container = document.getElementById('declarationDetail');
    const content = document.getElementById('detailContent');
    
    if (!container || !content) {
        console.error('❌ Éléments declarationDetail ou detailContent non trouvés');
        return;
    }
    
    // Afficher le chargement
    content.innerHTML = '<p class="empty-message"><i class="fas fa-spinner fa-spin"></i> Chargement du suivi...</p>';
    container.classList.remove('hidden');
    
    // Cacher la liste des déclarations
    const declarationsList = document.getElementById('declarationsList');
    if (declarationsList) declarationsList.style.display = 'none';
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/declarations/${declarationId}/suivre`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Détail reçu:', data);
        
        const declaration = data.declaration || data;
        content.innerHTML = createDetailHTML(declaration);
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement du détail:', error);
        content.innerHTML = `
            <p class="error">Erreur de chargement du détail: ${error.message}</p>
            <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="hideDeclarationDetail()">
                <i class="fas fa-arrow-left"></i> Retour
            </button>
        `;
    }
}

function hideDeclarationDetail() {
    const container = document.getElementById('declarationDetail');
    if (container) container.classList.add('hidden');
    
    const declarationsList = document.getElementById('declarationsList');
    if (declarationsList) declarationsList.style.display = 'block';
}

function createDetailHTML(declaration) {
    // Mapping des statuts avec couleurs
    const statusMap = {
        'en_attente': { text: 'En attente d\'affectation', color: '#ff9800', icon: '⏳' },
        'en_attente_affectation': { text: 'En attente d\'affectation', color: '#ff9800', icon: '⏳' },
        'affecte': { text: 'Collecteur affecté', color: '#2196f3', icon: '👤' },
        'affectee': { text: 'Collecteur affecté', color: '#2196f3', icon: '👤' },
        'collecteur_affecte': { text: 'Collecteur affecté', color: '#2196f3', icon: '👤' },
        'programme': { text: 'Collecte programmée', color: '#2196f3', icon: '📅' },
        'programmee': { text: 'Collecte programmée', color: '#2196f3', icon: '📅' },
        'en_cours': { text: 'Collecte en cours', color: '#9c27b0', icon: '🚛' },
        'termine': { text: 'Collecte terminée', color: '#4caf50', icon: '✅' },
        'terminee': { text: 'Collecte terminée', color: '#4caf50', icon: '✅' },
        'validee': { text: 'Validée', color: '#4caf50', icon: '✓' },
        'annule': { text: 'Annulée', color: '#f44336', icon: '✗' },
        'annulee': { text: 'Annulée', color: '#f44336', icon: '✗' }
    };
    
    const statut = (declaration.statut || 'en_attente').toLowerCase().trim();
    const status = statusMap[statut] || { text: statut, color: '#666', icon: '•' };
    
    // Informations du collecteur si disponible
    const collecteurInfo = declaration.collecteur_nom ? `
        <div style="margin-top: 1rem; padding: 1rem; background: var(--muted); border-radius: var(--radius);">
            <strong><i class="fas fa-user"></i> Collecteur assigné:</strong><br>
            ${declaration.collecteur_nom}<br>
            ${declaration.collecteur_telephone ? `📞 ${declaration.collecteur_telephone}` : ''}
        </div>
    ` : '';
    
    // Dates importantes
    const dateDeclaration = declaration.date_declaration 
        ? new Date(declaration.date_declaration).toLocaleString('fr-FR')
        : 'Non spécifiée';
    
    const dateCollecte = declaration.date_collecte
        ? new Date(declaration.date_collecte).toLocaleString('fr-FR')
        : declaration.date_souhaitee 
            ? new Date(declaration.date_souhaitee).toLocaleDateString('fr-FR')
            : 'Non planifiée';
    
    const dateValidation = declaration.date_validation
        ? new Date(declaration.date_validation).toLocaleString('fr-FR')
        : null;
    
    return `
        <div style="border-left: 4px solid ${status.color}; padding-left: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h4 style="font-size: 1.2rem;">
                    ${status.icon} Déclaration #${declaration.id?.substring(0, 8) || '???'}
                </h4>
                <span style="background: ${status.color}20; color: ${status.color}; padding: 0.5rem 1rem; border-radius: 100px; font-weight: 500;">
                    ${status.text}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                    <strong>Type de déchet:</strong><br>
                    ${formatWasteType(declaration.type_dechet)}
                </div>
                <div>
                    <strong>Quantité:</strong><br>
                    ${declaration.quantite || 0} ${declaration.unite || ''}
                </div>
                <div>
                    <strong>Mode de collecte:</strong><br>
                    ${formatCollectionMode(declaration.mode_collecte)}
                </div>
                <div>
                    <strong>Date de déclaration:</strong><br>
                    ${dateDeclaration}
                </div>
                <div>
                    <strong>Date de collecte:</strong><br>
                    ${dateCollecte}
                </div>
                ${dateValidation ? `
                <div>
                    <strong>Date de validation:</strong><br>
                    ${dateValidation}
                </div>
                ` : ''}
            </div>
            
            ${collecteurInfo}
            
            ${declaration.notes ? `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--muted); border-radius: var(--radius);">
                <strong><i class="fas fa-sticky-note"></i> Notes:</strong><br>
                ${declaration.notes}
            </div>
            ` : ''}
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-secondary" onclick="hideDeclarationDetail()">
                    <i class="fas fa-arrow-left"></i> Retour à la liste
                </button>
                ${declaration.statut === 'en_attente' ? `
                <button class="btn btn-warning" onclick="annulerDeclaration('${declaration.id}')">
                    <i class="fas fa-times"></i> Annuler la demande
                </button>
                ` : ''}
            </div>
        </div>
    `;
}

// ============================================
// PROFIL
// ============================================
function loadProfile() {
    console.log('👤 Chargement du profil');
    
    if (!currentUser) return;
    
    const fields = {
        'profileName': currentUser.nomComplet,
        'profileEmail': currentUser.email,
        'profilePhone': currentUser.telephone,
        'profileType': formatProducerType(currentUser.typeProducteur),
        'profileAddress': currentUser.adresse,
        'profileLocation': [currentUser.quartier, currentUser.commune].filter(Boolean).join(', '),
        'profileSince': currentUser.cree_le ? new Date(currentUser.cree_le).toLocaleDateString('fr-FR') : '-'
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value || '-';
    });
    
    // Remplir les formulaires de modification
    const updateFields = {
        'updateFullName': currentUser.nomComplet,
        'updatePhone': currentUser.telephone,
        'updateAddress': currentUser.adresse,
        'updateNeighborhood': currentUser.quartier,
        'updateMunicipality': currentUser.commune
    };
    
    Object.entries(updateFields).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.value = value || '';
    });
    
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
        nomComplet: document.getElementById('updateFullName')?.value.trim(),
        telephone: document.getElementById('updatePhone')?.value.trim(),
        adresse: document.getElementById('updateAddress')?.value.trim(),
        quartier: document.getElementById('updateNeighborhood')?.value.trim(),
        commune: document.getElementById('updateMunicipality')?.value.trim()
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
        console.error('❌ Erreur mise à jour profil:', error);
        showError(messageDiv, error.message);
    }
}

async function handleChangePassword(e) {
    e.preventDefault();
    
    if (!currentToken) {
        showError(document.getElementById('changePasswordMessage'), 'Vous devez être connecté');
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;
    
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
            const form = document.getElementById('changePasswordForm');
            if (form) form.reset();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur changement mot de passe:', error);
        showError(messageDiv, error.message);
    }
}

async function loadNotifications() {
    console.log('🔔 Chargement des notifications');
    
    const container = document.getElementById('recentNotifications');
    if (!container) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/notifications`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        }).catch(() => null);
        
        if (!response || !response.ok) {
            container.innerHTML = '<p class="empty-message">Aucune notification</p>';
            return;
        }
        
        const data = await response.json();
        
        if (!data.notifications || data.notifications.length === 0) {
            container.innerHTML = '<p class="empty-message">Aucune notification</p>';
            return;
        }
        
        container.innerHTML = data.notifications.slice(0, 5).map(notif => `
            <div class="notification-item">
                <strong>${notif.titre || 'Notification'}</strong>
                <p>${notif.message || ''}</p>
                <small>${notif.cree_le ? new Date(notif.cree_le).toLocaleString() : ''}</small>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Erreur notifications:', error);
        container.innerHTML = '<p class="empty-message">Erreur de chargement</p>';
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
    if (!element) return;
    element.className = 'message info';
    element.textContent = message;
    element.style.display = 'block';
}

function showSuccess(element, message) {
    if (!element) {
        const tempDiv = document.createElement('div');
        tempDiv.className = 'message success';
        tempDiv.textContent = message;
        tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 1rem; border-radius: 0.5rem;';
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
        tempDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; padding: 1rem; border-radius: 0.5rem;';
        document.body.appendChild(tempDiv);
        setTimeout(() => tempDiv.remove(), 5000);
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
        .catch(() => showError(null, 'Erreur lors de la copie'));
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
    return types[type] || type || 'Non spécifié';
}

function formatCollectionMode(mode) {
    const modes = {
        'collecte_domicile': 'À domicile',
        'depot_volontaire': 'Dépôt volontaire'
    };
    return modes[mode] || mode || 'Non spécifié';
}

function formatProducerType(type) {
    const types = {
        'menage': 'Ménage',
        'commerce': 'Commerce',
        'entreprise': 'Entreprise',
        'administration': 'Administration'
    };
    return types[type] || type || 'Non spécifié';
}

function getStatusText(status) {
    const statusMap = {
        'en_attente': 'En attente',
        'en_attente_affectation': 'En attente',
        'en_attente_collecte': 'En attente',
        'affecte': 'Collecteur affecté',
        'affectee': 'Collecteur affecté',
        'collecteur_affecte': 'Collecteur affecté',
        'programme': 'Programmée',
        'programmee': 'Programmée',
        'en_cours': 'En cours',
        'termine': 'Terminée',
        'terminee': 'Terminée',
        'validee': 'Validée',
        'annule': 'Annulée',
        'annulee': 'Annulée'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const statusMap = {
        'en_attente': 'badge-warning',
        'en_attente_affectation': 'badge-warning',
        'en_attente_collecte': 'badge-warning',
        'affecte': 'badge-info',
        'affectee': 'badge-info',
        'collecteur_affecte': 'badge-info',
        'programme': 'badge-info',
        'programmee': 'badge-info',
        'en_cours': 'badge-info',
        'termine': 'badge-success',
        'terminee': 'badge-success',
        'validee': 'badge-success',
        'annule': 'badge-danger',
        'annulee': 'badge-danger'
    };
    return statusMap[status] || 'badge-info';
}

function annulerDeclaration(declarationId) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette déclaration ?')) {
        console.log('Annulation de la déclaration:', declarationId);
        // Implémenter l'appel API pour annuler
        showSuccess(null, 'Déclaration annulée avec succès');
        setTimeout(() => {
            hideDeclarationDetail();
            loadDeclarations();
        }, 1000);
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
    if (!container) return;
    
    try {
        const latitude = currentUser?.latitude || 48.8566;
        const longitude = currentUser?.longitude || 2.3522;
        
        const response = await fetch(
            `${CONFIG.API_URL}/api/points-depot?latitude=${latitude}&longitude=${longitude}&rayon=5`,
            { headers: { 'Authorization': `Bearer ${currentToken}` } }
        ).catch(() => null);
        
        if (!response || !response.ok) {
            container.innerHTML = '<p class="empty-message">Erreur de chargement des points de dépôt</p>';
            return;
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
        console.error('❌ Erreur points de dépôt:', error);
        container.innerHTML = '<p class="empty-message error">Erreur de chargement</p>';
    }
}

// ============================================
// CONFIGURATION API
// ============================================
function showApiUrlModal() {
    const modal = document.getElementById('apiUrlModal');
    if (modal) modal.classList.remove('hidden');
}

function hideApiUrlModal() {
    const modal = document.getElementById('apiUrlModal');
    if (modal) modal.classList.add('hidden');
}

function saveApiUrl() {
    const input = document.getElementById('apiUrlInput');
    if (!input) return;
    
    const newUrl = input.value.trim();
    
    if (!newUrl) {
        showError(null, 'L\'URL ne peut pas être vide');
        return;
    }
    
    CONFIG.API_URL = newUrl;
    localStorage.setItem('api_url', newUrl);
    
    const apiUrlEl = document.getElementById('apiUrl');
    if (apiUrlEl) apiUrlEl.textContent = newUrl;
    
    hideApiUrlModal();
    showSuccess(null, 'URL de l\'API mise à jour avec succès');
}

// Exposer les fonctions globalement
window.showSection = showSection;
window.togglePassword = togglePassword;
window.copyToken = copyToken;
window.loadDeclarations = loadDeclarations;
window.showNewDeclarationForm = showNewDeclarationForm;
window.hideNewDeclarationForm = hideNewDeclarationForm;
window.handleNewDeclaration = handleNewDeclaration;
window.showDeclarationDetail = showDeclarationDetail;
window.hideDeclarationDetail = hideDeclarationDetail;
window.handleUpdateProfile = handleUpdateProfile;
window.handleChangePassword = handleChangePassword;
window.handleLogout = handleLogout;
window.loadDepotPoints = loadDepotPoints;
window.showApiUrlModal = showApiUrlModal;
window.hideApiUrlModal = hideApiUrlModal;
window.saveApiUrl = saveApiUrl;
window.annulerDeclaration = annulerDeclaration;