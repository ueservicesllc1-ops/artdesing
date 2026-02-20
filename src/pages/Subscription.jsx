import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Crown, Infinity, Zap, Shield } from 'lucide-react';

const Subscription = () => {
    const { isAuthenticated, isSubscribed } = useAuth();

    return (
        <div className="page-content fade-in">
            <div className="section-header center">
                <h2>Suscripcion Premium</h2>
                <p>Accede a todos los archivos de diseno sin limites</p>
            </div>

            {isSubscribed && (
                <div className="success-message" style={{ textAlign: 'center', maxWidth: '440px', margin: '0 auto 2rem' }}>
                    Ya tienes una suscripcion activa. Disfruta tus descargas ilimitadas.
                </div>
            )}

            <div className="pricing-card">
                <div className="pricing-label">
                    <Crown size={12} /> PREMIUM
                </div>

                <div className="price">
                    $9.99 <span>/ mes</span>
                </div>

                <p style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>
                    Todo lo que necesitas para tus proyectos
                </p>

                <ul className="pricing-features">
                    <li><span className="check"><Check size={16} /></span> Descargas ilimitadas de todos los archivos</li>
                    <li><span className="check"><Check size={16} /></span> Corte laser, impresion 3D y sublimacion</li>
                    <li><span className="check"><Check size={16} /></span> Nuevos disenos cada semana</li>
                    <li><span className="check"><Check size={16} /></span> Formatos profesionales (SVG, STL, PNG, DXF)</li>
                    <li><span className="check"><Check size={16} /></span> Soporte prioritario</li>
                    <li><span className="check"><Check size={16} /></span> Cancela cuando quieras</li>
                </ul>

                {!isAuthenticated ? (
                    <Link to="/register">
                        <button className="btn btn-accent btn-lg" style={{ width: '100%' }}>
                            Crear cuenta para suscribirte
                        </button>
                    </Link>
                ) : !isSubscribed ? (
                    <button className="btn btn-accent btn-lg" style={{ width: '100%' }}
                        onClick={() => alert('Contacta al administrador para activar tu suscripcion.')}
                    >
                        <Crown size={16} /> Activar suscripcion
                    </button>
                ) : (
                    <button className="btn btn-ghost btn-lg" style={{ width: '100%' }} disabled>
                        Suscripcion activa
                    </button>
                )}
            </div>

            <div className="steps-grid" style={{ marginTop: '4rem' }}>
                <div className="step-card">
                    <div className="step-number"><Infinity size={40} /></div>
                    <h3>Sin limites</h3>
                    <p>Descarga todos los archivos que necesites, sin restricciones ni limites diarios</p>
                </div>
                <div className="step-card">
                    <div className="step-number"><Zap size={40} /></div>
                    <h3>Acceso inmediato</h3>
                    <p>Activa tu suscripcion y comienza a descargar al instante</p>
                </div>
                <div className="step-card">
                    <div className="step-number"><Shield size={40} /></div>
                    <h3>Calidad garantizada</h3>
                    <p>Archivos revisados y optimizados para uso profesional</p>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
