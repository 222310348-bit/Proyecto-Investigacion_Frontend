import { Link } from 'react-router-dom';
import Icono from './Icono';
import EtiquetaTipo from './EtiquetaTipo';
import { obtenerTipo, separarParticipantes } from '../utils/proyectoUtils';

// Tarjeta de un proyecto en el catálogo. Toda la tarjeta abre el detalle
const ProyectoCard = ({ proyecto }) => {
    const participantes = separarParticipantes(proyecto.participantes);

    return (
        <Link
            to={`/proyecto/${proyecto.id}`}
            className="group flex flex-col justify-between bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div>
                <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                    <span className="font-code-tech text-code-tech bg-surface-container text-on-surface px-2.5 py-1 rounded">
                        {proyecto.clave.trim()}
                    </span>
                    <EtiquetaTipo tipo={obtenerTipo(proyecto.clave)} />
                </div>

                <h2 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-3 mb-space-sm">
                    {proyecto.proyecto}
                </h2>

                {proyecto.objetivo && (
                    <p className="font-body-md text-body-md text-secondary line-clamp-3 mb-space-lg">
                        {proyecto.objetivo}
                    </p>
                )}
            </div>

            <div className="bg-surface-container-low/50 rounded-lg p-space-sm mt-space-sm flex items-center justify-between">
                <div className="flex items-center gap-space-xs min-w-0 pr-2">
                    <Icono nombre="group" className="text-secondary text-[18px] shrink-0" />
                    <span className="font-body-sm text-body-sm text-on-surface truncate">
                        {participantes.length > 0 ? participantes.join(', ') : 'Sin participantes registrados'}
                    </span>
                </div>
                <span className="font-label-md text-label-md text-primary shrink-0 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Detalles <Icono nombre="arrow_forward" className="text-[16px]" />
                </span>
            </div>
        </Link>
    );
};

export default ProyectoCard;
