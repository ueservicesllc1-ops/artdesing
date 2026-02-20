import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="page-content fade-in">
            <div className="legal-container">
                <div className="section-header">
                    <div className="logo-mark" style={{ width: '50px', height: '50px', marginBottom: '1rem' }}>
                        <Shield size={24} />
                    </div>
                    <h1>Política de Privacidad</h1>
                    <p>Última actualización: 20 de febrero de 2026</p>
                </div>

                <div className="legal-content admin-card">
                    <section>
                        <h2>1. Introducción</h2>
                        <p>En Art Desing, valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos la información cuando utiliza nuestra plataforma.</p>
                    </section>

                    <section>
                        <h2>2. Información que recopilamos</h2>
                        <p>Recopilamos información que usted nos proporciona directamente al registrarse:</p>
                        <ul>
                            <li>Nombre y dirección de correo electrónico.</li>
                            <li>Información de facturación procesada a través de PayPal (nosotros no almacenamos sus datos de tarjeta de crédito).</li>
                            <li>Datos de uso y descargas realizadas en la plataforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Uso de la información</h2>
                        <p>Utilizamos su información para:</p>
                        <ul>
                            <li>Gestionar su suscripción y acceso a los archivos.</li>
                            <li>Mejorar nuestros servicios y catálogo de diseños.</li>
                            <li>Enviar notificaciones importantes relacionadas con su cuenta.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Protección de datos</h2>
                        <p>Implementamos medidas de seguridad robustas, incluyendo encriptación SSL y autenticación segura a través de Firebase, para proteger su información contra acceso no autorizado.</p>
                    </section>

                    <section>
                        <h2>5. Cookies</h2>
                        <p>Utilizamos cookies esenciales para mantener su sesión iniciada y proporcionar una experiencia personalizada en nuestra plataforma.</p>
                    </section>

                    <section>
                        <h2>6. Sus derechos</h2>
                        <p>Usted tiene derecho a acceder, corregir o eliminar sus datos personales en cualquier momento desde su panel de usuario o contactándonos directamente.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
