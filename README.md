# Proyecto-Investigacion_Frontend

Rediseño en React del portal "Investigación y Desarrollo Tecnológico" del ITS de Lerdo.
Muestra los proyectos de investigación y permite que un administrador los cree, edite
y elimine desde la página. Consume la API de `Proyecto-Investigacion_Backend`.

- **Tecnología:** React 19, Vite, React Router, axios y Tailwind CSS 3.
- **Diseño:** tokens y pantallas exportados de Stitch (`DESIGN.md`).
- **Estructura de carpetas:** ver `ARQUITECTURA.md`.

## Instalación

1. Tener el backend encendido (`npm run dev` en `Proyecto-Investigacion_Backend`).

2. Instalar dependencias:

   ```
   npm install
   ```

3. Copiar `.env.example` como `.env`. Solo hay que cambiarlo si la API no está en
   `http://localhost:3000/api`.

4. Iniciar el sitio:

   ```
   npm run dev
   ```

   Se abre en `http://localhost:5173`, que es la dirección que el backend tiene
   autorizada por defecto en su variable `CORS_ORIGIN`.

## Pantallas

| Dirección | Pantalla |
|---|---|
| `/` | Catálogo de proyectos con buscador y pestañas Todos / Internos / Externos |
| `/proyecto/:id` | Detalle de un proyecto: clave, título, objetivo y participantes |
| `/login` | Inicio de sesión de administrador |
| `/admin` | Tabla para crear, editar y eliminar proyectos (requiere sesión) |

## Notas sobre los datos

- Un proyecto es interno si su clave empieza con `ITSLerdo` y externo si empieza con
  `CONACYT`, igual que en el sitio original y en el backend.
- Los participantes se guardan en la base como un solo texto separado por `/`. El
  formulario los muestra como etiquetas y los vuelve a unir al guardar.

## Otros comandos

```
npm run build     Genera la versión de producción en dist/
npm run preview   Sirve la versión de producción para revisarla
npm run lint      Revisa el código con ESLint
```
