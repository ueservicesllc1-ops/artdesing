import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, Plus, Trash2, Image, FileUp, X, Package } from 'lucide-react';
import { createProduct, getAllProducts, deleteProduct } from '../services/productService';
import { uploadFile, deleteFile } from '../services/storageService';
import { CATEGORIES } from '../config/backblaze';

const Admin = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'laser',
        tags: '',
        fileType: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [designFile, setDesignFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            navigate('/');
            return;
        }
        if (isAdmin) {
            loadProducts();
        }
    }, [isAdmin, authLoading]);

    const loadProducts = async () => {
        try {
            const prods = await getAllProducts(100);
            setProducts(prods);
        } catch (error) {
            console.error('Error loading products:', error);
        }
        setLoading(false);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDesignFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDesignFile(file);
            const ext = file.name.split('.').pop().toUpperCase();
            setForm(prev => ({ ...prev, fileType: ext }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !designFile) {
            alert('Selecciona una imagen de preview y el archivo de diseno');
            return;
        }

        setUploading(true);
        try {
            const category = CATEGORIES[form.category];
            const timestamp = Date.now();

            const imagePath = `${category.folder}images/${timestamp}_${imageFile.name}`;
            const imageResult = await uploadFile(imageFile, imagePath);

            const filePath = `${category.folder}files/${timestamp}_${designFile.name}`;
            const fileResult = await uploadFile(designFile, filePath);

            const sizeKB = (designFile.size / 1024).toFixed(1);
            const fileSize = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

            const productData = {
                name: form.name,
                description: form.description,
                category: form.category,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                fileType: form.fileType,
                fileSize,
                imageUrl: imageResult.url,
                imageKey: imagePath,
                fileUrl: fileResult.url,
                fileKey: filePath,
                fileName: designFile.name,
            };

            const newProduct = await createProduct(productData);
            setProducts(prev => [newProduct, ...prev]);

            setForm({ name: '', description: '', category: 'laser', tags: '', fileType: '' });
            setImageFile(null);
            setDesignFile(null);
            setImagePreview(null);
            setShowForm(false);
            alert('Producto creado exitosamente');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear el producto: ' + error.message);
        }
        setUploading(false);
    };

    const handleDelete = async (product) => {
        if (!confirm(`Eliminar "${product.name}"?`)) return;
        try {
            if (product.imageKey) await deleteFile(product.imageKey).catch(() => { });
            if (product.fileKey) await deleteFile(product.fileKey).catch(() => { });
            await deleteProduct(product.id);
            setProducts(prev => prev.filter(p => p.id !== product.id));
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar');
        }
    };

    if (authLoading) {
        return (
            <div className="page-content">
                <div className="loading-container"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="page-content fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <h2>Administracion</h2>
                    <p>Gestiona productos y archivos de diseno</p>
                </div>
                <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><X size={18} /> Cerrar</> : <><Plus size={18} /> Nuevo</>}
                </button>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-label">Total</div>
                    <div className="stat-value">{products.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Corte Laser</div>
                    <div className="stat-value" style={{ color: 'var(--laser)' }}>
                        {products.filter(p => p.category === 'laser').length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Impresion 3D</div>
                    <div className="stat-value" style={{ color: 'var(--printing3d)' }}>
                        {products.filter(p => p.category === 'printing3d').length}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Sublimacion</div>
                    <div className="stat-value" style={{ color: 'var(--sublimation)' }}>
                        {products.filter(p => p.category === 'sublimation').length}
                    </div>
                </div>
            </div>

            {/* Upload Form */}
            {showForm && (
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Nuevo producto
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej: Caja decorativa hexagonal"
                                    value={form.name}
                                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoria</label>
                                <select
                                    className="form-input"
                                    value={form.category}
                                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                                        <option key={key} value={key}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Descripcion</label>
                            <textarea
                                className="form-input"
                                placeholder="Describe el producto..."
                                value={form.description}
                                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Etiquetas (separadas por coma)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="caja, decoracion, regalo"
                                    value={form.tags}
                                    onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de archivo</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="SVG, STL, PNG..."
                                    value={form.fileType}
                                    onChange={(e) => setForm(prev => ({ ...prev, fileType: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-1)' }}>
                                    Imagen de preview
                                </label>
                                <div
                                    className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                                    onClick={() => imageInputRef.current?.click()}
                                    style={{ padding: '1.5rem' }}
                                >
                                    {imagePreview ? (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <img src={imagePreview} alt="Preview" style={{ maxHeight: '120px', borderRadius: 'var(--radius-s)' }} />
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, padding: 0, borderRadius: '50%' }}
                                                onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Image size={32} style={{ color: 'var(--text-3)', marginBottom: '0.5rem' }} />
                                            <p>Arrastra o haz clic para subir imagen</p>
                                        </>
                                    )}
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-1)' }}>
                                    Archivo de diseno
                                </label>
                                <div
                                    className="upload-zone"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ padding: '1.5rem' }}
                                >
                                    {designFile ? (
                                        <div>
                                            <FileUp size={32} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-0)' }}>{designFile.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>
                                                {(designFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <FileUp size={32} style={{ color: 'var(--text-3)', marginBottom: '0.5rem' }} />
                                            <p>SVG, STL, PNG, DXF, OBJ...</p>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleDesignFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={uploading}>
                            {uploading ? (
                                <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div> Subiendo...</>
                            ) : (
                                <><Upload size={18} /> Publicar</>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Products Table */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>
                        <Package size={16} style={{ marginRight: 6 }} /> Productos ({products.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="loading-container" style={{ minHeight: 200 }}>
                        <div className="spinner"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem' }}>
                        <h3>Sin productos</h3>
                        <p>Agrega tu primer producto con el boton de arriba</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Producto</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoria</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Formato</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descargas</th>
                                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => {
                                    const cat = CATEGORIES[product.category];
                                    return (
                                        <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '0.75rem 1.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-s)', overflow: 'hidden', background: 'var(--bg-2)', flexShrink: 0 }}>
                                                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{product.name}</div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{product.fileSize || ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span className={`card-badge ${product.category}`} style={{ position: 'static' }}>
                                                    {cat?.name || product.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', color: 'var(--text-1)', fontSize: '0.85rem' }}>
                                                {product.fileType || '-'}
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.85rem' }}>
                                                {product.downloads || 0}
                                            </td>
                                            <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
