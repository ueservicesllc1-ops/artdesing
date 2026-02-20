import { FileText, Gavel, AlertCircle, Info } from 'lucide-react';

const Terms = () => {
    return (
        <div className="page-content fade-in">
            <div className="legal-container">
                <div className="section-header">
                    <div className="logo-mark" style={{ width: '50px', height: '50px', marginBottom: '1rem' }}>
                        <Gavel size={24} />
                    </div>
                    <h1>Términos y Condiciones</h1>
                    <p>Última actualización: 20 de febrero de 2026</p>
                </div>

                <div className="legal-content admin-card">
                    <section>
                        <h2>1. Aceptación de los Términos</h2>
                        <p>Al acceder y utilizar Art Desing, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte, no podrá utilizar nuestros servicios.</p>
                    </section>

                    <section>
                        <h2>2. Licencia de Uso</h2>
                        <p>Al adquirir una suscripción, Art Desing le otorga una licencia limitada para descargar y utilizar los archivos de diseño (Láser, 3D, Sublimación) para sus proyectos personales o comerciales.</p>
                        <p><strong>Prohibiciones:</strong> Queda terminantemente prohibida la reventa, redistribución o sublicencia de los archivos digitales originales en cualquier plataforma de terceros.</p>
                    </section>

                    <section>
                        <h2>3. Suscripciones y Pagos</h2>
                        <p>Todas las suscripciones se procesan de forma segura a través de PayPal. El acceso a los archivos se otorga inmediatamente tras la confirmación del pago.</p>
                        <ul>
                            <li>Los planes diarios, mensuales y anuales tienen validez por el tiempo contratado.</li>
                            <li>No se ofrecen reembolsos una vez que se han realizado descargas de la plataforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Uso de la Cuenta</h2>
                        <p>Cada cuenta es personal e intransferible. El uso compartido de credenciales para permitir descargas por parte de terceros resultará en la suspensión inmediata de la cuenta sin derecho a reembolso.</p>
                    </section>

                    <section>
                        <h2>5. Limitación de Responsabilidad</h2>
                        <p>Art Desing proporciona los diseños "tal cual". No garantizamos que los archivos sean compatibles con todos los hardware de terceros, aunque nos esforzamos por mantener estándares profesionales.</p>
                    </section>

                    <section>
                        <h2>6. Modificaciones</h2>
                        <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la plataforma después de dichos cambios constituye la aceptación de los nuevos términos.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
