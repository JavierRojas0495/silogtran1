// Dashboard Page JavaScript
;(() => {
  let sidebarOpen = true
  let lucide // Declare the lucide variable

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

  // Initialize page
  function init() {
    // Check if user is logged in
    loadUserData()

    // Setup sidebar toggle
    const toggleBtn = document.getElementById("sidebar-toggle")
    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleSidebar)
    }

    // Initialize icons
    initIcons()

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
