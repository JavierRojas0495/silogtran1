// Dashboard Page JavaScript
class DashboardManager {
  constructor() {
    this.sidebarOpen = true;
    this.HISTORIAL_KEY = 'user_historial';
    this.MAX_HISTORIAL_ITEMS = 5;
    this.searchData = this.initializeSearchData();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.loadUserData();
    this.initializeHistorial();
    this.setupEventListeners();
    // Don't setup module toggles here - they're handled by app.js
    this.setupHistorialTracking();
    this.setupSearchFunctionality();
    this.initializeIcons();
  }

  setupEventListeners() {
    // Sidebar toggle
    const toggleBtn = document.getElementById("sidebar-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", this.toggleSidebar.bind(this));
    }

    // Re-initialize icons when Bootstrap dropdowns are shown
    document.addEventListener("shown.bs.dropdown", this.initializeIcons.bind(this));
  }

  // Get historial from localStorage
  getHistorial() {
    try {
      const historial = localStorage.getItem(this.HISTORIAL_KEY);
      return historial ? JSON.parse(historial) : [];
    } catch (error) {
      console.error('Error loading historial:', error);
      return [];
    }
  }

  // Save historial to localStorage
  saveHistorial(historial) {
    try {
      localStorage.setItem(this.HISTORIAL_KEY, JSON.stringify(historial));
    } catch (error) {
      console.error('Error saving historial:', error);
    }
  }

  // Add item to historial
  addToHistorial(module, option) {
    const historial = this.getHistorial();
    const newItem = {
      module: module,
      option: option,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    // Remove existing item with same module and option
    const filteredHistorial = historial.filter(item => 
      !(item.module === module && item.option === option)
    );

    // Add new item at the beginning
    filteredHistorial.unshift(newItem);

    // Keep only the last MAX_HISTORIAL_ITEMS
    const limitedHistorial = filteredHistorial.slice(0, this.MAX_HISTORIAL_ITEMS);

    this.saveHistorial(limitedHistorial);
    this.updateHistorialDisplay();
  }

  // Update historial display in sidebar
  updateHistorialDisplay() {
    const historial = this.getHistorial();
    const historialBadge = document.getElementById('historial-badge');
    const historialItems = document.getElementById('historial-items');
    
    if (historialBadge) {
      historialBadge.textContent = historial.length;
    }
    
    if (historialItems) {
      historialItems.innerHTML = historial.map(item => `
        <a href="#" class="nav-link d-flex align-items-center gap-2 py-1 px-2 rounded-2 text-decoration-none historial-item" 
           style="color: #cbd5e1; font-size: 0.85rem" 
           data-module="${item.module}" 
           data-option="${item.option}">
          <i data-lucide="circle" style="width: 0.5rem; height: 0.5rem"></i>
          <span>${item.module} → ${item.option}</span>
        </a>
      `).join('');
      
      // Add click events to historial items
      this.setupHistorialItemClicks();
    }
  }

  // Initialize historial with sample data
  initializeHistorial() {
    const historial = this.getHistorial();
    
    // Only add sample data if historial is empty
    if (historial.length === 0) {
      const sampleData = [
        { module: 'Despacho', option: 'Manifiesto', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), id: Date.now() - 1000 * 60 * 30 },
        { module: 'Básicos', option: 'Autorización', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), id: Date.now() - 1000 * 60 * 60 },
        { module: 'Maestros', option: 'Centro de costos', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), id: Date.now() - 1000 * 60 * 90 },
        { module: 'Calidad', option: 'Auditoría', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), id: Date.now() - 1000 * 60 * 120 },
        { module: 'Mantenimiento', option: 'Orden de trabajo', timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), id: Date.now() - 1000 * 60 * 150 }
      ];
      
      this.saveHistorial(sampleData);
    }
    
    this.updateHistorialDisplay();
  }

  // Initialize Lucide icons
  initializeIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  // Toggle sidebar
  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("main-content");
    const toggleIcon = document.getElementById("sidebar-toggle-icon");

    this.sidebarOpen = !this.sidebarOpen;

    if (this.sidebarOpen) {
      sidebar.classList.remove("sidebar-closed");
      sidebar.classList.add("sidebar-open");
      mainContent.style.marginLeft = "18rem";
      if (toggleIcon) {
        toggleIcon.setAttribute("data-lucide", "menu");
      }
    } else {
      sidebar.classList.remove("sidebar-open");
      sidebar.classList.add("sidebar-closed");
      mainContent.style.marginLeft = "5rem";
      if (toggleIcon) {
        toggleIcon.setAttribute("data-lucide", "menu");
      }
    }

    this.initializeIcons();
  }

  // Load user data
  loadUserData() {
    const userData = localStorage.getItem("user");
    const costCenter = localStorage.getItem("costCenter");

    if (!userData || !costCenter) {
      // Redirect to login if no user data
      window.location.href = "login.html";
      return;
    }

    try {
      const user = JSON.parse(userData);

      // Update welcome message
      const welcomeMessage = document.getElementById("welcome-message");
      if (welcomeMessage && user.username) {
        welcomeMessage.textContent = `¡Bienvenido, ${user.username}!`;
      }

      // Update user profile
      const userName = document.getElementById("user-name");
      const userCostCenter = document.getElementById("user-cost-center");
      const userInitial = document.getElementById("user-initial");

      if (userName) userName.textContent = user.username;
      if (userCostCenter) userCostCenter.textContent = costCenter;
      if (userInitial) userInitial.textContent = user.username.charAt(0).toUpperCase();
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }


  // Setup historial click tracking for submodules
  setupHistorialTracking() {
    // Track clicks on submodule links
    const submoduleLinks = document.querySelectorAll('.submodules a');
    submoduleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Only prevent default for links without valid href (placeholder links)
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();
          
          // Get module name from parent container
          const submodulesContainer = link.closest('.submodules');
          const moduleContainer = submodulesContainer.closest('.module-container');
          const moduleToggle = moduleContainer.querySelector('.module-toggle');
          const moduleName = moduleToggle.getAttribute('data-module');
          
          // Get option name from link text
          const optionName = link.textContent.trim();
          
          // Add to historial
          this.addToHistorial(moduleName, optionName);
          
          // Show success message (optional)
          console.log(`Added to historial: ${moduleName} -> ${optionName}`);
        } else {
          // For valid links, just add to historial but don't prevent navigation
          const submodulesContainer = link.closest('.submodules');
          const moduleContainer = submodulesContainer.closest('.module-container');
          const moduleToggle = moduleContainer.querySelector('.module-toggle');
          const moduleName = moduleToggle.getAttribute('data-module');
          const optionName = link.textContent.trim();
          
          // Add to historial
          this.addToHistorial(moduleName, optionName);
          console.log(`Navigating to: ${href} and added to historial: ${moduleName} -> ${optionName}`);
        }
      });
    });
  }

  // Setup historial item clicks
  setupHistorialItemClicks() {
    const historialItems = document.querySelectorAll('.historial-item');
    historialItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const module = item.getAttribute('data-module');
        const option = item.getAttribute('data-option');
        
        // Find and click the corresponding module and option
        const moduleToggle = document.querySelector(`[data-module="${module.toLowerCase()}"]`);
        if (moduleToggle) {
          // Open the module if it's closed using app.js system
          const submodules = document.getElementById(`submodules-${module.toLowerCase()}`);
          if (submodules && submodules.style.display === 'none') {
            if (silogtranApp && silogtranApp.toggleModule) {
              silogtranApp.toggleModule(module.toLowerCase());
            }
          }
          
          // Find and click the option
          setTimeout(() => {
            const optionLink = Array.from(document.querySelectorAll('.submodules a')).find(link => 
              link.textContent.trim() === option
            );
            if (optionLink) {
              // Add to historial again (update timestamp)
              this.addToHistorial(module, option);
              console.log(`Navigated to: ${module} -> ${option}`);
            }
          }, 300);
        }
      });
    });
  }

  // Initialize search data structure
  initializeSearchData() {
    return {
      pages: [
        { name: 'Buscar', module: 'Búsqueda', description: 'Página de búsqueda general' },
        { name: 'Home', module: 'Principal', description: 'Página principal del sistema' },
        { name: 'Dashboard', module: 'Principal', description: 'Panel de control principal' },
        { name: 'Login', module: 'Autenticación', description: 'Página de inicio de sesión' },
        { name: 'Perfil', module: 'Usuario', description: 'Gestión de perfil de usuario' },
        { name: 'Configuración', module: 'Sistema', description: 'Configuración del sistema' }
      ],
      procedures: [
        { name: 'Adicion Remesa', module: 'Despacho', description: 'Procedimiento para agregar remesas' },
        { name: 'Crear Manifiesto', module: 'Despacho', description: 'Procedimiento para crear manifiestos' },
        { name: 'Validar Documentos', module: 'Calidad', description: 'Procedimiento de validación de documentos' },
        { name: 'Generar Reporte', module: 'Informes', description: 'Procedimiento para generar reportes' },
        { name: 'Actualizar Inventario', module: 'Inventario', description: 'Procedimiento de actualización de inventario' },
        { name: 'Procesar Pago', module: 'Financiero', description: 'Procedimiento de procesamiento de pagos' },
        { name: 'Asignar Recurso', module: 'Recursos', description: 'Procedimiento de asignación de recursos' },
        { name: 'Auditar Proceso', module: 'Calidad', description: 'Procedimiento de auditoría de procesos' }
      ],
      reports: [
        { name: 'Reporte de Manifiestos', module: 'Despacho', description: 'Informe detallado de manifiestos' },
        { name: 'Estado de Remesas', module: 'Despacho', description: 'Informe del estado de las remesas' },
        { name: 'Indicadores de Calidad', module: 'Calidad', description: 'Informe de indicadores de calidad' },
        { name: 'Balance Financiero', module: 'Financiero', description: 'Informe de balance financiero' },
        { name: 'Inventario Actual', module: 'Inventario', description: 'Informe de inventario actual' },
        { name: 'Rendimiento Operativo', module: 'Operaciones', description: 'Informe de rendimiento operativo' },
        { name: 'Análisis de Costos', module: 'Financiero', description: 'Informe de análisis de costos' },
        { name: 'Estadísticas de Usuario', module: 'Sistema', description: 'Informe de estadísticas de usuarios' }
      ]
    };
  }

  // Setup search functionality
  setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const filterRadios = document.querySelectorAll('input[name="search-filter"]');
    const clearButton = document.getElementById('clear-search');

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
        searchInput.style.borderColor = '#e5e7eb';
        searchInput.style.boxShadow = 'none';
      });
    }

    // Filter change events
    filterRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        const searchValue = searchInput ? searchInput.value : '';
        this.performSearch(searchValue);
      });
    });

    // Clear search
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearSearch();
      });
    }
  }

  // Perform search based on current filter and query
  performSearch(query) {
    if (!query || query.trim().length < 2) {
      this.hideSearchResults();
      return;
    }

    const results = this.searchInData(query.trim().toLowerCase());
    this.displaySearchResults(results, query);
  }

  // Search in the data based on current filter
  searchInData(query) {
    let searchTargets = [];

    switch (this.currentFilter) {
      case 'pages':
        searchTargets = this.searchData.pages;
        break;
      case 'procedures':
        searchTargets = this.searchData.procedures;
        break;
      case 'reports':
        searchTargets = this.searchData.reports;
        break;
      case 'all':
      default:
        searchTargets = [
          ...this.searchData.pages.map(item => ({ ...item, type: 'pages' })),
          ...this.searchData.procedures.map(item => ({ ...item, type: 'procedures' })),
          ...this.searchData.reports.map(item => ({ ...item, type: 'reports' }))
        ];
        break;
    }

    return searchTargets.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.module.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  // Display search results
  displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    const resultsContent = document.getElementById('search-results-content');

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
        const type = item.type || this.currentFilter;
        const typeLabel = typeLabels[type] || 'Elemento';
        
        return `
          <div class="search-result-item p-3 mb-2 border rounded-3" style="border-color: #e5e7eb; transition: all 0.2s ease; cursor: pointer;" 
               onmouseover="this.style.borderColor='#143c62'; this.style.backgroundColor='#f8f9fa'" 
               onmouseout="this.style.borderColor='#e5e7eb'; this.style.backgroundColor='transparent'"
               onclick="dashboardManager.handleSearchResultClick('${item.name}', '${item.module}', '${type}')">
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

  // Highlight matching text in search results
  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background-color: #fef3c7; color: #92400e; padding: 0.1rem 0.2rem; border-radius: 0.25rem">$1</mark>');
  }

  // Hide search results
  hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
    }
  }

  // Clear search
  clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    this.hideSearchResults();
  }

  // Handle search result click
  handleSearchResultClick(name, module, type) {
    // Add to historial
    this.addToHistorial(module, name);
    
    // Show success message
    this.showSearchSuccessMessage(name, type);
    
    // Clear search
    this.clearSearch();
  }

  // Show success message for search result click
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

  // Logout function
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("costCenter");
    window.location.href = "login.html";
  }
}

// Global dashboard manager instance
let dashboardManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  dashboardManager = new DashboardManager();
  
  // Make logout function globally available
  window.logout = function() {
    dashboardManager.logout();
  };
});