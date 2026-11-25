import { BANNERS } from '../utils/institucionUtils';

// Franja de logotipos oficiales. 'ubicacion' es "encabezado" o "pie"; las imágenes se cambian en BANNERS
const BannerInstitucional = ({ ubicacion, className = '' }) => {
    const banner = BANNERS[ubicacion];
    if (!banner) return null;

    return (
        <img
            src={banner.imagen}
            alt={banner.alt}
            className={`block w-auto max-w-full object-contain ${className}`}
        />
    );
};

export default BannerInstitucional;
