import { Link } from 'react-router-dom';
import Icono from './Icono';
import EtiquetaTipo from './EtiquetaTipo';
import IconoProyecto from './IconoProyecto';
import { obtenerTipo, separarParticipantes } from '../utils/proyectoUtils';

// Tarjeta de un proyecto en el catálogo. Toda la tarjeta abre el detalle
const ProyectoCard = ({ proyecto }) => {
    const tipo = obtenerTipo(proyecto.clave);
    const participantes = separarParticipantes(proyecto.participantes);

    return (
        <Link
            to={`/proyecto/${proyecto.id}`}
            className={`group flex flex-col h-full bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md border-t-[3px] ${tipo === 'externo' ? 'border-accent' : 'border-primary'} transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
        >
            <div className="flex-1 p-space-lg">
                <div className="flex items-start gap-space-md mb-space-md">
                    <IconoProyecto proyecto={proyecto} />
                    <div className="flex flex-col gap-space-xs min-w-0 flex-1">
                        <span className="font-code-tech text-code-tech text-secondary truncate">{proyecto.clave.trim()}</span>
                        <EtiquetaTipo tipo={tipo} />
                    </div>
                    {tipo === 'externo' && (
                        <img src="/images/logo-conacyt.png" alt="CONACYT" className="h-9 w-auto object-contain shrink-0" />
                    )}
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-3 mb-space-sm">
                    {proyecto.proyecto}
                </h3>

                {proyecto.objetivo && (
                    <p className="font-body-md text-body-md text-secondary line-clamp-3">
                        {proyecto.objetivo}
                    </p>
                )}
            </div>

            <div className="mx-space-lg mb-space-lg bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
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
