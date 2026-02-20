import { useEffect, useRef } from 'react';

const PayPalButton = ({ buttonId }) => {
    const containerRef = useRef(null);
    const renderedRef = useRef(false);

    useEffect(() => {
        if (!buttonId || renderedRef.current) return;

        if (window.paypal && window.paypal.HostedButtons) {
            window.paypal.HostedButtons({
                hostedButtonId: buttonId,
            }).render(`#${containerRef.current.id}`);
            renderedRef.current = true;
        }
    }, [buttonId]);

    return (
        <div
            id={`paypal-container-${buttonId}`}
            ref={containerRef}
            style={{ width: '100%', marginTop: '1rem' }}
        ></div>
    );
};

export default PayPalButton;
