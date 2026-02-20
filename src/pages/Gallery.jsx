import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CATEGORIES } from '../config/backblaze';
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const Gallery = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(category || 'all');

    useEffect(() => {
        if (category) setActiveFilter(category);
    }, [category]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                let data;
                if (search.trim()) {
                    data = await searchProducts(search, activeFilter !== 'all' ? activeFilter : null);
                    setProducts(data || []);
                } else if (activeFilter !== 'all') {
                    data = await getProductsByCategory(activeFilter, 50);
                    setProducts(data.products || []);
                } else {
                    data = await getAllProducts(50);
                    setProducts(data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeFilter, search]);

    const currentCat = CATEGORIES[activeFilter];

    return (
        <div className="page-content fade-in">
            <div className="section-header">
                <h2>{currentCat ? currentCat.name : 'Galeria'}</h2>
                <p>{currentCat ? currentCat.description : 'Todos los archivos de diseno disponibles'}</p>
            </div>

            <div className="filter-bar">
                <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar disenos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-pills">
                    <button
                        className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Todos
                    </button>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            className={`filter-pill ${activeFilter === key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(key)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div>
                        <div className="spinner"></div>
                        <p className="loading-text">Cargando disenos...</p>
                    </div>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <h3>Sin resultados</h3>
                    <p>No se encontraron disenos para
                        {search ? ` "${search}"` : ' esta categoria'}. Intenta ajustar tu busqueda.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Gallery;
