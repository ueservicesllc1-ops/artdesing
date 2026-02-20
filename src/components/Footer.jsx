import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>Art Desing</h3>
                    <p>
                        Plataforma de archivos de diseno para corte laser, impresion 3D y sublimacion.
                        Calidad profesional, listos para produccion.
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Explorar</h4>
                    <Link to="/gallery/laser">Corte Laser</Link>
                    <Link to="/gallery/printing3d">Impresion 3D</Link>
                    <Link to="/gallery/sublimation">Sublimacion</Link>
                </div>

                <div className="footer-col">
                    <h4>Cuenta</h4>
                    <Link to="/login">Iniciar sesion</Link>
                    <Link to="/register">Registrarse</Link>
                    <Link to="/subscription">Planes</Link>
                </div>

                <div className="footer-col">
                    <h4>Legal</h4>
                    <Link to="/privacy">Privacidad</Link>
                    <Link to="/terms">Términos</Link>
                </div>
            </div>

            <div className="footer-bottom">
                Art Desing &copy; {new Date().getFullYear()} &mdash; Todos los derechos reservados
            </div>
        </footer>
    );
};

export default Footer;
