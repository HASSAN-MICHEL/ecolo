
const CONFIG = {
    API_URL: window.API_BASE_URL || 'https://ecobackend-m3s8.vercel.app', // URL de production par défaut
    TOKEN_KEY: 'ecocollect_token',
    USER_KEY: 'ecocollect_user',
    ROLE_KEY: 'ecocollect_role'
};

console.log('🚀 Collecteur.js chargé');
console.log('📡 API URL utilisée:', CONFIG.API_URL);

// État de l'application
let currentUser = null;
let currentToken = null;
let selectedMissionId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de collecteur.js');
    
    // Afficher l'URL de l'API
    document.getElementById('apiUrl').textContent = CONFIG.API_URL;
    
    // Initialiser les écouteurs
    initEventListeners();
    
    // Vérifier la session
    checkSession();
});

function initEventListeners() {
    // Formulaire modification profil
    document.getElementById('modifierProfilForm')?.addEventListener('submit', handleModifierProfil);
    
    // Formulaire changement mot de passe
    document.getElementById('changerMotDePasseForm')?.addEventListener('submit', handleChangerMotDePasse);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Filtre missions
    document.getElementById('filterMissionsAcceptees')?.addEventListener('change', loadMesMissions);
}

// ============================================
// GESTION DE LA SESSION
// ============================================

function checkSession() {
    try {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        const userJson = localStorage.getItem(CONFIG.USER_KEY);
        const role = localStorage.getItem(CONFIG.ROLE_KEY);
        
        console.log('🔍 Vérification session:', { 
            token: token ? 'présent' : 'absent', 
            user: userJson ? 'présent' : 'absent',
            role: role 
        });
        
        if (!token || !userJson || role !== 'collecteur') {
            console.log('❌ Pas de session collecteur valide');
            window.location.href = 'index.html';
            return;
        }
        
        const user = JSON.parse(userJson);
        currentToken = token;
        currentUser = user;
        
        console.log('✅ Session collecteur restaurée:', user);
        
        // Mettre à jour l'interface
        updateUI();
        
        // Charger les données
        loadCollecteurData();
        
    } catch (error) {
        console.error('❌ Erreur de session:', error);
        window.location.href = 'index.html';
    }
}

function updateUI() {
    if (!currentUser) return;
    
    // Mettre à jour le badge utilisateur
    document.getElementById('userName').textContent = currentUser.nomComplet || currentUser.nom_complet || 'Collecteur';
    
    // Vérifier le statut
    const statut = currentUser.statut || 'en_attente';
    const pendingBanner = document.getElementById('pendingActivationBanner');
    
    if (statut === 'en_attente' || statut === 'pending') {
        pendingBanner.classList.remove('hidden');
    } else {
        pendingBanner.classList.add('hidden');
    }
}

function handleLogout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    localStorage.removeItem(CONFIG.ROLE_KEY);
    window.location.href = 'index.html';
}

// ============================================
// NAVIGATION
// ============================================

