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
│   └── images/logo-itsl.png    Logo del sitio original
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
    │   └── proyectoService.js  obtenerTodos, obtenerPorId, crear, actualizar, eliminar
    ├── utils/
    │   └── proyectoUtils.js    Tipo por clave, participantes, búsqueda, límites de campos
    ├── Components/
    │   ├── MainLayout.jsx              Encabezado + contenido + pie de las páginas públicas
    │   ├── Header.jsx                  Logo, título y botón "Administrador"
    │   ├── Footer.jsx                  Enlaces institucionales
    │   ├── ProtectedRoute.jsx          Bloquea las rutas privadas si no hay sesión
    │   ├── ProyectoCard.jsx            Tarjeta de proyecto del catálogo
    │   ├── EtiquetaTipo.jsx            Insignia "Proyecto Interno" / "Proyecto Externo"
    │   ├── ModalProyecto.jsx           Formulario para crear y editar
    │   ├── ModalConfirmarEliminar.jsx  Confirmación antes de eliminar
    │   ├── Aviso.jsx                   Aviso de éxito o error
    │   └── Icono.jsx                   Icono de Material Symbols
    └── Pages/
        ├── Proyectos.jsx        Pantalla 1: catálogo con buscador y pestañas
        ├── DetalleProyecto.jsx  Pantalla 2: detalle de un proyecto
        ├── Login.jsx            Pantalla 3: inicio de sesión de administrador
        └── AdminProyectos.jsx   Pantalla 4: tabla CRUD de proyectos
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | `Proyectos` | Público |
| `/proyecto/:id` | `DetalleProyecto` | Público |
| `/login` | `Login` | Público |
| `/admin` | `AdminProyectos` | Solo administrador |

Cualquier otra dirección regresa a `/`.

## Convenciones

- Componentes como función flecha con `export default`, un componente por archivo.
- Servicios como objeto con métodos `async` que devuelven `respuesta.data`.
- El token se guarda en `localStorage` con la clave `token`; `axiosClient` lo envía en cada petición.
- Estilos solo con clases de Tailwind usando los tokens de `tailwind.config.js`
  (por ejemplo `bg-primary-container`, `text-headline-sm`, `p-space-md`).
