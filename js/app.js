// Sistema de Aplicación Modular - Silogtran
// Maneja la navegación y funcionalidad común entre vistas

class SilogtranApp {
    constructor() {
        this.currentView = 'dashboard';
        this.user = this.getUserFromStorage();
        this.init();
    }

    init() {
        this.setupCommonEventListeners();
        this.initializeSidebar();
        this.loadUserInfo();
        this.setupNotifications();
    }

    setupCommonEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // User profile dropdown
        this.setupUserProfile();

        // Notifications
        this.setupNotifications();
    }

    initializeSidebar() {
        // Module toggle functionality
        const moduleToggles = document.querySelectorAll('.module-toggle');
        console.log('Found', moduleToggles.length, 'module toggles in app.js');
        moduleToggles.forEach(toggle => {
            // Remove any existing event listeners to avoid duplicates
            toggle.removeEventListener('click', this.handleModuleToggle);
            toggle.addEventListener('click', this.handleModuleToggle.bind(this));
        });

        // Set active navigation based on current page
        this.setActiveNavigation();
    }

    handleModuleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        const module = e.currentTarget.getAttribute('data-module');
        console.log('Toggling module:', module);
        this.toggleModule(module);
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
            this.reinitializeIcons();
        }
    }

    toggleModule(moduleName) {
        const submodules = document.getElementById(`submodules-${moduleName}`);
        const chevron = document.querySelector(`[data-module="${moduleName}"] .module-chevron`);
        
        console.log('toggleModule called for:', moduleName);
        console.log('submodules element:', submodules);
        console.log('chevron element:', chevron);
        
        if (submodules && chevron) {
            // Check current state more reliably
            const isCurrentlyVisible = submodules.style.display === 'block' || 
                                     (submodules.style.display === '' && window.getComputedStyle(submodules).display !== 'none');
            
            console.log('Current visibility:', isCurrentlyVisible);
            
            if (isCurrentlyVisible) {
                submodules.style.display = 'none';
                chevron.style.transform = 'rotate(0deg)';
                console.log('Closing module:', moduleName);
            } else {
                submodules.style.display = 'block';
                chevron.style.transform = 'rotate(180deg)';
                console.log('Opening module:', moduleName);
            }
        } else {
            console.error('Could not find submodules or chevron for module:', moduleName);
        }
    }

    setActiveNavigation() {
        const currentPage = this.getCurrentPage();
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active-nav-item');
            link.style.backgroundColor = '';
            link.style.color = '#e2e8f0';
        });

        // Set active class based on current page
        if (currentPage === 'dashboard') {
            const dashboardLink = document.querySelector('a[href="dashboard.html"], a[href="#"]:has(i[data-lucide="home"])');
            if (dashboardLink) {
                dashboardLink.classList.add('active-nav-item');
                dashboardLink.style.backgroundColor = 'rgba(255,255,255,0.15)';
                dashboardLink.style.color = 'white';
            }
        } else if (currentPage === 'manifest') {
            const manifestLink = document.querySelector('a[href="manifest.html"]');
            if (manifestLink) {
                manifestLink.classList.add('active-nav-item');
                manifestLink.style.backgroundColor = 'rgba(255,255,255,0.15)';
                manifestLink.style.color = 'white';
            }
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('manifest.html')) return 'manifest';
        if (path.includes('dashboard.html')) return 'dashboard';
        return 'dashboard'; // default
    }

    setupUserProfile() {
        // Load user information
        this.loadUserInfo();
    }

    loadUserInfo() {
        // Get user info from localStorage or session
        const userInfo = this.getUserFromStorage();
        
        if (userInfo) {
            const userName = document.getElementById('user-name');
            const userInitial = document.getElementById('user-initial');
            const userCostCenter = document.getElementById('user-cost-center');
            const welcomeMessage = document.getElementById('welcome-message');

            if (userName) userName.textContent = userInfo.name || 'Admin';
            if (userInitial) userInitial.textContent = (userInfo.name || 'A').charAt(0).toUpperCase();
            if (userCostCenter) userCostCenter.textContent = userInfo.costCenter || 'Centro Principal';
            if (welcomeMessage) welcomeMessage.textContent = `¡Bienvenido, ${userInfo.name || 'Admin'}!`;
        }
    }

    getUserFromStorage() {
        // Try to get user from localStorage first, then sessionStorage
        let user = localStorage.getItem('user');
        if (!user) {
            user = sessionStorage.getItem('user');
        }
        
        if (user) {
            try {
                return JSON.parse(user);
            } catch (e) {
                return { name: 'Admin', costCenter: 'Centro Principal' };
            }
        }
        
        return { name: 'Admin', costCenter: 'Centro Principal' };
    }

    setupNotifications() {
        // Load notifications count and data
        this.loadNotifications();
    }

    loadNotifications() {
        // Simulate notifications data
        const notifications = [
            { id: 1, message: 'Se actualizó la Remesa 001234', type: 'info' },
            { id: 2, message: 'Se creó el manifiesto 005678', type: 'success' },
            { id: 3, message: 'Se confirmó el Manifiesto 009012', type: 'success' },
            { id: 4, message: 'Se debe actualizar los documentos soportes 003456', type: 'warning' }
        ];

        // Update notification badge
        const badge = document.querySelector('.badge.bg-danger');
        if (badge) {
            badge.textContent = notifications.length;
        }

        // Update notification dropdown
        this.updateNotificationDropdown(notifications);
    }

    updateNotificationDropdown(notifications) {
        const dropdown = document.querySelector('.dropdown-menu');
        if (dropdown) {
            const notificationItems = dropdown.querySelectorAll('.dropdown-item');
            notificationItems.forEach((item, index) => {
                if (notifications[index]) {
                    item.innerHTML = `<small>${notifications[index].message}</small>`;
                }
            });
        }
    }

    reinitializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Navigation methods
    navigateTo(view) {
        this.currentView = view;
        // This can be extended for SPA functionality
    }

    // Utility methods
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 'alert-info';
        
        toast.className = `alert ${alertClass} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i data-lucide="${this.getToastIcon(type)}" style="width: 1rem; height: 1rem; margin-right: 0.5rem"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Reinitialize icons for the toast
        this.reinitializeIcons();
        
        setTimeout(() => {
            toast.remove();
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'x-circle',
            'warning': 'alert-triangle',
            'info': 'info'
        };
        return icons[type] || 'info';
    }

    // Logout functionality
    logout() {
        if (confirm('¿Está seguro de que desea cerrar sesión?')) {
            // Clear stored data
            localStorage.removeItem('user');
            sessionStorage.clear();
            
            // Redirect to login
            window.location.href = 'login.html';
        }
    }

    // API methods (can be extended)
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(endpoint, options);
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showToast('Error en la comunicación con el servidor', 'error');
            throw error;
        }
    }

    // Format utilities
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    }

    // Validation utilities
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validateRequired(value) {
        return value && value.trim().length > 0;
    }
}

// Global app instance
let silogtranApp;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    silogtranApp = new SilogtranApp();
    
    // Make logout function globally available
    window.logout = function() {
        silogtranApp.logout();
    };
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SilogtranApp;
}
