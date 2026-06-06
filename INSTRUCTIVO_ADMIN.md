# Instructivo — Panel de Administración

> Acceso: `/admin-dash` · Requiere usuario con rol **admin**

---

## Navegación general

El panel tiene un **sidebar lateral** que se puede contraer o expandir con el botón de menú (☰). Cuando está contraído solo muestra iconos; al pasar el cursor sobre ellos aparece el nombre en un tooltip. El logo en la parte superior abre el sitio público en una pestaña nueva.

---

## 1. Sliders

**Ruta:** `/admin-dash/sliders`

Gestiona las imágenes del carrusel principal del inicio (hero). Cada slide tiene:

- **Imagen** — se sube directamente desde el panel. Formatos aceptados: JPG, PNG, WEBP.
- **Punto focal** — una vez subida la imagen, se puede arrastrar un punto amarillo sobre la preview para definir qué zona se prioriza en mobile.
- **Orden** — los slides se reordenan arrastrando con el ícono de grip (⠿) a la izquierda de cada fila. El nuevo orden se guarda automáticamente al soltar.
- **Eliminar** — ícono de papelera en la fila. Pide confirmación.
- **Editar** — ícono de lápiz; abre el formulario del slide seleccionado en el mismo panel.

**Tip:** Usá imágenes horizontales (relación 16:9 o mayor). El punto focal es especialmente importante si la imagen tiene el sujeto principal a un costado.

---

## 2. Obras

**Ruta:** `/admin-dash/servicios`

Administra los proyectos/obras que se muestran en el sitio. Tiene tres pestañas:

### Pestaña "Obras"
Lista de obras existentes con imagen en miniatura, título y descripción. Desde aquí podés:
- **Crear** una nueva obra con el botón "Crear obra".
- **Editar** — ícono de lápiz.
- **Eliminar** — ícono de papelera con confirmación.
- **Reordenar** — arrastrando con el grip; el orden se guarda automáticamente.

### Pestaña "Categorías"
Permite crear categorías y subcategorías para organizar las obras.
- **Nombre** — obligatorio.
- **Categoría Padre** — si se selecciona, la categoría se anida como subcategoría.
- **Descripción** — opcional.
- **Imagen** — opcional (JPG/PNG/WEBP, máx. 5 MB).
- Para **editar** una categoría existente hacé clic en "Editar Categoría" en su tarjeta.
- Para **eliminar** usá el botón rojo en la tarjeta.

### Formulario de obra (crear / editar)
Al crear o editar una obra se muestra un formulario con campos como título, descripción, categoría, e imágenes asociadas.

---

## 3. Certificados

**Ruta:** `/admin-dash/certificados`

Gestiona los certificados de calidad ISO que aparecen en la página Calidad. Incluye también la **Política de Gestión**.

### Política de Gestión (parte superior)
- Solo existe **un archivo a la vez** (PDF).
- Botón **"Subir PDF"** para cargar el documento descargable desde la página pública.
- Botón **"Reemplazar"** si ya hay uno cargado.
- Ícono X rojo para **eliminar** el archivo actual.

### Lista de certificados
- **Nuevo Certificado** — botón superior derecho. Lleva al formulario de creación.
- Cada fila muestra imagen en miniatura, título, descripción y si tiene PDF adjunto (badge verde "PDF/DOC").
- **Reordenar** — arrastrando el grip; el nuevo orden se guarda automáticamente.
- **Editar** — ícono de lápiz (aparece al pasar el cursor).
- **Eliminar** — ícono de papelera con confirmación.

### Formulario de certificado
Campos: título, descripción, imagen (imagen del certificado, se muestra en la grilla pública), y documento PDF descargable opcional.

---

## 4. Brochure

**Ruta:** `/admin-dash/brochure`

Sube el PDF institucional que los visitantes pueden descargar desde el sitio.

- **Nombre del brochure** — etiqueta visible (ej: "Brochure Institucional 2026"). Obligatorio.
- **Archivo PDF** — máx. 20 MB. Solo acepta PDF.
- Si ya hay un brochure cargado, el nuevo **reemplaza** al anterior automáticamente.
- Botón **"Eliminar"** en rojo para quitar el brochure actual.

---

## 5. Video Principal

**Ruta:** `/admin-dash/video-principal`

Configura el video de YouTube que se muestra en la página de inicio.

- Pegá la URL completa de YouTube (ej: `https://www.youtube.com/watch?v=XXXXXX`).
- El panel muestra una **vista previa** embebida del video en tiempo real antes de guardar.
- Solo acepta URLs de YouTube (`youtube.com` o `youtu.be`).
- Guardá con el botón "Guardar Configuración".

---

## 6. Maquinarias

**Ruta:** `/admin-dash/portafolio`

Gestiona el catálogo de maquinarias que se muestra en el sitio. Tiene tres pestañas:

### Pestaña "Maquinarias"
- Lista de maquinarias con imagen, título y descripción.
- **Agregar Nueva** — botón superior derecho, lleva al formulario.
- **Editar** — ícono de lápiz.
- **Eliminar** — ícono de papelera con confirmación.
- **Reordenar** — arrastrando el grip; el orden se guarda en tiempo real.

### Pestaña "Categorías"
Igual que en Obras: permite crear categorías y subcategorías para organizar las maquinarias, con nombre (obligatorio), categoría padre opcional, descripción e imagen.

