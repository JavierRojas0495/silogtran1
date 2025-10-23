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
        this.searchData = this.initializeSearchData();
        this.currentSearchFilter = 'all';
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.setupSearchFunctionality();
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

    // Search functionality
    initializeSearchData() {
        return {
            pages: [
                { name: 'Buscar', module: 'Búsqueda', description: 'Búsqueda avanzada de remesas y documentos' },
                { name: 'Home', module: 'Principal', description: 'Página principal del dashboard' }
            ],
            procedures: [
                { name: 'Actualiza Detalle', module: 'Remesa', description: 'Modificar detalles de remesas existentes' },
                { name: 'Agregar Contenedor', module: 'Contenedor', description: 'Agregar nuevos contenedores a la remesa' },
                { name: 'Anulación', module: 'General', description: 'Anular remesas y operaciones' },
                { name: 'Cambio Observación', module: 'Remesa', description: 'Modificar observaciones de remesas' },
                { name: 'Cambio Tarifa', module: 'Tarifa', description: 'Modificar tarifas de remesas' },
                { name: 'Descuento Remesa', module: 'Descuento', description: 'Aplicar descuentos a remesas' },
                { name: 'Editar Remesa', module: 'Remesa', description: 'Editar información completa de remesas' },
                { name: 'Ingreso Bodega', module: 'Bodega', description: 'Registrar ingreso a bodega' },
                { name: 'Modificar Contenedor', module: 'Contenedor', description: 'Modificar información de contenedores' },
                { name: 'Reexpedición', module: 'Transporte', description: 'Procesar reexpedición de remesas' }
            ],
            reports: [
                { name: 'Informe General Control', module: 'Control', description: 'Reporte general de control de remesas' },
                { name: 'Informe General', module: 'General', description: 'Reporte general de remesas' },
                { name: 'Informe Kilos Cliente', module: 'Cliente', description: 'Reporte de kilos por cliente' },
                { name: 'Informe Tiempo Remesa', module: 'Tiempo', description: 'Reporte de tiempos de remesas' },
                { name: 'Informe Vienes', module: 'Bienes', description: 'Reporte de bienes transportados' },
                { name: 'Informe Ingreso Bodega', module: 'Bodega', description: 'Reporte de ingresos a bodega' }
            ]
        };
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('remesa-search-input');
        const clearButton = document.getElementById('remesa-clear-search');

        if (searchInput) {
            // Real-time search
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });

            // Focus effects
            searchInput.addEventListener('focus', () => {
                searchInput.style.borderColor = '#143c62';
                searchInput.style.boxShadow = '0 0 0 0.2rem rgba(20, 60, 98, 0.25)';
            });

            searchInput.addEventListener('blur', () => {
                searchInput.style.borderColor = '#d1d5db';
                searchInput.style.boxShadow = 'none';
            });
        }

        // Clear search
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Listen for tab changes
        const tabButtons = document.querySelectorAll('#remesaTabs button[data-bs-toggle="tab"]');
        tabButtons.forEach(button => {
            button.addEventListener('shown.bs.tab', (e) => {
                // Update search filter based on active tab
                const targetTab = e.target.getAttribute('data-bs-target');
                this.updateSearchFilterFromTab(targetTab);
                
                // Re-perform search if there's a current query
                if (searchInput && searchInput.value.trim()) {
                    this.performSearch(searchInput.value);
                }
            });
        });
    }

    updateSearchFilterFromTab(targetTab) {
        switch (targetTab) {
            case '#paginas':
                this.currentSearchFilter = 'pages';
                break;
            case '#procedimientos':
                this.currentSearchFilter = 'procedures';
                break;
            case '#informes':
                this.currentSearchFilter = 'reports';
                break;
            default:
                this.currentSearchFilter = 'pages';
        }
    }

    performSearch(query) {
        if (!query || query.trim().length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchInData(query.trim().toLowerCase());
        this.displaySearchResults(results, query);
    }

    searchInData(query) {
        let searchTargets = [];

        switch (this.currentSearchFilter) {
            case 'pages':
                searchTargets = this.searchData.pages.map(item => ({ ...item, type: 'pages' }));
                break;
            case 'procedures':
                searchTargets = this.searchData.procedures.map(item => ({ ...item, type: 'procedures' }));
                break;
            case 'reports':
                searchTargets = this.searchData.reports.map(item => ({ ...item, type: 'reports' }));
                break;
            default:
                searchTargets = this.searchData.pages.map(item => ({ ...item, type: 'pages' }));
        }

        return searchTargets.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.module.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.getElementById('remesa-search-results');
        const resultsContent = document.getElementById('remesa-search-results-content');

        if (!resultsContainer || !resultsContent) return;

        if (results.length === 0) {
            resultsContent.innerHTML = `
                <div class="text-center py-4">
                    <i data-lucide="search-x" style="width: 3rem; height: 3rem; color: #9ca3af; margin-bottom: 1rem"></i>
                    <p class="text-muted mb-0">No se encontraron resultados para "${query}"</p>
                    <small class="text-muted">Intenta con otros términos de búsqueda</small>
                </div>
            `;
        } else {
            const typeLabels = {
                pages: 'Páginas',
                procedures: 'Procedimientos', 
                reports: 'Informes'
            };

            resultsContent.innerHTML = results.map(item => {
                const type = item.type || this.currentSearchFilter;
                const typeLabel = typeLabels[type] || 'Elemento';
                
                return `
                    <div class="search-result-item p-3 mb-2 border rounded-3" style="border-color: #e5e7eb; transition: all 0.2s ease; cursor: pointer;" 
                         onmouseover="this.style.borderColor='#143c62'; this.style.backgroundColor='#f8f9fa'" 
                         onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='transparent'"
                         onclick="remesaManager.handleSearchResultClick('${item.name}', '${item.module}', '${type}')">
                        <div class="d-flex align-items-start justify-content-between">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="badge" style="background-color: #143c62; color: white; font-size: 0.7rem">${typeLabel}</span>
                                    <h6 class="mb-0 fw-semibold" style="color: #1f2937">${this.highlightText(item.name, query)}</h6>
                                </div>
                                <p class="text-muted mb-1 small">Módulo: <strong>${item.module}</strong></p>
                                <p class="text-muted mb-0 small">${item.description}</p>
                            </div>
                            <div class="flex-shrink-0">
                                <i data-lucide="arrow-right" style="width: 1rem; height: 1rem; color: #6b7280"></i>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        resultsContainer.style.display = 'block';
        this.initializeIcons();
    }

    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: #fef3c7; color: #92400e; padding: 0.1rem 0.2rem; border-radius: 0.25rem">$1</mark>');
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('remesa-search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('remesa-search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideSearchResults();
    }

    handleSearchResultClick(name, module, type) {
        // Show success message
        this.showSearchSuccessMessage(name, type);
        
        // Clear search
        this.clearSearch();
    }

    showSearchSuccessMessage(name, type) {
        const typeLabels = {
            pages: 'Página',
            procedures: 'Procedimiento',
            reports: 'Informe'
        };
        
        const typeLabel = typeLabels[type] || 'Elemento';
        
        this.showToast(`${typeLabel} seleccionado: ${name}`, 'success');
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
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
