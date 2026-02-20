import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/authService';
import { Zap, Box, Palette, Menu, X, LogOut, Shield, LayoutDashboard, Crown } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAdmin, isAuthenticated, isSubscribed } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/');
        setMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path ? 'nav-active' : '';

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="logo-mark">AD</div>
                    Art Desing
                </Link>

                <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/gallery/laser" className={isActive('/gallery/laser')} onClick={() => setMenuOpen(false)}>
                        <Zap size={15} /> Laser
                    </Link>
                    <Link to="/gallery/printing3d" className={isActive('/gallery/printing3d')} onClick={() => setMenuOpen(false)}>
                        <Box size={15} /> 3D
                    </Link>
                    <Link to="/gallery/sublimation" className={isActive('/gallery/sublimation')} onClick={() => setMenuOpen(false)}>
                        <Palette size={15} /> Sublimacion
                    </Link>

                    {!isSubscribed && (
                        <Link to="/subscription" onClick={() => setMenuOpen(false)}>
                            <button className="btn btn-sm btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Crown size={15} /> Suscribirse
                            </button>
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>
                                <LayoutDashboard size={15} /> Panel
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className={isActive('/admin')} onClick={() => setMenuOpen(false)}>
                                    <Shield size={15} /> Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-sm btn-ghost" style={{ marginLeft: '0.25rem' }}>
                                <LogOut size={15} /> Salir
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)} style={{ marginLeft: '0.25rem' }}>
                            <button className="btn btn-sm btn-ghost">Login / Registrar</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
