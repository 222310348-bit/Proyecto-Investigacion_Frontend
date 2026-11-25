import { Link } from 'react-router-dom';
import Icono from './Icono';

// Tarjeta de la página principal que lleva a la sección de un módulo. 'cifra' es el texto inferior
const TarjetaModulo = ({ modulo, cifra }) => {
    return (
        <Link
            to={`/#${modulo.ancla}`}
            className="group flex flex-col h-full bg-surface-container-lowest rounded-xl p-space-lg border border-surface-container-high shadow-sm hover:shadow-md hover:border-primary/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="h-14 flex items-center mb-space-md">
                {modulo.imagen ? (
                    <img src={modulo.imagen} alt="" className="h-14 w-auto object-contain" />
                ) : (
                    <span className="w-12 h-12 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                        <Icono nombre={modulo.icono} className="text-[28px]" />
                    </span>
                )}
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                {modulo.titulo}
            </h3>
            <p className="flex-1 font-body-md text-body-md text-secondary mt-space-xs">{modulo.descripcion}</p>
            <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between gap-space-sm">
                <span className="font-label-md text-label-md text-secondary">{cifra}</span>
                <Icono nombre="arrow_forward" className="text-primary text-[18px] group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
};

export default TarjetaModulo;
