# Sistema de Vistas Modulares - Silogtran

## Descripción

Este sistema permite crear vistas modulares para diferentes submódulos del sistema Silogtran, manteniendo la estructura común (navbar, sidebar, etc.) y permitiendo contenido específico para cada módulo.

## Estructura del Sistema

### Archivos Principales

1. **`js/app.js`** - Sistema base común para todas las vistas
2. **`manifest.html`** - Vista específica del submódulo Manifiesto
3. **`manifest.js`** - Lógica específica del submódulo Manifiesto
4. **`dashboard.html`** - Vista principal del dashboard
5. **`dashboard.js`** - Lógica del dashboard

### Características del Sistema

- **Navegación Consistente**: Todas las vistas mantienen el mismo navbar y sidebar
- **Funcionalidad Común**: Sidebar toggle, notificaciones, perfil de usuario
- **Contenido Modular**: Cada submódulo tiene su propio contenido y lógica
- **Sistema de Toast**: Notificaciones consistentes en todas las vistas
- **Gestión de Estado**: Manejo de usuario y sesión centralizado

## Cómo Crear una Nueva Vista

### 1. Crear el Archivo HTML

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Silogtran - [Nombre del Módulo]</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="css/base.css?v=1.2">
    <link rel="stylesheet" href="css/dashboard.css?v=1.2">
</head>
<body>
    <!-- Navbar (copiar desde dashboard.html) -->
    <!-- Sidebar (copiar desde dashboard.html) -->
    
    <!-- Main Content - Contenido específico del módulo -->
    <div id="main-content" class="flex-grow-1" style="margin-left: 18rem; transition: margin-left 0.3s ease; background-color: #f8f9fa; min-height: calc(100vh - 70px)">
        <div class="p-4">
            <!-- Tu contenido específico aquí -->
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/app.js?v=1.2"></script>
    <script src="[nombre-modulo].js?v=1.2"></script>
    <script>
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    </script>
</body>
</html>
```

### 2. Crear el Archivo JavaScript

```javascript
// [Nombre del Módulo] JavaScript
class [NombreModulo]Manager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // Event listeners específicos del módulo
    }

    loadData() {
        // Cargar datos específicos del módulo
    }

    // Métodos específicos del módulo
}

// Inicializar cuando se carga la página
let [nombreModulo]Manager;

document.addEventListener('DOMContentLoaded', function() {
    [nombreModulo]Manager = new [NombreModulo]Manager();
});
```

### 3. Actualizar el Sidebar

En el archivo HTML, actualizar el enlace correspondiente en el sidebar:

```html
<a href="[nombre-modulo].html" class="nav-link d-flex align-items-center gap-2 py-1 px-2 rounded-2 text-decoration-none" style="color: #cbd5e1; font-size: 0.85rem">
    <i data-lucide="circle" style="width: 0.5rem; height: 0.5rem"></i>
    <span>[Nombre del Módulo]</span>
</a>
```

## Funcionalidades Disponibles

### Sistema Base (app.js)

- **Sidebar Toggle**: `silogtranApp.toggleSidebar()`
- **Notificaciones Toast**: `silogtranApp.showToast(message, type, duration)`
- **Navegación**: `silogtranApp.navigateTo(view)`
- **Logout**: `silogtranApp.logout()`
- **API Calls**: `silogtranApp.apiCall(endpoint, method, data)`
- **Utilidades**: Formateo de fechas, moneda, validaciones

### Ejemplo de Uso

```javascript
// Mostrar notificación
silogtranApp.showToast('Operación exitosa', 'success');

// Llamada a API
const data = await silogtranApp.apiCall('/api/manifests', 'GET');

// Formatear fecha
const formattedDate = silogtranApp.formatDate('2024-01-15');

// Formatear moneda
const formattedAmount = silogtranApp.formatCurrency(1500000);
```

## Estructura de Archivos Recomendada

```
silogtran1/
├── js/
│   └── app.js                 # Sistema base común
├── css/
│   ├── base.css              # Estilos base
│   └── dashboard.css         # Estilos del dashboard
├── dashboard.html            # Vista principal
├── dashboard.js              # Lógica del dashboard
├── manifest.html             # Vista de manifiestos
├── manifest.js               # Lógica de manifiestos
├── [modulo].html             # Nueva vista
├── [modulo].js               # Nueva lógica
└── README-VISTAS.md          # Esta documentación
```

## Mejores Prácticas

1. **Reutilizar Componentes**: Usar la estructura común del navbar y sidebar
2. **Consistencia Visual**: Mantener el mismo diseño y colores
3. **Funcionalidad Modular**: Cada módulo debe ser independiente
4. **Manejo de Estado**: Usar el sistema centralizado para usuario y sesión
5. **Notificaciones**: Usar el sistema de toast para feedback al usuario
6. **Responsive**: Asegurar que las vistas funcionen en dispositivos móviles

## Ejemplo Completo: Módulo de Clientes

### clientes.html
```html
<!-- Estructura base con navbar y sidebar -->
<!-- Contenido específico para gestión de clientes -->
```

### clientes.js
```javascript
class ClientesManager {
    constructor() {
        this.clientes = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadClientes();
    }

    setupEventListeners() {
        // Event listeners para clientes
    }

    loadClientes() {
        // Cargar lista de clientes
        silogtranApp.showToast('Clientes cargados', 'success');
    }

    createCliente() {
        // Lógica para crear cliente
    }

    editCliente(id) {
        // Lógica para editar cliente
    }

    deleteCliente(id) {
        // Lógica para eliminar cliente
    }
}

let clientesManager;
document.addEventListener('DOMContentLoaded', function() {
    clientesManager = new ClientesManager();
});
```

Este sistema permite escalar fácilmente el número de módulos manteniendo consistencia y reutilizando código común.
