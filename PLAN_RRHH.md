# Plan: Panel de Gestión RRHH — Ankaloo

## Resumen ejecutivo

Crear un rol de usuario `RRHH` con su propio panel de administración (`/rrhh-dash`) dedicado exclusivamente a la gestión de recursos humanos. El panel incluye: gestión de posiciones abiertas (vacantes), configuración del contenido de la página "Trabaja con Nosotros" (imagen + video), y visualización de postulaciones. La página pública pasará a mostrar vacantes dinámicas cargadas desde la base de datos.

---

## Estado actual del proyecto

### Lo que ya existe

| Área | Estado |
|---|---|
| Tabla `leads_rrhh` | ✅ Ya creada |
| `LeadRRHHController` | ✅ CRUD completo implementado |
| `LeadsRRHH.jsx` (vista admin) | ✅ Funcional, solo accesible por admin |
| `TrabajaConNosotros.jsx` | ✅ Existe pero con vacantes **hardcodeadas** |
| Campo `rol` en modelo `User` | ✅ En `$fillable` pero sin uso activo |
| Campo `admin` en modelo `User` | ✅ Boolean, controla acceso total al admin |
| Middleware `IsAdmin` | ✅ Verifica `user->admin === 1` |
| Rutas leads-rrhh protegidas por `IsAdmin` | ✅ Funcionan |

### Lo que falta

- Rol `rrhh` funcional con acceso restringido
- Tabla de vacantes (posiciones abiertas dinámicas)
- Settings de RRHH (video propio + imagen banner para la página pública)
- Panel RRHH dedicado con su propio layout y sidebar
- Formulario de asignación de rol RRHH desde el admin de usuarios

---

## BACKEND — Laravel (`c:\laragon\www\ankaloo-nuevo`)

### Paso 1 — Migración: tabla `vacantes`

```php
// database/migrations/2026_XX_XX_create_vacantes_table.php
Schema::create('vacantes', function (Blueprint $table) {
    $table->id();
    $table->string('titulo');          // "Jefe de Obra"
    $table->string('area');            // "Obra civil"
    $table->string('ubicacion');       // "Córdoba", "Remoto"
    $table->text('descripcion')->nullable(); // detalle opcional de la búsqueda
    $table->boolean('activo')->default(true);
    $table->integer('orden')->default(0);
    $table->timestamps();
});
```

### Paso 2 — Migración: settings RRHH

Agregar columnas a la tabla `settings` existente para evitar crear tabla nueva:

```php
// database/migrations/2026_XX_XX_add_rrhh_settings.php
Schema::table('settings', function (Blueprint $table) {
    $table->string('rrhh_video')->nullable();    // URL de YouTube
    $table->string('rrhh_imagen')->nullable();   // URL imagen banner
});
```

### Paso 3 — Modelo `Vacante`

**Archivo:** `app/Models/Vacante.php`

```php
class Vacante extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo', 'area', 'ubicacion', 'descripcion', 'activo', 'orden'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function scopeActivas($query) {
        return $query->where('activo', true)->orderBy('orden');
    }
}
```

### Paso 4 — Middleware `IsRRHH`

**Archivo:** `app/Http/Middleware/IsRRHH.php`

Permite acceso si el usuario es admin completo (`admin = 1`) **O** si tiene el rol RRHH (`rol = 'rrhh'`). Esto asegura que el admin siempre puede acceder a todo.

```php
class IsRRHH
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ($user->admin || $user->rol === 'rrhh')) {
            return $next($request);
        }

        return response()->json(['message' => 'Acceso no autorizado'], 403);
    }
}
```

Registrar en `app/Http/Kernel.php` bajo `$routeMiddleware`:
```php
'IsRRHH' => \App\Http\Middleware\IsRRHH::class,
```

### Paso 5 — `VacanteController`

**Archivo:** `app/Http/Controllers/VacanteController.php`

