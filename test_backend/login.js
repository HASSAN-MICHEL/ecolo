// // ============================================
// // login.js - Gestion unifiée de l'authentification EcoCollect
// // Version 1.0 - Thème clair
// // ============================================

// // Configuration
// const CONFIG = {
//     API_URL: localStorage.getItem('ecocollect_api_url') || 'http://localhost:3000',
//     TOKEN_KEY: 'ecocollect_token',
//     USER_KEY: 'ecocollect_user',
//     USER_ROLE_KEY: 'ecocollect_role'
// };

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
    
//     // Vérifier si l'utilisateur est déjà connecté
//     loadUserFromStorage();
    
//     // Afficher l'URL de l'API
//     updateApiUrlDisplay();
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
    
//     // Lien "Se connecter"
//     document.querySelectorAll('.auth-link a').forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             window.location.href = 'index.html';
//         });
//     });
    
//     // Nettoyage des erreurs
//     document.querySelectorAll('input, select, textarea').forEach(el => {
//         el.addEventListener('input', () => {
//             el.closest('.field')?.classList.remove('has-error');
//         });
//     });
// }

// function initProducteurForm() {
//     // Boutons de navigation
//     document.querySelectorAll('.btn-back').forEach(btn => {
//         if (btn.closest('#screen2p')) {
//             btn.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 if (btn.textContent.includes('Retour')) {
//                     const step = btn.closest('.form-step');
//                     if (step.id === 'pStep1') {
//                         goBack();
//                     } else if (step.id === 'pStep2') {
//                         pPrev(1);
//                     } else if (step.id === 'pStep3') {
//                         pPrev(2);
//                     } else if (step.id === 'pStep4') {
//                         pPrev(3);
//                     }
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
//                 if (step.id === 'pStep1') {
//                     pNext(1);
//                 } else if (step.id === 'pStep2') {
//                     pNext(2);
//                 } else if (step.id === 'pStep3') {
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
//                 if (step.id === 'cStep1') {
//                     goBack();
//                 } else if (step.id === 'cStep2') {
//                     cPrev(1);
//                 } else if (step.id === 'cStep3') {
//                     cPrev(2);
//                 } else if (step.id === 'cStep4') {
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
//                 if (step.id === 'cStep1') {
//                     cNext(1);
//                 } else if (step.id === 'cStep2') {
//                     cNext(2);
//                 } else if (step.id === 'cStep3') {
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
    
//     // Upload photo
//     const photoUpload = document.getElementById('photoUploadZone');
//     if (photoUpload) {
//         photoUpload.addEventListener('click', () => {
//             document.getElementById('c-photo-file').click();
//         });
//     }
    
//     const photoFile = document.getElementById('c-photo-file');
//     if (photoFile) {
//         photoFile.addEventListener('change', previewPhoto);
//     }
// }

// // ============================================
// // GESTION DE LA SESSION
// // ============================================

// function loadUserFromStorage() {
//     try {
//         const token = localStorage.getItem(CONFIG.TOKEN_KEY);
//         const userJson = localStorage.getItem(CONFIG.USER_KEY);
//         const role = localStorage.getItem(CONFIG.USER_ROLE_KEY);
        
//         if (token && userJson && userJson !== 'undefined' && userJson !== 'null') {
//             const user = JSON.parse(userJson);
//             currentToken = token;
//             currentUser = user;
//             currentRole = role;
            
//             console.log('✅ Session restaurée:', { role: currentRole, user: currentUser.nomComplet });
            
//             // Rediriger vers l'application appropriée
//             redirectToApp();
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
//         localStorage.setItem(CONFIG.USER_ROLE_KEY, role);
//         console.log('✅ Données sauvegardées pour', role, user.nomComplet);
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

// function redirectToApp() {
//     if (currentRole === 'producteur') {
//         window.location.href = 'producteur-dashboard.html';
//     } else if (currentRole === 'collecteur') {
//         window.location.href = 'collecteur-dashboard.html';
//     } else {
//         window.location.href = 'index.html';
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
// // SOUMISSION DES FORMULAIRES
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
//         mot_de_passe: document.getElementById('p-pwd')?.value || '',
//         nom_complet: document.getElementById('p-name')?.value || '',
//         type_producteur: type ? type.value : '',
//         adresse: document.getElementById('p-address')?.value || '',
//         quartier: document.getElementById('p-neighborhood')?.value || '',
//         commune: document.getElementById('p-municipality')?.value || '',
//         latitude: parseFloat(document.getElementById('p-lat')?.value) || null,
//         longitude: parseFloat(document.getElementById('p-lng')?.value) || null,
//         cgu_acceptees: true 
//     };
    
