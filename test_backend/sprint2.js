

// sprint2.js - VERSION COMPLÈTE AVEC GESTION DES PHOTOS CNI
let API_URL = localStorage.getItem('api_url') || 'http://localhost:3000';
let currentToken = null;
let currentUser = null;
let currentRole = 'collecteur';
let selectedMissionId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('apiUrl').value = API_URL;
    setupEventListeners();
    testConnection();
    
    // Ajouter un indicateur pour le champ mission ID du gestionnaire
    const missionIdField = document.getElementById('valider-mission-id');
    if (missionIdField) {
        missionIdField.placeholder = "Cliquez sur une mission pour la sélectionner";
        missionIdField.style.backgroundColor = '#f9f9f9';
    }
    
    // Vérifier si un token gestionnaire existe dans localStorage
    const savedToken = localStorage.getItem('gestionnaire_token');
    const savedUser = localStorage.getItem('gestionnaire_user');
    
    if (savedToken && savedUser) {
        currentToken = savedToken;
        currentUser = JSON.parse(savedUser);
        console.log('✅ Token restauré depuis localStorage');
        
        testGestionnaireConnexion().then(valid => {
            if (valid) {
                console.log('✅ Token valide');
                if (currentRole === 'gestionnaire') loadGestionnaireData();
            } else {
                console.log('❌ Token invalide, nettoyage...');
                localStorage.removeItem('gestionnaire_token');
                localStorage.removeItem('gestionnaire_user');
            }
        });
    }
});

async function testConnection() {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        console.log('✅ Connexion API établie:', data);
    } catch (error) {
        console.error('❌ Impossible de se connecter à l\'API:', error);
        showMessage(null, 'Impossible de se connecter au serveur. Vérifiez l\'URL.', 'error');
    }
}

function setupEventListeners() {
    // Navigation des rôles
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            switchRole(role);
        });
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.panel');
            const tabId = btn.dataset.tab;
            switchTab(panel, tabId);
        });
    });

    // Sauvegarde URL API
    document.getElementById('saveApiUrl').addEventListener('click', () => {
        API_URL = document.getElementById('apiUrl').value;
        localStorage.setItem('api_url', API_URL);
        showMessage(null, 'URL API sauvegardée', 'success');
    });

    // ========== COLLECTEUR ==========
    document.getElementById('collecteur-inscription-form')?.addEventListener('submit', handleCollecteurInscription);
    document.getElementById('collecteur-connexion-form')?.addEventListener('submit', handleCollecteurConnexion);
    document.getElementById('collecteur-deconnexion')?.addEventListener('click', handleDeconnexion);
    document.getElementById('refresh-missions-dispo')?.addEventListener('click', loadMissionsDisponibles);
    document.getElementById('filter-mes-missions')?.addEventListener('change', loadMesMissions);
    document.getElementById('mission-accepter')?.addEventListener('click', () => handleMissionAction('accepter'));
    document.getElementById('mission-demarrer')?.addEventListener('click', () => handleMissionAction('demarrer'));
    document.getElementById('mission-terminer')?.addEventListener('click', () => handleMissionAction('terminer'));
    document.getElementById('mission-choisir-depot')?.addEventListener('click', handleChoisirDepot);
    
    // NOUVEAU : Gestion des formulaires de profil
    document.getElementById('modifier-profil-form')?.addEventListener('submit', handleModifierProfil);
    document.getElementById('changer-mot-de-passe-form')?.addEventListener('submit', handleChangerMotDePasseCollecteur);
    
    // Upload photo
    document.getElementById('collecteur-photo-file')?.addEventListener('change', handlePhotoUpload);
    
    // NOUVEAU : Upload photos CNI
    document.getElementById('collecteur-cni-recto-file')?.addEventListener('change', (e) => handleCniUpload(e, 'recto'));
    document.getElementById('collecteur-cni-verso-file')?.addEventListener('change', (e) => handleCniUpload(e, 'verso'));

    // ========== GESTIONNAIRE ==========
    document.getElementById('gestionnaire-connexion-form')?.addEventListener('submit', handleGestionnaireConnexion);
    document.getElementById('refresh-missions-attente')?.addEventListener('click', loadMissionsEnAttente);
    document.getElementById('valider-mission-form')?.addEventListener('submit', handleValiderMission);
    document.getElementById('attribuer-credits-form')?.addEventListener('submit', handleAttribuerCredits);
    document.getElementById('gestionnaire-changer-mdp')?.addEventListener('submit', handleChangerMotDePasse);

    // ========== SUPERVISEUR ==========
    document.getElementById('superviseur-connexion-form')?.addEventListener('submit', handleSuperviseurConnexion);
    document.getElementById('refresh-collecteurs-attente')?.addEventListener('click', loadCollecteursEnAttente);
    document.getElementById('valider-collecteur-form')?.addEventListener('submit', handleValiderCollecteur);
    document.getElementById('refresh-gestionnaires')?.addEventListener('click', loadGestionnaires);
    document.getElementById('creer-gestionnaire-form')?.addEventListener('submit', handleCreerGestionnaire);
    document.getElementById('attribuer-mission-form')?.addEventListener('submit', handleAttribuerMission);
}