Métodos:
- `index()` — GET público, devuelve solo las activas ordenadas
- `indexAdmin()` — GET protegido, devuelve todas (activas + inactivas)
- `store()` — POST protegido (solo RRHH/admin)
- `update($id)` — PUT protegido
- `destroy($id)` — DELETE protegido
- `reorder()` — POST protegido, recibe array `[{id, orden}]`

### Paso 6 — `RRHHConfigController`

**Archivo:** `app/Http/Controllers/RRHHConfigController.php`

Métodos:
- `show()` — GET protegido, devuelve `rrhh_video` y `rrhh_imagen` de settings
- `update()` — POST protegido, recibe `video` (string URL) y/o `imagen` (file upload)
  - Imagen: guardar en `storage/app/public/rrhh/`, retornar URL pública
  - Video: validar que sea URL de YouTube válida

### Paso 7 — Actualizar `api.php`

```php
// Rutas PÚBLICAS (para la página Trabaja con Nosotros)
Route::get('/vacantes', [VacanteController::class, 'index']);

// Rutas PROTEGIDAS con IsRRHH (admin completo + rol rrhh)
Route::middleware(['auth:sanctum', 'IsRRHH'])->group(function () {
    
    // Vacantes (CRUD)
    Route::get('/admin/vacantes', [VacanteController::class, 'indexAdmin']);
    Route::post('/vacantes', [VacanteController::class, 'store']);
    Route::put('/vacantes/{id}', [VacanteController::class, 'update']);
    Route::delete('/vacantes/{id}', [VacanteController::class, 'destroy']);
    Route::post('/vacantes/reorder', [VacanteController::class, 'reorder']);

    // Configuración RRHH (video + imagen)
    Route::get('/rrhh-config', [RRHHConfigController::class, 'show']);
    Route::post('/rrhh-config', [RRHHConfigController::class, 'update']);

    // Leads RRHH (mover del grupo IsAdmin a IsRRHH)
    Route::get('/leads-rrhh', [LeadRRHHController::class, 'index']);
    Route::get('/leads-rrhh/stats', [LeadRRHHController::class, 'stats']);
    Route::get('/leads-rrhh/{id}', [LeadRRHHController::class, 'show']);
    Route::put('/leads-rrhh/{id}', [LeadRRHHController::class, 'update']);
    Route::delete('/leads-rrhh/{id}', [LeadRRHHController::class, 'destroy']);
    Route::get('/leads-rrhh/{id}/descargar-cv', [LeadRRHHController::class, 'descargarCV']);
});
```

> **Nota:** Las rutas de leads-rrhh actualmente están en el grupo `IsAdmin`. Duplicarlas (o moverlas) al grupo `IsRRHH` para que el usuario RRHH pueda acceder.

### Paso 8 — Actualizar `SettingController`

En el método `index()` (que ya devuelve todas las settings), agregar `rrhh_video` y `rrhh_imagen` al array de respuesta para que el frontend los consuma via `useCont()`.

### Paso 9 — Actualizar `UserController`

En el método `update($id)`, asegurarse de que el campo `rol` sea actualizable. Validar que `rol` sea `null`, `''`, o `'rrhh'` solamente.

---

## FRONTEND — React (`c:\Users\Franco\Desktop\PROYECTOS PERSONALES\react\Ankaloo`)

### Paso 10 — `RRHHSidebar.jsx`

**Archivo:** `src/components/RRHHSidebar.jsx`

Copia estructural de `AdminSidebar.jsx` con las siguientes diferencias:

- **Header:** En lugar del logo, mostrar "Gestión de RRHH" con ícono `Briefcase`
- **Menú items (solo estos 3):**
  ```js
  const menuItems = [
    { text: "Postulaciones", icon: <Users size={20} />, path: "/rrhh-dash/postulaciones" },
    { text: "Posiciones Abiertas", icon: <ListChecks size={20} />, path: "/rrhh-dash/vacantes" },
    { text: "Configuración", icon: <Settings size={20} />, path: "/rrhh-dash/configuracion" },
  ];
  ```