//     try {
//         console.log('📤 Inscription producteur:', payload.email);
        
//         const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
        
//         const data = await response.json();
        
//         if (response.ok && data.success) {
//             console.log('✅ Inscription producteur réussie');
            
//             // Sauvegarder les données
//             if (data.token && data.producteur) {
//                 saveAuthData(data.token, data.producteur, 'producteur');
//             }
            
//             showSuccess('producteur', document.getElementById('p-name')?.value || '');
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

// async function submitCollecteur() {
//     const cguRow = document.getElementById('cCguRow');
//     if (!cguRow || !cguRow.classList.contains('checked')) {
//         showMsg('cMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
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
    
//     const payload = {
//         email: document.getElementById('c-email')?.value || '',
//         telephone: document.getElementById('c-phone')?.value || '',
//         mot_de_passe: document.getElementById('c-pwd')?.value || '',
//         nom_complet: document.getElementById('c-name')?.value || '',
//         type_collecteur: type ? type.value : '',
//         numero_identite: document.getElementById('c-identity')?.value || null,
//         zone_intervention: {
//             nom: document.getElementById('c-zone')?.value || '',
//             quartiers: quartiers,
//             communes: communes
//         },
//         cgu_acceptees: true
//     };
    
//     // Ajouter la photo si présente
//     const photoFile = document.getElementById('c-photo-file')?.files[0];
//     if (photoFile) {
//         const reader = new FileReader();
//         reader.onload = async function(e) {
//             payload.photo_profil = e.target.result;
//             await sendCollecteurRequest(payload, btn);
//         };
//         reader.readAsDataURL(photoFile);
//     } else {
//         await sendCollecteurRequest(payload, btn);
//     }
// }

// async function sendCollecteurRequest(payload, btn) {
//     try {
//         console.log('📤 Inscription collecteur:', payload.email);
        
//         const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/inscription`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(payload)
//         });
        
//         const data = await response.json();
        
//         if (response.ok && data.success) {
//             console.log('✅ Inscription collecteur réussie');
            
//             // Sauvegarder les données
//             if (data.token && data.collecteur) {
//                 saveAuthData(data.token, data.collecteur, 'collecteur');
//             }
            
//             showSuccess('collecteur', document.getElementById('c-name')?.value || '');
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
//             ? 'Votre compte Producteur a été créé avec succès. Vous pouvez maintenant déclarer vos déchets et suivre vos collectes.'
//             : 'Votre compte Collecteur a été créé. Il sera validé par un superviseur. Vous serez notifié dès l\'activation.';
//     }
    
//     const actions = document.getElementById('successActions');
//     if (actions) {
//         actions.innerHTML = `
//             <button class="btn-go primary" onclick="window.location.href='${role === 'producteur' ? 'producteur-dashboard.html' : 'collecteur-dashboard.html'}'">
//                 Accéder à l'application →
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

// function toggleCgu(rowId, checkId) {
//     const row = document.getElementById(rowId);
//     if (row) {
//         row.classList.toggle('checked');
//     }
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
//         const zone = document.getElementById('photoUploadZone');
        
//         if (img) {
//             img.src = e.target.result;
//             img.style.display = 'block';
//         }
//         if (emoji) emoji.style.display = 'none';
//         if (zone) zone.style.borderStyle = 'solid';
//     };
//     reader.readAsDataURL(input.files[0]);
// }

// function updateApiUrlDisplay() {
//     const apiDisplay = document.getElementById('apiUrl');
//     if (apiDisplay) {
//         apiDisplay.textContent = CONFIG.API_URL;
//     }
// }

// // ============================================
// // FONCTIONS DE TEST DE CONNEXION API
// // ============================================

// async function testApiConnection() {
//     try {
//         const response = await fetch(`${CONFIG.API_URL}/api/health`);
//         if (response.ok) {
//             console.log('✅ Connexion API établie');
//             return true;
//         } else {
//             console.warn('⚠️ API répond mais avec erreur');
//             return false;
//         }
//     } catch (error) {
//         console.error('❌ Impossible de se connecter à l\'API:', error);
//         return false;
//     }
// }