function switchRole(role) {
    currentRole = role;
    
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.role === role) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`panel-${role}`).classList.add('active');

    if (currentToken) {
        if (role === 'collecteur') loadCollecteurData();
        if (role === 'gestionnaire') loadGestionnaireData();
        if (role === 'superviseur') loadSuperviseurData();
    }
}

function switchTab(panel, tabId) {
    const tabs = panel.querySelectorAll('.tab-btn');
    const contents = panel.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    panel.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    panel.querySelector(`#${tabId}`).classList.add('active');
}

function showMessage(element, message, type = 'info') {
    if (!element) {
        console.log(`[${type}] ${message}`);
        alert(message);
        return;
    }
    element.className = `message ${type}`;
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// ========== GESTION PHOTOS ==========
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            preview.appendChild(img);
            preview.classList.add('has-image');
            document.getElementById('collecteur-photo').value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// NOUVEAU : Gestion upload photos CNI
function handleCniUpload(e, type) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const previewId = type === 'recto' ? 'cni-recto-preview' : 'cni-verso-preview';
            const inputId = type === 'recto' ? 'collecteur-cni-recto' : 'collecteur-cni-verso';
            const preview = document.getElementById(previewId);
            
            preview.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            preview.appendChild(img);
            preview.classList.add('has-image');
            document.getElementById(inputId).value = event.target.result;
            
            // Mettre à jour le texte
            const hint = preview.nextElementSibling;
            if (hint) hint.innerHTML = `<i class="fas fa-check-circle" style="color: #4CAF50;"></i> ${type === 'recto' ? 'Recto' : 'Verso'} chargé`;
        };
        reader.readAsDataURL(file);
    }
}

// }

