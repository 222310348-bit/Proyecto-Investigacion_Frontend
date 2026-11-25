import { useEffect, useRef, useState } from 'react';

// Sin IntersectionObserver o con "reducir movimiento" activado, el contenido se muestra desde el inicio
const mostrarDeInmediato = () =>
    !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Muestra su contenido con un desvanecido corto la primera vez que entra en pantalla.
// 'retraso' (ms) escalona la entrada de varias tarjetas seguidas.
const Aparecer = ({ children, retraso = 0, className = '' }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(mostrarDeInmediato);

    useEffect(() => {
        if (visible) return undefined;
        const observador = new IntersectionObserver(([entrada]) => {
            if (entrada.isIntersecting) {
                setVisible(true);
                observador.disconnect();
            }
        }, { rootMargin: '0px 0px -8% 0px' });
        observador.observe(ref.current);
        return () => observador.disconnect();
    }, [visible]);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${retraso}ms` }}
            className={`transition-[opacity,transform] duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${className}`}
        >
            {children}
        </div>
    );
};

export default Aparecer;
