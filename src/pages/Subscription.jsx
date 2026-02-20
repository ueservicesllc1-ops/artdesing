import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Crown, Infinity, Zap, Shield, X } from 'lucide-react';
import PayPalButton from '../components/PayPalButton';

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

            <div className="pricing-grid">
                {[
                    { name: 'Diario', price: '1.99', interval: '1 día', label: 'Básico', popular: false, paypalId: '9ZKR3HQQRXEWE' },
                    { name: 'Semanal', price: '3.99', interval: '1 semana', label: 'Plus', popular: false, paypalId: 'UDMLRLLXCDXSA' },
                    { name: 'Mensual', price: '6.99', interval: '1 mes', label: 'Recomendado', popular: true, paypalId: 'TJXS3YMJUDFGE' },
                    { name: 'Anual', price: '11.99', interval: '1 año', label: 'Ahorro', popular: false, paypalId: 'LJ4C86JD2BFL2' },
                    { name: 'De por Vida', price: '15.99', interval: 'Ilimitado', label: 'Ultimate', popular: false, paypalId: '6X9APZJL7BM76' }
                ].map((plan, i) => (
                    <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`} style={plan.popular ? { borderColor: 'var(--accent)', transform: 'scale(1.02)' } : {}}>
                        <div className="pricing-label">
                            {plan.name === 'De por Vida' ? <Infinity size={12} /> : <Zap size={12} />} {plan.label}
                        </div>

                        <div className="price">
                            ${plan.price} <span>/ {plan.interval}</span>
                        </div>

                        <p style={{ color: 'var(--text-2)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {plan.name === 'De por Vida' ? 'Acceso total para siempre' : 'Sin límites de descarga'}
                        </p>

                        <ul className="pricing-features" style={{ marginBottom: '2rem' }}>
                            <li><span className="check"><Check size={16} /></span> Descargas ilimitadas</li>
                            <li><span className="check"><Check size={16} /></span> Todo el catálogo</li>
                            <li><span className="check"><Check size={16} /></span> Nuevos lanzamientos</li>
                            <li style={(plan.name === 'Diario' || plan.name === 'Semanal') ? { opacity: 0.5 } : {}}>
                                <span className="check">
                                    {(plan.name === 'Diario' || plan.name === 'Semanal') ? <X size={16} style={{ color: 'var(--text-3)' }} /> : <Check size={16} />}
                                </span>
                                Diseños VIP
                            </li>
                            <li style={(plan.name === 'Diario' || plan.name === 'Semanal') ? { opacity: 0.5 } : {}}>
                                <span className="check">
                                    {(plan.name === 'Diario' || plan.name === 'Semanal') ? <X size={16} style={{ color: 'var(--text-3)' }} /> : <Check size={16} />}
                                </span>
                                Soporte 24/7
                            </li>
                            <li style={(plan.name === 'Diario' || plan.name === 'Semanal' || plan.name === 'Mensual') ? { opacity: 0.5 } : {}}>
                                <span className="check">
                                    {(plan.name === 'Diario' || plan.name === 'Semanal' || plan.name === 'Mensual') ? <X size={16} style={{ color: 'var(--text-3)' }} /> : <Check size={16} />}
                                </span>
                                Acceso a la comunidad
                            </li>
                        </ul>

                        {!isAuthenticated ? (
                            <Link to="/register">
                                <button className="btn btn-accent" style={{ width: '100%' }}>
                                    Suscribirse
                                </button>
                            </Link>
                        ) : !isSubscribed ? (
                            <div className="paypal-wrapper" style={{ width: '100%' }}>
                                {plan.paypalId ? (
                                    <PayPalButton buttonId={plan.paypalId} />
                                ) : (
                                    <button className="btn btn-accent" style={{ width: '100%' }}
                                        onClick={() => alert('Próximamente: Estamos configurando el botón de pago para el plan ' + plan.name)}
                                    >
                                        Seleccionar {plan.name}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <button className="btn btn-ghost" style={{ width: '100%' }} disabled>
                                Plan Actual
                            </button>
                        )}
                    </div>
                ))}
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