// Remplacer handleCollecteurInscription
async function handleCollecteurInscription(e) {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('email', document.getElementById('collecteur-email').value);
    formData.append('telephone', document.getElementById('collecteur-telephone').value);
    formData.append('motDePasse', document.getElementById('collecteur-password').value);
    formData.append('nomComplet', document.getElementById('collecteur-nom').value);
    formData.append('typeCollecteur', document.getElementById('collecteur-type').value);
    formData.append('numeroIdentite', document.getElementById('collecteur-numero-identite').value);
    formData.append('zoneInterventionNom', document.getElementById('collecteur-zone-nom').value);
    formData.append('quartiersHabituels', document.getElementById('collecteur-quartiers').value);
    formData.append('communesIntervention', document.getElementById('collecteur-communes').value);
    formData.append('cguAcceptees', document.getElementById('collecteur-cgu').checked);
    
    // Ajouter les fichiers (pas de compression nécessaire)
    const photoFile = document.getElementById('collecteur-photo-file').files[0];
    if (photoFile) {
        formData.append('photoProfil', photoFile);
    }
    
    const cniRectoFile = document.getElementById('collecteur-cni-recto-file').files[0];
    if (cniRectoFile) {
        formData.append('photoCniRecto', cniRectoFile);
    }
    
    const cniVersoFile = document.getElementById('collecteur-cni-verso-file').files[0];
    if (cniVersoFile) {
        formData.append('photoCniVerso', cniVersoFile);
    }

    const messageDiv = document.getElementById('collecteur-inscription-message');

    try {
        console.log('📤 Envoi du formulaire avec fichiers...');
        
        const response = await fetch(`${API_URL}/api/collecteurs/inscription`, {
            method: 'POST',
            body: formData // Pas de headers Content-Type !
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(messageDiv, result.message, 'success');
            document.getElementById('collecteur-inscription-form').reset();
            
            // Réinitialiser les prévisualisations
            document.getElementById('photo-preview').innerHTML = '<i class="fas fa-camera"></i>';
            document.getElementById('cni-recto-preview').innerHTML = '<i class="fas fa-id-card"></i><span>Recto</span>';
            document.getElementById('cni-verso-preview').innerHTML = '<i class="fas fa-id-card"></i><span>Verso</span>';
        } else {
            throw new Error(result.message || result.erreur || 'Erreur inscription');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function handleCollecteurConnexion(e) {
    e.preventDefault();
    
    const data = {
        identifiant: document.getElementById('collecteur-login-identifiant').value,
        motDePasse: document.getElementById('collecteur-login-password').value
    };

    const messageDiv = document.getElementById('collecteur-connexion-message');

    try {
        console.log('🔑 Connexion collecteur:', data.identifiant);
        const response = await fetch(`${API_URL}/api/collecteurs/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            currentToken = result.token;
            currentUser = result.collecteur;
            
            document.getElementById('collecteur-connected-name').textContent = currentUser.nomComplet;
            document.getElementById('collecteur-connected-state').classList.remove('hidden');
            
            showMessage(messageDiv, 'Connexion réussie', 'success');
            loadCollecteurData();
        } else {
            throw new Error(result.message || 'Erreur connexion');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadCollecteurData() {
    if (!currentToken) return;
    
    try {
        await Promise.all([
            loadMissionsDisponibles(),
            loadMesMissions(),
            loadGains(),
            loadProfil(),
            loadDashboard()
        ]);
    } catch (error) {
        console.error('❌ Erreur chargement données collecteur:', error);
    }
}

async function loadMissionsDisponibles() {
    try {
        const response = await fetch(`${API_URL}/api/collecteurs/missions/disponibles`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();
        const container = document.getElementById('missions-disponibles');

        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="text-center">Aucune mission disponible</p>';
            } else {
                container.innerHTML = result.missions.map(m => `
                    <div class="item" onclick="window.selectMission('${m.id}')">
                        <div class="item-header">
                            <span class="item-title">Mission #${(m.id || '').substring(0,8)}</span>
                            <span class="badge badge-info">${m.type_dechet || 'Non spécifié'}</span>
                        </div>
                        <div class="item-body">
                            <p><i class="fas fa-user"></i> ${m.producteur_nom || 'Inconnu'}</p>
                            <p><i class="fas fa-map-marker"></i> ${m.adresse || 'Adresse non spécifiée'}</p>
                            <p><i class="fas fa-weight"></i> ${m.quantite || 0} ${m.unite || 'kg'}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function loadMesMissions() {
    const filter = document.getElementById('filter-mes-missions').value;
    
    try {
        const url = filter !== 'tous' 
            ? `${API_URL}/api/collecteurs/missions?statut=${filter}`
            : `${API_URL}/api/collecteurs/missions`;
            
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();
        const container = document.getElementById('mes-missions');

        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="text-center">Aucune mission</p>';
            } else {
                container.innerHTML = result.missions.map(m => `
                    <div class="item" onclick="window.selectMission('${m.id}')">
                        <div class="item-header">
                            <span class="item-title">Mission #${(m.id || '').substring(0,8)}</span>
                            <span class="badge ${getStatusBadgeClass(m.statut)}">${m.statut || 'inconnu'}</span>
                        </div>
                        <div class="item-body">
                            <p><i class="fas fa-user"></i> ${m.producteur_nom || 'Inconnu'}</p>
                            <p><i class="fas fa-weight"></i> ${m.quantite || 0} ${m.unite || 'kg'}</p>
                            ${m.poids_depose ? `<p><i class="fas fa-weight"></i> Poids déposé: ${m.poids_depose} kg</p>` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

function getStatusBadgeClass(status) {
    const classes = {
        'disponible': 'badge-info',
        'acceptee': 'badge-primary',
        'en_cours': 'badge-warning',
        'deposee': 'badge-secondary',
        'validee': 'badge-success'
    };
    return classes[status] || 'badge-secondary';
}

window.selectMission = function(missionId) {
    document.getElementById('mission-selected-id').textContent = missionId;
    document.getElementById('mission-actions').classList.remove('hidden');
}

async function handleMissionAction(action) {
    const missionId = document.getElementById('mission-selected-id').textContent;
    const messageDiv = document.getElementById('mission-action-message');
    
    if (!missionId) {
        showMessage(messageDiv, 'Veuillez sélectionner une mission', 'error');
        return;
    }
    
    let url = '';
    let method = 'POST';
    let body = {};

    switch(action) {
        case 'accepter':
            url = `${API_URL}/api/collecteurs/missions/${missionId}/accepter`;
            break;
        case 'demarrer':
            url = `${API_URL}/api/collecteurs/missions/${missionId}/demarrer`;
            break;
        case 'terminer':
            url = `${API_URL}/api/collecteurs/missions/${missionId}/terminer`;
            body = {
                photoPreuveUrl: document.getElementById('mission-photo-url').value,
                codeConfirmation: document.getElementById('mission-code').value,
                notes: document.getElementById('mission-notes').value,
                conformiteTri: document.getElementById('mission-conformite').value === 'true'
            };
            break;
    }

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: Object.keys(body).length ? JSON.stringify(body) : undefined
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Action effectuée avec succès', 'success');
            loadMissionsDisponibles();
            loadMesMissions();
            document.getElementById('mission-selected-id').textContent = '';
            document.getElementById('mission-actions').classList.add('hidden');
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        showMessage(messageDiv, error.message, 'error');
    }
}

async function handleChoisirDepot() {
    const missionId = document.getElementById('mission-selected-id').textContent;
    const pointDepotId = document.getElementById('mission-point-depot').value;
    const messageDiv = document.getElementById('mission-action-message');

    if (!missionId) {
        showMessage(messageDiv, 'Veuillez sélectionner une mission', 'error');
        return;
    }

    if (!pointDepotId) {
        showMessage(messageDiv, 'Veuillez sélectionner un point de dépôt', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/collecteurs/missions/${missionId}/depot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ pointDepotId })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Point de dépôt sélectionné', 'success');
            loadMesMissions();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadGains() {
    try {
        const response = await fetch(`${API_URL}/api/collecteurs/gains`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('gains-total').textContent = result.resume?.total || 0;
            document.getElementById('gains-valides').textContent = result.resume?.valides || 0;
            document.getElementById('gains-en-attente').textContent = result.resume?.enAttente || 0;

            const container = document.getElementById('liste-gains');
            if (!result.gains || result.gains.length === 0) {
                container.innerHTML = '<p class="text-center">Aucun gain</p>';
            } else {
                container.innerHTML = result.gains.map(g => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${g.montant || 0} FCFA</span>
                            <span class="badge ${g.statut === 'valide' ? 'badge-success' : 'badge-warning'}">${g.statut || 'en_attente'}</span>
                        </div>
                        <div class="item-body">
                            <p>Type: ${g.type_gain || 'Standard'}</p>
                            <p>Date: ${g.cree_le ? new Date(g.cree_le).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// NOUVEAU : Chargement du profil avec photos CNI
async function loadProfil() {
    if (!currentToken) return;

    try {
        const response = await fetch(`${API_URL}/api/collecteurs/profil`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            const profil = result.collecteur;
            
            // Informations de base
            document.getElementById('profil-nom').textContent = profil.nom_complet || 'N/A';
            document.getElementById('profil-email').textContent = profil.email || 'N/A';
            document.getElementById('profil-telephone').textContent = profil.telephone || 'N/A';
            document.getElementById('profil-type').textContent = profil.type_collecteur || 'N/A';
            document.getElementById('profil-zone').textContent = profil.zone_intervention_nom || 'Non spécifiée';
            document.getElementById('profil-statut').textContent = profil.statut || 'N/A';
            
            // Photo de profil
            if (profil.photo_profil_url) {
                const photoImg = document.getElementById('profil-photo');
                photoImg.src = profil.photo_profil_url;
                photoImg.style.display = 'inline-block';
            }
            
            // Photos CNI
            if (profil.photo_cni_recto_url) {
                const cniRectoImg = document.getElementById('profil-cni-recto');
                cniRectoImg.src = profil.photo_cni_recto_url;
                cniRectoImg.style.display = 'inline-block';
                document.getElementById('profil-cni-recto-container').classList.remove('hidden');
            }
            
            if (profil.photo_cni_verso_url) {
                const cniVersoImg = document.getElementById('profil-cni-verso');
                cniVersoImg.src = profil.photo_cni_verso_url;
                cniVersoImg.style.display = 'inline-block';
                document.getElementById('profil-cni-verso-container').classList.remove('hidden');
            }

            // Remplir le formulaire de modification
            document.getElementById('modif-nom').value = profil.nom_complet || '';
            document.getElementById('modif-telephone').value = profil.telephone || '';
            document.getElementById('modif-zone').value = profil.zone_intervention_nom || '';
            document.getElementById('modif-quartiers').value = (profil.quartiers_habituels || []).join(', ');
            document.getElementById('modif-communes').value = (profil.communes_intervention || []).join(', ');
            
            // Mettre à jour currentUser
            currentUser = profil;
        }
    } catch (error) {
        console.error('❌ Erreur chargement profil:', error);
    }
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/collecteurs/tableau-bord`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            const d = result.dashboard || {};
            document.getElementById('dashboard-total-missions').textContent = d.total_missions || 0;
            document.getElementById('dashboard-missions-validees').textContent = d.missions_validees || 0;
            document.getElementById('dashboard-missions-en-cours').textContent = d.missions_en_cours || 0;
            document.getElementById('dashboard-dechets').textContent = d.total_dechets_collectes || 0;

            if (result.missionEnCours) {
                const m = result.missionEnCours;
                document.getElementById('mission-en-cours').innerHTML = `
                    <p><strong>Mission #${(m.id || '').substring(0,8)}</strong></p>
                    <p>Producteur: ${m.producteur_nom || 'Inconnu'}</p>
                    <p>Déchets: ${m.quantite || 0} ${m.unite || 'kg'} de ${m.type_dechet || 'Non spécifié'}</p>
                    <p>Adresse: ${m.producteur_adresse || 'Non spécifiée'}</p>
                `;
            } else {
                document.getElementById('mission-en-cours').innerHTML = '<p>Aucune mission en cours</p>';
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// NOUVEAU : Modification du profil avec toutes les informations
async function handleModifierProfil(e) {
    e.preventDefault();
    
    const data = {
        nomComplet: document.getElementById('modif-nom').value,
        telephone: document.getElementById('modif-telephone').value,
        zoneInterventionNom: document.getElementById('modif-zone').value,
        quartiersHabituels: document.getElementById('modif-quartiers').value.split(',').map(q => q.trim()).filter(q => q),
        communesIntervention: document.getElementById('modif-communes').value.split(',').map(c => c.trim()).filter(c => c)
    };

    const messageDiv = document.getElementById('modif-profil-message');

    try {
        const response = await fetch(`${API_URL}/api/collecteurs/profil/infos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Profil mis à jour avec succès', 'success');
            loadProfil();
        } else {
            throw new Error(result.message || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

// NOUVEAU : Changement de mot de passe pour collecteur
async function handleChangerMotDePasseCollecteur(e) {
    e.preventDefault();
    
    const ancienMotDePasse = document.getElementById('collecteur-ancien-mdp').value;
    const nouveauMotDePasse = document.getElementById('collecteur-nouveau-mdp').value;
    const confirmerMotDePasse = document.getElementById('collecteur-confirm-mdp').value;

    const messageDiv = document.getElementById('collecteur-mdp-message');

    if (nouveauMotDePasse !== confirmerMotDePasse) {
        showMessage(messageDiv, 'Les mots de passe ne correspondent pas', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/collecteurs/profil/mot-de-passe`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                ancienMotDePasse,
                nouveauMotDePasse
            })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Mot de passe modifié avec succès', 'success');
            document.getElementById('changer-mot-de-passe-form').reset();
        } else {
            throw new Error(result.message || 'Erreur lors du changement de mot de passe');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

// ========== GESTIONNAIRE ==========

// Fonction de test de connexion
async function testGestionnaireConnexion() {
    console.log('🔍 Test de connexion gestionnaire...');
    console.log('Token actuel:', currentToken ? currentToken.substring(0, 20) + '...' : 'Aucun token');
    
    if (!currentToken) return false;
    
    try {
        const response = await fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        console.log('📊 Statut test auth:', response.status);
        return response.ok;
    } catch (error) {
        console.error('❌ Erreur test:', error);
        return false;
    }
}

async function handleGestionnaireConnexion(e) {
    e.preventDefault();
    
    const data = {
        identifiant: document.getElementById('gestionnaire-email').value,
        motDePasse: document.getElementById('gestionnaire-password').value
    };

    const messageDiv = document.getElementById('gestionnaire-connexion-message');

    try {
        console.log('🔑 Connexion gestionnaire:', data.identifiant);
        const response = await fetch(`${API_URL}/api/gestionnaires/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            currentToken = result.token;
            currentUser = result.utilisateur;
            
            localStorage.setItem('gestionnaire_token', currentToken);
            localStorage.setItem('gestionnaire_user', JSON.stringify(currentUser));
            
            showMessage(messageDiv, 'Connexion réussie', 'success');
            await loadGestionnaireData();
            
            const missionsTab = document.querySelector('[data-tab="gestionnaire-missions"]');
            if (missionsTab) missionsTab.click();
        } else {
            throw new Error(result.message || 'Erreur connexion');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadGestionnaireData() {
    if (!currentToken) return;
    
    try {
        console.log('📡 Chargement des données gestionnaire...');
        await loadMissionsEnAttente();
        await loadGestionnaireStats();
    } catch (error) {
        console.error('❌ Erreur chargement données gestionnaire:', error);
        if (error.message?.includes('401')) handleDeconnexion();
    }
}

async function loadMissionsEnAttente() {
    if (!currentToken) return;

    try {
        console.log('📡 Chargement des missions en attente...');
        
        const response = await fetch(`${API_URL}/api/gestionnaires/missions/en-attente`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        console.log('📊 Statut réponse:', response.status);
        
        if (response.status === 401) {
            showMessage(document.getElementById('gestionnaire-connexion-message'), 
                       'Session expirée, reconnectez-vous', 'error');
            return;
        }

        const result = await response.json();
        console.log('📦 Données reçues:', result);

        const container = document.getElementById('missions-en-attente');
        if (!container) return;

        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="text-center">Aucune mission en attente</p>';
            } else {
                container.innerHTML = result.missions.map(m => `
                    <div class="mission-item" data-mission-id="${m.id}" style="border: 2px solid transparent; margin-bottom: 10px; padding: 15px; border-radius: 5px; background: white;">
                        <div style="display: flex; align-items: flex-start; gap: 15px;">
                            <input type="radio" name="missionSelection" value="${m.id}" id="mission_${m.id}" style="width: 20px; height: 20px; cursor: pointer; margin-top: 5px;">
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <strong>Mission #${(m.id || '').substring(0,8)}</strong>
                                    <span class="badge badge-warning">En attente</span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                    <p><i class="fas fa-user"></i> Collecteur: <strong>${m.collecteur_nom || 'Inconnu'}</strong></p>
                                    <p><i class="fas fa-trash"></i> Déchet: <strong>${m.type_dechet || 'Non spécifié'}</strong></p>
                                    <p><i class="fas fa-calendar"></i> Dépôt: <strong>${m.date_depot_point ? new Date(m.date_depot_point).toLocaleString() : 'N/A'}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Ajouter les écouteurs d'événements
                document.querySelectorAll('input[name="missionSelection"]').forEach(radio => {
                    radio.addEventListener('change', function(e) {
                        const missionId = this.value;
                        document.getElementById('valider-mission-id').value = missionId;
                        document.getElementById('valider-mission-id').style.borderColor = '#4CAF50';
                        document.getElementById('valider-mission-id').style.backgroundColor = '#e8f5e9';
                        
                        document.querySelectorAll('.mission-item').forEach(item => {
                            item.style.borderColor = 'transparent';
                            item.style.backgroundColor = 'white';
                        });
                        const parentItem = this.closest('.mission-item');
                        if (parentItem) {
                            parentItem.style.borderColor = '#4CAF50';
                            parentItem.style.backgroundColor = '#e8f5e9';
                        }
                    });
                });
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function handleValiderMission(e) {
    e.preventDefault();
    
    const missionId = document.getElementById('valider-mission-id').value;
    const poidsDepose = document.getElementById('valider-poids').value;
    const qualiteDechets = document.getElementById('valider-qualite').value;
    const notes = document.getElementById('valider-notes').value;

    const messageDiv = document.getElementById('validation-message');

    if (!missionId) {
        showMessage(messageDiv, '❌ Veuillez sélectionner une mission', 'error');
        return;
    }

    if (!poidsDepose || isNaN(parseFloat(poidsDepose)) || parseFloat(poidsDepose) <= 0) {
        showMessage(messageDiv, '❌ Veuillez entrer un poids valide', 'error');
        return;
    }

    const data = {
        poidsDepose: parseFloat(poidsDepose),
        qualiteDechets: qualiteDechets,
        notes: notes
    };

    try {
        console.log('📤 Validation mission:', missionId, data);
        
        const response = await fetch(`${API_URL}/api/gestionnaires/missions/${missionId}/valider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, '✅ Mission validée avec succès !', 'success');
            
            document.getElementById('valider-mission-form').reset();
            document.getElementById('valider-mission-id').value = '';
            document.getElementById('valider-mission-id').style.borderColor = '';
            document.getElementById('valider-mission-id').style.backgroundColor = '';
            
            const selectedRadio = document.querySelector('input[name="missionSelection"]:checked');
            if (selectedRadio) selectedRadio.checked = false;
            
            await loadMissionsEnAttente();
            await loadGestionnaireStats();
        } else {
            throw new Error(result.message || 'Erreur lors de la validation');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, `❌ ${error.message}`, 'error');
    }
}

async function loadGestionnaireStats() {
    try {
        const response = await fetch(`${API_URL}/api/gestionnaires/tableau-bord`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            const statsContainer = document.getElementById('gestionnaire-stats');
            if (statsContainer) {
                const stats = result.statistiques || {};
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <div class="stat-value">${stats.en_attente || 0}</div>
                        <div class="stat-label">En attente</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.validees || 0}</div>
                        <div class="stat-label">Validées</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.poids_total || 0} kg</div>
                        <div class="stat-label">Poids total</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.gains_distribues || 0} FCFA</div>
                        <div class="stat-label">Gains distribués</div>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function handleAttribuerCredits(e) {
    e.preventDefault();
    
    const collecteurId = document.getElementById('credits-collecteur').value;
    const missionId = document.getElementById('credits-mission').value;
    const montant = parseFloat(document.getElementById('credits-montant').value);

    const messageDiv = document.getElementById('credits-message');

    if (!collecteurId || !missionId || !montant) {
        showMessage(messageDiv, 'Tous les champs sont requis', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/gestionnaires/collecteurs/${collecteurId}/missions/${missionId}/credits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ montant })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Crédits attribués avec succès', 'success');
            document.getElementById('attribuer-credits-form').reset();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function handleChangerMotDePasse(e) {
    e.preventDefault();
    
    const mdpActuel = document.getElementById('gest-mdp-actuel').value;
    const nouveauMdp = document.getElementById('gest-nouveau-mdp').value;
    const confirmMdp = document.getElementById('gest-confirm-mdp').value;

    const messageDiv = document.getElementById('gest-mdp-message');

    if (nouveauMdp !== confirmMdp) {
        showMessage(messageDiv, 'Les mots de passe ne correspondent pas', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/gestionnaires/changer-mot-de-passe`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                motDePasseActuel: mdpActuel,
                nouveauMotDePasse: nouveauMdp
            })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Mot de passe modifié avec succès', 'success');
            document.getElementById('gestionnaire-changer-mdp').reset();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

// ========== SUPERVISEUR ==========
async function handleSuperviseurConnexion(e) {
    e.preventDefault();
    
    const data = {
        identifiant: document.getElementById('superviseur-email').value,
        motDePasse: document.getElementById('superviseur-password').value
    };

    const messageDiv = document.getElementById('superviseur-connexion-message');

    try {
        console.log('🔑 Connexion superviseur:', data.identifiant);
        const response = await fetch(`${API_URL}/api/superviseurs/connexion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            currentToken = result.token;
            currentUser = result.superviseur;
            showMessage(messageDiv, 'Connexion réussie', 'success');
            loadSuperviseurData();
        } else {
            throw new Error(result.message || 'Erreur connexion');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadSuperviseurData() {
    if (!currentToken) return;
    
    try {
        await Promise.all([
            loadCollecteursEnAttente(),
            loadGestionnaires(),
            loadStats()
        ]);
    } catch (error) {
        console.error('❌ Erreur chargement données superviseur:', error);
    }
}

async function loadCollecteursEnAttente() {
    try {
        const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/en-attente`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();
        const container = document.getElementById('collecteurs-attente');

        if (result.success) {
            if (!result.collecteurs || result.collecteurs.length === 0) {
                container.innerHTML = '<p class="text-center">Aucun collecteur en attente</p>';
            } else {
                container.innerHTML = result.collecteurs.map(c => `
                    <div class="item" onclick="document.getElementById('valider-collecteur-id').value='${c.id}'">
                        <div class="item-header">
                            <span class="item-title">${c.nom_complet || 'Inconnu'}</span>
                            <span class="badge badge-warning">En attente</span>
                        </div>
                        <div class="item-body">
                            <p><i class="fas fa-envelope"></i> ${c.email || 'N/A'}</p>
                            <p><i class="fas fa-phone"></i> ${c.telephone || 'N/A'}</p>
                            <p><i class="fas fa-map"></i> ${c.zone_intervention_nom || 'Non spécifiée'}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function handleValiderCollecteur(e) {
    e.preventDefault();
    
    const collecteurId = document.getElementById('valider-collecteur-id').value;
    const notes = document.getElementById('valider-notes').value;

    const messageDiv = document.getElementById('validation-collecteur-message');

    if (!collecteurId) {
        showMessage(messageDiv, 'Sélectionnez un collecteur', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/superviseurs/collecteurs/${collecteurId}/valider`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ notes })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Collecteur validé avec succès', 'success');
            document.getElementById('valider-collecteur-id').value = '';
            document.getElementById('valider-notes').value = '';
            loadCollecteursEnAttente();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadGestionnaires() {
    try {
        const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();
        const container = document.getElementById('liste-gestionnaires');

        if (result.success) {
            if (!result.gestionnaires || result.gestionnaires.length === 0) {
                container.innerHTML = '<p class="text-center">Aucun gestionnaire</p>';
            } else {
                container.innerHTML = result.gestionnaires.map(g => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">${g.nom_complet || 'Inconnu'}</span>
                            <span class="badge ${g.est_actif ? 'badge-success' : 'badge-danger'}">
                                ${g.est_actif ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                        <div class="item-body">
                            <p><i class="fas fa-envelope"></i> ${g.email || 'N/A'}</p>
                            <p><i class="fas fa-map-marker"></i> ${g.point_collecte_nom || 'Non assigné'}</p>
                            <p><i class="fas fa-briefcase"></i> ${g.fonction || 'N/A'}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function handleCreerGestionnaire(e) {
    e.preventDefault();
    
    const data = {
        email: document.getElementById('gest-email').value,
        telephone: document.getElementById('gest-telephone').value,
        motDePasse: document.getElementById('gest-password').value,
        nomComplet: document.getElementById('gest-nom').value,
        pointCollecteId: document.getElementById('gest-point').value || undefined,
        fonction: document.getElementById('gest-fonction').value
    };

    const messageDiv = document.getElementById('creation-gestionnaire-message');

    try {
        const response = await fetch(`${API_URL}/api/superviseurs/gestionnaires`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Gestionnaire créé avec succès', 'success');
            document.getElementById('creer-gestionnaire-form').reset();
            loadGestionnaires();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function handleAttribuerMission(e) {
    e.preventDefault();
    
    const missionId = document.getElementById('attribuer-mission').value;
    const collecteurId = document.getElementById('attribuer-collecteur').value;

    const messageDiv = document.getElementById('attribution-mission-message');

    try {
        const response = await fetch(`${API_URL}/api/superviseurs/missions/${missionId}/attribuer/${collecteurId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            showMessage(messageDiv, 'Mission attribuée avec succès', 'success');
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        showMessage(messageDiv, error.message, 'error');
    }
}

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/api/superviseurs/statistiques`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        const result = await response.json();

        if (result.success) {
            const s = result.stats || {};
            document.getElementById('stats-total-collecteurs').textContent = s.total_collecteurs || 0;
            document.getElementById('stats-collecteurs-actifs').textContent = s.collecteurs_actifs || 0;
            document.getElementById('stats-total-gestionnaires').textContent = s.total_gestionnaires || 0;
            document.getElementById('stats-missions-validees').textContent = s.missions_validees || 0;
            document.getElementById('stats-dechets-collectes').textContent = s.total_dechets_collectes || 0;
            document.getElementById('stats-gains-distribues').textContent = s.total_gains_distribues || 0;

            if (result.evolution) {
                const evolutionContainer = document.getElementById('evolution-jours');
                if (evolutionContainer) {
                    evolutionContainer.innerHTML = result.evolution.map(j => `
                        <div class="item">
                            <div class="item-header">
                                <span class="item-title">${j.jour ? new Date(j.jour).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div class="item-body">
                                <p>Missions: ${j.missions_validees || 0}</p>
                                <p>Poids: ${j.poids_total || 0} kg</p>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// ========== UTILITAIRES ==========
function handleDeconnexion() {
    currentToken = null;
    currentUser = null;
    localStorage.removeItem('gestionnaire_token');
    localStorage.removeItem('gestionnaire_user');
    document.getElementById('collecteur-connected-state')?.classList.add('hidden');
    document.getElementById('collecteur-connexion-form')?.reset();
    showMessage(document.getElementById('collecteur-connexion-message'), 'Déconnexion réussie', 'success');
}