### Pestaña "Carga Masiva"
Permite subir múltiples imágenes a la vez:
1. Arrastrá las imágenes al área punteada **o** hacé clic para seleccionarlas (múltiple selección).
2. Cada imagen muestra una preview y un campo de título (por defecto toma el nombre del archivo).
3. Editá los títulos si es necesario.
4. Hacé clic en **"Subir X imágenes"** para cargarlas todas. Cada una muestra su estado (subiendo / listo / error).
5. Las imágenes con error se pueden reintentar volviendo a subir.

---

## 7. Líderes

**Ruta:** `/admin-dash/lideres`

Gestiona el equipo directivo que aparece en la página "Quiénes Somos".

- **Nuevo Líder** — botón superior derecho, lleva al formulario.
- Cada fila muestra foto circular, nombre completo, posición y link de LinkedIn (si tiene).
- **Reordenar** — arrastrando el grip.
- **Editar / Eliminar** — íconos que aparecen al pasar el cursor sobre la fila.

### Formulario de líder
Campos: nombre, apellido, posición/cargo, descripción, foto (imagen circular), y URL de LinkedIn (opcional).

---

## 8. Leads Contacto

**Ruta:** `/admin-dash/leads-contacto`

Bandeja de consultas recibidas desde el formulario de contacto del sitio público.

- **Estadísticas** en la parte superior: total de leads, nuevos, respondidos, etc.
- **Búsqueda** — barra de texto (mínimo 3 caracteres para activarse).
- **Filtros** — por estado (nuevo, respondido, etc.) y por rango de fechas.
- **Ver detalle** — ícono de ojo, abre un modal con todos los datos del lead incluyendo el mensaje completo.
- **Copiar** — ícono de copiar para copiar email u otros datos al portapapeles.
- **Eliminar** — ícono de papelera con confirmación.
- **Exportar** — botón de descarga para exportar la lista actual a CSV.
- Paginación de 15 registros por página.

---

## 9. RRHH

**Ruta:** `/admin-dash/leads-rrhh`

Bandeja de postulaciones espontáneas recibidas desde la sección "Trabaja con Nosotros".

Funciona igual que Leads Contacto pero para candidatos:
- Búsqueda, filtros por estado y fechas, paginación.
- Ver detalle con datos del candidato y adjuntos (CV).
- Copiar email, eliminar, exportar.

> Este módulo solo lista candidatos que postularon sin especificar un puesto. Los que aplican a una posición específica aparecen en el panel RRHH (ver instructivo separado).

---

## 10. Usuarios

**Ruta:** `/admin-dash/usuarios`

Gestiona los usuarios con acceso al panel de administración.

- Lista de usuarios con nombre, email y rol.
- Permite **crear** nuevos usuarios con nombre, email, contraseña y rol.
- Permite **eliminar** usuarios existentes.
- **Importante:** no elimines tu propio usuario.

---

## 11. Recursos

**Ruta:** `/admin-dash/imagen-corporativa`

Gestiona las imágenes y videos que se muestran en distintas secciones del sitio. Está dividido en cuatro bloques:

### Imagen Corporativa
Slider de fotos en la sección "Quiénes Somos".
- Podés agregar **varias imágenes** (JPG/PNG/WEBP, máx. 4 MB cada una).
- Para agregar: clic en el área punteada o arrastrá la imagen.
- Para eliminar: pasá el cursor sobre la imagen y hacé clic en el ícono de papelera rojo.
- El orden del slider sigue el orden de subida.

### Imagen Calidad
Slider de fotos en la página "Calidad Certificada". Mismo funcionamiento que Imagen Corporativa.

### Video Quiénes Somos
URL de YouTube que se incrusta en la página "Quiénes Somos". Muestra preview en tiempo real. Guardá con el botón correspondiente.

### Imagen Compromiso
Slider de fotos en la página "Compromiso Ambiental". Mismo funcionamiento que los otros sliders.

---

## 12. Footer

**Ruta:** `/admin-dash/footer`

Personaliza el aspecto visual del pie de página del sitio.

### Fondo del Footer
- **Color Sólido** — elegí un color con el selector o ingresá el código hexadecimal.
- **Imagen de Fondo** — subí una imagen y ajustá el punto focal arrastrando el punto amarillo sobre la preview. Se muestra una preview de cómo quedaría en mobile. También podés activar **Escala de Grises** para un efecto B&N.

### Estilo de Texto
- **Color General de Texto** — afecta al texto del footer (los títulos siempre quedan en amarillo independientemente de este ajuste).

### Logos del Footer
- **Logo Principal del Footer** — logo de la empresa que aparece en el footer.
- **Logo Partner 1 y 2** — logos adicionales de organismos o socios (ej: certificadoras, cámaras).

Guardá todos los cambios con el botón **"Guardar Cambios"** en la parte superior.

---

## 13. Configuraciones

**Ruta:** `/admin-dash/configuraciones`

Ajustes generales del sistema. Tiene tres pestañas:

### Empresa
- **Nombre de la empresa** — aparece en el sitio y en el panel.
- **Logo** — imagen del logo (JPG/PNG/WEBP/SVG, máx. 2 MB). Se puede reemplazar o eliminar.

### SMTP
Configura el servidor de correo saliente para el envío de notificaciones (cuando alguien completa un formulario de contacto).
- Campos: host, puerto, usuario, contraseña, cifrado (TLS/SSL).
- Guardá y probá la conexión.

### Notificaciones / Integraciones
Configura integraciones con servicios externos (ej: webhooks, Analytics, etc.).

---

## Soporte Técnico

En la parte inferior del sidebar hay un enlace a **Soporte Técnico** que lleva al dashboard del proveedor de soporte en una pestaña nueva.

## Cerrar sesión

Botón rojo en la parte inferior del sidebar. Cierra la sesión y redirige al login.
