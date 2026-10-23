# Plan: Módulo admin "Abastecimiento para obras" — Ankaloo

## Resumen ejecutivo

Hoy las plantas de abastecimiento (Hormigón y Asfalto) están **hardcodeadas** en `src/data/abastecimientoPlantas.json`, con las imágenes en `public/img/abastecimiento/`. Cualquier cambio requiere un deploy.

El objetivo es crear una sección **propia y separada** en el admin (`/admin-dash/abastecimiento`) desde la que se pueda crear, editar, ordenar, ocultar y eliminar cada servicio de abastecimiento, con su título, subtítulo, descripción, imagen de portada, imagen principal y galería. La web pública pasa a leer los datos desde la API.

Se reutiliza el patrón ya probado del módulo **Maquinarias** (`PortafolioController` + `portafolio_galeria`): conversión a WebP con `ImageHelper::saveWebp`, URLs absolutas devueltas por el backend y reordenamiento de la galería.

---

## Estado actual

| Área | Estado |
|---|---|
| `AbastecimientoParaObras.jsx` (listado público) | Lee el JSON local |
| `PlantaDetalle.jsx` (detalle `/servicios/abastecimiento-para-obras/:plantaId`) | Lee el JSON local, busca por `id` (slug) |
| `PlantaCard.jsx` | Usa `imagenCard` (o, si falta, `imagen`), `titulo` y `subtitulo` |
| `CategoriasServicios.jsx` | Mezcla las plantas del JSON con las categorías de servicios |
| Admin | **No existe** ninguna sección para esto |
| Backend | **No existe** ninguna tabla, modelo ni endpoint |

### Campos que usa hoy el front (se mantienen)

| JSON actual | Nuevo campo en BD | Uso |
|---|---|---|
| `id` (`planta-hormigon`) | `slug` | URL del detalle; se conserva para no romper links ni SEO |
| `titulo` | `titulo` | Card + detalle |
| `subtitulo` | `subtitulo` | Pie de la card (modelo de la planta) |
| `descripcion[]` | `descripcion` (JSON array) | Viñetas ❯ del detalle |
| `imagenCard` | `imagen_portada` | Fondo de la card |
| `imagen` | `imagen_principal` | Primera foto del slider del detalle (si falta, se usa la portada) |
| `galeria[]` | tabla `abastecimiento_galeria` | Resto de las fotos del slider |
| — | `activo` | Mostrar u ocultar en la web sin borrar |
| — | `position` | Orden en el listado |
| — | `seo_title`, `seo_description` | Opcionales; si faltan, se generan a partir del título y la descripción |

---

## BACKEND — Laravel (`c:\laragon\www\ankaloo`)

### Paso 1 — Migraciones

```php
// 2026_10_XX_000001_create_abastecimientos_table.php
Schema::create('abastecimientos', function (Blueprint $table) {
    $table->id();
    $table->string('slug')->unique();
    $table->string('titulo');
    $table->string('subtitulo')->nullable();
    $table->json('descripcion')->nullable();     // ["Capacidad: 70–80 m³/h", ...]
    $table->string('imagen_portada')->nullable();
    $table->string('imagen_principal')->nullable();
    $table->string('seo_title')->nullable();
    $table->string('seo_description', 300)->nullable();
    $table->boolean('activo')->default(true);
    $table->integer('position')->default(0);
    $table->timestamps();
});

// 2026_10_XX_000002_create_abastecimiento_galeria_table.php
Schema::create('abastecimiento_galeria', function (Blueprint $table) {
    $table->id();
    $table->foreignId('abastecimiento_id')->constrained('abastecimientos')->cascadeOnDelete();
    $table->string('imagen');
    $table->string('alt')->nullable();
    $table->integer('position')->default(0);
    $table->timestamps();
});
```

### Paso 2 — Modelos

- `App\Models\Abastecimiento`: `$fillable`, `$casts = ['descripcion' => 'array', 'activo' => 'boolean']`, `galeria()` es `hasMany` con `orderBy('position')` y `scopeActivos()`.
- `App\Models\AbastecimientoGaleria`: `$table = 'abastecimiento_galeria'` y `belongsTo` hacia `Abastecimiento`.

