import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../config/backblaze';
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const Gallery = () => {
    const { category: urlCategory } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState(urlCategory || 'all');

    // Sync state with URL parameter
    useEffect(() => {
        setActiveFilter(urlCategory || 'all');
    }, [urlCategory]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                let data;
                if (search.trim()) {
                    data = await searchProducts(search, activeFilter !== 'all' ? activeFilter : null);
                    setProducts(data || []);
                } else if (activeFilter !== 'all') {
                    // console.log("Fetching by category:", activeFilter);
                    const result = await getProductsByCategory(activeFilter, 50);
                    setProducts(result.products || []);
                } else {
                    // console.log("Fetching all products");
                    const result = await getAllProducts(50);
                    setProducts(result || []);
                }
            } catch (err) {
                console.error("Gallery Load Error:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [activeFilter, search]);

    const handleFilterChange = (key) => {
        if (key === 'all') {
            navigate('/gallery');
        } else {
            navigate(`/gallery/${key}`);
        }
    };

    const currentCat = CATEGORIES[activeFilter];

    return (
        <div className="page-content fade-in">
            <div className="section-header">
                <h2>{currentCat ? currentCat.name : 'Galería Completa'}</h2>
                <p>{currentCat ? currentCat.description : 'Todos los archivos de diseño disponibles en la plataforma'}</p>
            </div>

            <div className="filter-bar">
                <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar diseños..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-pills">
                    <button
                        className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        Todos
                    </button>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            className={`filter-pill ${activeFilter === key ? 'active' : ''}`}
                            onClick={() => handleFilterChange(key)}
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
                        <p className="loading-text">Cargando diseños...</p>
                    </div>
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state" style={{ padding: '4rem 1rem' }}>
                    <h3>No hay diseños todavía</h3>
                    <p style={{ maxWidth: '400px', margin: '1rem auto' }}>
                        {search
                            ? `No encontramos nada para "${search}" en esta categoría.`
                            : `Aún no se han subido archivos a la categoría ${currentCat ? currentCat.name : 'seleccionada'}.`}
                    </p>
                    {activeFilter !== 'all' && (
                        <button className="btn btn-ghost mt-2" onClick={() => handleFilterChange('all')}>
                            Ver todos los diseños
                        </button>
                    )}
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
