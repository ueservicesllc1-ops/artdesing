import { useState, useEffect } from 'react';
import { Calculator, Zap, Package, Clock, DollarSign, Globe, Trash2, Plus, Info, Settings, Palette } from 'lucide-react';

const ELECTRICITY_RATES = [
    { country: 'Estados Unidos', code: 'USA', rate: 0.18, currency: 'USD' },
    { country: 'España', code: 'ESP', rate: 0.28, currency: 'EUR' },
    { country: 'México', code: 'MEX', rate: 0.12, currency: 'MXN' },
    { country: 'Colombia', code: 'COL', rate: 0.24, currency: 'COP' },
    { country: 'Argentina', code: 'ARG', rate: 0.09, currency: 'ARS' },
    { country: 'Chile', code: 'CHL', rate: 0.29, currency: 'CLP' },
    { country: 'Ecuador', code: 'ECU', rate: 0.10, currency: 'USD' },
    { country: 'Perú', code: 'PER', rate: 0.18, currency: 'PEN' },
    { country: 'Uruguay', code: 'URY', rate: 0.22, currency: 'UYU' },
    { country: 'Otro (Personalizado)', code: 'OTHER', rate: 0.15, currency: 'USD' }
];

const Budget = () => {
    const [activeTab, setActiveTab] = useState('3d'); // 3d, laser, sublimation
    const [country, setCountry] = useState(ELECTRICITY_RATES[0]);
    const [customRate, setCustomRate] = useState(0.15);

    // 3D Printing States
    const [filamentPrice, setFilamentPrice] = useState(25);
    const [weight, setWeight] = useState(100);
    const [hours, setHours] = useState(5);
    const [minutes, setMinutes] = useState(0);
    const [laborPrice, setLaborPrice] = useState(5);
    const [printerWattage, setPrinterWattage] = useState(200);

    // Laser Cutting States
    const [matPrice, setMatPrice] = useState(50);
    const [sheetW, setSheetW] = useState(120);
    const [sheetH, setSheetH] = useState(90);
    const [pieceW, setPieceW] = useState(20);
    const [pieceH, setPieceH] = useState(20);
    const [laserTime, setLaserTime] = useState(15);
    const [laserPower, setLaserPower] = useState(80);
    const [laserHourly, setLaserHourly] = useState(10);

    // Sublimation States
    const [blankPrice, setBlankPrice] = useState(2.5);
    const [paperPrice, setPaperPrice] = useState(0.5);
    const [pressTime, setPressTime] = useState(180);
    const [pressPower, setPressPower] = useState(1500);
    const [failMargin, setFailMargin] = useState(10);

    // Results
    const [results, setResults] = useState({
        material: 0,
        labor: 0,
        energy: 0,
        total: 0
    });

    const calculate3D = () => {
        const totalTimeHours = hours + (minutes / 60);
        const materialCost = (filamentPrice / 1000) * weight;
        const laborTotal = totalTimeHours * laborPrice;

        const rate = country.code === 'OTHER' ? customRate : country.rate;
        const energyTotal = totalTimeHours * (printerWattage / 1000) * rate;

        setResults({
            material: materialCost,
            labor: laborTotal,
            energy: energyTotal,
            total: materialCost + laborTotal + energyTotal
        });
    };

    const calculateLaser = () => {
        const sheetArea = sheetW * sheetH;
        const pieceArea = pieceW * pieceH;
        const materialCost = sheetArea > 0 ? (matPrice / sheetArea) * pieceArea : 0;

        const timeHours = laserTime / 60;
        const machineWear = timeHours * laserHourly;
        const laborTotal = timeHours * laborPrice;

        const rate = country.code === 'OTHER' ? customRate : country.rate;
        const energyTotal = timeHours * (laserPower / 1000) * rate;

        setResults({
            material: materialCost + machineWear,
            labor: laborTotal,
            energy: energyTotal,
            total: materialCost + machineWear + laborTotal + energyTotal
        });
    };

    const calculateSublimation = () => {
        const materialCost = blankPrice + paperPrice;
        const timeHours = pressTime / 3600;
        // Se estima tiempo de preparación de 2 mins por unidad más el tiempo de prensa
        const laborTotal = (laborPrice / 60) * ((pressTime / 60) + 2);

        const rate = country.code === 'OTHER' ? customRate : country.rate;
        const energyTotal = timeHours * (pressPower / 1000) * rate;

        const subtotal = materialCost + laborTotal + energyTotal;
        const marginVal = subtotal * (failMargin / 100);

        setResults({
            material: materialCost + marginVal,
            labor: laborTotal,
            energy: energyTotal,
            total: subtotal + marginVal
        });
    };

    useEffect(() => {
        if (activeTab === '3d') calculate3D();
        if (activeTab === 'laser') calculateLaser();
        if (activeTab === 'sublimation') calculateSublimation();
    }, [
        filamentPrice, weight, hours, minutes, laborPrice, printerWattage,
        matPrice, sheetW, sheetH, pieceW, pieceH, laserTime, laserPower, laserHourly,
        blankPrice, paperPrice, pressTime, pressPower, failMargin,
        country, customRate, activeTab
    ]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <div className="page-content fade-in">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div className="logo-mark" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h2 style={{ marginBottom: '0.25rem' }}>Calculadora de Presupuestos</h2>
                        <p>Estima costos de producción precisos para tus proyectos</p>
                    </div>
                </div>
            </div>

            <div className="budget-container">
                <div className="budget-tabs">
                    <button
                        className={`budget-tab ${activeTab === '3d' ? 'active' : ''}`}
                        onClick={() => setActiveTab('3d')}
                    >
                        <Zap size={18} /> Impresión 3D
                    </button>
                    <button
                        className={`budget-tab ${activeTab === 'laser' ? 'active' : ''}`}
                        onClick={() => setActiveTab('laser')}
                    >
                        <Settings size={18} /> Corte Láser
                    </button>
                    <button
                        className={`budget-tab ${activeTab === 'sublimation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sublimation')}
                    >
                        <Palette size={18} /> Sublimación
                    </button>
                </div>

                <div className="budget-grid">
                    <div className="budget-inputs">
                        <div className="admin-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <Globe size={20} style={{ color: 'var(--accent)' }} />
                                <h3 style={{ fontSize: '1.1rem' }}>Configuración Regional</h3>
                            </div>

                            <div className="form-group">
                                <label>País (Costo Electricidad)</label>
                                <select
                                    className="form-input"
                                    onChange={(e) => setCountry(ELECTRICITY_RATES.find(c => c.code === e.target.value))}
                                    value={country.code}
                                >
                                    {ELECTRICITY_RATES.map(c => (
                                        <option key={c.code} value={c.code}>
                                            {c.country} ({c.rate.toFixed(2)} USD/kWh)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {country.code === 'OTHER' && (
                                <div className="form-group mt-3">
                                    <label>Tarifa Personalizada (USD/kWh)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={customRate}
                                        onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                                        step="0.01"
                                    />
                                </div>
                            )}
                        </div>

                        {activeTab === '3d' && (
                            <div className="admin-card fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <Settings size={20} style={{ color: 'var(--accent)' }} />
                                    <h3 style={{ fontSize: '1.1rem' }}>Parámetros de Impresión</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Costo Filamento (1kg)</label>
                                        <input type="number" className="form-input" value={filamentPrice} onChange={(e) => setFilamentPrice(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Peso de Obra (gramos)</label>
                                        <input type="number" className="form-input" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Horas</label>
                                        <input type="number" className="form-input" value={hours} onChange={(e) => setHours(parseInt(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Minutos</label>
                                        <input type="number" className="form-input" value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value))} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Mano de Obra ($/hr)</label>
                                        <input type="number" className="form-input" value={laborPrice} onChange={(e) => setLaborPrice(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Watts Impresora</label>
                                        <input type="number" className="form-input" value={printerWattage} onChange={(e) => setPrinterWattage(parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'laser' && (
                            <div className="admin-card fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <Zap size={20} style={{ color: 'var(--accent)' }} />
                                    <h3 style={{ fontSize: '1.1rem' }}>Parámetros de Corte Láser</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Costo Plancha</label>
                                        <input type="number" className="form-input" value={matPrice} onChange={(e) => setMatPrice(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Tamaño Plancha (cm)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="number" className="form-input" placeholder="W" value={sheetW} onChange={(e) => setSheetW(parseFloat(e.target.value))} />
                                            <input type="number" className="form-input" placeholder="H" value={sheetH} onChange={(e) => setSheetH(parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Minutos de Corte</label>
                                        <input type="number" className="form-input" value={laserTime} onChange={(e) => setLaserTime(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Tamaño Pieza (cm)</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input type="number" className="form-input" placeholder="W" value={pieceW} onChange={(e) => setPieceW(parseFloat(e.target.value))} />
                                            <input type="number" className="form-input" placeholder="H" value={pieceH} onChange={(e) => setPieceH(parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Mantenimiento ($/hr)</label>
                                        <input type="number" className="form-input" value={laserHourly} onChange={(e) => setLaserHourly(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Watts Máquina</label>
                                        <input type="number" className="form-input" value={laserPower} onChange={(e) => setLaserPower(parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sublimation' && (
                            <div className="admin-card fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <Palette size={20} style={{ color: 'var(--accent)' }} />
                                    <h3 style={{ fontSize: '1.1rem' }}>Parámetros de Sublimación</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label>Costo Insumo (Blanco)</label>
                                        <input type="number" className="form-input" value={blankPrice} onChange={(e) => setBlankPrice(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Papel y Tinta</label>
                                        <input type="number" className="form-input" value={paperPrice} onChange={(e) => setPaperPrice(parseFloat(e.target.value))} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Segundos de Prensa</label>
                                        <input type="number" className="form-input" value={pressTime} onChange={(e) => setPressTime(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Watts Prensa</label>
                                        <input type="number" className="form-input" value={pressPower} onChange={(e) => setPressPower(parseFloat(e.target.value))} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label>Margen Error (%)</label>
                                        <input type="number" className="form-input" value={failMargin} onChange={(e) => setFailMargin(parseFloat(e.target.value))} />
                                    </div>
                                    <div className="form-group">
                                        <label>Mano Obra ($/hr)</label>
                                        <input type="number" className="form-input" value={laborPrice} onChange={(e) => setLaborPrice(parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SUMMARY SECTION */}
                    <div className="budget-summary">
                        <div className="admin-card sticky" style={{ padding: '2rem', border: '1px solid var(--accent-mid)', background: 'var(--bg-1)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <DollarSign size={24} style={{ color: 'var(--accent)' }} /> Resumen del Costo
                            </h3>

                            <div className="summary-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={16} style={{ color: 'var(--text-2)' }} />
                                    <span>Material Usado</span>
                                </div>
                                <span className="price-val">{formatCurrency(results.material)}</span>
                            </div>

                            <div className="summary-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} style={{ color: 'var(--text-2)' }} />
                                    <span>Mano de Obra</span>
                                </div>
                                <span className="price-val">{formatCurrency(results.labor)}</span>
                            </div>

                            <div className="summary-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Zap size={16} style={{ color: 'var(--text-2)' }} />
                                    <span>Consumo Eléctrico</span>
                                </div>
                                <span className="price-val">{formatCurrency(results.energy)}</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span>Costo Total de Producción</span>
                                <div className="total-val">{formatCurrency(results.total)}</div>
                            </div>

                            <div className="info-badge mt-4">
                                <Info size={14} />
                                <p>Cálculo basado en tarifa de {country.country}</p>
                            </div>

                            <button
                                className="btn btn-accent btn-lg mt-4"
                                style={{ width: '100%', height: '56px' }}
                                onClick={() => window.print()}
                            >
                                Descargar cotización
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;
