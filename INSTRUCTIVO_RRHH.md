# Instructivo — Panel de Recursos Humanos (RRHH)

> Acceso: `/rrhh-dash` · Requiere usuario con rol **RRHH**

---

## Navegación general

El panel RRHH tiene su propio sidebar lateral independiente del panel de administración. Se puede contraer o expandir con el botón de menú (☰). Cuando está contraído muestra solo iconos con tooltips al pasar el cursor.

El panel tiene **tres secciones**: Postulaciones, Posiciones Abiertas y Configuración.

---

## 1. Postulaciones

**Ruta:** `/rrhh-dash/postulaciones`

Bandeja de candidatos que se postularon a través de la sección "Trabaja con Nosotros" del sitio público.

### Estadísticas
En la parte superior se muestran contadores con el total de postulaciones recibidas, nuevas sin revisar, respondidas, etc.

### Buscar y filtrar
- **Búsqueda por texto** — barra con ícono de lupa. Escribe el nombre, email o algún dato del candidato (mínimo 3 caracteres para activarse).
- **Filtro por estado** — filtra por: nuevo, revisado, respondido, u otros estados disponibles.
- **Filtro por fechas** — podés establecer un rango de fecha inicio y fecha fin para acotar los resultados.

### Lista de postulaciones
Muestra 15 registros por página. Cada fila tiene:
- **Nombre y email** del candidato.
- **Fecha** de recepción.
- **Estado** actual.
- Íconos de acción:
  - **Ver detalle** (ojo) — abre un modal con todos los datos del candidato, el mensaje enviado y los archivos adjuntos como CV.
  - **Copiar** — copia el email u otros datos al portapapeles.
  - **Eliminar** (papelera) — elimina el registro con confirmación.

### Exportar
Botón de descarga para exportar la lista filtrada actual a formato CSV. Útil para procesar fuera del sistema.

### Paginación
Navegá entre páginas con los controles en la parte inferior de la lista.

---

## 2. Posiciones Abiertas

**Ruta:** `/rrhh-dash/vacantes`

Gestiona los puestos de trabajo publicados en la página "Trabaja con Nosotros" del sitio.

### Encabezado
Muestra un contador de posiciones activas e inactivas.

### Crear una nueva posición
Hacé clic en el botón **"Nueva posición"** (amarillo, parte superior derecha). Se abre un modal con los siguientes campos:

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| **Título del puesto** | Nombre del rol (ej: "Jefe de Obra") | Sí |
| **Área** | Departamento o sector (ej: "Obra civil") | Sí |
| **Ubicación** | Ciudad o modalidad (ej: "Córdoba", "Remoto") | Sí |
| **Descripción** | Detalle de responsabilidades y requisitos | No |
| **Posición activa** | Checkbox — si está activado, la posición se muestra en el sitio público | — |

Guardá con **"Crear posición"**.

### Lista de posiciones
Cada fila muestra:
- **Título**, **área** y **ubicación**.
- Badge **"inactiva"** si la posición no está publicada.
- **Descripción** (primera línea, si existe).

#### Acciones por posición:
- **Toggle activo/inactivo** — ícono verde/gris a la derecha. Cambia la visibilidad en el sitio sin eliminar la posición. Útil para pausar una búsqueda temporalmente.
- **Editar** (lápiz) — abre el mismo modal con los datos precargados para modificar.
- **Eliminar** (papelera) — elimina la posición con confirmación. Esta acción es irreversible.

### Buenas prácticas
- Desactivá una posición cuando se cubrió el puesto en lugar de eliminarla; así mantenés el historial.
- Revisá periódicamente las posiciones activas para que el sitio refleje búsquedas reales.

---

## 3. Configuración

**Ruta:** `/rrhh-dash/configuracion`

Personaliza el contenido visual de la página pública "Trabaja con Nosotros".

### Video de YouTube
Muestra un video embebido debajo del hero de la página de empleos.

1. Pegá la URL completa del video de YouTube (ej: `https://www.youtube.com/watch?v=XXXXXX`).
2. El panel muestra una **vista previa** del video en tiempo real.
3. También podés hacer clic en el ícono de enlace externo para abrir el video en YouTube y verificar que es el correcto.
4. Guardá con el botón **"Guardar video"**.

> Si dejás el campo vacío y guardás, el video deja de mostrarse en la página pública.

### Imagen Banner
Imagen destacada que aparece como encabezado visual en la sección de empleos.

1. Hacé clic en **"Seleccionar imagen"** para elegir un archivo desde tu computadora.
   - Formatos aceptados: JPG, PNG, WebP.
   - Tamaño máximo: 4 MB.
2. Se muestra una **preview** de la imagen seleccionada.
3. Hacé clic en **"Guardar imagen"** para subir y aplicar.
4. Para eliminar la imagen actual, hacé clic en el ícono de papelera (rojo) en la esquina de la preview.

> Si no hay imagen cargada, la sección muestra un placeholder con borde punteado.

---

## Accesos adicionales

En la parte inferior del sidebar hay dos acciones siempre disponibles:

- **Ver sitio** (ícono de casa) — abre el sitio público en una pestaña nueva para verificar los cambios aplicados.
- **Soporte Técnico** (ícono de salvavidas) — acceso al dashboard del proveedor de soporte.
- **Cerrar sesión** (botón rojo) — cierra la sesión y redirige al login.
