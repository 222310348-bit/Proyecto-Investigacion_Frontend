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
| `/` | Página principal: portada, módulos, catálogo con buscador y pestañas, Servicios Especializados, Empresas Asociadas y Convocatorias |
| `/proyecto/:id` | Detalle de un proyecto: icono, clave, título, objetivo y participantes |
| `/login` | Inicio de sesión de administrador |
| `/admin` | Tabla para crear, editar y eliminar proyectos (requiere sesión) |
| `/admin/usuarios` | Alta y gestión de administradores (requiere sesión) |

## Notas sobre los datos

- Un proyecto es interno si su clave empieza con `ITSLerdo` y externo si empieza con
  `CONACYT`, igual que en el sitio original y en el backend.
- Los participantes se guardan en la base como un solo texto separado por `/`. El
  formulario los muestra como etiquetas y los vuelve a unir al guardar.

## Módulos sin base de datos

Servicios Especializados, Empresas Asociadas y Convocatorias no dependen de la base de datos.
Su contenido se edita en `src/utils/modulosUtils.js`:

- **Servicios Especializados:** lista `SERVICIOS_ESPECIALIZADOS`.
- **Empresas Asociadas:** lista `EMPRESAS_ASOCIADAS`, tomada de los proyectos externos registrados.
  Cada empresa lleva las claves de sus proyectos; si el proyecto existe, la clave enlaza a su detalle.
- **Convocatorias:** lista `CONVOCATORIAS`. Mientras esté vacía se muestra el aviso de que no hay
  convocatorias vigentes con el enlace al sitio del ITSL.

Los datos de contacto, las redes, el sitio oficial y los banners están en `src/utils/institucionUtils.js`.
Para cambiar un banner basta con reemplazar la imagen en `public/images` o cambiar su ruta ahí.

## Icono de cada proyecto

Cada proyecto se muestra con un icono. Si el administrador no elige uno («Automático»), se usa el del
área de la clave (POSG, AMBI, SIST, ELEC, INDU) o el de vinculación con empresa en los externos.
El icono elegido se guarda en la columna `ICONO` de la tabla `proyecto` (archivo
`database/03_icono_proyecto.sql` del backend). La lista de iconos está en `src/utils/iconoUtils.js` y
debe coincidir con `src/utils/iconosProyecto.js` del backend.

## Homologación de participantes

Al crear o editar un proyecto, el campo de participantes muestra el historial de
personas ya registradas en los demás proyectos, con cuántos proyectos tiene cada una.
Escribir filtra el historial; un clic agrega el nombre tal como está registrado.

El formulario reconoce a la misma persona aunque esté escrita distinto (acentos,
mayúsculas, títulos como `M.C.`, prefijos como `ITSLerdo:`, punto final u orden de las
palabras) y avisa con un botón para usar el nombre registrado. También avisa cuando un
nombre se parece mucho a otro (le falta una palabra o difiere en una o dos letras).
Se guarda lo que el administrador decida; los avisos no bloquean el guardado.

## Administradores

- Se dan de alta con un correo institucional (`@itslerdo.edu.mx`), que será su usuario.
- La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un
  número y un símbolo. El formulario marca cada requisito conforme se cumple.
- Desde el panel se puede cambiar la contraseña de cualquier cuenta y eliminar
  cuentas, excepto la propia.
- Estas reglas también las valida el backend; el dominio y los requisitos del
  frontend están en `src/utils/usuarioUtils.js`.

## Otros comandos

```
npm run build     Genera la versión de producción en dist/
npm run preview   Sirve la versión de producción para revisarla
npm run lint      Revisa el código con ESLint
```
