import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Crown, Zap, Box, Palette, Star, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
    const { user, userProfile, isSubscribed } = useAuth();

    return (
        <div className="page-content fade-in">
            <div className="section-header">
                <h2>Mi panel</h2>
                <p>Bienvenido, {user?.displayName || user?.email}</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-label">Estado</div>
                    <div className="stat-value" style={{ color: isSubscribed ? 'var(--accent)' : 'var(--laser)' }}>
                        {isSubscribed ? 'Premium' : 'Gratis'}
                    </div>
                </div>

                {!isSubscribed ? (
                    <div className="stat-card">
                        <div className="stat-label">Descargas hoy</div>
                        <div className="stat-value">
                            <span style={{ color: (userProfile?.dailyDownloads || 0) >= 2 ? 'var(--danger)' : 'var(--accent)' }}>
                                {userProfile?.dailyDownloads || 0}
                            </span> / 2
                        </div>
                    </div>
                ) : (
                    <div className="stat-card">
                        <div className="stat-label">Descargas totales</div>
                        <div className="stat-value">{userProfile?.totalDownloads || 0}</div>
                    </div>
                )}

                <div className="stat-card">
                    <div className="stat-label">Miembro desde</div>
                    <div className="stat-value" style={{ fontSize: '1rem' }}>
                        {userProfile?.createdAt?.toDate
                            ? userProfile.createdAt.toDate().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
                            : 'Reciente'}
                    </div>
                </div>
                {isSubscribed && userProfile?.subscriptionEnd && (
                    <div className="stat-card">
                        <div className="stat-label">Suscripcion hasta</div>
                        <div className="stat-value" style={{ fontSize: '1rem' }}>
                            {userProfile.subscriptionEnd.toDate
                                ? userProfile.subscriptionEnd.toDate().toLocaleDateString('es-ES')
                                : 'Activa'}
                        </div>
                    </div>
                )}
            </div>

            {!isSubscribed && (
                <div className="subscribe-banner">
                    <Crown size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                    <h3>Hazte Premium</h3>
                    <p>Acceso ilimitado a todos los archivos de diseno con tu suscripcion mensual</p>
                    <Link to="/subscription">
                        <button className="btn btn-accent btn-lg">
                            <Star size={16} /> Ver planes
                        </button>
                    </Link>
                </div>
            )}

            <div className="section-header" style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.4rem' }}>Explorar</h2>
            </div>

            <div className="category-grid">
                <Link to="/gallery/laser">
                    <div className="category-card laser">
                        <ArrowUpRight size={18} className="card-arrow" />
                        <div className="category-icon"><Zap size={24} /></div>
                        <h3>Corte Laser</h3>
                        <p>Archivos SVG, DXF para corte laser</p>
                    </div>
                </Link>
                <Link to="/gallery/printing3d">
                    <div className="category-card printing3d">
                        <ArrowUpRight size={18} className="card-arrow" />
                        <div className="category-icon"><Box size={24} /></div>
                        <h3>Impresion 3D</h3>
                        <p>Modelos STL, OBJ para imprimir</p>
                    </div>
                </Link>
                <Link to="/gallery/sublimation">
                    <div className="category-card sublimation">
                        <ArrowUpRight size={18} className="card-arrow" />
                        <div className="category-icon"><Palette size={24} /></div>
                        <h3>Sublimacion</h3>
                        <p>Disenos PNG para sublimacion</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
