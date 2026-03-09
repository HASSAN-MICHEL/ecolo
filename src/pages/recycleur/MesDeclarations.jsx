// pages/Recycleur/MesDeclarations.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../Layouts/LayoutDashboard';
import recycleurService from '../../services/recycleurService';
import { 
  FiFileText, FiCalendar, FiPackage, FiDownload,
  FiEye, FiFilter, FiRefreshCw, FiImage, FiFile
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MesDeclarations = () => {
  const [declarations, setDeclarations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtreStatut, setFiltreStatut] = useState('tous');
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('ecocollect_user'));
    setUser(userData);
    loadDeclarations();
  }, [filtreStatut]);

  const loadDeclarations = async () => {
    try {
      setLoading(true);
      const statut = filtreStatut !== 'tous' ? filtreStatut : null;
      const data = await recycleurService.getMesDeclarations(statut);
      setDeclarations(data.declarations || []);
    } catch (error) {
      console.error('Erreur chargement déclarations:', error);
      toast.error('Erreur lors du chargement des déclarations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDeclarations();
    setRefreshing(false);
    toast.success('Données actualisées');
  };

  const handleViewCertificat = (declaration) => {
    setSelectedDeclaration(declaration);
    setShowPreviewModal(true);
  };

  const getStatusBadge = (statut) => {
    const badges = {
      'en_attente': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'validee': { color: 'bg-green-100 text-green-800', label: 'Validée' },
      'refusee': { color: 'bg-red-100 text-red-800', label: 'Refusée' },
    };
    return badges[statut] || { color: 'bg-gray-100 text-gray-800', label: statut };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      'plastique_pet': 'Plastique PET',
      'plastique_pehd': 'Plastique PEHD',
      'papier_carton': 'Papier/Carton',
      'metal': 'Métal',
      'verre': 'Verre',
      'organique': 'Organique'
    };
    return labels[type] || type;
  };

  const getCertificatIcon = (url) => {
    if (!url) return <FiFile className="text-gray-400" />;
    if (url.endsWith('.pdf')) return <FiFileText className="text-red-500" />;
    return <FiImage className="text-blue-500" />;
  };

  const styles = `
    .declarations-container {
      padding: 1.5rem;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.6rem 1.5rem;
      border: 1.5px solid #d9e0d9;
      border-radius: 100px;
      background: white;
      color: #1a1e1a;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .filter-btn.active {
      background: #2d8a5e;
      color: white;
      border-color: #2d8a5e;
    }

    .new-declaration-btn {
      background: #2d8a5e;
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 100px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .new-declaration-btn:hover {
      background: #1e5e3f;
    }

    .declarations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .declaration-card {
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #d9e0d9;
      transition: all 0.3s;
    }

    .declaration-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px -8px rgba(45, 138, 94, 0.15);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
    }

    .declaration-type {
      font-weight: 700;
      color: #1a1e1a;
      font-size: 1.1rem;
    }

    .declaration-quantity {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2d8a5e;
      margin: 0.5rem 0;
    }

    .declaration-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1rem 0;
      padding: 1rem 0;
      border-top: 1px solid #d9e0d9;
      border-bottom: 1px solid #d9e0d9;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #5a655a;
      font-size: 0.9rem;
    }

    .certificat-section {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8faf8;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .certificat-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-view {
      background: none;
      border: none;
      color: #2d8a5e;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .btn-view:hover {
      background: #e8f3e8;
    }

    .btn-download {
      background: none;
      border: none;
      color: #2d8a5e;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .btn-download:hover {
      background: #e8f3e8;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      max-width: 800px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1a1e1a;
      margin-bottom: 1.5rem;
    }

    .certificat-preview {
      max-width: 100%;
      max-height: 500px;
      object-fit: contain;
      margin-bottom: 1rem;
    }

    .pdf-preview {
      width: 100%;
      height: 500px;
      border: 1px solid #d9e0d9;
      border-radius: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 1rem;
      border: 1px solid #d9e0d9;
      grid-column: 1 / -1;
    }

    .empty-state i {
      font-size: 3rem;
      color: #d9e0d9;
      margin-bottom: 1rem;
    }

    .refresh-btn {
      background: white;
      border: 1px solid #d9e0d9;
      border-radius: 0.75rem;
      padding: 0.6rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #e8f3e8;
      border-color: #2d8a5e;
    }

    @media (max-width: 768px) {
      .filters-bar {
        flex-direction: column;
      }
      
      .declarations-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  if (loading) {
    return (
      <DashboardLayout title="Mes déclarations" user={user}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', color: '#5a655a' }}>Chargement de vos déclarations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <DashboardLayout title="Mes déclarations de recyclage" user={user}>
        <div className="declarations-container">
          {/* En-tête */}
          <div className="header-actions">
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1e1a' }}>
              Mes déclarations
            </h1>
            <button 
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? 'fa-spin' : ''} />
              Actualiser
            </button>
          </div>

          {/* Filtres et nouvelle déclaration */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="filters-bar">
              <button 
                className={`filter-btn ${filtreStatut === 'tous' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('tous')}
              >
                <FiFilter /> Toutes
              </button>
              <button 
                className={`filter-btn ${filtreStatut === 'en_attente' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('en_attente')}
              >
                En attente
              </button>
              <button 
                className={`filter-btn ${filtreStatut === 'validee' ? 'active' : ''}`}
                onClick={() => setFiltreStatut('validee')}
              >
                Validées
              </button>
            </div>
            <Link to="/recycleur/declarations" className="new-declaration-btn">
              <i className="fas fa-plus"></i>
              Nouvelle déclaration
            </Link>
          </div>

          {/* Liste des déclarations */}
          {declarations.length > 0 ? (
            <div className="declarations-grid">
              {declarations.map((declaration) => {
                const status = getStatusBadge(declaration.statut);
                return (
                  <div key={declaration.id} className="declaration-card">
                    <div className="card-header">
                      <span className="declaration-type">
                        {getTypeLabel(declaration.type_dechet)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="declaration-quantity">
                      {parseFloat(declaration.quantite_recyclee).toFixed(1)} kg
                    </div>

                    <div className="declaration-meta">
                      <div className="meta-item">
                        <FiCalendar />
                        <span>Recyclé le {formatDate(declaration.date_recyclage)}</span>
                      </div>
                      {declaration.demande_enlevement_id && (
                        <div className="meta-item">
                          <FiPackage />
                          <span>Demande #{declaration.demande_enlevement_id.substring(0, 8)}</span>
                        </div>
                      )}
                    </div>

                    {/* Certificat */}
                    {declaration.certificat_url ? (
                      <div className="certificat-section">
                        <div className="certificat-info">
                          {getCertificatIcon(declaration.certificat_url)}
                          <span className="text-sm text-gray-600">
                            {declaration.certificat_url.split('/').pop()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-view"
                            onClick={() => handleViewCertificat(declaration)}
                            title="Voir le certificat"
                          >
                            <FiEye size={18} />
                          </button>
                          <a
                            href={recycleurService.getCertificatUrl(declaration.certificat_url)}
                            download
                            className="btn-download"
                            title="Télécharger"
                          >
                            <FiDownload size={18} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="certificat-section" style={{ background: '#fff3e0' }}>
                        <span className="text-sm text-gray-500">Aucun certificat joint</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-file-alt"></i>
              <p>Aucune déclaration trouvée</p>
              <Link to="/recycleur/declarations/nouvelle" style={{ color: '#2d8a5e' }}>
                Créer votre première déclaration
              </Link>
            </div>
          )}

          {/* Modal de prévisualisation */}
          {showPreviewModal && selectedDeclaration && (
            <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3 className="modal-title">
                  Certificat - {getTypeLabel(selectedDeclaration.type_dechet)}
                </h3>
                
                {selectedDeclaration.certificat_url && (
                  <>
                    {selectedDeclaration.certificat_url.endsWith('.pdf') ? (
                      <iframe
                        src={recycleurService.getCertificatUrl(selectedDeclaration.certificat_url)}
                        className="pdf-preview"
                        title="Certificat PDF"
                      />
                    ) : (
                      <img
                        src={recycleurService.getCertificatUrl(selectedDeclaration.certificat_url)}
                        alt="Certificat"
                        className="certificat-preview"
                      />
                    )}
                    
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <a
                        href={recycleurService.getCertificatUrl(selectedDeclaration.certificat_url)}
                        download
                        className="btn-primary"
                        style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}
                      >
                        <FiDownload /> Télécharger
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default MesDeclarations;