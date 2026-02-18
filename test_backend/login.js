

// // ============================================
// // login.js - Gestion unifiée de l'authentification EcoCollect
// // Version corrigée avec redirection vers les bons dashboards
// // ============================================




// const CONFIG = {
//     API_URL: window.API_BASE_URL || 'https://ecobackend-eopk.vercel.app', // URL de production par défaut
//     TOKEN_KEY: 'ecocollect_token',
//     USER_KEY: 'ecocollect_user',
//     ROLE_KEY: 'ecocollect_role'
// };

// console.log('🚀 Collecteur.js chargé');
// console.log('📡 API URL utilisée:', CONFIG.API_URL);

// // // Configuration
// // const CONFIG = {
// //     API_URL: localStorage.getItem('api_url') || 'http://localhost:3000',
// //     TOKEN_KEY: 'ecocollect_token',
// //     USER_KEY: 'ecocollect_user',
// //     USER_ROLE_KEY: 'ecocollect_role'
// // };



// // État de l'application
// let currentUser = null;
// let currentToken = null;
// let currentRole = null;
// let selectedRole = null;
// let pCurrentStep = 1;
// let cCurrentStep = 1;

// // ============================================
// // INITIALISATION
// // ============================================

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('🚀 Initialisation de login.js');
    
//     // Initialiser les écouteurs d'événements
//     initEventListeners();
    
//     // Vérifier si l'utilisateur est déjà connecté (mais NE PAS rediriger automatiquement)
//     checkExistingSession();
    
//     // Tester la connexion à l'API
//     testConnection();
    
//     // Initialiser la gestion des photos
//     initPhotoUploads();
// });

// function initEventListeners() {
//     // Navigation
//     document.querySelectorAll('.nav-back').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             e.preventDefault();
//             window.location.href = 'in.html';
//         });
//     });
    
//     // Rôle selection
//     const cardProducteur = document.getElementById('cardProducteur');
//     const cardCollecteur = document.getElementById('cardCollecteur');
    
//     if (cardProducteur) {
//         cardProducteur.addEventListener('click', () => selectRole('producteur'));
//     }
//     if (cardCollecteur) {
//         cardCollecteur.addEventListener('click', () => selectRole('collecteur'));
//     }
    
//     // Bouton continuer
//     const btnContinue = document.getElementById('btnContinueRole');
//     if (btnContinue) {
//         btnContinue.addEventListener('click', goToForm);
//     }
    
//     // Formulaire producteur
//     initProducteurForm();
    
//     // Formulaire collecteur
//     initCollecteurForm();
    
//     // Nettoyage des erreurs
//     document.querySelectorAll('input, select, textarea').forEach(el => {
//         el.addEventListener('input', () => {
//             el.closest('.field')?.classList.remove('has-error');
//         });
//     });
    
//     // Gestion des CGU
//     const pCguRow = document.getElementById('pCguRow');
//     if (pCguRow) {
//         pCguRow.addEventListener('click', function(e) {
//             e.preventDefault();
//             this.classList.toggle('checked');
//         });
//     }
    
//     const cCguRow = document.getElementById('cCguRow');
//     if (cCguRow) {
//         cCguRow.addEventListener('click', function(e) {
//             e.preventDefault();
//             this.classList.toggle('checked');
//         });
//     }
// }

// function initPhotoUploads() {
//     // Photo de profil
//     const photoPreview = document.getElementById('photoPreview');
//     const photoFile = document.getElementById('c-photo-file');
    
//     if (photoPreview && photoFile) {
//         photoPreview.addEventListener('click', () => {
//             photoFile.click();
//         });
        
//         photoFile.addEventListener('change', previewPhoto);
//     }
    
//     // Photos CNI - RECTO
//     const cniRectoZone = document.getElementById('cni-recto-zone');
//     const cniRectoFile = document.getElementById('collecteur-cni-recto-file');
    
//     if (cniRectoZone && cniRectoFile) {
//         cniRectoZone.addEventListener('click', () => {
//             cniRectoFile.click();
//         });
        
//         cniRectoFile.addEventListener('change', (e) => handleCniUpload(e, 'recto'));
//     }
    
//     // Photos CNI - VERSO
//     const cniVersoZone = document.getElementById('cni-verso-zone');
//     const cniVersoFile = document.getElementById('collecteur-cni-verso-file');
    
//     if (cniVersoZone && cniVersoFile) {
//         cniVersoZone.addEventListener('click', () => {
//             cniVersoFile.click();
//         });
        
//         cniVersoFile.addEventListener('change', (e) => handleCniUpload(e, 'verso'));
//     }
// }

// // Gestion upload photos CNI
// function handleCniUpload(e, type) {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     const reader = new FileReader();
//     reader.onload = function(event) {
//         const previewId = type === 'recto' ? 'cni-recto-preview' : 'cni-verso-preview';
//         const inputId = type === 'recto' ? 'collecteur-cni-recto' : 'collecteur-cni-verso';
//         const preview = document.getElementById(previewId);
        
//         if (preview) {
//             preview.innerHTML = '';
//             const img = document.createElement('img');
//             img.src = event.target.result;
//             img.style.width = '100%';
//             img.style.height = '100%';
//             img.style.objectFit = 'cover';
//             img.style.borderRadius = '5px';
//             preview.appendChild(img);
//             preview.classList.add('has-image');
            
//             // Mettre à jour le champ caché
//             const hiddenInput = document.getElementById(inputId);
//             if (hiddenInput) {
//                 hiddenInput.value = event.target.result;
//             }
            
//             // Mettre à jour le texte
//             const hint = preview.nextElementSibling;
//             if (hint) hint.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ${type === 'recto' ? 'Recto' : 'Verso'} chargé`;
//         }
//     };
//     reader.readAsDataURL(file);
// }