- Mismo estilo visual (colores `#fdce27`, sidebar colapsable, logout button)
- El `<Outlet />` va dentro del mismo componente como en `AdminSidebar`

### Paso 11 — `RRHHLayout.jsx`

**Archivo:** `src/layout/RRHHLayout.jsx`

```jsx
const RRHHLayout = () => {
    const { user, error } = UseAuth({ middleware: 'auth' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.admin !== 1 && user.rol !== 'rrhh') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user && !error) return <p>Cargando...</p>;
    if (!user || (user.admin !== 1 && user.rol !== 'rrhh')) return null;

    return (
        <div className="admin-layout">
            <RRHHSidebar />
        </div>
    );
};
```

### Paso 12 — `VacantesAdmin.jsx`

**Archivo:** `src/views/VacantesAdmin.jsx`

**UI:**
- Header: "Posiciones Abiertas" con botón "Nueva posición +"
- Lista de vacantes en cards (o tabla) con:
  - Toggle activo/inactivo
  - Nombre del puesto, área, ubicación
  - Botones: editar (lápiz), eliminar (trash)
  - Indicador de orden (drag handle o flechas ↑↓)
- Modal/drawer para crear y editar:
  - Input: Título del puesto (requerido)
  - Input: Área (ej: "Obra civil", "Corporativo")
  - Input: Ubicación (ej: "Córdoba", "Remoto")
  - Textarea: Descripción (opcional)
  - Toggle: Activo

**API calls:**
- `GET /api/admin/vacantes` — listar todas
- `POST /api/vacantes` — crear
- `PUT /api/vacantes/:id` — editar
- `DELETE /api/vacantes/:id` — eliminar
- `POST /api/vacantes/reorder` — reordenar

### Paso 13 — `RRHHConfig.jsx`

**Archivo:** `src/views/RRHHConfig.jsx`

**UI — Dos secciones separadas:**

**Sección 1: Video de YouTube**
- Input URL de YouTube
- Preview en vivo del video embebido (debajo del input)
- Botón "Guardar video"
- Texto explicativo: "Este video se mostrará en la página Trabaja con Nosotros"

**Sección 2: Imagen Banner**
- Componente de upload de imagen (igual al patrón usado en `ImagenCorporativaAdmin`)
- Preview de la imagen actual
- Botón "Subir imagen" + botón "Eliminar imagen"
- Texto explicativo: "Esta imagen se mostrará como banner en la página Trabaja con Nosotros"

**API calls:**
- `GET /api/rrhh-config` — obtener configuración actual
- `POST /api/rrhh-config` — guardar (video o imagen)

### Paso 14 — Actualizar `Router.jsx`

```jsx
// Imports nuevos
const RRHHLayout = lazy(() => import("./layout/RRHHLayout"));
const VacantesAdmin = lazy(() => import("./views/VacantesAdmin"));
const RRHHConfig = lazy(() => import("./views/RRHHConfig"));

// Nueva sección en el router (junto a /admin-dash)
{
    path: "/rrhh-dash",
    element: <RRHHLayout />,
    children: [
        { index: true, element: suspense(<LeadsRRHH />) },  // pantalla de inicio = postulaciones
        { path: "/rrhh-dash/postulaciones", element: suspense(<LeadsRRHH />) },
        { path: "/rrhh-dash/vacantes", element: suspense(<VacantesAdmin />) },
        { path: "/rrhh-dash/configuracion", element: suspense(<RRHHConfig />) },
    ],
},
```

### Paso 15 — Actualizar `useAuth.js`

En el `useEffect` de redirección post-login, agregar condición para rol RRHH:

```js
// Admins al dashboard
if (middleware === 'guest' && user?.admin && location.pathname === '/auth/login') {
    hasRedirectedRef.current = true;
    navigate('/admin-dash');
    return;
}

// Usuarios RRHH (NO admin completo) al panel RRHH
if (middleware === 'guest' && user?.rol === 'rrhh' && !user?.admin && location.pathname === '/auth/login') {
    hasRedirectedRef.current = true;
    navigate('/rrhh-dash');
    return;
}
```

