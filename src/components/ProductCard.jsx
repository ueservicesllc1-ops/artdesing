import { Link } from 'react-router-dom';
import { CATEGORIES } from '../config/backblaze';
import { Download, Eye, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
    const cat = CATEGORIES[product.category] || {};
    const catClass = product.category || '';

    return (
        <Link to={`/product/${product.id}`}>
            <div className="card">
                <div className="card-image">
                    {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} loading="lazy" />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-2)' }} />
                    )}
                    <span className={`card-badge ${catClass}`}>
                        {cat.name || product.category}
                    </span>
                    <div className="card-overlay">
                        <button className="btn btn-accent btn-sm">
                            <Eye size={14} /> Ver detalle
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <h3>{product.name}</h3>
                    {product.description && <p>{product.description}</p>}
                    {product.tags && product.tags.length > 0 && (
                        <div className="card-tags">
                            {product.tags.slice(0, 3).map((tag, i) => (
                                <span className="tag" key={i}>{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Download size={12} /> {product.downloads || 0}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--text-2)' }}>
                        Ver mas <ArrowRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