// async function testConnection() {
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/`);
//         console.log('✅ Connexion API établie');
//     } catch (error) {
//         console.error('❌ Impossible de se connecter à l\'API:', error);
//         showMsg('pMsg', 'Impossible de se connecter au serveur. Vérifiez l\'URL.', 'error');
//     }
// }

// function initProducteurForm() {
//     // Boutons de navigation
//     document.querySelectorAll('.btn-back').forEach(btn => {
//         if (btn.closest('#screen2p')) {
//             btn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const step = btn.closest('.form-step');
//                 if (step && step.id === 'pStep1') {
//                     goBack();
//                 } else if (step && step.id === 'pStep2') {
//                     pPrev(1);
//                 } else if (step && step.id === 'pStep3') {
//                     pPrev(2);
//                 } else if (step && step.id === 'pStep4') {
//                     pPrev(3);
//                 }
//             });
//         }
//     });
    
//     // Boutons suivants
//     document.querySelectorAll('.btn-next').forEach(btn => {
//         if (btn.closest('#screen2p')) {
//             btn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const step = btn.closest('.form-step');
//                 if (step && step.id === 'pStep1') {
//                     pNext(1);
//                 } else if (step && step.id === 'pStep2') {
//                     pNext(2);
//                 } else if (step && step.id === 'pStep3') {
//                     pNext(3);
//                 }
//             });
//         }
//     });
    
//     // Bouton de soumission
//     const submitBtn = document.getElementById('pSubmitBtn');
//     if (submitBtn) {
//         submitBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             submitProducteur();
//         });
//     }
// }

// function initCollecteurForm() {
//     // Boutons de navigation
//     document.querySelectorAll('.btn-back').forEach(btn => {
//         if (btn.closest('#screen2c')) {
//             btn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const step = btn.closest('.form-step');
//                 if (step && step.id === 'cStep1') {
//                     goBack();
//                 } else if (step && step.id === 'cStep2') {
//                     cPrev(1);
//                 } else if (step && step.id === 'cStep3') {
//                     cPrev(2);
//                 } else if (step && step.id === 'cStep4') {
//                     cPrev(3);
//                 }
//             });
//         }
//     });
    
//     // Boutons suivants
//     document.querySelectorAll('.btn-next').forEach(btn => {
//         if (btn.closest('#screen2c')) {
//             btn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const step = btn.closest('.form-step');
//                 if (step && step.id === 'cStep1') {
//                     cNext(1);
//                 } else if (step && step.id === 'cStep2') {
//                     cNext(2);
//                 } else if (step && step.id === 'cStep3') {
//                     cNext(3);
//                 }
//             });
//         }
//     });
    
//     // Bouton de soumission
//     const submitBtn = document.getElementById('cSubmitBtn');
//     if (submitBtn) {
//         submitBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             submitCollecteur();
//         });
//     }
// }

// // ============================================
// // GESTION DE LA SESSION
// // ============================================

// function checkExistingSession() {
//     try {
//         const token = localStorage.getItem(CONFIG.TOKEN_KEY);
//         const userJson = localStorage.getItem(CONFIG.USER_KEY);
//         const role = localStorage.getItem(CONFIG.USER_ROLE_KEY);
        
//         if (token && userJson && userJson !== 'undefined' && userJson !== 'null') {
//             const user = JSON.parse(userJson);
//             currentToken = token;
//             currentUser = user;
//             currentRole = role;
            
//             console.log('✅ Session existante:', { role: currentRole, user: currentUser?.nomComplet });
            
//             // Rediriger vers le bon dashboard si on est sur la page de login
//             redirectToDashboard();
//         }
//     } catch (error) {
//         console.error('❌ Erreur lors du chargement de la session:', error);
//         clearSession();
//     }
// }

// function saveAuthData(token, user, role) {
//     currentToken = token;
//     currentUser = user;
//     currentRole = role;
    
//     try {
//         localStorage.setItem(CONFIG.TOKEN_KEY, token);
//         localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
//         if (role) {
//             localStorage.setItem(CONFIG.USER_ROLE_KEY, role);
//         }
//         console.log('✅ Données sauvegardées pour', role, user?.nomComplet);
//     } catch (error) {
//         console.error('❌ Erreur sauvegarde localStorage:', error);
//     }
// }

// function clearSession() {
//     currentToken = null;
//     currentUser = null;
//     currentRole = null;
    
//     localStorage.removeItem(CONFIG.TOKEN_KEY);
//     localStorage.removeItem(CONFIG.USER_KEY);
//     localStorage.removeItem(CONFIG.USER_ROLE_KEY);
// }

// function redirectToDashboard() {
//     if (currentRole === 'producteur') {
//         window.location.href = 'producteur.html';
//     } else if (currentRole === 'collecteur') {
//         window.location.href = 'collecteur.html';
//     }
// }

// // ============================================
// // SÉLECTION DU RÔLE
// // ============================================

// function selectRole(role) {
//     selectedRole = role;
    
//     const cardProducteur = document.getElementById('cardProducteur');
//     const cardCollecteur = document.getElementById('cardCollecteur');
//     const btnContinue = document.getElementById('btnContinueRole');
    
//     if (cardProducteur) {
//         cardProducteur.classList.remove('selected');
//     }
//     if (cardCollecteur) {
//         cardCollecteur.classList.remove('selected');
//     }
    
//     if (role === 'producteur') {
//         cardProducteur?.classList.add('selected');
//     } else {
//         cardCollecteur?.classList.add('selected');
//     }
    
//     if (btnContinue) {
//         btnContinue.classList.add('ready');
//         btnContinue.innerHTML = `Continuer en tant que <strong>${role === 'producteur' ? 'Producteur' : 'Collecteur'}</strong> 
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
//                 <path d="M5 12h14M12 5l7 7-7 7"/>
//             </svg>`;
//     }
// }

// function goToForm() {
//     if (!selectedRole) {
//         showMsg('pMsg', 'Veuillez sélectionner un rôle', 'error');
//         return;
//     }
    
//     setScreen(selectedRole === 'producteur' ? 'screen2p' : 'screen2c');
//     updateProgress(2);
// }

// // ============================================
// // NAVIGATION ENTRE ÉCRANS
// // ============================================

// function setScreen(id) {
//     document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
//     const screen = document.getElementById(id);
//     if (screen) {
//         screen.classList.add('active');
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
// }

// function goBack() {
//     setScreen('screen1');
//     updateProgress(1);
//     selectedRole = null;
    
//     const btnContinue = document.getElementById('btnContinueRole');
//     if (btnContinue) {
//         btnContinue.classList.remove('ready');
//         btnContinue.innerHTML = `Continuer avec ce rôle
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
//                 <path d="M5 12h14M12 5l7 7-7 7"/>
//             </svg>`;
//     }
// }

// function updateProgress(step) {
//     for (let i = 1; i <= 4; i++) {
//         const dot = document.getElementById('dot' + i);
//         const lbl = document.getElementById('lbl' + i);
        
//         if (!dot || !lbl) continue;
        
//         dot.classList.remove('active', 'done');
//         lbl.classList.remove('active');
        
//         if (i < step) {
//             dot.classList.add('done');
//             dot.textContent = '✓';
//         } else if (i === step) {
//             dot.classList.add('active');
//             dot.textContent = i === 4 ? '✓' : i.toString();
//             lbl.classList.add('active');
//         } else {
//             dot.textContent = i === 4 ? '✓' : i.toString();
//         }
        
//         if (i < 4) {
//             const line = document.getElementById('line' + i);
//             if (line) {
//                 line.classList.toggle('done', i < step);
//             }
//         }
//     }
// }

// // ============================================
// // PRODUCTEUR - GESTION DES ÉTAPES
// // ============================================

// function pShowStep(n) {
//     document.querySelectorAll('#screen2p .form-step').forEach(s => s.classList.remove('active'));
//     const step = document.getElementById('pStep' + n);
//     if (step) {
//         step.classList.add('active');
//         pCurrentStep = n;
//     }
// }

// function pPrev(n) {
//     pShowStep(n);
// }

// function pNext(from) {
//     if (!pValidate(from)) return;
//     if (from === 3) buildPRecap();
//     pShowStep(from + 1);
// }

// function pValidate(step) {
//     let ok = true;
    
//     if (step === 1) {
//         const email = document.getElementById('p-email');
//         const phone = document.getElementById('p-phone');
//         const pwd = document.getElementById('p-pwd');
//         const confirm = document.getElementById('p-pwdConfirm');
        
//         ok = setErr('f-p-email', !email || !email.value || !email.value.includes('@')) && ok;
//         ok = setErr('f-p-phone', !phone || !phone.value || phone.value.length < 8) && ok;
//         ok = setErr('f-p-pwd', !pwd || !pwd.value || pwd.value.length < 8) && ok;
//         ok = setErr('f-p-pwdConfirm', !pwd || !confirm || pwd.value !== confirm.value) && ok;
//     }
    
