// Dashboard Page JavaScript
;(() => {
  let sidebarOpen = true
  let lucide // Declare the lucide variable

  // Historial system
  const HISTORIAL_KEY = 'user_historial'
  const MAX_HISTORIAL_ITEMS = 5

  // Get historial from localStorage
  function getHistorial() {
    try {
      const historial = localStorage.getItem(HISTORIAL_KEY)
      return historial ? JSON.parse(historial) : []
    } catch (error) {
      console.error('Error loading historial:', error)
      return []
    }
  }

  // Save historial to localStorage
  function saveHistorial(historial) {
    try {
      localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial))
    } catch (error) {
      console.error('Error saving historial:', error)
    }
  }

  // Add item to historial
  function addToHistorial(module, option) {
    const historial = getHistorial()
    const newItem = {
      module: module,
      option: option,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }

    // Remove existing item with same module and option
    const filteredHistorial = historial.filter(item => 
      !(item.module === module && item.option === option)
    )

    // Add new item at the beginning
    filteredHistorial.unshift(newItem)

    // Keep only the last MAX_HISTORIAL_ITEMS
    const limitedHistorial = filteredHistorial.slice(0, MAX_HISTORIAL_ITEMS)

    saveHistorial(limitedHistorial)
    updateHistorialDisplay()
  }

  // Update historial display in sidebar
  function updateHistorialDisplay() {
    const historial = getHistorial()
    const historialBadge = document.getElementById('historial-badge')
    const historialItems = document.getElementById('historial-items')
    
    if (historialBadge) {
      historialBadge.textContent = historial.length
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
      `).join('')
      
      // Add click events to historial items
      setupHistorialItemClicks()
    }
  }

  // Initialize historial with sample data
  function initializeHistorial() {
    const historial = getHistorial()
    
    // Only add sample data if historial is empty
    if (historial.length === 0) {
      const sampleData = [
        { module: 'Despacho', option: 'Manifiesto', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), id: Date.now() - 1000 * 60 * 30 },
        { module: 'Básicos', option: 'Autorización', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), id: Date.now() - 1000 * 60 * 60 },
        { module: 'Maestros', option: 'Centro de costos', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), id: Date.now() - 1000 * 60 * 90 },
        { module: 'Calidad', option: 'Auditoría', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), id: Date.now() - 1000 * 60 * 120 },
        { module: 'Mantenimiento', option: 'Orden de trabajo', timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), id: Date.now() - 1000 * 60 * 150 }
      ]
      
      saveHistorial(sampleData)
    }
    
    updateHistorialDisplay()
  }

  // Initialize Lucide icons
  function initIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  // Toggle sidebar
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.getElementById("main-content")
    const toggleIcon = document.getElementById("sidebar-toggle-icon")

    sidebarOpen = !sidebarOpen

    if (sidebarOpen) {
      sidebar.classList.remove("sidebar-closed")
      sidebar.classList.add("sidebar-open")
      mainContent.style.marginLeft = "18rem"
      if (toggleIcon) {
        toggleIcon.setAttribute("data-lucide", "menu")
      }
    } else {
      sidebar.classList.remove("sidebar-open")
      sidebar.classList.add("sidebar-closed")
      mainContent.style.marginLeft = "5rem"
      if (toggleIcon) {
        toggleIcon.setAttribute("data-lucide", "menu")
      }
    }

    initIcons()
  }

  // Load user data
  function loadUserData() {
    const userData = localStorage.getItem("user")
    const costCenter = localStorage.getItem("costCenter")

    if (!userData || !costCenter) {
      // Redirect to login if no user data
      window.location.href = "login.html"
      return
    }

    try {
      const user = JSON.parse(userData)

      // Update welcome message
      const welcomeMessage = document.getElementById("welcome-message")
      if (welcomeMessage && user.username) {
        welcomeMessage.textContent = `¡Bienvenido, ${user.username}!`
      }

      // Update user profile
      const userName = document.getElementById("user-name")
      const userCostCenter = document.getElementById("user-cost-center")
      const userInitial = document.getElementById("user-initial")

      if (userName) userName.textContent = user.username
      if (userCostCenter) userCostCenter.textContent = costCenter
      if (userInitial) userInitial.textContent = user.username.charAt(0).toUpperCase()
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Logout function
  window.logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("costCenter")
    window.location.href = "login.html"
  }

  // Toggle module submodules
  function toggleModule(moduleName) {
    const submodules = document.getElementById(`submodules-${moduleName}`)
    const chevron = document.querySelector(`[data-module="${moduleName}"] .module-chevron`)
    
    if (submodules && chevron) {
      // Check if currently visible (either explicitly set to block or computed style is not none)
      const isVisible = submodules.style.display === 'block' || 
                       (submodules.style.display === '' && window.getComputedStyle(submodules).display !== 'none')
      
      if (isVisible) {
        submodules.style.display = 'none'
        chevron.style.transform = 'rotate(0deg)'
      } else {
        submodules.style.display = 'block'
        chevron.style.transform = 'rotate(90deg)'
      }
    }
  }

  // Setup module toggles
  function setupModuleToggles() {
    const moduleToggles = document.querySelectorAll('.module-toggle')
    console.log('Setting up', moduleToggles.length, 'module toggles')
    moduleToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault()
        const moduleName = toggle.getAttribute('data-module')
        console.log('Clicked module:', moduleName)
        toggleModule(moduleName)
      })
    })
  }

  // Setup historial click tracking for submodules
  function setupHistorialTracking() {
    // Track clicks on submodule links
    const submoduleLinks = document.querySelectorAll('.submodules a')
    submoduleLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        
        // Get module name from parent container
        const submodulesContainer = link.closest('.submodules')
        const moduleContainer = submodulesContainer.closest('.module-container')
        const moduleToggle = moduleContainer.querySelector('.module-toggle')
        const moduleName = moduleToggle.getAttribute('data-module')
        
        // Get option name from link text
        const optionName = link.textContent.trim()
        
        // Add to historial
        addToHistorial(moduleName, optionName)
        
        // Show success message (optional)
        console.log(`Added to historial: ${moduleName} -> ${optionName}`)
      })
    })
  }

  // Setup historial item clicks
  function setupHistorialItemClicks() {
    const historialItems = document.querySelectorAll('.historial-item')
    historialItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault()
        
        const module = item.getAttribute('data-module')
        const option = item.getAttribute('data-option')
        
        // Find and click the corresponding module and option
        const moduleToggle = document.querySelector(`[data-module="${module.toLowerCase()}"]`)
        if (moduleToggle) {
          // Open the module if it's closed
          const submodules = document.getElementById(`submodules-${module.toLowerCase()}`)
          if (submodules && submodules.style.display === 'none') {
            toggleModule(module.toLowerCase())
          }
          
          // Find and click the option
          setTimeout(() => {
            const optionLink = Array.from(document.querySelectorAll('.submodules a')).find(link => 
              link.textContent.trim() === option
            )
            if (optionLink) {
              // Add to historial again (update timestamp)
              addToHistorial(module, option)
              console.log(`Navigated to: ${module} -> ${option}`)
            }
          }, 300)
        }
      })
    })
  }

  // Initialize page
  function init() {
    // Check if user is logged in
    loadUserData()

    // Initialize historial
    initializeHistorial()

    // Setup sidebar toggle
    const toggleBtn = document.getElementById("sidebar-toggle")
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleSidebar)
    }

    // El historial ahora funciona como un módulo normal, no necesita setup especial

    // Initialize icons
    initIcons()

    // Setup module toggles after icons are initialized
    setTimeout(() => {
      setupModuleToggles()
      setupHistorialTracking()
    }, 200)

    // Re-initialize icons after a short delay
    setTimeout(initIcons, 100)

    // Re-initialize icons when Bootstrap dropdowns are shown
    document.addEventListener("shown.bs.dropdown", initIcons)
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