También actualizar `AdminLayout.jsx` para que no bloquee al usuario RRHH si accidentalmente entra a `/admin-dash`:
> No es necesario darle acceso al admin completo. El RRHHLayout ya tiene su propia protección.

### Paso 16 — Actualizar `TrabajaConNosotros.jsx`

Reemplazar el array hardcodeado `VACANTES` por un fetch dinámico:

```jsx
// Reemplazar esto:
const VACANTES = [
  { area: "Obra civil", rol: "Jefe de Obra", ubicacion: "Córdoba" },
  // ...
];

// Por esto:
const { data: vacantesData } = useSWR('/api/vacantes', () =>
    clienteAxios('/api/vacantes').then(res => res.data)
);
const VACANTES = vacantesData ?? [];
```

Agregar soporte para imagen banner RRHH (si está configurada):

```jsx
const { company } = useCont();
// company.rrhh_imagen ya vendrá desde el Provider si se agrega al SettingController
// company.rrhh_video tiene prioridad sobre company.video_quienes_somos para esta página
const videoEmbedUrl = getYouTubeEmbedUrl(company?.rrhh_video || company?.video_quienes_somos);
```

### Paso 17 — Actualizar `Provider.jsx` (context)

En el objeto `company` dentro del contexto global, agregar los nuevos campos RRHH:

```js
company: {
    // ... campos existentes ...
    rrhh_video: settings?.rrhh_video ?? null,
    rrhh_imagen: settings?.rrhh_imagen ? `${API_URL}storage/${settings.rrhh_imagen}` : null,
},
```

### Paso 18 — Actualizar vista de Usuarios en Admin

En la vista/formulario de crear/editar usuario (`src/views/Usuarios/Pacientes/Paciente.jsx` o similar), agregar campo de rol:

```jsx
<select name="rol" value={form.rol || ''} onChange={handleChange}>
    <option value="">Usuario normal</option>
    <option value="rrhh">RRHH</option>
</select>
```

Al crear un usuario con `rol = 'rrhh'`, el campo `admin` debe quedar en `0`.

---

## Flujo completo de experiencia de usuario

### Admin crea usuario RRHH:
1. Admin va a `/admin-dash/usuarios/nuevo`
2. Completa nombre, email, contraseña
3. Selecciona rol: **RRHH**
4. Guarda → el usuario se crea con `admin=0`, `rol='rrhh'`

### Usuario RRHH hace login:
1. Va a `/auth/login`, ingresa credenciales
2. `useAuth.js` detecta `user.rol === 'rrhh'` y redirige a `/rrhh-dash`
3. Ve el panel "Gestión de RRHH" con 3 secciones

### Usuario RRHH gestiona posiciones abiertas:
1. Va a "Posiciones Abiertas" en el sidebar
2. Ve todas las vacantes existentes
3. Puede crear nuevas, editar, activar/desactivar, eliminar
4. Los cambios se reflejan **en tiempo real** en la página pública `/trabaja-con-nosotros`

### Usuario RRHH configura la página pública:
1. Va a "Configuración" en el sidebar
2. Puede cambiar el video de YouTube que se muestra en la página
3. Puede subir/cambiar la imagen banner
4. Los cambios se reflejan en la página pública de inmediato

### Usuario RRHH revisa postulaciones:
1. Va a "Postulaciones" en el sidebar
2. Ve la misma vista `LeadsRRHH` que el admin completo
3. Puede cambiar estados, descargar CVs, tomar notas, eliminar candidatos

---

## Archivos a crear

### Backend
| Archivo | Descripción |
|---|---|
| `database/migrations/XXXX_create_vacantes_table.php` | Tabla de vacantes |
| `database/migrations/XXXX_add_rrhh_settings.php` | Columnas rrhh en settings |
| `app/Models/Vacante.php` | Modelo de vacante |
| `app/Http/Controllers/VacanteController.php` | CRUD vacantes |
| `app/Http/Controllers/RRHHConfigController.php` | Config video + imagen RRHH |
| `app/Http/Middleware/IsRRHH.php` | Middleware de autorización RRHH |