//     if (step === 2) {
//         const name = document.getElementById('p-name');
//         const type = document.querySelector('input[name="p-type"]:checked');
        
//         ok = setErr('f-p-name', !name || !name.value.trim()) && ok;
        
//         const typeErr = document.getElementById('p-type-err');
//         if (!type) {
//             if (typeErr) typeErr.style.display = 'block';
//             ok = false;
//         } else {
//             if (typeErr) typeErr.style.display = 'none';
//         }
//     }
    
//     if (step === 3) {
//         const addr = document.getElementById('p-address');
//         const neigh = document.getElementById('p-neighborhood');
//         const muni = document.getElementById('p-municipality');
        
//         ok = setErr('f-p-address', !addr || !addr.value.trim()) && ok;
//         ok = setErr('f-p-neighborhood', !neigh || !neigh.value.trim()) && ok;
//         ok = setErr('f-p-municipality', !muni || !muni.value.trim()) && ok;
//     }
    
//     return ok;
// }

// function buildPRecap() {
//     const type = document.querySelector('input[name="p-type"]:checked');
//     const typeLabels = {
//         menage: '🏠 Ménage',
//         commerce: '🏪 Commerce',
//         entreprise: '🏭 Entreprise',
//         administration: '🏛️ Administration'
//     };
    
//     const recap = document.getElementById('pRecap');
//     if (recap) {
//         recap.innerHTML = `
//             <div class="recap-item">
//                 <div class="recap-label">Email</div>
//                 <div class="recap-val">${document.getElementById('p-email')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Téléphone</div>
//                 <div class="recap-val">${document.getElementById('p-phone')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Nom</div>
//                 <div class="recap-val">${document.getElementById('p-name')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Type</div>
//                 <div class="recap-val">${type ? typeLabels[type.value] : '–'}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Adresse</div>
//                 <div class="recap-val">${document.getElementById('p-address')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Localisation</div>
//                 <div class="recap-val">${document.getElementById('p-neighborhood')?.value || ''}, ${document.getElementById('p-municipality')?.value || ''}</div>
//             </div>
//         `;
//     }
// }

// // ============================================
// // COLLECTEUR - GESTION DES ÉTAPES
// // ============================================

// function cShowStep(n) {
//     document.querySelectorAll('#screen2c .form-step').forEach(s => s.classList.remove('active'));
//     const step = document.getElementById('cStep' + n);
//     if (step) {
//         step.classList.add('active');
//         cCurrentStep = n;
//     }
// }

// function cPrev(n) {
//     cShowStep(n);
// }

// function cNext(from) {
//     if (!cValidate(from)) return;
//     if (from === 3) buildCRecap();
//     cShowStep(from + 1);
// }

// function cValidate(step) {
//     let ok = true;
    
//     if (step === 1) {
//         const email = document.getElementById('c-email');
//         const phone = document.getElementById('c-phone');
//         const pwd = document.getElementById('c-pwd');
//         const confirm = document.getElementById('c-pwdConfirm');
        
//         ok = setErr('f-c-email', !email || !email.value || !email.value.includes('@')) && ok;
//         ok = setErr('f-c-phone', !phone || !phone.value || phone.value.length < 8) && ok;
//         ok = setErr('f-c-pwd', !pwd || !pwd.value || pwd.value.length < 8) && ok;
//         ok = setErr('f-c-pwdConfirm', !pwd || !confirm || pwd.value !== confirm.value) && ok;
//     }
    
//     if (step === 2) {
//         const name = document.getElementById('c-name');
//         const type = document.querySelector('input[name="c-type"]:checked');
        
//         ok = setErr('f-c-name', !name || !name.value.trim()) && ok;
        
//         const typeErr = document.getElementById('c-type-err');
//         if (!type) {
//             if (typeErr) typeErr.style.display = 'block';
//             ok = false;
//         } else {
//             if (typeErr) typeErr.style.display = 'none';
//         }
//     }
    
//     if (step === 3) {
//         const zone = document.getElementById('c-zone');
//         ok = setErr('f-c-zone', !zone || !zone.value.trim()) && ok;
//     }
    
//     return ok;
// }

// function buildCRecap() {
//     const type = document.querySelector('input[name="c-type"]:checked');
    
//     const recap = document.getElementById('cRecap');
//     if (recap) {
//         recap.innerHTML = `
//             <div class="recap-item">
//                 <div class="recap-label">Email</div>
//                 <div class="recap-val">${document.getElementById('c-email')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Téléphone</div>
//                 <div class="recap-val">${document.getElementById('c-phone')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Nom</div>
//                 <div class="recap-val">${document.getElementById('c-name')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Type</div>
//                 <div class="recap-val">${type ? '🧑‍💼 ' + type.value.charAt(0).toUpperCase() + type.value.slice(1) : '–'}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Zone</div>
//                 <div class="recap-val">${document.getElementById('c-zone')?.value || ''}</div>
//             </div>
//             <div class="recap-item">
//                 <div class="recap-label">Communes</div>
//                 <div class="recap-val">${document.getElementById('c-communes')?.value || '–'}</div>
//             </div>
//         `;
//     }
// }

// // ============================================
// // SOUMISSION DES FORMULAIRES - PRODUCTEUR
// // ============================================

// async function submitProducteur() {
//     const cguRow = document.getElementById('pCguRow');
    
//     if (!cguRow || !cguRow.classList.contains('checked')) {
//         showMsg('pMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
//         return;
//     }
    
//     const btn = document.getElementById('pSubmitBtn');
//     if (btn) {
//         btn.disabled = true;
//         btn.innerHTML = '⏳ Envoi en cours...';
//     }
    
//     const type = document.querySelector('input[name="p-type"]:checked');
    
//     const payload = {
//         email: document.getElementById('p-email')?.value || '',
//         telephone: document.getElementById('p-phone')?.value || '',
//         motDePasse: document.getElementById('p-pwd')?.value || '',
//         nomComplet: document.getElementById('p-name')?.value || '',
//         typeProducteur: type ? type.value : '',
//         adresse: document.getElementById('p-address')?.value || '',
//         quartier: document.getElementById('p-neighborhood')?.value || '',
//         commune: document.getElementById('p-municipality')?.value || '',
//         latitude: parseFloat(document.getElementById('p-lat')?.value) || null,
//         longitude: parseFloat(document.getElementById('p-lng')?.value) || null,
//         cguAcceptees: true
//     };
    
//     try {
//         console.log('📤 Inscription producteur:', payload.email);
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
        
//         const data = await response.json();
        
//         if (response.ok && (data.success || data.token)) {
//             console.log('✅ Inscription producteur réussie');
            
//             // Récupérer le token et l'utilisateur
//             const token = data.token || data.accessToken;
//             const userData = data.producteur || data.user || data.utilisateur || data;
            
//             if (token && userData) {
//                 saveAuthData(token, userData, 'producteur');
//             }
            
//             showSuccess('producteur', document.getElementById('p-name')?.value || '');
            
//             // Rediriger vers le dashboard producteur
//             setTimeout(() => {
//                 window.location.href = 'producteur.html';
//             }, 2000);
            
