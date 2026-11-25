import { useEffect, useRef } from 'react';

// La imagen mide 130% del contenedor: el 15% que sobra arriba y abajo es el margen de movimiento
const MARGEN = 0.15;

// Imagen de fondo que se desplaza un poco más lento que la página.
// 'intensidad' es la fracción del desplazamiento que sigue la imagen. 'children' va encima de la imagen.
const ImagenParallax = ({ src, intensidad = 0.12, cargaInmediata = false, className = '', children }) => {
    const contenedor = useRef(null);
    const imagen = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        let cuadro = 0;
        const mover = () => {
            cuadro = 0;
            const caja = contenedor.current.getBoundingClientRect();
            if (caja.bottom < 0 || caja.top > window.innerHeight) return;
            const limite = caja.height * MARGEN;
            const distancia = (caja.top + caja.height / 2 - window.innerHeight / 2) * intensidad;
            const desplazamiento = Math.max(-limite, Math.min(limite, -distancia));
            imagen.current.style.transform = `translate3d(0, ${desplazamiento}px, 0)`;
        };
        const programar = () => {
            if (!cuadro) cuadro = requestAnimationFrame(mover);
        };

        mover();
        window.addEventListener('scroll', programar, { passive: true });
        window.addEventListener('resize', programar);
        return () => {
            cancelAnimationFrame(cuadro);
            window.removeEventListener('scroll', programar);
            window.removeEventListener('resize', programar);
        };
    }, [intensidad]);

    return (
        <div ref={contenedor} className={`relative overflow-hidden ${className}`}>
            <img
                ref={imagen}
                src={src}
                alt=""
                aria-hidden="true"
                loading={cargaInmediata ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover will-change-transform"
            />
            {children}
        </div>
    );
};

export default ImagenParallax;
