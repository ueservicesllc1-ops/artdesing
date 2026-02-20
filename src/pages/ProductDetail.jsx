import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProduct, incrementDownloads } from '../services/productService';
import { downloadFile } from '../services/storageService';
import { CATEGORIES } from '../config/backblaze';
import { ArrowLeft, Download, Zap, Box, Palette, FileType, Calendar, Tag, Lock } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, isSubscribed } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getProduct(id);
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDownload = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (!isSubscribed) return navigate('/subscription');

        setDownloading(true);
        try {
            await downloadFile(product.fileKey, product.fileName || product.name);
            await incrementDownloads(product.id);
            setProduct(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
        } catch (err) {
            console.error(err);
            alert('Error al descargar el archivo.');
        } finally {
            setDownloading(false);
        }
    };

    const catIcons = { laser: Zap, printing3d: Box, sublimation: Palette };

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading-container">
                    <div><div className="spinner"></div><p className="loading-text">Cargando...</p></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-content">
                <div className="empty-state">
                    <h3>Producto no encontrado</h3>
                    <p>El producto que buscas no existe o fue eliminado</p>
                    <Link to="/gallery"><button className="btn btn-accent mt-2">Volver a la galeria</button></Link>
                </div>
            </div>
        );
    }

    const cat = CATEGORIES[product.category] || {};
    const catClass = product.category || '';
    const CatIcon = catIcons[product.category] || Tag;

    return (
        <div className="page-content fade-in">
            <button className="btn btn-ghost btn-sm mb-3" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Volver
            </button>

            <div className="product-detail">
                <div className="product-image-main">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                </div>

                <div className="product-info">
                    <div className={`product-category-badge ${catClass}`}
                        style={{ background: `var(--${catClass}-dim)`, color: `var(--${catClass})` }}>
                        <CatIcon size={13} />
                        {cat.name || product.category}
                    </div>

                    <h1>{product.name}</h1>

                    {product.description && (
                        <p className="product-description">{product.description}</p>
                    )}

                    <div className="product-meta">
                        <div className="product-meta-item">
                            <div className="meta-label">Descargas</div>
                            <div className="meta-value">{product.downloads || 0}</div>
                        </div>
                        <div className="product-meta-item">
                            <div className="meta-label">Formato</div>
                            <div className="meta-value">{product.fileType || cat.extensions?.[0] || '---'}</div>
                        </div>
                        <div className="product-meta-item">
                            <div className="meta-label">Categoria</div>
                            <div className="meta-value">{cat.name || product.category}</div>
                        </div>
                        <div className="product-meta-item">
                            <div className="meta-label">Fecha</div>
                            <div className="meta-value" style={{ fontSize: '0.8rem' }}>
                                {product.createdAt?.toDate
                                    ? product.createdAt.toDate().toLocaleDateString('es-ES')
                                    : 'Reciente'}
                            </div>
                        </div>
                    </div>

                    {!isAuthenticated ? (
                        <div>
                            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                                Inicia sesion y suscribete para descargar este archivo
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to="/login"><button className="btn btn-accent">Iniciar sesion</button></Link>
                                <Link to="/register"><button className="btn btn-ghost">Crear cuenta</button></Link>
                            </div>
                        </div>
                    ) : !isSubscribed ? (
                        <div>
                            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Lock size={14} /> Necesitas una suscripcion activa para descargar
                            </p>
                            <Link to="/subscription"><button className="btn btn-accent btn-lg">Ver planes</button></Link>
                        </div>
                    ) : (
                        <button className="btn btn-accent btn-lg" onClick={handleDownload} disabled={downloading}
                            style={{ width: '100%' }}>
                            <Download size={18} />
                            {downloading ? 'Descargando...' : 'Descargar archivo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
