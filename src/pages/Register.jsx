import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../services/authService';
import { ArrowRight, User } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Las contrasenas no coinciden');
        }
        if (password.length < 6) {
            return setError('La contrasena debe tener al menos 6 caracteres');
        }

        setLoading(true);
        try {
            await registerUser(email, password, name);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Error con Google');
        }
    };

    return (
        <div className="auth-container fade-in">
            <div className="auth-card">
                <h2>Crear cuenta</h2>
                <p className="auth-subtitle">Unete y accede a todos los disenos</p>

                {error && <div className="error-message">{error}</div>}

                <button className="btn-google" onClick={handleGoogle} type="button">
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>
                    Registrarse con Google
                </button>

                <div className="auth-divider">o</div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contrasena</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimo 6 caracteres"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contrasena</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repite tu contrasena"
                            required
                        />
                    </div>

                    <button className="btn btn-accent btn-lg" type="submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        <ArrowRight size={16} />
                    </button>
                </form>

                <p className="auth-footer">
                    Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
