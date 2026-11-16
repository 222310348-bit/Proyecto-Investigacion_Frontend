import Icono from './Icono';

// Enlaces institucionales tomados del sitio original
const ENLACES = [
    { texto: 'Sitio oficial', icono: 'public', url: 'http://www.itslerdo.edu.mx/' },
    { texto: 'Facebook', icono: 'thumb_up', url: 'https://www.facebook.com/Instituto-Tecnol%C3%B3gico-Superior-de-Lerdo-P%C3%A1gina-Oficial-285056498195463/' },
    { texto: 'Twitter', icono: 'tag', url: 'https://twitter.com/ITSLerdo' },
];

const Footer = () => {
    return (
        <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high py-space-lg">
            <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                    <img src="/images/logo-itsl.png" alt="Logo del ITS de Lerdo" className="h-8 w-auto object-contain" />
                    <p className="font-body-sm text-body-sm text-secondary">
                        © {new Date().getFullYear()} Instituto Tecnológico Superior de Lerdo
                    </p>
                </div>
                <div className="flex items-center gap-space-sm">
                    {ENLACES.map((enlace) => (
                        <a
                            key={enlace.texto}
                            href={enlace.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container hover:bg-primary hover:text-on-primary text-secondary font-label-md text-label-md transition-colors"
                        >
                            <Icono nombre={enlace.icono} className="text-[16px]" />
                            <span>{enlace.texto}</span>
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
