/**
 * RemesaManager - Gestión de Remesas
 * Maneja la lógica específica del módulo de Remesas
 */
class RemesaManager {
    constructor() {
        this.remesas = [];
        this.filters = {
            search: '',
            estado: '',
            fechaDesde: '',
            fechaHasta: ''
        };
        this.currentPage = 1;
        this.itemsPerPage = 10;
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.loadRemesas();
        this.updateStats();
        this.setupToast();
    }

    loadUserData() {
        // Cargar datos del usuario desde localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            document.getElementById('user-name').textContent = user.name || 'Admin';
            document.getElementById('user-initial').textContent = (user.name || 'A').charAt(0).toUpperCase();
            document.getElementById('user-cost-center').textContent = user.costCenter || 'Centro Principal';
        }
    }

    setupEventListeners() {
        // Event listeners para filtros
        const searchInput = document.querySelector('input[placeholder*="remesa"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.filterRemesas();
            });
        }

        const estadoSelect = document.querySelector('select');
        if (estadoSelect) {
            estadoSelect.addEventListener('change', (e) => {
                this.filters.estado = e.target.value;
                this.filterRemesas();
            });
        }

        // Event listeners para botones de filtro
        const filterBtn = document.querySelector('button[class*="btn-primary"]');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        const refreshBtn = document.querySelector('button[class*="btn-outline-secondary"]');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
    }

    loadRemesas() {
        // Datos de ejemplo para remesas
        this.remesas = [
            {
                id: 1,
                numero: 'RM-001234',
                cliente: 'Empresa ABC S.A.S',
                fecha: '2024-01-15',
                origen: 'Bogotá',
                destino: 'Medellín',
                estado: 'pendiente',
                peso: 1500,
                valor: 2500000
            },
            {
                id: 2,
                numero: 'RM-001235',
                cliente: 'Transportes XYZ Ltda',
                fecha: '2024-01-16',
                origen: 'Cali',
                destino: 'Barranquilla',
                estado: 'en_proceso',
                peso: 2200,
                valor: 3200000
            },
            {
                id: 3,
                numero: 'RM-001236',
                cliente: 'Logística Nacional',
                fecha: '2024-01-17',
                origen: 'Pereira',
                destino: 'Bucaramanga',
                estado: 'completado',
                peso: 1800,
                valor: 2800000
            },
            {
                id: 4,
                numero: 'RM-001237',
                cliente: 'Distribuidora Central',
                fecha: '2024-01-18',
                origen: 'Manizales',
                destino: 'Cartagena',
                estado: 'pendiente',
                peso: 1200,
                valor: 1900000
            },
            {
                id: 5,
                numero: 'RM-001238',
                cliente: 'Comercial del Sur',
                fecha: '2024-01-19',
                origen: 'Neiva',
                destino: 'Santa Marta',
                estado: 'en_proceso',
                peso: 2100,
                valor: 3100000
            }
        ];

        this.renderRemesas();
    }

    renderRemesas() {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const filteredRemesas = this.getFilteredRemesas();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedRemesas = filteredRemesas.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        paginatedRemesas.forEach(remesa => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border-0" style="padding: 1rem">
                    <span class="fw-semibold" style="color: #143c62">${remesa.numero}</span>
                </td>
                <td class="border-0" style="padding: 1rem">${remesa.cliente}</td>
                <td class="border-0" style="padding: 1rem">${this.formatDate(remesa.fecha)}</td>
                <td class="border-0" style="padding: 1rem">${remesa.origen}</td>
                <td class="border-0" style="padding: 1rem">${remesa.destino}</td>
                <td class="border-0" style="padding: 1rem">
                    <span class="badge rounded-pill" style="background-color: ${this.getEstadoColor(remesa.estado)}; color: white">
                        ${this.getEstadoText(remesa.estado)}
                    </span>
                </td>
                <td class="border-0" style="padding: 1rem">
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary" title="Ver" onclick="remesaManager.viewRemesa(${remesa.id})">
                            <i data-lucide="eye" style="width: 1rem; height: 1rem"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" title="Editar" onclick="remesaManager.editRemesa(${remesa.id})">
                            <i data-lucide="edit" style="width: 1rem; height: 1rem"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="remesaManager.deleteRemesa(${remesa.id})">
                            <i data-lucide="trash-2" style="width: 1rem; height: 1rem"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.updatePagination(filteredRemesas.length);
    }

    getFilteredRemesas() {
        return this.remesas.filter(remesa => {
            const matchesSearch = !this.filters.search || 
                remesa.numero.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                remesa.cliente.toLowerCase().includes(this.filters.search.toLowerCase());
            
            const matchesEstado = !this.filters.estado || remesa.estado === this.filters.estado;
            
            return matchesSearch && matchesEstado;
        });
    }

    filterRemesas() {
        this.currentPage = 1;
        this.renderRemesas();
    }

    applyFilters() {
        const searchInput = document.querySelector('input[placeholder*="remesa"]');
        const estadoSelect = document.querySelector('select');
        const fechaDesdeInput = document.querySelector('input[type="date"]:nth-of-type(1)');
        const fechaHastaInput = document.querySelector('input[type="date"]:nth-of-type(2)');

        if (searchInput) this.filters.search = searchInput.value;
        if (estadoSelect) this.filters.estado = estadoSelect.value;
        if (fechaDesdeInput) this.filters.fechaDesde = fechaDesdeInput.value;
        if (fechaHastaInput) this.filters.fechaHasta = fechaHastaInput.value;

        this.filterRemesas();
        this.showToast('Filtros aplicados correctamente', 'success');
    }

    refreshData() {
        this.loadRemesas();
        this.updateStats();
        this.showToast('Datos actualizados', 'info');
    }

    updateStats() {
        const totalRemesas = this.remesas.length;
        const pendientes = this.remesas.filter(r => r.estado === 'pendiente').length;
        const enProceso = this.remesas.filter(r => r.estado === 'en_proceso').length;
        const completadas = this.remesas.filter(r => r.estado === 'completado').length;

        // Actualizar las estadísticas en la interfaz
        const statsElements = document.querySelectorAll('.stats-card h2');
        if (statsElements.length >= 4) {
            statsElements[0].textContent = totalRemesas;
            statsElements[1].textContent = pendientes;
            statsElements[2].textContent = enProceso;
            statsElements[3].textContent = completadas;
        }
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (paginationContainer) {
            // Actualizar texto de información
            const infoText = document.querySelector('.card-footer .text-muted');
            if (infoText) {
                const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
                const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
                infoText.textContent = `Mostrando ${startItem}-${endItem} de ${totalItems} remesas`;
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO');
    }

    getEstadoColor(estado) {
        const colors = {
            'pendiente': '#f59e0b',
            'en_proceso': '#3b82f6',
            'completado': '#22c55e',
            'cancelado': '#ef4444'
        };
        return colors[estado] || '#6b7280';
    }

    getEstadoText(estado) {
        const texts = {
            'pendiente': 'Pendiente',
            'en_proceso': 'En Proceso',
            'completado': 'Completada',
            'cancelado': 'Cancelada'
        };
        return texts[estado] || estado;
    }

    // CRUD Operations
    viewRemesa(id) {
        const remesa = this.remesas.find(r => r.id === id);
        if (remesa) {
            this.showToast(`Viendo remesa: ${remesa.numero}`, 'info');
            console.log('Ver remesa:', remesa);
        }
    }

    editRemesa(id) {
        const remesa = this.remesas.find(r => r.id === id);
        if (remesa) {
            this.showToast(`Editando remesa: ${remesa.numero}`, 'info');
            console.log('Editar remesa:', remesa);
        }
    }

    deleteRemesa(id) {
        const remesa = this.remesas.find(r => r.id === id);
        if (remesa) {
            if (confirm(`¿Está seguro de eliminar la remesa ${remesa.numero}?`)) {
                this.remesas = this.remesas.filter(r => r.id !== id);
                this.renderRemesas();
                this.updateStats();
                this.showToast(`Remesa ${remesa.numero} eliminada`, 'success');
            }
        }
    }

    // Navigation functions
    navigateToPage(page) {
        console.log(`Navegando a página: ${page}`);
        this.showToast(`Navegando a: ${page}`, 'info');
        
        switch (page) {
            case 'buscar':
                // Implementar búsqueda avanzada
                this.showToast('Abriendo búsqueda avanzada...', 'info');
                break;
            case 'home':
                window.location.href = 'dashboard.html';
                break;
            default:
                this.showToast(`Página ${page} no implementada aún`, 'warning');
        }
    }

    executeProcedure(procedure) {
        console.log(`Ejecutando procedimiento: ${procedure}`);
        this.showToast(`Ejecutando: ${procedure}`, 'info');
        
        switch (procedure) {
            case 'actualiza-detalle':
                this.showToast('Abriendo actualización de detalles...', 'info');
                break;
            case 'agregar-contenedor':
                this.showToast('Abriendo agregar contenedor...', 'info');
                break;
            case 'anulacion':
                this.showToast('Abriendo anulación de remesa...', 'warning');
                break;
            case 'cambio-observacion':
                this.showToast('Abriendo cambio de observación...', 'info');
                break;
            case 'cambio-tarifa':
                this.showToast('Abriendo cambio de tarifa...', 'info');
                break;
            case 'descuento-remesa':
                this.showToast('Abriendo descuento de remesa...', 'info');
                break;
            case 'editar-remesa':
                this.showToast('Abriendo edición de remesa...', 'info');
                break;
            case 'ingreso-bodega':
                this.showToast('Abriendo ingreso a bodega...', 'info');
                break;
            case 'modificar-contenedor':
                this.showToast('Abriendo modificación de contenedor...', 'info');
                break;
            case 'reexpedicion':
                this.showToast('Abriendo reexpedición...', 'info');
                break;
            default:
                this.showToast(`Procedimiento ${procedure} no implementado aún`, 'warning');
        }
    }

    generateReport(report) {
        console.log(`Generando reporte: ${report}`);
        this.showToast(`Generando reporte: ${report}`, 'info');
        
        switch (report) {
            case 'informe-general-control':
                this.showToast('Generando informe general de control...', 'info');
                break;
            case 'informe-general':
                this.showToast('Generando informe general...', 'info');
                break;
            case 'informe-kilos-cliente':
                this.showToast('Generando informe de kilos por cliente...', 'info');
                break;
            case 'informe-tiempo-remesa':
                this.showToast('Generando informe de tiempo de remesa...', 'info');
                break;
            case 'informe-vienes':
                this.showToast('Generando informe de bienes...', 'info');
                break;
            case 'informe-ingreso-bodega':
                this.showToast('Generando informe de ingreso a bodega...', 'info');
                break;
            default:
                this.showToast(`Reporte ${report} no implementado aún`, 'warning');
        }
    }

    // Toast notifications
    setupToast() {
        // Crear contenedor de toast si no existe
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toastId = `toast-${Date.now()}`;
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        
        toast.show();

        // Remover el elemento del DOM después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Logout function
    logout() {
        if (confirm('¿Está seguro de que desea cerrar sesión?')) {
            localStorage.removeItem('userData');
            this.showToast('Cerrando sesión...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }
}

// Initialize the remesa manager when the page loads
let remesaManager;

document.addEventListener('DOMContentLoaded', function() {
    remesaManager = new RemesaManager();
    
    // Make functions globally available
    window.logout = function() {
        remesaManager.logout();
    };
    
    window.navigateToPage = function(page) {
        remesaManager.navigateToPage(page);
    };
    
    window.executeProcedure = function(procedure) {
        remesaManager.executeProcedure(procedure);
    };
    
    window.generateReport = function(report) {
        remesaManager.generateReport(report);
    };
});

// Reinitialize icons when needed
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
