// Manifest Module JavaScript
// Sistema de gestión de manifiestos

class ManifestManager {
    constructor() {
        this.manifests = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            status: '',
            dateFrom: '',
            dateTo: ''
        };
        this.searchData = this.initializeSearchData();
        this.currentSearchFilter = 'all';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSearchFunctionality();
        this.loadManifests();
        this.initializeSidebar();
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // Search and filter functionality
        const searchInput = document.querySelector('input[placeholder*="manifiesto"]');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        const statusSelect = document.querySelector('select');
        if (statusSelect) {
            statusSelect.addEventListener('change', this.handleFilterChange.bind(this));
        }

        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('change', this.handleFilterChange.bind(this));
        });

        // Filter button
        const filterBtn = document.querySelector('button:has(i[data-lucide="filter"])');
        if (filterBtn) {
            filterBtn.addEventListener('click', this.applyFilters.bind(this));
        }

        // Refresh button
        const refreshBtn = document.querySelector('button:has(i[data-lucide="refresh-cw"])');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', this.refreshData.bind(this));
        }

        // New manifest button
        const newManifestBtn = document.querySelector('button:has(i[data-lucide="plus"])');
        if (newManifestBtn) {
            newManifestBtn.addEventListener('click', this.createNewManifest.bind(this));
        }

        // Export button
        const exportBtn = document.querySelector('button:has(i[data-lucide="download"])');
        if (exportBtn) {
            exportBtn.addEventListener('click', this.exportManifests.bind(this));
        }

        // Table action buttons
        this.setupTableActions();
    }

    initializeSidebar() {
        // Module toggle functionality
        const moduleToggles = document.querySelectorAll('.module-toggle');
        moduleToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const module = toggle.getAttribute('data-module');
                this.toggleModule(module);
            });
        });

        // Set active state for current module
        this.setActiveModule('despacho');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleIcon = document.getElementById('sidebar-toggle-icon');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('sidebar-open');
            sidebar.classList.toggle('sidebar-closed');
            
            if (sidebar.classList.contains('sidebar-closed')) {
                mainContent.style.marginLeft = '4rem';
                if (toggleIcon) {
                    toggleIcon.setAttribute('data-lucide', 'menu');
                }
            } else {
                mainContent.style.marginLeft = '18rem';
                if (toggleIcon) {
                    toggleIcon.setAttribute('data-lucide', 'x');
                }
            }
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    toggleModule(moduleName) {
        const submodules = document.getElementById(`submodules-${moduleName}`);
        const chevron = document.querySelector(`[data-module="${moduleName}"] .module-chevron`);
        
        if (submodules && chevron) {
            const isOpen = submodules.style.display !== 'none';
            submodules.style.display = isOpen ? 'none' : 'block';
            chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }

    setActiveModule(moduleName) {
        // Open the specified module
        const submodules = document.getElementById(`submodules-${moduleName}`);
        const chevron = document.querySelector(`[data-module="${moduleName}"] .module-chevron`);
        
        if (submodules && chevron) {
            submodules.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
        }
    }

    loadManifests() {
        // Simulate loading manifests data
        this.manifests = [
            {
                id: 'MF-001234',
                client: 'Empresa ABC S.A.S',
                date: '2024-01-15',
                origin: 'Bogotá',
                destination: 'Medellín',
                status: 'pendiente',
                statusText: 'Pendiente'
            },
            {
                id: 'MF-001235',
                client: 'Transportes XYZ Ltda',
                date: '2024-01-16',
                origin: 'Cali',
                destination: 'Barranquilla',
                status: 'en_proceso',
                statusText: 'En Proceso'
            },
            {
                id: 'MF-001236',
                client: 'Logística Nacional',
                date: '2024-01-17',
                origin: 'Pereira',
                destination: 'Bucaramanga',
                status: 'completado',
                statusText: 'Completado'
            },
            {
                id: 'MF-001237',
                client: 'Distribuidora Central',
                date: '2024-01-18',
                origin: 'Cartagena',
                destination: 'Santa Marta',
                status: 'pendiente',
                statusText: 'Pendiente'
            },
            {
                id: 'MF-001238',
                client: 'Carga Express',
                date: '2024-01-19',
                origin: 'Manizales',
                destination: 'Armenia',
                status: 'en_proceso',
                statusText: 'En Proceso'
            }
        ];

        this.renderManifests();
        this.updateStatistics();
    }

    renderManifests() {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;

        const filteredManifests = this.getFilteredManifests();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageManifests = filteredManifests.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        pageManifests.forEach(manifest => {
            const row = this.createManifestRow(manifest);
            tbody.appendChild(row);
        });

        this.updatePagination(filteredManifests.length);
    }

    createManifestRow(manifest) {
        const row = document.createElement('tr');
        
        const statusClass = this.getStatusClass(manifest.status);
        const statusColor = this.getStatusColor(manifest.status);

        row.innerHTML = `
            <td class="border-0" style="padding: 1rem">
                <span class="fw-semibold" style="color: #143c62">${manifest.id}</span>
            </td>
            <td class="border-0" style="padding: 1rem">${manifest.client}</td>
            <td class="border-0" style="padding: 1rem">${this.formatDate(manifest.date)}</td>
            <td class="border-0" style="padding: 1rem">${manifest.origin}</td>
            <td class="border-0" style="padding: 1rem">${manifest.destination}</td>
            <td class="border-0" style="padding: 1rem">
                <span class="badge rounded-pill" style="background-color: ${statusColor}; color: white">${manifest.statusText}</span>
            </td>
            <td class="border-0" style="padding: 1rem">
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-primary" title="Ver" onclick="manifestManager.viewManifest('${manifest.id}')">
                        <i data-lucide="eye" style="width: 1rem; height: 1rem"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" title="Editar" onclick="manifestManager.editManifest('${manifest.id}')">
                        <i data-lucide="edit" style="width: 1rem; height: 1rem"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="manifestManager.deleteManifest('${manifest.id}')">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    }

    getStatusClass(status) {
        const classes = {
            'pendiente': 'warning',
            'en_proceso': 'info',
            'completado': 'success',
            'cancelado': 'danger'
        };
        return classes[status] || 'secondary';
    }

    getStatusColor(status) {
        const colors = {
            'pendiente': '#f59e0b',
            'en_proceso': '#3b82f6',
            'completado': '#22c55e',
            'cancelado': '#ef4444'
        };
        return colors[status] || '#6b7280';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO');
    }

    getFilteredManifests() {
        return this.manifests.filter(manifest => {
            const matchesSearch = !this.filters.search || 
                manifest.id.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                manifest.client.toLowerCase().includes(this.filters.search.toLowerCase());
            
            const matchesStatus = !this.filters.status || manifest.status === this.filters.status;
            
            const matchesDateFrom = !this.filters.dateFrom || new Date(manifest.date) >= new Date(this.filters.dateFrom);
            const matchesDateTo = !this.filters.dateTo || new Date(manifest.date) <= new Date(this.filters.dateTo);

            return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
        });
    }

    updateStatistics() {
        const total = this.manifests.length;
        const pendientes = this.manifests.filter(m => m.status === 'pendiente').length;
        const enProceso = this.manifests.filter(m => m.status === 'en_proceso').length;
        const completados = this.manifests.filter(m => m.status === 'completado').length;

        // Update statistics cards
        const statsCards = document.querySelectorAll('.stats-card h2');
        if (statsCards.length >= 4) {
            statsCards[0].textContent = total;
            statsCards[1].textContent = pendientes;
            statsCards[2].textContent = enProceso;
            statsCards[3].textContent = completados;
        }
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (pagination) {
            // Update pagination info
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            
            const paginationInfo = document.querySelector('.card-footer .text-muted');
            if (paginationInfo) {
                paginationInfo.textContent = `Mostrando ${startItem}-${endItem} de ${totalItems} manifiestos`;
            }

            // Update pagination buttons
            const prevBtn = pagination.querySelector('.page-item:first-child');
            const nextBtn = pagination.querySelector('.page-item:last-child');
            
            if (prevBtn) {
                prevBtn.classList.toggle('disabled', this.currentPage === 1);
            }
            if (nextBtn) {
                nextBtn.classList.toggle('disabled', this.currentPage === totalPages);
            }
        }
    }

    setupTableActions() {
        // This will be called after the table is rendered
        // Action buttons are handled in createManifestRow method
    }

    handleSearch(event) {
        this.filters.search = event.target.value;
        this.currentPage = 1;
        this.renderManifests();
    }

    handleFilterChange(event) {
        const target = event.target;
        if (target.type === 'date') {
            if (target.previousElementSibling?.textContent.includes('Desde')) {
                this.filters.dateFrom = target.value;
            } else {
                this.filters.dateTo = target.value;
            }
        } else if (target.tagName === 'SELECT') {
            this.filters.status = target.value;
        }
        this.currentPage = 1;
        this.renderManifests();
    }

    applyFilters() {
        this.currentPage = 1;
        this.renderManifests();
    }

    refreshData() {
        this.loadManifests();
        this.showToast('Datos actualizados correctamente', 'success');
    }

    createNewManifest() {
        this.showToast('Funcionalidad de nuevo manifiesto en desarrollo', 'info');
        // TODO: Implement new manifest modal/form
    }

    exportManifests() {
        this.showToast('Exportando manifiestos...', 'info');
        // TODO: Implement export functionality
    }

    viewManifest(id) {
        this.showToast(`Viendo manifiesto ${id}`, 'info');
        // TODO: Implement view manifest modal
    }

    editManifest(id) {
        this.showToast(`Editando manifiesto ${id}`, 'info');
        // TODO: Implement edit manifest functionality
    }

    deleteManifest(id) {
        if (confirm(`¿Está seguro de que desea eliminar el manifiesto ${id}?`)) {
            this.manifests = this.manifests.filter(m => m.id !== id);
            this.renderManifests();
            this.updateStatistics();
            this.showToast(`Manifiesto ${id} eliminado correctamente`, 'success');
        }
    }

    showToast(message, type = 'info') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Navigation functions
    navigateToPage(page) {
        console.log('Navigating to page:', page);
        
        switch(page) {
            case 'buscar':
                this.showToast('Abriendo página de búsqueda...', 'info');
                // TODO: Implement search page
                break;
            case 'home':
                window.location.href = 'dashboard.html';
                break;
            default:
                this.showToast(`Navegando a ${page}`, 'info');
        }
    }

    executeProcedure(procedure) {
        console.log('Executing procedure:', procedure);
        
        const procedureNames = {
            'actualizar-manifiesto': 'Actualizar Manifiesto',
            'actualizar-tiempos-remesa': 'Actualizar Tiempos Remesa',
            'adicion-equipo': 'Adición Equipo',
            'adicion-remesa': 'Adición Remesa',
            'adicionar-anticipo-vacio': 'Adicionar Anticipo Vacío',
            'anulacion': 'Anulación',
            'anulacion-anticipo': 'Anulación Anticipo',
            'archivo-operaciones': 'Archivo Operaciones',
            'arreglo-impuesto': 'Arreglo Impuesto',
            'arreglo-impuesto-masivo': 'Arreglo Impuesto Masivo',
            'borrador-equipo': 'Borrador Equipo'
        };

        const procedureName = procedureNames[procedure] || procedure;
        this.showToast(`Ejecutando procedimiento: ${procedureName}`, 'info');
        
        // TODO: Implement actual procedure execution
        // This could open modals, redirect to specific pages, or trigger API calls
    }

    generateReport(report) {
        console.log('Generating report:', report);
        
        const reportNames = {
            'certificado-ingreso': 'Certificado Ingreso',
            'informe-aseguradora': 'Informe Aseguradora',
            'informe-dian': 'Informe DIAN',
            'informe-errores-ministerio': 'Informe Errores Ministerio',
            'informe-general-control': 'Informe General Control',
            'informe-general-gerencia': 'Informe General Gerencia',
            'informe-generar-nuevo': 'Informe Generar Nuevo',
            'informe-general-operacion': 'Informe General Operación'
        };

        const reportName = reportNames[report] || report;
        this.showToast(`Generando informe: ${reportName}`, 'info');
        
        // TODO: Implement actual report generation
        // This could open report modals, trigger PDF generation, or redirect to report pages
    }

    // Search functionality
    initializeSearchData() {
        return {
            pages: [
                { name: 'Buscar', module: 'Búsqueda', description: 'Búsqueda avanzada de manifiestos y documentos' },
                { name: 'Home', module: 'Principal', description: 'Página principal del dashboard' }
            ],
            procedures: [
                { name: 'Actualizar Manifiesto', module: 'Manifiesto', description: 'Modificar información de manifiestos existentes' },
                { name: 'Actualizar Tiempos Remesa', module: 'Remesa', description: 'Gestionar tiempos y fechas de remesas' },
                { name: 'Adición Equipo', module: 'Equipo', description: 'Agregar nuevos equipos al sistema' },
                { name: 'Adición Remesa', module: 'Remesa', description: 'Crear nuevas remesas en el sistema' },
                { name: 'Adicionar Anticipo Vacío', module: 'Anticipo', description: 'Crear anticipos sin contenido inicial' },
                { name: 'Anulación', module: 'General', description: 'Anular documentos y operaciones' },
                { name: 'Anulación Anticipo', module: 'Anticipo', description: 'Cancelar anticipos existentes' },
                { name: 'Archivo Operaciones', module: 'Archivo', description: 'Gestionar archivo de operaciones' },
                { name: 'Arreglo Impuesto', module: 'Impuesto', description: 'Corregir cálculos de impuestos' },
                { name: 'Arreglo Impuesto Masivo', module: 'Impuesto', description: 'Corrección masiva de impuestos' },
                { name: 'Borrador Equipo', module: 'Equipo', description: 'Crear borradores de equipos' }
            ],
            reports: [
                { name: 'Certificado Ingreso', module: 'Certificado', description: 'Generar certificados de ingreso' },
                { name: 'Informe Aseguradora', module: 'Seguros', description: 'Reportes para compañías de seguros' },
                { name: 'Informe DIAN', module: 'DIAN', description: 'Reportes para la DIAN' },
                { name: 'Informe Errores Ministerio', module: 'Ministerio', description: 'Reporte de errores para el ministerio' },
                { name: 'Informe General Control', module: 'Control', description: 'Reporte general de control' },
                { name: 'Informe General Gerencia', module: 'Gerencia', description: 'Reporte ejecutivo para gerencia' },
                { name: 'Informe Generar Nuevo', module: 'Personalizado', description: 'Crear nuevos informes personalizados' },
                { name: 'Informe General Operación', module: 'Operación', description: 'Reporte general de operaciones' }
            ]
        };
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('manifest-search-input');
        const clearButton = document.getElementById('manifest-clear-search');

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
        const tabButtons = document.querySelectorAll('#manifestTabs button[data-bs-toggle="tab"]');
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
        const resultsContainer = document.getElementById('manifest-search-results');
        const resultsContent = document.getElementById('manifest-search-results-content');

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
                         onclick="manifestManager.handleSearchResultClick('${item.name}', '${item.module}', '${type}')">
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
        const resultsContainer = document.getElementById('manifest-search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('manifest-search-input');
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
        
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        successDiv.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        successDiv.innerHTML = `
            <i data-lucide="check-circle" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem"></i>
            <strong>${typeLabel} seleccionado:</strong> ${name}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(successDiv);
        this.initializeIcons();
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Logout functionality
    logout() {
        if (confirm('¿Está seguro de que desea cerrar sesión?')) {
            // Clear any stored data
            localStorage.removeItem('user');
            sessionStorage.clear();
            
            // Redirect to login
            window.location.href = '../login/login.html';
        }
    }
}

// Initialize the manifest manager when the page loads
let manifestManager;

document.addEventListener('DOMContentLoaded', function() {
    manifestManager = new ManifestManager();
    
    // Make functions globally available
    window.logout = function() {
        manifestManager.logout();
    };
    
    window.navigateToPage = function(page) {
        manifestManager.navigateToPage(page);
    };
    
    window.executeProcedure = function(procedure) {
        manifestManager.executeProcedure(procedure);
    };
    
    window.generateReport = function(report) {
        manifestManager.generateReport(report);
    };
});

// Reinitialize icons when needed
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