### Frontend
| Archivo | Descripción |
|---|---|
| `src/layout/RRHHLayout.jsx` | Layout protegido para rol RRHH |
| `src/components/RRHHSidebar.jsx` | Sidebar con menú Gestión RRHH |
| `src/views/VacantesAdmin.jsx` | CRUD de posiciones abiertas |
| `src/views/RRHHConfig.jsx` | Configuración video e imagen |

## Archivos a modificar

### Backend
| Archivo | Cambio |
|---|---|
| `routes/api.php` | Agregar rutas RRHH + mover leads-rrhh a middleware IsRRHH |
| `app/Http/Kernel.php` | Registrar middleware IsRRHH |
| `app/Http/Controllers/SettingController.php` | Incluir campos rrhh en respuesta |
| `app/Http/Controllers/UserController.php` | Permitir actualizar campo `rol` |

### Frontend
| Archivo | Cambio |
|---|---|
| `src/Router.jsx` | Agregar rutas `/rrhh-dash/*` |
| `src/hooks/useAuth.js` | Redirección para rol RRHH post-login |
| `src/context/Provider.jsx` | Agregar `rrhh_video` y `rrhh_imagen` al contexto |
| `src/components/TrabajaConNosotros.jsx` | Vacantes dinámicas desde API |
| `src/views/Usuarios/Pacientes/Paciente.jsx` | Campo selector de rol |

---

## Orden de implementación recomendado

### Fase 1 — Backend (2–3 hs)
1. Migración `vacantes` + `rrhh` en settings → `php artisan migrate`
2. Modelo `Vacante`
3. `VacanteController` completo
4. Middleware `IsRRHH` + registro en Kernel
5. `RRHHConfigController`
6. Actualizar `api.php`
7. Actualizar `SettingController` para exponer campos RRHH

### Fase 2 — Frontend panel RRHH (3–4 hs)
8. `RRHHSidebar.jsx`
9. `RRHHLayout.jsx`
10. Agregar rutas en `Router.jsx`
11. Actualizar `useAuth.js` para redirección RRHH
12. `VacantesAdmin.jsx`
13. `RRHHConfig.jsx`

### Fase 3 — Integración página pública (1 hs)
14. Actualizar `Provider.jsx` con campos RRHH
15. Actualizar `TrabajaConNosotros.jsx` con vacantes dinámicas + video/imagen RRHH

### Fase 4 — Gestión de usuarios (1 hs)
16. Agregar selector de rol en formulario de usuarios
17. Probar flujo completo: crear usuario RRHH → login → panel → gestionar vacantes → ver en página pública

---

## Notas técnicas importantes

1. **Seguridad:** El middleware `IsRRHH` permite acceso tanto a admin como a rol rrhh. Las rutas exclusivas de admin completo (`/api/settings`, usuarios, etc.) se mantienen en el grupo `IsAdmin`. El usuario RRHH nunca tiene acceso a configuraciones globales de la app.

2. **Imagen RRHH:** Usar el mismo patrón que `ImagenCorporativaAdmin` (subir a `storage/app/public/rrhh/`, retornar URL pública con `Storage::url()`).

3. **Vacantes vacías:** Si no hay vacantes en la base de datos, `TrabajaConNosotros` mostrará el texto "¿No ves tu perfil? Dejanos tu CV de todas formas ↓" (ya existente).

4. **No romper al admin completo:** El admin sigue accediendo a `leads-rrhh` desde `/admin-dash/leads-rrhh` (ruta existente). El usuario RRHH accede desde `/rrhh-dash/postulaciones`. Ambos usan el mismo componente `LeadsRRHH.jsx`.

5. **Campo `rol` en la DB:** Ya existe en `$fillable` del modelo `User`. Verificar que la columna exista en la tabla (puede necesitar migración si no fue creada inicialmente).
