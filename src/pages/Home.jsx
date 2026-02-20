import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Box, Palette, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        icon: Zap,
        title: 'Corte Laser',
        headline: 'Archivos SVG y DXF listos para cortar',
        desc: 'Disenos optimizados para maquinas de corte y grabado laser. Cajas, decoracion, senaletica y mas.',
        cta: 'Explorar Laser',
        link: '/gallery/laser',
        color: '#f87171',
        bg: 'linear-gradient(135deg, #0a0000 0%, #1a0505 30%, #2d0a0a 100%)',
        accent: 'rgba(248, 113, 113, 0.08)',
    },
    {
        id: 2,
        icon: Box,
        title: 'Impresion 3D',
        headline: 'Modelos 3D profesionales para imprimir',
        desc: 'STL, OBJ y 3MF testeados y listos para cualquier impresora FDM o resina sin soportes innecesarios.',
        cta: 'Explorar 3D',
        link: '/gallery/printing3d',
        color: '#818cf8',
        bg: 'linear-gradient(135deg, #000005 0%, #070520 30%, #0f0a2d 100%)',
        accent: 'rgba(129, 140, 248, 0.08)',
    },
    {
        id: 3,
        icon: Palette,
        title: 'Sublimacion',
        headline: 'Disenos HD para sublimar y estampar',
        desc: 'PNG y JPG en alta resolucion con colores vibrantes. Tazas, camisetas, fundas y mas.',
        cta: 'Explorar Sublimacion',
        link: '/gallery/sublimation',
        color: '#38bdf8',
        bg: 'linear-gradient(135deg, #000505 0%, #001520 30%, #0a1f2d 100%)',
        accent: 'rgba(56, 189, 248, 0.08)',
    },
];

const Home = () => {
    const { isAuthenticated } = useAuth();
    const [current, setCurrent] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback((index) => {
        if (transitioning) return;
        setTransitioning(true);
        setTimeout(() => {
            setCurrent(index);
            setTimeout(() => setTransitioning(false), 50);
        }, 400);
    }, [transitioning]);

    const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
    const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

    useEffect(() => {
        const interval = setInterval(() => next(), 6000);
        return () => clearInterval(interval);
    }, [next]);

    const slide = SLIDES[current];
    const SlideIcon = slide.icon;

    return (
        <div className="fade-in">
            {/* Hero Carousel */}
            <section className="hero-banner" style={{ background: slide.bg }}>
                {/* Ambient glow */}
                <div className="hero-glow" style={{ background: `radial-gradient(ellipse 60% 80% at 70% 50%, ${slide.accent}, transparent)` }}></div>
                <div className="hero-glow-2" style={{ background: `radial-gradient(ellipse 40% 60% at 30% 80%, ${slide.accent}, transparent)` }}></div>

                {/* Grid overlay */}
                <div className="hero-grid"></div>

                {/* Large background icon */}
                <div className="hero-bg-icon">
                    <SlideIcon size={320} strokeWidth={0.3} style={{ color: slide.color }} />
                </div>

                {/* Content */}
                <div className={`hero-slide-content ${transitioning ? 'out' : 'in'}`}>
                    <div className="hero-slide-label" style={{ color: slide.color, borderColor: `${slide.color}30` }}>
                        <SlideIcon size={14} />
                        {slide.title}
                    </div>

                    <h1>{slide.headline}</h1>

                    <p>{slide.desc}</p>

                    <div className="hero-slide-actions">
                        <Link to={slide.link}>
                            <button className="btn btn-accent btn-lg">
                                {slide.cta} <ArrowRight size={18} />
                            </button>
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register">
                                <button className="btn btn-ghost btn-lg">
                                    Crear cuenta
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="hero-nav">
                    <button className="hero-nav-btn" onClick={prev}><ChevronLeft size={18} /></button>
                    <div className="hero-dots">
                        {SLIDES.map((s, i) => (
                            <button
                                key={s.id}
                                className={`hero-dot ${i === current ? 'active' : ''}`}
                                onClick={() => goTo(i)}
                                style={i === current ? { background: slide.color, boxShadow: `0 0 10px ${slide.color}80` } : {}}
                            />
                        ))}
                    </div>
                    <button className="hero-nav-btn" onClick={next}><ChevronRight size={18} /></button>
                </div>

                {/* Slide counter */}
                <div className="hero-counter">
                    <span style={{ color: slide.color }}>{String(current + 1).padStart(2, '0')}</span>
                    <span className="hero-counter-sep">/</span>
                    <span>{String(SLIDES.length).padStart(2, '0')}</span>
                </div>
            </section>

            {/* Categories */}
            <section className="page-content">
                <div className="section-header">
                    <h2>Categorias</h2>
                    <p>Colecciones organizadas por tipo de trabajo</p>
                </div>

                <div className="category-grid">
                    <Link to="/gallery/laser">
                        <div className="category-card laser">
                            <ArrowUpRight size={18} className="card-arrow" />
                            <div className="category-icon"><Zap size={24} /></div>
                            <h3>Corte Laser</h3>
                            <p>Archivos SVG, DXF y AI optimizados para maquinas de corte y grabado laser</p>
                        </div>
                    </Link>

                    <Link to="/gallery/printing3d">
                        <div className="category-card printing3d">
                            <ArrowUpRight size={18} className="card-arrow" />
                            <div className="category-icon"><Box size={24} /></div>
                            <h3>Impresion 3D</h3>
                            <p>Modelos STL, OBJ y 3MF listos para imprimir en cualquier impresora</p>
                        </div>
                    </Link>

                    <Link to="/gallery/sublimation">
                        <div className="category-card sublimation">
                            <ArrowUpRight size={18} className="card-arrow" />
                            <div className="category-icon"><Palette size={24} /></div>
                            <h3>Sublimacion</h3>
                            <p>Disenos PNG y JPG de alta resolucion para sublimacion y estampado</p>
                        </div>
                    </Link>
                </div>

                {/* Steps */}
                <div className="section-header" style={{ marginTop: '5rem' }}>
                    <h2>Como funciona</h2>
                    <p>Tres pasos para acceder a todos los disenos</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">01</div>
                        <h3>Registrate</h3>
                        <p>Crea tu cuenta gratuita y explora toda la galeria de disenos disponibles</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">02</div>
                        <h3>Suscribete</h3>
                        <p>Elige tu plan y obten acceso ilimitado a todos los archivos de la plataforma</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">03</div>
                        <h3>Descarga</h3>
                        <p>Descarga sin limites. Todos los archivos listos para usar en tus proyectos</p>
                    </div>
                </div>

                {/* CTA */}
                {!isAuthenticated && (
                    <div className="subscribe-banner" style={{ marginTop: '5rem' }}>
                        <h3>Empieza hoy</h3>
                        <p>Unete a la comunidad y accede a cientos de archivos de diseno profesional</p>
                        <Link to="/register">
                            <button className="btn btn-accent btn-lg">
                                Crear cuenta gratis <ArrowRight size={18} />
                            </button>
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