//         } else {
//             throw new Error(data.message || data.erreur || 'Erreur lors de l\'inscription');
//         }
//     } catch (error) {
//         console.error('❌ Erreur inscription producteur:', error);
//         showMsg('pMsg', error.message, 'error');
        
//         if (btn) {
//             btn.disabled = false;
//             btn.innerHTML = '🚀 Créer mon compte <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
//         }
//     }
// }

// // ============================================
// // SOUMISSION DES FORMULAIRES - COLLECTEUR
// // ============================================

// async function submitCollecteur() {
//     const cguRow = document.getElementById('cCguRow');
    
//     if (!cguRow || !cguRow.classList.contains('checked')) {
//         showMsg('cMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
//         return;
//     }
    
//     // Vérification des photos CNI
//     const cniRectoInput = document.getElementById('collecteur-cni-recto');
//     const cniVersoInput = document.getElementById('collecteur-cni-verso');
    
//     if (!cniRectoInput || !cniRectoInput.value) {
//         showMsg('cMsg', 'Veuillez charger la photo recto de votre CNI', 'error');
//         return;
//     }
    
//     if (!cniVersoInput || !cniVersoInput.value) {
//         showMsg('cMsg', 'Veuillez charger la photo verso de votre CNI', 'error');
//         return;
//     }
    
//     const btn = document.getElementById('cSubmitBtn');
//     if (btn) {
//         btn.disabled = true;
//         btn.innerHTML = '⏳ Envoi en cours...';
//     }
    
//     const type = document.querySelector('input[name="c-type"]:checked');
    
//     // Construction de l'objet zone d'intervention
//     const quartiers = document.getElementById('c-quarters')?.value
//         .split(',')
//         .map(q => q.trim())
//         .filter(q => q) || [];
    
//     const communes = document.getElementById('c-communes')?.value
//         .split(',')
//         .map(c => c.trim())
//         .filter(c => c) || [];
    
//     // Utiliser FormData pour gérer les fichiers
//     const formData = new FormData();
    
//     formData.append('email', document.getElementById('c-email')?.value || '');
//     formData.append('telephone', document.getElementById('c-phone')?.value || '');
//     formData.append('motDePasse', document.getElementById('c-pwd')?.value || '');
//     formData.append('nomComplet', document.getElementById('c-name')?.value || '');
//     formData.append('typeCollecteur', type ? type.value : '');
//     formData.append('numeroIdentite', document.getElementById('c-identity')?.value || '');
//     formData.append('zoneInterventionNom', document.getElementById('c-zone')?.value || '');
//     formData.append('quartiersHabituels', JSON.stringify(quartiers));
//     formData.append('communesIntervention', JSON.stringify(communes));
//     formData.append('cguAcceptees', 'true');
    
//     // Ajouter la photo de profil
//     const photoFile = document.getElementById('c-photo-file')?.files[0];
//     if (photoFile) {
//         formData.append('photoProfil', photoFile);
//     }
    
//     // Ajouter les photos CNI (fichiers)
//     const cniRectoFile = document.getElementById('collecteur-cni-recto-file')?.files[0];
//     if (cniRectoFile) {
//         formData.append('photoCniRecto', cniRectoFile);
//     }
    
//     const cniVersoFile = document.getElementById('collecteur-cni-verso-file')?.files[0];
//     if (cniVersoFile) {
//         formData.append('photoCniVerso', cniVersoFile);
//     }
    
//     try {
//         console.log('📤 Inscription collecteur avec fichiers...');
        
//         const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/inscription`, {
//             method: 'POST',
//             body: formData
//         });
        
//         const data = await response.json();
        
//         if (response.ok && data.success) {
//             console.log('✅ Inscription collecteur réussie');
            
//             // Sauvegarder les données
//             if (data.token && data.collecteur) {
//                 saveAuthData(data.token, data.collecteur, 'collecteur');
//             }
            
//             showSuccess('collecteur', document.getElementById('c-name')?.value || '');
            
//             // Rediriger vers le dashboard collecteur
//             setTimeout(() => {
//                 window.location.href = 'collecteur.html';
//             }, 2000);
            
//         } else {
//             throw new Error(data.message || data.erreur || 'Erreur lors de l\'inscription');
//         }
//     } catch (error) {
//         console.error('❌ Erreur inscription collecteur:', error);
//         showMsg('cMsg', error.message, 'error');
        
//         if (btn) {
//             btn.disabled = false;
//             btn.innerHTML = '🚀 Créer mon compte <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
//         }
//     }
// }

// // ============================================
// // ÉCRAN DE SUCCÈS
// // ============================================

// function showSuccess(role, name) {
//     updateProgress(4);
//     setScreen('screen3');
    
//     const anim = document.getElementById('successAnim');
//     if (anim) {
//         anim.textContent = role === 'producteur' ? '🎉' : '🚛';
//     }
    
//     const title = document.getElementById('successTitle');
//     if (title) {
//         const firstName = name.split(' ')[0];
//         title.innerHTML = `Bienvenue, <em>${firstName}</em> !`;
//     }
    
//     const sub = document.getElementById('successSub');
//     if (sub) {
//         sub.textContent = role === 'producteur'
//             ? 'Votre compte Producteur a été créé avec succès. Redirection vers votre espace...'
//             : 'Votre compte Collecteur a été créé avec succès. Redirection vers votre espace...';
//     }
    
//     const actions = document.getElementById('successActions');
//     if (actions) {
//         actions.innerHTML = `
//             <button class="btn-go primary" onclick="window.location.href='${role === 'producteur' ? 'producteur.html' : 'collecteur.html'}'">
//                 Accéder à mon espace →
//             </button>
//             <button class="btn-go ghost" onclick="window.location.href='in.html'">
//                 Retour à l'accueil
//             </button>
//         `;
//     }
// }

// // ============================================
// // UTILITAIRES
// // ============================================

// function setErr(fieldId, hasError) {
//     const field = document.getElementById(fieldId);
//     if (field) {
//         field.classList.toggle('has-error', hasError);
//     }
//     return !hasError;
// }

// function showMsg(id, msg, type) {
//     const el = document.getElementById(id);
//     if (!el) return;
    
//     el.textContent = msg;
//     el.className = 'msg-box ' + type;
//     el.style.display = 'block';
//     el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
//     setTimeout(() => {
//         el.style.display = 'none';
//     }, 5000);
// }

// function togglePwd(inputId, btn) {
//     const inp = document.getElementById(inputId);
//     if (!inp) return;
    
//     inp.type = inp.type === 'password' ? 'text' : 'password';
//     btn.textContent = inp.type === 'password' ? '👁' : '🙈';
// }

// function checkPwd(input, barId, lblId) {
//     const v = input.value;
//     const bar = document.getElementById(barId);
//     const lbl = document.getElementById(lblId);
    
//     if (!bar || !lbl) return;
    
//     let score = 0;
    
//     if (v.length >= 8) score++;
//     if (/[A-Z]/.test(v)) score++;
//     if (/[0-9]/.test(v)) score++;
//     if (/[^A-Za-z0-9]/.test(v)) score++;
    