### Paso 3 — `AbastecimientoController`

Se copia la estructura de `PortafolioController`:

| Método | Descripción |
|---|---|
| `index` | Público. Solo los activos, ordenados por `position`, con la galería y las URLs absolutas |
| `show($slug)` | Público. Un servicio activo por slug; devuelve 404 si no existe o está inactivo |
| `adminIndex` | Admin. Todos los servicios, incluidos los inactivos |
| `adminShow($id)` | Admin. Para cargar el formulario de edición |
| `store` | Crea el servicio, genera el slug desde el título si viene vacío (`Str::slug` + sufijo si ya existe) y sube la portada, la principal y la galería |
| `update($id)` | Igual que `store`. Si se reemplaza una imagen, borra el archivo anterior. Acepta `remove_imagen_principal=1` |
| `destroy($id)` | Borra el servicio y todos sus archivos |
| `toggle($id)` | Invierte `activo` |
| `reorder` | Recibe `[{id, position}]` |
| `deleteGaleriaImage($id, $galeriaId)` | Borra una foto de la galería |
| `reorderGaleria($id)` | Reordena la galería |

**Validación:** `titulo` es obligatorio (máx. 255); `slug` debe ser `alpha_dash` y único (ignorando el propio registro); `descripcion` es un array de strings; las imágenes deben ser `jpg,jpeg,png,webp` de 5 MB como máximo; `galeria.*` sigue la misma regla.

**Imágenes:** `ImageHelper::saveWebp(..., 'storage/uploads/abastecimiento', ...)` y `.../abastecimiento/galeria`. Se agrega `appendPublicMediaUrls()` (como en Portafolio) para que el front reciba `imagen_portada_url`, `imagen_principal_url` y `galeria[].imagen_url` **absolutas**. Así el front no depende de la barra final de `VITE_API_URL`.

### Paso 4 — Rutas (`routes/api.php`)

```php
// Públicas
Route::get('/abastecimientos', [AbastecimientoController::class, 'index']);
Route::get('/abastecimientos/{slug}', [AbastecimientoController::class, 'show']);

// Dentro del grupo ['auth:sanctum', 'IsAdmin']
Route::get('/admin/abastecimientos', [AbastecimientoController::class, 'adminIndex']);
Route::get('/admin/abastecimientos/{id}', [AbastecimientoController::class, 'adminShow']);
Route::post('/admin/abastecimientos', [AbastecimientoController::class, 'store']);
Route::post('/admin/abastecimientos/reorder', [AbastecimientoController::class, 'reorder']);
Route::post('/admin/abastecimientos/{id}', [AbastecimientoController::class, 'update']);   // multipart
Route::patch('/admin/abastecimientos/{id}/toggle', [AbastecimientoController::class, 'toggle']);
Route::delete('/admin/abastecimientos/{id}', [AbastecimientoController::class, 'destroy']);
Route::delete('/admin/abastecimientos/{id}/galeria/{galeriaId}', [AbastecimientoController::class, 'deleteGaleriaImage']);
Route::post('/admin/abastecimientos/{id}/galeria/reorder', [AbastecimientoController::class, 'reorderGaleria']);
```

> La ruta `reorder` se declara antes de `{id}` para que no la capture el comodín, igual que en portafolios.

### Paso 5 — Seeder de migración de datos

`AbastecimientoSeeder` crea las 2 plantas actuales con los mismos slugs (`planta-hormigon` y `planta-asfalto`) y textos. Copia las imágenes de `staging/public/img/abastecimiento/**` a `public/storage/uploads/abastecimiento/` y las convierte a WebP. Así, al activar el módulo la web se ve igual que hoy.

---

## FRONTEND — Admin (`staging/src`)

### Paso 6 — Entrada propia en el sidebar

En `AdminSidebar.jsx` se agrega un ítem **"Abastecimiento"** con el ícono `Factory` de `lucide-react`, justo debajo de "Obras", con `path: "/admin-dash/abastecimiento"`. Queda como sección independiente y no mezclada con Obras ni con Maquinarias.

Rutas nuevas en `Router.jsx`, dentro de `/admin-dash`:

