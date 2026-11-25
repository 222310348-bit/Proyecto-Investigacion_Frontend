# Arquitectura del frontend

Misma organización que `Educatio_Frontend_V1.0`: componentes en `Components`, pantallas en `Pages`,
llamadas a la API en `services`, sesión en `context` y rutas en `router`.

```
Proyecto-Investigacion_Frontend/
├── index.html                  Página base: fuentes (Raleway, Inter) e iconos (Material Symbols)
├── package.json
├── vite.config.js              Alias "src" y "@" hacia la carpeta src
├── tailwind.config.js          Tokens de DESIGN.md (colores, tipografía, espaciado, radios)
├── postcss.config.js           Necesario para que Vite procese Tailwind
├── eslint.config.js
├── .env.example                Dirección de la API
├── public/
│   └── images/                 Logos, banners oficiales y fotos (optimizadas desde el sitio original)
│       ├── logo-itsl.png, logo-itsl-escudo.png, logo-conacyt.png
│       ├── banner-institucional.png (encabezado), banner-sep.jpg (pie)
│       └── portada-itsl.jpg, banda-*.jpg  Fotos de la portada y de las franjas entre secciones
└── src/
    ├── main.jsx                Punto de entrada
    ├── App.jsx                 Envuelve la app con AuthProvider y AppRouter
    ├── index.css               Directivas de Tailwind y estilos base
    ├── config/
    │   └── axiosClient.js      Cliente axios: URL base y envío automático del token
    ├── context/
    │   ├── AuthContext.js      Contexto de sesión
    │   └── AuthProvider.jsx    Estado de sesión: auth, cargando, cerrarSesion
    ├── router/
    │   └── AppRouter.jsx       Rutas públicas y privadas
    ├── services/
    │   ├── authService.js      login y perfil
    │   ├── proyectoService.js  obtenerTodos, obtenerPorId, crear, actualizar, eliminar
    │   └── usuarioService.js   obtenerTodos, crear, cambiarPassword, eliminar
    ├── utils/
    │   ├── proyectoUtils.js    Tipo por clave, participantes, búsqueda, límites de campos
    │   ├── participantesUtils.js  Historial de participantes y detección de nombres escritos distinto
    │   ├── iconoUtils.js       Catálogo de iconos de proyecto e icono automático según el área de la clave
    │   ├── institucionUtils.js Sitio oficial, contacto, redes, banners y secciones del menú
    │   ├── modulosUtils.js     Servicios Especializados, Empresas Asociadas, Convocatorias y tarjetas de módulos
    │   └── usuarioUtils.js     Dominio del correo institucional y requisitos de la contraseña
    ├── Components/
    │   ├── MainLayout.jsx              Encabezado + contenido + pie de las páginas públicas
    │   ├── AdminLayout.jsx             Encabezado y pestañas del panel de administración
    │   ├── CampoParticipantes.jsx      Participantes de un proyecto con historial y avisos de homologación
    │   ├── Header.jsx                  Banner oficial, menú de secciones, enlace al sitio del ITSL y botón "Administrador"
    │   ├── MenuLateral.jsx             Menú de pantallas chicas (panel lateral)
    │   ├── Footer.jsx                  Contacto, secciones, redes, enlace al sitio del ITSL y banner de la SEP
    │   ├── BannerInstitucional.jsx     Franja de logotipos oficiales (imágenes definidas en institucionUtils)
    │   ├── PortadaInicio.jsx           Portada con la fachada del instituto y número de proyectos
    │   ├── EncabezadoSeccion.jsx       Título común de las secciones de la página principal
    │   ├── TarjetaModulo.jsx           Tarjeta de cada módulo en la página principal
    │   ├── SeccionServicios.jsx        Módulo Servicios Especializados
    │   ├── SeccionEmpresas.jsx         Módulo Empresas Asociadas (enlaza a sus proyectos)
    │   ├── SeccionConvocatorias.jsx    Módulo Convocatorias
    │   ├── ImagenParallax.jsx          Imagen de fondo que se desplaza más lento que la página
    │   ├── Aparecer.jsx                Desvanecido corto al entrar en pantalla
    │   ├── IconoProyecto.jsx           Icono de un proyecto (elegido por el administrador o el de su área)
    │   ├── SelectorIcono.jsx           Elección del icono en el formulario de proyecto
    │   ├── ProtectedRoute.jsx          Bloquea las rutas privadas si no hay sesión
    │   ├── ProyectoCard.jsx            Tarjeta de proyecto del catálogo
    │   ├── EtiquetaTipo.jsx            Insignia "Proyecto Interno" / "Proyecto Externo"
    │   ├── ModalProyecto.jsx           Formulario para crear y editar proyectos
    │   ├── ModalUsuario.jsx            Alta de administrador y cambio de contraseña
    │   ├── ModalConfirmarEliminar.jsx  Confirmación antes de eliminar
    │   ├── Aviso.jsx                   Aviso de éxito o error
    │   └── Icono.jsx                   Icono de Material Symbols
    └── Pages/
        ├── Proyectos.jsx        Pantalla 1: portada, módulos, catálogo con buscador y pestañas, servicios, empresas y convocatorias
        ├── DetalleProyecto.jsx  Pantalla 2: detalle de un proyecto
        ├── Login.jsx            Pantalla 3: inicio de sesión de administrador
        ├── AdminProyectos.jsx   Pantalla 4: tabla CRUD de proyectos
        └── AdminUsuarios.jsx    Gestión de administradores
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | `Proyectos` | Público. Secciones por ancla: `#inicio`, `#proyectos`, `#internos`, `#externos`, `#servicios`, `#empresas`, `#convocatorias` |
| `/proyecto/:id` | `DetalleProyecto` | Público |
| `/login` | `Login` | Público |
| `/admin` | `AdminProyectos` | Solo administrador |
| `/admin/usuarios` | `AdminUsuarios` | Solo administrador |

Cualquier otra dirección regresa a `/`.

## Convenciones

- Componentes como función flecha con `export default`, un componente por archivo.
- Servicios como objeto con métodos `async` que devuelven `respuesta.data`.
- El token se guarda en `localStorage` con la clave `token`; `axiosClient` lo envía en cada petición.
- Estilos solo con clases de Tailwind usando los tokens de `tailwind.config.js`
  (por ejemplo `bg-primary-container`, `text-headline-sm`, `p-space-md`).
- Colores institucionales: `primary` (#953133) es el rojo del escudo del ITSL y `accent` /
  `accent-container` son su dorado. `primary-deep` se usa en el pie y en el detalle.
- Los efectos al desplazarse (`ImagenParallax`, `Aparecer`) no usan librerías y se desactivan
  si el sistema tiene activada la opción "reducir movimiento".