//     const map = [
//         { pct: '20%', color: '#dc2626', text: 'Très faible' },
//         { pct: '40%', color: '#f97316', text: 'Faible' },
//         { pct: '65%', color: '#eab308', text: 'Moyen' },
//         { pct: '85%', color: '#22c55e', text: 'Fort' },
//         { pct: '100%', color: '#2d8a5e', text: 'Très fort' }
//     ];
    
//     const m = v.length === 0 
//         ? { pct: '0%', color: 'transparent', text: '–' } 
//         : map[Math.min(score, 4)];
    
//     bar.style.width = m.pct;
//     bar.style.background = m.color;
//     lbl.textContent = m.text;
// }

// function getGPS() {
//     const btn = document.getElementById('gpsBtn');
//     if (!btn) return;
    
//     if (!navigator.geolocation) {
//         btn.textContent = '❌ Non disponible';
//         return;
//     }
    
//     btn.textContent = '📡 Localisation...';
    
//     navigator.geolocation.getCurrentPosition(
//         (pos) => {
//             const lat = document.getElementById('p-lat');
//             const lng = document.getElementById('p-lng');
            
//             if (lat) lat.value = pos.coords.latitude.toFixed(6);
//             if (lng) lng.value = pos.coords.longitude.toFixed(6);
            
//             btn.textContent = '✅ Position enregistrée';
//         },
//         () => {
//             btn.textContent = '❌ Erreur de localisation';
//         }
//     );
// }

// function previewPhoto(input) {
//     if (!input || !input.files || !input.files[0]) return;
    
//     const reader = new FileReader();
//     reader.onload = (e) => {
//         const img = document.getElementById('photoImg');
//         const emoji = document.getElementById('photoEmoji');
//         const preview = document.getElementById('photoPreview');
        
//         if (img) {
//             img.src = e.target.result;
//             img.style.display = 'block';
//         }
//         if (emoji) {
//             emoji.style.display = 'none';
//         }
//         if (preview) {
//             preview.classList.add('has-image');
//         }
//     };
//     reader.readAsDataURL(input.files[0]);
// }

// // Exposer les fonctions globalement
// window.selectRole = selectRole;
// window.goToForm = goToForm;
// window.goBack = goBack;
// window.togglePwd = togglePwd;
// window.checkPwd = checkPwd;
// window.getGPS = getGPS;
// window.previewPhoto = previewPhoto;
// window.pNext = pNext;
// window.pPrev = pPrev;
// window.cNext = cNext;
// window.cPrev = cPrev;
// window.submitProducteur = submitProducteur;
// window.submitCollecteur = submitCollecteur;



// login.js - Version corrigée

// Configuration
const CONFIG = {
    API_URL: window.API_BASE_URL || 'https://ecobackend-m3s8.vercel.app',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    ROLE_KEY: 'ecocollect_role'
};

console.log('🚀 login.js chargé');
console.log('📡 API URL utilisée:', CONFIG.API_URL);

// État de l'application
let currentUser = null;
let currentToken = null;
let currentRole = null;
let selectedRole = null;
let pCurrentStep = 1;
let cCurrentStep = 1;

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de login.js');
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Vérifier si l'utilisateur est déjà connecté
    checkExistingSession();
    
    // Tester la connexion à l'API
    testConnection();
    
    // Initialiser la gestion des photos
    initPhotoUploads();
    
    // Initialiser les CGU
    initCguCheckboxes();
});

function initCguCheckboxes() {
    // Pour le producteur
    const pCguRow = document.getElementById('pCguRow');
    const pCguCheck = document.getElementById('pCguCheck');
    const pCguBox = document.getElementById('pCguBox');
    
    if (pCguRow && pCguCheck && pCguBox) {
        pCguRow.addEventListener('click', (e) => {
            e.preventDefault();
            pCguCheck.checked = !pCguCheck.checked;
            pCguRow.classList.toggle('checked', pCguCheck.checked);
            if (pCguBox) {
                pCguBox.textContent = pCguCheck.checked ? '✓' : '';
            }
        });
    }
    
    // Pour le collecteur
    const cCguRow = document.getElementById('cCguRow');
    const cCguCheck = document.getElementById('cCguCheck');
    const cCguBox = document.getElementById('cCguBox');
    
    if (cCguRow && cCguCheck && cCguBox) {
        cCguRow.addEventListener('click', (e) => {
            e.preventDefault();
            cCguCheck.checked = !cCguCheck.checked;
            cCguRow.classList.toggle('checked', cCguCheck.checked);
            if (cCguBox) {
                cCguBox.textContent = cCguCheck.checked ? '✓' : '';
            }
        });
    }
}

function initEventListeners() {
    // Navigation retour
    document.querySelectorAll('.nav-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'in.html';
        });
    });
    
    // Rôle selection
    const cardProducteur = document.getElementById('cardProducteur');
    const cardCollecteur = document.getElementById('cardCollecteur');
    
    if (cardProducteur) {
        cardProducteur.addEventListener('click', () => selectRole('producteur'));
    }
    if (cardCollecteur) {
        cardCollecteur.addEventListener('click', () => selectRole('collecteur'));
    }
    
    // Bouton continuer
    const btnContinue = document.getElementById('btnContinueRole');
    if (btnContinue) {
        btnContinue.addEventListener('click', goToForm);
    }
    
    // Formulaire producteur
    initProducteurForm();
    
    // Formulaire collecteur
    initCollecteurForm();
}

function initPhotoUploads() {
    // Photo de profil
    const photoUploadZone = document.getElementById('photoUploadZone');
    const photoPreview = document.getElementById('photoPreview');
    const photoFile = document.getElementById('c-photo-file');
    
    if (photoUploadZone && photoFile) {
        photoUploadZone.addEventListener('click', () => {
            photoFile.click();
        });
        
        photoFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.getElementById('photoImg');
                const emoji = document.getElementById('photoEmoji');
                
                if (img) {
                    img.src = event.target.result;
                    img.style.display = 'block';
                }
                if (emoji) {
                    emoji.style.display = 'none';
                }
                if (photoPreview) {
                    photoPreview.classList.add('has-image');
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    // CNI Recto
    const cniRectoZone = document.getElementById('cni-recto-zone');
    const cniRectoFile = document.getElementById('collecteur-cni-recto-file');
    
    if (cniRectoZone && cniRectoFile) {
        cniRectoZone.addEventListener('click', () => {
            cniRectoFile.click();
        });
        
        cniRectoFile.addEventListener('change', (e) => {
            handleCniUpload(e, 'recto');
        });
    }
    
    // CNI Verso
    const cniVersoZone = document.getElementById('cni-verso-zone');
    const cniVersoFile = document.getElementById('collecteur-cni-verso-file');
    
    if (cniVersoZone && cniVersoFile) {
        cniVersoZone.addEventListener('click', () => {
            cniVersoFile.click();
        });
        
        cniVersoFile.addEventListener('change', (e) => {
            handleCniUpload(e, 'verso');
        });
    }
}

function handleCniUpload(e, type) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const previewId = type === 'recto' ? 'cni-recto-preview' : 'cni-verso-preview';
        const inputId = type === 'recto' ? 'collecteur-cni-recto' : 'collecteur-cni-verso';
        const preview = document.getElementById(previewId);
        
        if (preview) {
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            preview.appendChild(img);
            preview.classList.add('has-image');
            
            // Mettre à jour le champ caché avec la data URL
            const hiddenInput = document.getElementById(inputId);
            if (hiddenInput) {
                hiddenInput.value = event.target.result;
            }
            
            // Mettre à jour le texte
            const hint = preview.nextElementSibling;
            if (hint) {
                hint.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ${type === 'recto' ? 'Recto' : 'Verso'} chargé`;
            }
        }
    };
    reader.readAsDataURL(file);
}

async function testConnection() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/`);
        if (response.ok) {
            console.log('✅ Connexion API établie');
        } else {
            console.warn('⚠️ API répond avec statut:', response.status);
        }
    } catch (error) {
        console.error('❌ Impossible de se connecter à l\'API:', error);
    }
}

function initProducteurForm() {
    // Boutons de navigation
    document.querySelectorAll('.btn-back').forEach(btn => {
        if (btn.closest('#screen2p')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = btn.closest('.form-step');
                if (step && step.id === 'pStep1') {
                    goBack();
                } else if (step && step.id === 'pStep2') {
                    pPrev(1);
                } else if (step && step.id === 'pStep3') {
                    pPrev(2);
                } else if (step && step.id === 'pStep4') {
                    pPrev(3);
                }
            });
        }
    });
    
    // Boutons suivants
    document.querySelectorAll('.btn-next').forEach(btn => {
        if (btn.closest('#screen2p')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = btn.closest('.form-step');
                if (step && step.id === 'pStep1') {
                    pNext(1);
                } else if (step && step.id === 'pStep2') {
                    pNext(2);
                } else if (step && step.id === 'pStep3') {
                    pNext(3);
                }
            });
        }
    });
    
    // Bouton de soumission
    const submitBtn = document.getElementById('pSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            submitProducteur();
        });
    }
}