function showSection(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Charger les données si nécessaire
    if (sectionId === 'dashboard' && currentToken) {
        loadDashboard();
    } else if (sectionId === 'missions' && currentToken) {
        loadMissionsDisponibles();
        loadMesMissions();
    } else if (sectionId === 'gains' && currentToken) {
        loadGains();
    } else if (sectionId === 'profil' && currentToken) {
        loadProfil();
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================

async function loadCollecteurData() {
    try {
        await Promise.all([
            loadDashboard(),
            loadMissionsDisponibles(),
            loadMesMissions(),
            loadGains(),
            loadProfil()
        ]);
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
    }
}

async function loadDashboard() {
    if (!currentToken) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/tableau-bord`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        if (response.status === 401) {
            handleLogout();
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            const d = result.dashboard || {};
            document.getElementById('dashboardTotalMissions').textContent = d.total_missions || 0;
            document.getElementById('dashboardMissionsValidees').textContent = d.missions_validees || 0;
            document.getElementById('dashboardMissionsEnCours').textContent = d.missions_en_cours || 0;
            document.getElementById('dashboardDechets').textContent = d.total_dechets_collectes || 0;
            
            if (result.missionEnCours) {
                const m = result.missionEnCours;
                document.getElementById('missionEnCours').innerHTML = `
                    <p><strong>Mission #${(m.id || '').substring(0,8)}</strong></p>
                    <p><i class="fas fa-user"></i> ${m.producteur_nom || 'Inconnu'}</p>
                    <p><i class="fas fa-trash"></i> ${m.quantite || 0} ${m.unite || 'kg'} de ${m.type_dechet || 'Non spécifié'}</p>
                    <p><i class="fas fa-map-marker"></i> ${m.producteur_adresse || 'Non spécifiée'}</p>
                `;
            } else {
                document.getElementById('missionEnCours').innerHTML = '<p class="empty-message">Aucune mission en cours</p>';
            }
        }
    } catch (error) {
        console.error('❌ Erreur dashboard:', error);
    }
}

async function loadMissionsDisponibles() {
    if (!currentToken) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/missions/disponibles`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const result = await response.json();
        const container = document.getElementById('missionsDisponiblesList');
        
        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="empty-message">Aucune mission disponible</p>';
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
    if (!currentToken) return;
    
    const filter = document.getElementById('filterMissionsAcceptees').value;
    
    try {
        const url = filter !== 'tous' 
            ? `${CONFIG.API_URL}/api/collecteurs/missions?statut=${filter}`
            : `${CONFIG.API_URL}/api/collecteurs/missions`;
            
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const result = await response.json();
        const container = document.getElementById('missionsAccepteesList');
        
        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="empty-message">Aucune mission acceptée</p>';
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
        
        // Charger aussi les missions terminées
        loadMissionsTerminees();
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

async function loadMissionsTerminees() {
    if (!currentToken) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/missions?statut=termine`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const result = await response.json();
        const container = document.getElementById('missionsTermineesList');
        
        if (result.success) {
            if (!result.missions || result.missions.length === 0) {
                container.innerHTML = '<p class="empty-message">Aucune mission terminée</p>';
            } else {
                container.innerHTML = result.missions.map(m => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">Mission #${(m.id || '').substring(0,8)}</span>
                            <span class="badge badge-success">Terminée</span>
                        </div>
                        <div class="item-body">
                            <p><i class="fas fa-user"></i> ${m.producteur_nom || 'Inconnu'}</p>
                            <p><i class="fas fa-weight"></i> Poids déposé: ${m.poids_depose || 0} kg</p>
                            <p><i class="fas fa-calendar"></i> ${m.date_fin ? new Date(m.date_fin).toLocaleDateString() : 'N/A'}</p>
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
    selectedMissionId = missionId;
    document.getElementById('missionSelectedId').textContent = missionId;
    document.getElementById('missionActions').classList.remove('hidden');
}

async function handleMissionAction(action) {
    if (!selectedMissionId) {
        showMessage('missionActionMessage', 'Veuillez sélectionner une mission', 'error');
        return;
    }
    
    let url = '';
    let body = {};
    
    switch(action) {
        case 'accepter':
            url = `${CONFIG.API_URL}/api/collecteurs/missions/${selectedMissionId}/accepter`;
            break;
        case 'demarrer':
            url = `${CONFIG.API_URL}/api/collecteurs/missions/${selectedMissionId}/demarrer`;
            break;
        case 'terminer':
            url = `${CONFIG.API_URL}/api/collecteurs/missions/${selectedMissionId}/terminer`;
            body = {
                photoPreuveUrl: document.getElementById('missionPhotoUrl').value,
                codeConfirmation: document.getElementById('missionCode').value,
                notes: document.getElementById('missionNotes').value,
                conformiteTri: document.getElementById('missionConformite').value === 'true'
            };
            break;
    }
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: Object.keys(body).length ? JSON.stringify(body) : undefined
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('missionActionMessage', 'Action effectuée avec succès', 'success');
            loadMissionsDisponibles();
            loadMesMissions();
            document.getElementById('missionSelectedId').textContent = '';
            document.getElementById('missionActions').classList.add('hidden');
            selectedMissionId = null;
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        showMessage('missionActionMessage', error.message, 'error');
    }
}

async function handleChoisirDepot() {
    if (!selectedMissionId) {
        showMessage('missionActionMessage', 'Veuillez sélectionner une mission', 'error');
        return;
    }
    
    const pointDepotId = document.getElementById('missionPointDepot').value;
    
    if (!pointDepotId) {
        showMessage('missionActionMessage', 'Veuillez sélectionner un point de dépôt', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/missions/${selectedMissionId}/depot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ pointDepotId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('missionActionMessage', 'Point de dépôt sélectionné', 'success');
            loadMesMissions();
        } else {
            throw new Error(result.message || 'Erreur');
        }
    } catch (error) {
        showMessage('missionActionMessage', error.message, 'error');
    }
}

async function loadGains() {
    if (!currentToken) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/gains`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('gainsTotal').textContent = result.resume?.total || 0;
            document.getElementById('gainsValides').textContent = result.resume?.valides || 0;
            document.getElementById('gainsEnAttente').textContent = result.resume?.enAttente || 0;
            
            const container = document.getElementById('gainsList');
            if (!result.gains || result.gains.length === 0) {
                container.innerHTML = '<p class="empty-message">Aucun gain</p>';
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

async function loadProfil() {
    if (!currentToken) return;
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/profil`, {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        
        const result = await response.json();
        
        if (result.success) {
            const profil = result.collecteur;
            
            document.getElementById('profilNom').textContent = profil.nom_complet || 'N/A';
            document.getElementById('profilEmail').textContent = profil.email || 'N/A';
            document.getElementById('profilTelephone').textContent = profil.telephone || 'N/A';
            document.getElementById('profilType').textContent = profil.type_collecteur || 'N/A';
            document.getElementById('profilZone').textContent = profil.zone_intervention_nom || 'Non spécifiée';
            document.getElementById('profilQuartiers').textContent = (profil.quartiers_habituels || []).join(', ') || 'Non spécifiés';
            document.getElementById('profilCommunes').textContent = (profil.communes_intervention || []).join(', ') || 'Non spécifiées';
            
            const statut = profil.statut || 'en_attente';
            const statutElement = document.getElementById('profilStatut');
            statutElement.textContent = statut === 'actif' ? 'Actif' : 'En attente';
            statutElement.className = statut === 'actif' ? 'badge badge-success' : 'badge badge-warning';
            
            if (profil.photo_profil_url) {
                const photoImg = document.getElementById('profilPhoto');
                photoImg.src = profil.photo_profil_url;
                photoImg.style.display = 'inline-block';
            }
            
            if (profil.photo_cni_recto_url) {
                const cniRectoImg = document.getElementById('profilCniRecto');
                cniRectoImg.src = profil.photo_cni_recto_url;
                cniRectoImg.style.display = 'inline-block';
                document.getElementById('profilCniRectoContainer').classList.remove('hidden');
            }
            
            if (profil.photo_cni_verso_url) {
                const cniVersoImg = document.getElementById('profilCniVerso');
                cniVersoImg.src = profil.photo_cni_verso_url;
                cniVersoImg.style.display = 'inline-block';
                document.getElementById('profilCniVersoContainer').classList.remove('hidden');
            }
            
            // Remplir formulaire modification
            document.getElementById('modifNom').value = profil.nom_complet || '';
            document.getElementById('modifTelephone').value = profil.telephone || '';
            document.getElementById('modifZone').value = profil.zone_intervention_nom || '';
            document.getElementById('modifQuartiers').value = (profil.quartiers_habituels || []).join(', ');
            document.getElementById('modifCommunes').value = (profil.communes_intervention || []).join(', ');
        }
    } catch (error) {
        console.error('❌ Erreur chargement profil:', error);
    }
}

async function handleModifierProfil(e) {
    e.preventDefault();
    
    const data = {
        nomComplet: document.getElementById('modifNom').value,
        telephone: document.getElementById('modifTelephone').value,
        zoneInterventionNom: document.getElementById('modifZone').value,
        quartiersHabituels: document.getElementById('modifQuartiers').value.split(',').map(q => q.trim()).filter(q => q),
        communesIntervention: document.getElementById('modifCommunes').value.split(',').map(c => c.trim()).filter(c => c)
    };
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/profil/infos`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('modifProfilMessage', 'Profil mis à jour avec succès', 'success');
            loadProfil();
        } else {
            throw new Error(result.message || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        showMessage('modifProfilMessage', error.message, 'error');
    }
}

async function handleChangerMotDePasse(e) {
    e.preventDefault();
    
    const ancienMotDePasse = document.getElementById('ancienMdp').value;
    const nouveauMotDePasse = document.getElementById('nouveauMdp').value;
    const confirmerMotDePasse = document.getElementById('confirmMdp').value;
    
    if (nouveauMotDePasse !== confirmerMotDePasse) {
        showMessage('mdpMessage', 'Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/collecteurs/profil/mot-de-passe`, {
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
            showMessage('mdpMessage', 'Mot de passe modifié avec succès', 'success');
            document.getElementById('changerMotDePasseForm').reset();
        } else {
            throw new Error(result.message || 'Erreur lors du changement');
        }
    } catch (error) {
        showMessage('mdpMessage', error.message, 'error');
    }
}

// ============================================
// UTILITAIRES
// ============================================

function showMessage(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.textContent = message;
    el.className = 'message ' + type;
    el.style.display = 'block';
    
    setTimeout(() => {
        el.style.display = 'none';
    }, 5000);
}

// Exposer les fonctions globalement
window.showSection = showSection;
window.selectMission = selectMission;
window.handleMissionAction = handleMissionAction;
window.handleChoisirDepot = handleChoisirDepot;
window.handleLogout = handleLogout;
window.loadMissionsDisponibles = loadMissionsDisponibles; 