// // Exposer les fonctions globalement
// window.selectRole = selectRole;
// window.goToForm = goToForm;
// window.goBack = goBack;
// window.toggleCgu = toggleCgu;
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
// window.testApiConnection = testApiConnection;



// ============================================
// login.js - Gestion unifiée de l'authentification EcoCollect
// Version corrigée - Gestion des CGU
// ============================================

// Configuration
const CONFIG = {
    API_URL: localStorage.getItem('ecocollect_api_url') || 'http://localhost:3000',
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    USER_ROLE_KEY: 'ecocollect_role'
};

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
    loadUserFromStorage();
    
    // Afficher l'URL de l'API
    updateApiUrlDisplay();
});

function initEventListeners() {
    // Navigation
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
    
    // Lien "Se connecter"
    document.querySelectorAll('.auth-link a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    });
    
    // Nettoyage des erreurs
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.closest('.field')?.classList.remove('has-error');
        });
    });
    
    // Ajouter des écouteurs pour les cases CGU
    const pCguRow = document.getElementById('pCguRow');
    if (pCguRow) {
        pCguRow.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('checked');
        });
    }
    
    const cCguRow = document.getElementById('cCguRow');
    if (cCguRow) {
        cCguRow.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('checked');
        });
    }
}

function initProducteurForm() {
    // Boutons de navigation
    document.querySelectorAll('.btn-back').forEach(btn => {
        if (btn.closest('#screen2p')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.textContent.includes('Retour')) {
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
    
    // Upload photo
    const photoUpload = document.getElementById('photoUploadZone');
    if (photoUpload) {
        photoUpload.addEventListener('click', () => {
            document.getElementById('c-photo-file').click();
        });
    }
    
    const photoFile = document.getElementById('c-photo-file');
    if (photoFile) {
        photoFile.addEventListener('change', previewPhoto);
    }
}

// ============================================
// GESTION DE LA SESSION
// ============================================

function loadUserFromStorage() {
    try {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        const role = localStorage.getItem(CONFIG.USER_ROLE_KEY);
        
        if (token && userJson && userJson !== 'undefined' && userJson !== 'null') {
            const user = JSON.parse(userJson);
            currentToken = token;
            currentUser = user;
            currentRole = role;
            
            console.log('✅ Session restaurée:', { role: currentRole, user: currentUser?.nomComplet });
            
            // Rediriger vers l'application appropriée
            redirectToApp();
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
            localStorage.setItem(CONFIG.USER_ROLE_KEY, role);
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
    localStorage.removeItem(CONFIG.USER_ROLE_KEY);
}

function redirectToApp() {
    if (currentRole === 'producteur') {
        window.location.href = 'producteur-dashboard.html';
    } else if (currentRole === 'collecteur') {
        window.location.href = 'collecteur-dashboard.html';
    } else {
        window.location.href = 'index.html';
    }
}

// ============================================
// SÉLECTION DU RÔLE
// ============================================

function selectRole(role) {
    selectedRole = role;
    
    const cardProducteur = document.getElementById('cardProducteur');
    const cardCollecteur = document.getElementById('cardCollecteur');
    const btnContinue = document.getElementById('btnContinueRole');
    
    if (cardProducteur) {
        cardProducteur.classList.remove('selected');
    }
    if (cardCollecteur) {
        cardCollecteur.classList.remove('selected');
    }
    
    if (role === 'producteur') {
        cardProducteur?.classList.add('selected');
    } else {
        cardCollecteur?.classList.add('selected');
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
        
        if (i < 4) {
            const line = document.getElementById('line' + i);
            if (line) {
                line.classList.toggle('done', i < step);
            }
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
// SOUMISSION DES FORMULAIRES
// ============================================

async function submitProducteur() {
    const cguRow = document.getElementById('pCguRow');
    
    // Vérifier si la case CGU est cochée
    if (!cguRow || !cguRow.classList.contains('checked')) {
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
        mot_de_passe: document.getElementById('p-pwd')?.value || '',
        nom_complet: document.getElementById('p-name')?.value || '',
        type_producteur: type ? type.value : '',
        adresse: document.getElementById('p-address')?.value || '',
        quartier: document.getElementById('p-neighborhood')?.value || '',
        commune: document.getElementById('p-municipality')?.value || '',
        latitude: parseFloat(document.getElementById('p-lat')?.value) || null,
        longitude: parseFloat(document.getElementById('p-lng')?.value) || null,
        cgu_acceptees: true
    };
    
    try {
        console.log('📤 Inscription producteur:', payload.email);
        
        const response = await fetch(`${CONFIG.API_URL}/api/auth/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Inscription producteur réussie');
            
            // Sauvegarder les données
            if (data.token && data.producteur) {
                saveAuthData(data.token, data.producteur, 'producteur');
            }
            
            showSuccess('producteur', document.getElementById('p-name')?.value || '');
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

async function submitCollecteur() {
    const cguRow = document.getElementById('cCguRow');
    
    // Vérifier si la case CGU est cochée
    if (!cguRow || !cguRow.classList.contains('checked')) {
        showMsg('cMsg', 'Vous devez accepter les Conditions Générales d\'Utilisation', 'error');
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
    
    const payload = {
        email: document.getElementById('c-email')?.value || '',
        telephone: document.getElementById('c-phone')?.value || '',
        mot_de_passe: document.getElementById('c-pwd')?.value || '',
        nom_complet: document.getElementById('c-name')?.value || '',
        type_collecteur: type ? type.value : '',
        numero_identite: document.getElementById('c-identity')?.value || null,
        zone_intervention: {
            nom: document.getElementById('c-zone')?.value || '',
            quartiers: quartiers,
            communes: communes
        },
        cgu_acceptees: true
    };
    
    // Ajouter la photo si présente
    const photoFile = document.getElementById('c-photo-file')?.files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            payload.photo_profil = e.target.result;
            await sendCollecteurRequest(payload, btn);
        };
        reader.readAsDataURL(photoFile);
    } else {
        await sendCollecteurRequest(payload, btn);
    }
}

async function sendCollecteurRequest(payload, btn) {
    try {
        console.log('📤 Inscription collecteur:', payload.email);
        
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('✅ Inscription collecteur réussie');
            
            // Sauvegarder les données
            if (data.token && data.collecteur) {
                saveAuthData(data.token, data.collecteur, 'collecteur');
            }
            
            showSuccess('collecteur', document.getElementById('c-name')?.value || '');
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
            ? 'Votre compte Producteur a été créé avec succès. Vous pouvez maintenant déclarer vos déchets et suivre vos collectes.'
            : 'Votre compte Collecteur a été créé. Il sera validé par un superviseur. Vous serez notifié dès l\'activation.';
    }
    
    const actions = document.getElementById('successActions');
    if (actions) {
        actions.innerHTML = `
            <button class="btn-go primary" onclick="window.location.href='${role === 'producteur' ? 'producteur-dashboard.html' : 'collecteur-dashboard.html'}'">
                Accéder à l'application →
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

function toggleCgu(rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.classList.toggle('checked');
    }
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

function previewPhoto(input) {
    if (!input || !input.files || !input.files[0]) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.getElementById('photoImg');
        const emoji = document.getElementById('photoEmoji');
        const zone = document.getElementById('photoUploadZone');
        
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
        }
        if (emoji) emoji.style.display = 'none';
        if (zone) zone.style.borderStyle = 'solid';
    };
    reader.readAsDataURL(input.files[0]);
}

function updateApiUrlDisplay() {
    const apiDisplay = document.getElementById('apiUrl');
    if (apiDisplay) {
        apiDisplay.textContent = CONFIG.API_URL;
    }
}

// ============================================
// FONCTIONS DE TEST DE CONNEXION API
// ============================================

async function testApiConnection() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/health`);
        if (response.ok) {
            console.log('✅ Connexion API établie');
            return true;
        } else {
            console.warn('⚠️ API répond mais avec erreur');
            return false;
        }
    } catch (error) {
        console.error('❌ Impossible de se connecter à l\'API:', error);
        return false;
    }
}

// Exposer les fonctions globalement
window.selectRole = selectRole;
window.goToForm = goToForm;
window.goBack = goBack;
window.toggleCgu = toggleCgu;
window.togglePwd = togglePwd;
window.checkPwd = checkPwd;
window.getGPS = getGPS;
window.previewPhoto = previewPhoto;
window.pNext = pNext;
window.pPrev = pPrev;
window.cNext = cNext;
window.cPrev = cPrev;
window.submitProducteur = submitProducteur;
window.submitCollecteur = submitCollecteur;
window.testApiConnection = testApiConnection;