function initCollecteurForm() {
    // Boutons de navigation
    document.querySelectorAll('.btn-back').forEach(btn => {
        if (btn.closest('#screen2c')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = btn.closest('.form-step');
                if (step && step.id === 'cStep1') {
                    goBack();
                } else if (step && step.id === 'cStep2') {
                    cPrev(1);
                } else if (step && step.id === 'cStep3') {
                    cPrev(2);
                } else if (step && step.id === 'cStep4') {
                    cPrev(3);
                }
            });
        }
    });
    
    // Boutons suivants
    document.querySelectorAll('.btn-next').forEach(btn => {
        if (btn.closest('#screen2c')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = btn.closest('.form-step');
                if (step && step.id === 'cStep1') {
                    cNext(1);
                } else if (step && step.id === 'cStep2') {
                    cNext(2);
                } else if (step && step.id === 'cStep3') {
                    cNext(3);
                }
            });
        }
    });
    
    // Bouton de soumission
    const submitBtn = document.getElementById('cSubmitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            submitCollecteur();
        });
    }
}

// ============================================
// GESTION DE LA SESSION
// ============================================

function checkExistingSession() {
    try {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        const role = localStorage.getItem(CONFIG.ROLE_KEY);
        
        if (token && userJson && userJson !== 'undefined' && userJson !== 'null') {
            const user = JSON.parse(userJson);
            currentToken = token;
            currentUser = user;
            currentRole = role;
            
            console.log('✅ Session existante:', { role: currentRole, user: currentUser?.nomComplet });
            
            // Rediriger vers le bon dashboard
            redirectToDashboard();
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement de la session:', error);
        clearSession();
    }
}

function saveAuthData(token, user, role) {
    currentToken = token;
    currentUser = user;
    currentRole = role;
    
    try {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
        if (role) {
            localStorage.setItem(CONFIG.ROLE_KEY, role);
        }
        console.log('✅ Données sauvegardées pour', role, user?.nomComplet);
    } catch (error) {
        console.error('❌ Erreur sauvegarde localStorage:', error);
    }
}

function clearSession() {
    currentToken = null;
    currentUser = null;
    currentRole = null;
    
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
}

function redirectToDashboard() {
    if (currentRole === 'producteur') {
        window.location.href = 'producteur.html';
    } else if (currentRole === 'collecteur') {
        window.location.href = 'collecteur.html';
    }
}

// ============================================
// SÉLECTION DU RÔLE
// ============================================

function selectRole(role) {
    selectedRole = role;
    
    const cardProducteur = document.getElementById('cardProducteur');
    const cardCollecteur = document.getElementById('cardCollecteur');
    const checkProducteur = document.getElementById('checkProducteur');
    const checkCollecteur = document.getElementById('checkCollecteur');
    const btnContinue = document.getElementById('btnContinueRole');
    
    if (cardProducteur) cardProducteur.classList.remove('selected');
    if (cardCollecteur) cardCollecteur.classList.remove('selected');
    if (checkProducteur) checkProducteur.style.display = 'none';
    if (checkCollecteur) checkCollecteur.style.display = 'none';
    
    if (role === 'producteur') {
        cardProducteur?.classList.add('selected');
        if (checkProducteur) checkProducteur.style.display = 'flex';
    } else {
        cardCollecteur?.classList.add('selected');
        if (checkCollecteur) checkCollecteur.style.display = 'flex';
    }
    
    if (btnContinue) {
        btnContinue.classList.add('ready');
        btnContinue.innerHTML = `Continuer en tant que <strong>${role === 'producteur' ? 'Producteur' : 'Collecteur'}</strong> 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>`;
    }
}

function goToForm() {
    if (!selectedRole) {
        showMsg('pMsg', 'Veuillez sélectionner un rôle', 'error');
        return;
    }
    
    setScreen(selectedRole === 'producteur' ? 'screen2p' : 'screen2c');
    updateProgress(2);
}

// ============================================
// NAVIGATION ENTRE ÉCRANS
// ============================================

function setScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) {
        screen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goBack() {
    setScreen('screen1');
    updateProgress(1);
    selectedRole = null;
    
    const btnContinue = document.getElementById('btnContinueRole');
    if (btnContinue) {
        btnContinue.classList.remove('ready');
        btnContinue.innerHTML = `Continuer avec ce rôle
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>`;
    }
}

function updateProgress(step) {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById('dot' + i);
        const lbl = document.getElementById('lbl' + i);
        const line = document.getElementById('line' + i);
        
        if (!dot || !lbl) continue;
        
        dot.classList.remove('active', 'done');
        lbl.classList.remove('active');
        
        if (i < step) {
            dot.classList.add('done');
            dot.textContent = '✓';
        } else if (i === step) {
            dot.classList.add('active');
            dot.textContent = i === 4 ? '✓' : i.toString();
            lbl.classList.add('active');
        } else {
            dot.textContent = i === 4 ? '✓' : i.toString();
        }
        
        if (line) {
            line.classList.toggle('done', i < step);
        }
    }
}

// ============================================
// PRODUCTEUR - GESTION DES ÉTAPES
// ============================================

