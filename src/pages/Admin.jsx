import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, Plus, Trash2, Image, FileUp, X, Package, Users, LayoutGrid, ChevronRight, User, Shield } from 'lucide-react';
import { createProduct, getAllProducts, deleteProduct } from '../services/productService';
import { uploadFile, deleteFile } from '../services/storageService';
import { getAllUsers } from '../services/authService';
import { CATEGORIES } from '../config/backblaze';

const Admin = () => {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [activeSection, setActiveSection] = useState('upload'); // categories, upload, users
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        category: 'laser',
        tags: '',
        fileType: 'SVG',
    });
    const [imageFile, setImageFile] = useState(null);
    const [designFile, setDesignFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const PIN_SECRET = '1619';
    const FILE_FORMATS = ['STL', 'PNG', 'SVG', 'CDR', 'AI', 'DXF', 'PDF', 'OBJ', 'JPG'];

    useEffect(() => {
        if (isAuthorized) {
            loadInitialData();
        }
    }, [isAuthorized]);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pinInput === PIN_SECRET) {
            setIsAuthorized(true);
        } else {
            alert('PIN Incorrecto');
            setPinInput('');
        }
    };

    const loadInitialData = async () => {
        console.log("Cargando datos. Auth User:", isAdmin ? "Admin" : "Standard", "isAuthorized:", isAuthorized);
        setLoading(true);
        try {
            const [prods, allUsers] = await Promise.all([
                getAllProducts(100).catch(e => { console.error("Error prods:", e); return []; }),
                getAllUsers().catch(e => { console.error("Error users:", e); return []; })
            ]);
            setProducts(prods);
            setUsers(allUsers);
        } catch (error) {
            console.error('Error loading admin data:', error);
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
            if (FILE_FORMATS.includes(ext)) {
                setForm(prev => ({ ...prev, fileType: ext }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !designFile) {
            alert('Selecciona una imagen de preview y el archivo de diseño');
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
                createdAt: new Date()
            };

            const newProduct = await createProduct(productData);
            setProducts(prev => [newProduct, ...prev]);

            setForm({ name: '', description: '', category: 'laser', tags: '', fileType: 'SVG' });
            setImageFile(null);
            setDesignFile(null);
            setImagePreview(null);
            setShowForm(false);
            alert('Producto publicado exitosamente');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error de permisos o conexión: ' + error.message);
        }
        setUploading(false);
    };

    const handleDelete = async (product) => {
        if (!confirm(`¿Eliminar "${product.name}"?`)) return;
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

    const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com');

    if (authLoading) {
        return (
            <div className="page-content">
                <div className="loading-container"><div className="spinner"></div></div>
            </div>
        );
    }

    if (!isAuthorized) {
        if (!user) {
            return (
                <div className="page-content fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                        <Shield size={48} style={{ color: 'var(--text-3)', marginBottom: '1.5rem', margin: '0 auto' }} />
                        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '1.5rem' }}>Acceso Restringido</h2>
                        <p style={{ color: 'var(--text-2)', margin: '1rem 0 2rem' }}>Debes iniciar sesión para intentar acceder al panel.</p>
                        <button className="btn btn-accent btn-lg" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                </div>
            );
        }

        if (!isGoogleUser) {
            return (
                <div className="page-content fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
                        <Shield size={48} style={{ color: 'var(--danger)', marginBottom: '1.5rem', margin: '0 auto' }} />
                        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: '1.5rem' }}>Acceso no Autorizado</h2>
                        <p style={{ color: 'var(--text-2)', margin: '1rem 0 2rem' }}>Solo los usuarios autenticados con <strong>Google</strong> pueden intentar ingresar al panel administrativo.</p>
                        <button className="btn btn-sm" style={{ width: '100%' }} onClick={() => navigate('/')}>
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="pin-entry-container fade-in">
                <div className="pin-card">
                    <div className="pin-icon-wrapper">
                        <Shield size={40} />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Verificación de PIN</h2>
                    <p style={{ color: 'var(--text-2)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Usuario verificado: <strong>{user.displayName}</strong></p>

                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            className="pin-input"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            placeholder="****"
                            maxLength={4}
                            autoFocus
                            required
                        />
                        <button className="btn btn-accent btn-lg" style={{ width: '100%', height: '56px' }}>
                            Desbloquear Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-content">
                <div className="loading-container"><div className="spinner"></div></div>
            </div>
        );
    }

    return (
        <div className="admin-layout fade-in">
            <aside className="admin-sidebar">
                <div style={{ padding: '0 0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--accent)', color: 'black', padding: '0.5rem', borderRadius: '12px' }}>
                        <Shield size={20} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>Admin Panel</span>
                </div>

                <button className={`admin-nav-item ${activeSection === 'categories' ? 'active' : ''}`} onClick={() => setActiveSection('categories')}>
                    <LayoutGrid size={20} /> Categorías
                </button>
                <button className={`admin-nav-item ${activeSection === 'upload' ? 'active' : ''}`} onClick={() => setActiveSection('upload')}>
                    <FileUp size={20} /> Subir archivos
                </button>
                <button className={`admin-nav-item ${activeSection === 'users' ? 'active' : ''}`} onClick={() => setActiveSection('users')}>
                    <Users size={20} /> Usuarios
                </button>

                <div style={{ marginTop: 'auto', padding: '1rem' }}>
                    <button className="btn btn-sm" style={{ width: '100%', opacity: 0.6 }} onClick={() => navigate('/')}>Volver al Sitio</button>
                </div>
            </aside>

            <main className="admin-main">
                {activeSection === 'categories' && (
                    <div className="fade-in">
                        <div className="admin-header"><div className="admin-title-group"><h2>Configuración de Categorías</h2><p>Estructura de carpetas y formatos permitidos</p></div></div>
                        <div className="admin-grid">
                            {Object.entries(CATEGORIES).map(([key, cat]) => (
                                <div key={key} className="admin-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                        <div style={{ width: 56, height: 56, borderRadius: '16px', background: cat.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Package size={28} /></div>
                                        <div><h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{cat.name}</h4><code style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{cat.folder}</code></div>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', marginBottom: '1.5rem' }}>{cat.description}</p>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {cat.extensions.map(ext => (<span key={ext} style={{ fontSize: '0.75rem', background: 'var(--bg-3)', padding: '0.3rem 0.6rem', borderRadius: '8px' }}>{ext}</span>))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'upload' && (
                    <div className="fade-in">
                        <div className="admin-header">
                            <div className="admin-title-group"><h2>Gestión de Biblioteca</h2><p>Añade nuevos recursos o elimina contenido</p></div>
                            <button className="btn btn-accent btn-lg" onClick={() => setShowForm(!showForm)}>{showForm ? <><X size={18} /> Cancelar</> : <><Plus size={18} /> Nuevo Recurso</>}</button>
                        </div>

                        {showForm && (
                            <div className="admin-card" style={{ marginBottom: '3rem', maxWidth: '800px', border: '2px solid var(--accent-dim)' }}>
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div className="form-group"><label>Nombre Comercial</label><input type="text" className="form-input" placeholder="Nombre del diseño" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required /></div>
                                        <div className="form-group"><label>Categoría Destino</label><select className="form-input" value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}>{Object.entries(CATEGORIES).map(([key, cat]) => (<option key={key} value={key}>{cat.name}</option>))}</select></div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}><label>Descripción</label><textarea className="form-input" placeholder="Detalles..." value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} style={{ height: '100px' }} required /></div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                        <div className="upload-zone" onClick={() => imageInputRef.current?.click()}>
                                            {imagePreview ? <img src={imagePreview} alt="Preview" style={{ height: '80px' }} /> : <><Image size={32} /><p>Subir Miniatura</p></>}
                                            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                                        </div>
                                        <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                            {designFile ? <p>{designFile.name}</p> : <><FileUp size={32} /><p>Subir Archivo Final</p></>}
                                            <input ref={fileInputRef} type="file" onChange={handleDesignFileSelect} style={{ display: 'none' }} />
                                        </div>
                                    </div>
                                    <button className="btn btn-accent btn-lg" style={{ width: '100%' }} disabled={uploading}>{uploading ? 'Subiendo...' : 'Publicar Producto'}</button>
                                </form>
                            </div>
                        )}

                        <div className="user-table-container">
                            <table className="user-table">
                                <thead><tr><th>Producto</th><th>Categoría</th><th>Formato</th><th style={{ textAlign: 'right' }}>Gestión</th></tr></thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><img src={product.imageUrl} style={{ width: 44, height: 44, borderRadius: '10px', objectFit: 'cover' }} /><div><span style={{ fontWeight: 700 }}>{product.name}</span></div></div></td>
                                            <td>{CATEGORIES[product.category]?.name || product.category}</td>
                                            <td><span style={{ fontSize: '0.75rem', background: 'var(--bg-3)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{product.fileType}</span></td>
                                            <td style={{ textAlign: 'right' }}><button className="btn btn-danger btn-sm" onClick={() => handleDelete(product)}><Trash2 size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeSection === 'users' && (
                    <div className="fade-in">
                        <div className="admin-header"><div className="admin-title-group"><h2>Base de Usuarios</h2><p>Control de acceso y suscripciones</p></div></div>
                        <div className="user-table-container">
                            <table className="user-table">
                                <thead><tr><th>Usuario</th><th>Email</th><th>Permisos</th><th>Membresía</th></tr></thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={18} /></div><span>{u.displayName || 'Invitado'}</span></div></td>
                                            <td>{u.email || 'N/A'}</td>
                                            <td><span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>{u.role || 'user'}</span></td>
                                            <td><div className="status-indicator"><div className={`status-dot ${u.subscriptionStatus === 'active' ? 'active' : 'inactive'}`}></div><span>{u.subscriptionStatus === 'active' ? 'Premium' : 'Básico'}</span></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