```
/admin-dash/abastecimiento          → AdminAbastecimientoList
/admin-dash/abastecimiento/nuevo    → AdminAbastecimientoForm
/admin-dash/abastecimiento/:id      → AdminAbastecimientoForm
```

### Paso 7 — Listado: `views/AdminAbastecimientoList.jsx`

Pensado para que se entienda de un vistazo:

- **Encabezado:** título "Abastecimiento para obras", una línea de ayuda ("Estos servicios se muestran en /servicios/abastecimiento-para-obras") y el botón amarillo **"+ Nuevo servicio"**.
- **Grilla de tarjetas** (no una tabla). Cada tarjeta muestra la miniatura de la portada, el título, el subtítulo, la cantidad de fotos de la galería y un badge **Visible / Oculto**.
- Acciones en cada tarjeta: **Editar**, **Ver en la web** (abre el detalle en una pestaña nueva), un **switch de visibilidad** (toggle inmediato) y **Eliminar** (con modal de confirmación que muestra el nombre).
- **Arrastrar para ordenar** con `@dnd-kit` (ya instalado); se guarda automáticamente y aparece el aviso "Orden guardado".
- **Estado vacío** con ilustración y el botón "Crear el primer servicio".

### Paso 8 — Formulario: `views/AdminAbastecimientoForm.jsx`

El mismo formulario sirve para crear y editar. Tiene dos columnas en desktop y una sola en mobile.

**Columna izquierda — bloques numerados con título y ayuda:**

1. **Información básica**
   - Título (obligatorio), por ejemplo "Planta de Hormigón".
   - Subtítulo o modelo (opcional), por ejemplo "Betonmac Neo Móvil 70/80".
   - URL: se autogenera desde el título y se puede editar. Muestra la vista previa `ankaloo.com/servicios/abastecimiento-para-obras/planta-hormigon`.
2. **Características** (las viñetas ❯)
   - Lista editable: input con el botón **"+ Agregar característica"**; cada ítem tiene un ícono para arrastrar y otro para borrar.
3. **Imagen de portada** (la de la card del listado)
   - Zona drag & drop con la vista previa en la **misma proporción que la card**. Botones "Cambiar" y "Quitar".
   - Ayuda: "Recomendado: vertical, mínimo 800×1100 px. JPG, PNG o WebP de hasta 5 MB."
4. **Imagen principal del detalle** (opcional)
   - Si no se carga, se usa la portada (y se indica en la ayuda).
5. **Galería**
   - Drop zone que acepta **varias fotos a la vez**.
   - Grilla de miniaturas reordenables con dnd-kit; cada una tiene un botón de borrar y la primera lleva la etiqueta "1ª".
   - Las fotos nuevas aparecen con el badge "Sin guardar" hasta que se envía el formulario.
6. **SEO (avanzado, plegado por defecto)**
   - Título y descripción para Google, con contador de caracteres. Si se dejan vacíos, se generan automáticamente.
7. **Visibilidad**: switch "Mostrar en la web".

**Columna derecha — vista previa en vivo (sticky):**
- Se renderiza el **`PlantaCard` real** con los datos del formulario y las imágenes locales (`URL.createObjectURL`), para que el admin vea cómo quedará la card antes de guardar.

**Comportamiento:**
- Barra inferior fija con **"Cancelar"** y **"Guardar cambios"**; el botón muestra un spinner y queda deshabilitado mientras se guarda.
- Validación en el cliente: título obligatorio; tamaño y tipo de cada imagen al soltarla, con un mensaje claro por archivo.
- Aviso de **cambios sin guardar** al salir de la página (`beforeunload` y bloqueo de navegación).
- Envío en `FormData` a `POST /api/admin/abastecimientos[/:id]`. Las fotos de la galería que se eliminan o reordenan sobre registros existentes se aplican con sus endpoints propios.
- Al guardar: toast de éxito y regreso al listado.

### Paso 9 — Hook compartido

`src/hooks/useAbastecimientos.js`, con SWR y `clienteAxios` (ya en uso):
- `useAbastecimientos()` para el listado público.
- `useAbastecimiento(slug)` para el detalle público.
- `useAdminAbastecimientos()` para el listado admin, con `mutate` para refrescar después de toggle, reorden o borrado.

---