function pShowStep(n) {
    document.querySelectorAll('#screen2p .form-step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById('pStep' + n);
    if (step) {
        step.classList.add('active');
        pCurrentStep = n;
    }
}

function pPrev(n) {
    pShowStep(n);
}

function pNext(from) {
    if (!pValidate(from)) return;
    if (from === 3) buildPRecap();
    pShowStep(from + 1);
}

function pValidate(step) {
    let ok = true;
    
    if (step === 1) {
        const email = document.getElementById('p-email');
        const phone = document.getElementById('p-phone');
        const pwd = document.getElementById('p-pwd');
        const confirm = document.getElementById('p-pwdConfirm');
        
        ok = setErr('f-p-email', !email || !email.value || !email.value.includes('@')) && ok;
        ok = setErr('f-p-phone', !phone || !phone.value || phone.value.length < 8) && ok;
        ok = setErr('f-p-pwd', !pwd || !pwd.value || pwd.value.length < 8) && ok;
        ok = setErr('f-p-pwdConfirm', !pwd || !confirm || pwd.value !== confirm.value) && ok;
    }
    
    if (step === 2) {
        const name = document.getElementById('p-name');
        const type = document.querySelector('input[name="p-type"]:checked');
        
        ok = setErr('f-p-name', !name || !name.value.trim()) && ok;
        
        const typeErr = document.getElementById('p-type-err');
        if (!type) {
            if (typeErr) typeErr.style.display = 'block';
            ok = false;
        } else {
            if (typeErr) typeErr.style.display = 'none';
        }
    }
    
    if (step === 3) {
        const addr = document.getElementById('p-address');
        const neigh = document.getElementById('p-neighborhood');
        const muni = document.getElementById('p-municipality');
        
        ok = setErr('f-p-address', !addr || !addr.value.trim()) && ok;
        ok = setErr('f-p-neighborhood', !neigh || !neigh.value.trim()) && ok;
        ok = setErr('f-p-municipality', !muni || !muni.value.trim()) && ok;
    }
    
    return ok;
}

function buildPRecap() {
    const type = document.querySelector('input[name="p-type"]:checked');
    const typeLabels = {
        menage: '🏠 Ménage',
        commerce: '🏪 Commerce',
        entreprise: '🏭 Entreprise',
        administration: '🏛️ Administration'
    };
    
    const recap = document.getElementById('pRecap');
    if (recap) {
        recap.innerHTML = `
            <div class="recap-item">
                <div class="recap-label">Email</div>
                <div class="recap-val">${document.getElementById('p-email')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Téléphone</div>
                <div class="recap-val">${document.getElementById('p-phone')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Nom</div>
                <div class="recap-val">${document.getElementById('p-name')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Type</div>
                <div class="recap-val">${type ? typeLabels[type.value] : '–'}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Adresse</div>
                <div class="recap-val">${document.getElementById('p-address')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Localisation</div>
                <div class="recap-val">${document.getElementById('p-neighborhood')?.value || ''}, ${document.getElementById('p-municipality')?.value || ''}</div>
            </div>
        `;
    }
}

// ============================================
// COLLECTEUR - GESTION DES ÉTAPES
// ============================================

function cShowStep(n) {
    document.querySelectorAll('#screen2c .form-step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById('cStep' + n);
    if (step) {
        step.classList.add('active');
        cCurrentStep = n;
    }
}

function cPrev(n) {
    cShowStep(n);
}

function cNext(from) {
    if (!cValidate(from)) return;
    if (from === 3) buildCRecap();
    cShowStep(from + 1);
}

function cValidate(step) {
    let ok = true;
    
    if (step === 1) {
        const email = document.getElementById('c-email');
        const phone = document.getElementById('c-phone');
        const pwd = document.getElementById('c-pwd');
        const confirm = document.getElementById('c-pwdConfirm');
        
        ok = setErr('f-c-email', !email || !email.value || !email.value.includes('@')) && ok;
        ok = setErr('f-c-phone', !phone || !phone.value || phone.value.length < 8) && ok;
        ok = setErr('f-c-pwd', !pwd || !pwd.value || pwd.value.length < 8) && ok;
        ok = setErr('f-c-pwdConfirm', !pwd || !confirm || pwd.value !== confirm.value) && ok;
    }
    
    if (step === 2) {
        const name = document.getElementById('c-name');
        const type = document.querySelector('input[name="c-type"]:checked');
        
        ok = setErr('f-c-name', !name || !name.value.trim()) && ok;
        
        const typeErr = document.getElementById('c-type-err');
        if (!type) {
            if (typeErr) typeErr.style.display = 'block';
            ok = false;
        } else {
            if (typeErr) typeErr.style.display = 'none';
        }
    }
    
    if (step === 3) {
        const zone = document.getElementById('c-zone');
        ok = setErr('f-c-zone', !zone || !zone.value.trim()) && ok;
    }
    
    return ok;
}

function buildCRecap() {
    const type = document.querySelector('input[name="c-type"]:checked');
    
    const recap = document.getElementById('cRecap');
    if (recap) {
        recap.innerHTML = `
            <div class="recap-item">
                <div class="recap-label">Email</div>
                <div class="recap-val">${document.getElementById('c-email')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Téléphone</div>
                <div class="recap-val">${document.getElementById('c-phone')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Nom</div>
                <div class="recap-val">${document.getElementById('c-name')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Type</div>
                <div class="recap-val">${type ? '🧑‍💼 ' + type.value.charAt(0).toUpperCase() + type.value.slice(1) : '–'}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Zone</div>
                <div class="recap-val">${document.getElementById('c-zone')?.value || ''}</div>
            </div>
            <div class="recap-item">
                <div class="recap-label">Communes</div>
                <div class="recap-val">${document.getElementById('c-communes')?.value || '–'}</div>
            </div>
        `;
    }
}

// ============================================
// SOUMISSION DES FORMULAIRES - PRODUCTEUR
// ============================================

async function submitProducteur() {
    const cguCheck = document.getElementById('pCguCheck');
    
    if (!cguCheck || !cguCheck.checked) {
        showMsg('pMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
        return;
    }
    
    const btn = document.getElementById('pSubmitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Envoi en cours...';
    }
    
    const type = document.querySelector('input[name="p-type"]:checked');
    
    const payload = {
        email: document.getElementById('p-email')?.value || '',
        telephone: document.getElementById('p-phone')?.value || '',
        motDePasse: document.getElementById('p-pwd')?.value || '',
        nomComplet: document.getElementById('p-name')?.value || '',
        typeProducteur: type ? type.value : '',
        adresse: document.getElementById('p-address')?.value || '',
        quartier: document.getElementById('p-neighborhood')?.value || '',
        commune: document.getElementById('p-municipality')?.value || '',
        latitude: parseFloat(document.getElementById('p-lat')?.value) || null,
        longitude: parseFloat(document.getElementById('p-lng')?.value) || null,
        cguAcceptees: true
    };
    
    try {
        console.log('📤 Inscription producteur:', payload.email);
        console.log('📡 Envoi vers:', `${CONFIG.API_URL}/api/auth/inscription`);
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        console.log('📥 Réponse:', data);
        
        if (response.ok && (data.success || data.token || data.producteur)) {
            console.log('✅ Inscription producteur réussie');
            
            // Récupérer le token et l'utilisateur
            const token = data.token || data.accessToken;
            const userData = data.producteur || data.user || data.utilisateur || data;
            
            if (token && userData) {
                saveAuthData(token, userData, 'producteur');
            }
            
            showSuccess('producteur', document.getElementById('p-name')?.value || '');
            
            // Rediriger vers le dashboard producteur
            setTimeout(() => {
                window.location.href = 'producteur.html';
            }, 2000);
            
        } else {
            throw new Error(data.message || data.erreur || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('❌ Erreur inscription producteur:', error);
        showMsg('pMsg', error.message, 'error');
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🚀 Créer mon compte <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    }
}

// ============================================
// SOUMISSION DES FORMULAIRES - COLLECTEUR
// ============================================

async function submitCollecteur() {
    const cguCheck = document.getElementById('cCguCheck');
    
    if (!cguCheck || !cguCheck.checked) {
        showMsg('cMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
        return;
    }
    
    // Vérification des photos CNI
    const cniRectoFile = document.getElementById('collecteur-cni-recto-file')?.files[0];
    const cniVersoFile = document.getElementById('collecteur-cni-verso-file')?.files[0];
    
    if (!cniRectoFile) {
        showMsg('cMsg', 'Veuillez charger la photo recto de votre CNI', 'error');
        return;
    }
    
    if (!cniVersoFile) {
        showMsg('cMsg', 'Veuillez charger la photo verso de votre CNI', 'error');
        return;
    }
    
    const btn = document.getElementById('cSubmitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Envoi en cours...';
    }
    
    const type = document.querySelector('input[name="c-type"]:checked');
    
    // Construction de l'objet zone d'intervention
    const quartiers = document.getElementById('c-quarters')?.value
        .split(',')
        .map(q => q.trim())
        .filter(q => q) || [];
    
    const communes = document.getElementById('c-communes')?.value
        .split(',')
        .map(c => c.trim())
        .filter(c => c) || [];
    
    // Utiliser FormData pour gérer les fichiers
    const formData = new FormData();
    
    formData.append('email', document.getElementById('c-email')?.value || '');
    formData.append('telephone', document.getElementById('c-phone')?.value || '');
    formData.append('motDePasse', document.getElementById('c-pwd')?.value || '');
    formData.append('nomComplet', document.getElementById('c-name')?.value || '');
    formData.append('typeCollecteur', type ? type.value : '');
    formData.append('numeroIdentite', document.getElementById('c-identity')?.value || '');
    formData.append('zoneInterventionNom', document.getElementById('c-zone')?.value || '');
    formData.append('quartiersHabituels', JSON.stringify(quartiers));
    formData.append('communesIntervention', JSON.stringify(communes));
    formData.append('cguAcceptees', 'true');
    
    // Ajouter la photo de profil
    const photoFile = document.getElementById('c-photo-file')?.files[0];
    if (photoFile) {
        formData.append('photoProfil', photoFile);
    }
    
    // Ajouter les photos CNI
    if (cniRectoFile) {
        formData.append('photoCniRecto', cniRectoFile);
    }
    
    if (cniVersoFile) {
        formData.append('photoCniVerso', cniVersoFile);
    }
    
    try {
        console.log('📤 Inscription collecteur avec fichiers...');
        
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/inscription`, {
            method: 'POST',
            body: formData
            // ⚠️ Ne PAS mettre 'Content-Type' header, le navigateur le fera automatiquement avec la boundary
        });
        
        const data = await response.json();
        console.log('📥 Réponse:', data);
        
        if (response.ok && data.success) {
            console.log('✅ Inscription collecteur réussie');
            
            // Sauvegarder les données
            if (data.token && data.collecteur) {
                saveAuthData(data.token, data.collecteur, 'collecteur');
            }
            
            showSuccess('collecteur', document.getElementById('c-name')?.value || '');
            
            // Rediriger vers le dashboard collecteur
            setTimeout(() => {
                window.location.href = 'collecteur.html';
            }, 2000);
            
        } else {
            throw new Error(data.message || data.erreur || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('❌ Erreur inscription collecteur:', error);
        showMsg('cMsg', error.message, 'error');
        
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🚀 Créer mon compte <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    }
}

// ============================================
// ÉCRAN DE SUCCÈS
// ============================================

function showSuccess(role, name) {
    updateProgress(4);
    setScreen('screen3');
    
    const anim = document.getElementById('successAnim');
    if (anim) {
        anim.textContent = role === 'producteur' ? '🎉' : '🚛';
    }
    
    const title = document.getElementById('successTitle');
    if (title) {
        const firstName = name.split(' ')[0];
        title.innerHTML = `Bienvenue, <em>${firstName}</em> !`;
    }
    
    const sub = document.getElementById('successSub');
    if (sub) {
        sub.textContent = role === 'producteur'
            ? 'Votre compte Producteur a été créé avec succès. Redirection vers votre espace...'
            : 'Votre compte Collecteur a été créé avec succès. Redirection vers votre espace...';
    }
    
    const actions = document.getElementById('successActions');
    if (actions) {
        actions.innerHTML = `
            <button class="btn-go primary" onclick="window.location.href='${role === 'producteur' ? 'producteur.html' : 'collecteur.html'}'">
                Accéder à mon espace →
            </button>
            <button class="btn-go ghost" onclick="window.location.href='in.html'">
                Retour à l'accueil
            </button>
        `;
    }
}

// ============================================
// UTILITAIRES
// ============================================

function setErr(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.toggle('has-error', hasError);
    }
    return !hasError;
}

function showMsg(id, msg, type) {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.textContent = msg;
    el.className = 'msg-box ' + type;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

function togglePwd(inputId, btn) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function checkPwd(input, barId, lblId) {
    const v = input.value;
    const bar = document.getElementById(barId);
    const lbl = document.getElementById(lblId);
    
    if (!bar || !lbl) return;
    
    let score = 0;
    
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    
    const map = [
        { pct: '20%', color: '#dc2626', text: 'Très faible' },
        { pct: '40%', color: '#f97316', text: 'Faible' },
        { pct: '65%', color: '#eab308', text: 'Moyen' },
        { pct: '85%', color: '#22c55e', text: 'Fort' },
        { pct: '100%', color: '#2d8a5e', text: 'Très fort' }
    ];
    
    const m = v.length === 0 
        ? { pct: '0%', color: 'transparent', text: '–' } 
        : map[Math.min(score, 4)];
    
    bar.style.width = m.pct;
    bar.style.background = m.color;
    lbl.textContent = m.text;
}

function getGPS() {
    const btn = document.getElementById('gpsBtn');
    if (!btn) return;
    
    if (!navigator.geolocation) {
        btn.textContent = '❌ Non disponible';
        return;
    }
    
    btn.textContent = '📡 Localisation...';
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = document.getElementById('p-lat');
            const lng = document.getElementById('p-lng');
            
            if (lat) lat.value = pos.coords.latitude.toFixed(6);
            if (lng) lng.value = pos.coords.longitude.toFixed(6);
            
            btn.textContent = '✅ Position enregistrée';
        },
        () => {
            btn.textContent = '❌ Erreur de localisation';
        }
    );
}

// Exposer les fonctions globalement
window.selectRole = selectRole;
window.goToForm = goToForm;
window.goBack = goBack;
window.togglePwd = togglePwd;
window.checkPwd = checkPwd;
window.getGPS = getGPS;
window.pNext = pNext;
window.pPrev = pPrev;
window.cNext = cNext;
window.cPrev = cPrev;
window.submitProducteur = submitProducteur;
window.submitCollecteur = submitCollecteur;