## FRONTEND — Web pública

### Paso 10 — Pasar del JSON a la API

| Archivo | Cambio |
|---|---|
| `AbastecimientoParaObras.jsx` | `useAbastecimientos()` en lugar del JSON. Skeleton de 2 cards mientras carga |
| `PlantaDetalle.jsx` | `useAbastecimiento(plantaId)`. Galería = `[imagen_principal_url ?? imagen_portada_url, ...galeria]`. SEO desde `seo_title` y `seo_description`, o generado |
| `PlantaCard.jsx` | Lee `imagen_portada_url`, `titulo`, `subtitulo` y `slug` (adaptador mínimo) |
| `CategoriasServicios.jsx` | Usa el mismo hook para las tarjetas `hc-*` |
| `src/data/abastecimientoPlantas.json` | Se elimina una vez que el seeder esté corrido en producción |

Las URLs públicas **no cambian** porque el slug conserva el `id` actual.

---

## Fases de implementación

| Fase | Contenido | Estimación |
|---|---|---|
| 1. Backend | Migraciones, modelos, controller, rutas, seeder | ~1 día |
| 2. Admin | Sidebar, listado con reorden y toggle, formulario con vista previa | ~1,5–2 días |
| 3. Web pública | Hook y migración de los 4 componentes | ~0,5 día |
| 4. QA | Probar contra el backend local (`https://ankaloo.test/`), mobile, imágenes grandes, borrado en cascada | ~0,5 día |

## Checklist de pruebas

- [ ] Crear un servicio solo con título: aparece en la web con el placeholder "Imagen próximamente".
- [ ] Cargar la portada y 5 fotos de galería, reordenarlas, guardar y comprobar el orden en el detalle.
- [ ] Reemplazar la portada: el archivo viejo se borra del servidor.
- [ ] Ocultar un servicio: desaparece del listado público y su URL devuelve "No encontramos esta planta".
- [ ] Cambiar el orden de las cards desde el admin: el cambio se refleja en la web.
- [ ] Usar un slug repetido: aparece un error claro.
- [ ] Subir una imagen de más de 5 MB o un PDF: se rechaza con un mensaje.
- [ ] Eliminar un servicio: se borran sus registros y sus archivos.
- [ ] Un usuario no admin recibe 401/403 en todas las rutas `/api/admin/abastecimientos*`.

## Decisiones tomadas (23/10/2026)

1. **Imagen principal:** se mantiene, separada de la portada y opcional.
2. **Editor:** **CKEditor 5** en lugar de Tiptap. `descripcion` pasa a guardarse como **HTML** (`longText`), no como array JSON. En la web se muestra con `DOMPurify` y CSS propio que reproduce las viñetas ❯ amarillas. El backend también limpia el HTML con una lista de etiquetas permitidas. La license key va en `VITE_CKEDITOR_LICENSE_KEY`; si está vacía, se usa `"GPL"`.
3. **Título de la sección editable:** se agregan las columnas `abastecimiento_titulo`, `abastecimiento_titulo_destacado` (la parte en amarillo) y `abastecimiento_seo_description` a `settings`. Se editan arriba del listado del admin (`PUT /api/admin/abastecimientos-seccion`) y `GET /api/abastecimientos` las devuelve en `seccion`.
4. **Header y estilos:** no cambian. El front queda igual que en staging; solo cambia de dónde salen los textos y las imágenes.

## Cambios de implementación respecto al borrador

- **Guardado en un solo paso:** el formulario manda `galeria_orden` (`["id:12","new:0",...]`) con el orden final de la galería. El backend crea las fotos nuevas, reordena las existentes y borra las que no aparecen, así que no hacen falta endpoints separados para borrar o reordenar fotos.
- **URLs de imágenes:** los modelos agregan `imagen_portada_url`, `imagen_principal_url` y `galeria[].imagen_url` como URLs absolutas.
- **Adaptador en el front:** `src/hooks/useAbastecimientos.js` (`toPlanta`) convierte la respuesta a la forma del JSON viejo, así `PlantaCard` no se modifica.
- **Seeder:** las imágenes originales se copiaron a `database/seeders/assets/abastecimiento/` en el backend, para que el seeder funcione también en producción.
