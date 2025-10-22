// Cost Center Page JavaScript
;(() => {
  // Declare the lucide variable
  const lucide = window.lucide

  // Initialize Lucide icons
  function initIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  // Set loading state
  function setLoading(loading = true) {
    const button = document.getElementById("cost-center-btn")
    const textSpan = document.getElementById("cost-center-btn-text")
    const loadingSpan = document.getElementById("cost-center-btn-loading")

    if (loading) {
      textSpan.classList.add("d-none")
      loadingSpan.classList.remove("d-none")
      button.disabled = true
    } else {
      textSpan.classList.remove("d-none")
      loadingSpan.classList.add("d-none")
      button.disabled = false
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()

    const select = document.getElementById("cost-center")
    const selectedValue = select.value

    if (!selectedValue) {
      alert("Por favor selecciona un centro de costos")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get the selected option text
      const selectedOption = select.options[select.selectedIndex]
      const centerName = selectedOption.text

      // Save cost center to localStorage
      localStorage.setItem("costCenter", centerName)

      // Redirect to dashboard
      window.location.href = "dashboard.html"
    } catch (error) {
      console.error("Error selecting cost center:", error)
      alert("Error al seleccionar el centro de costos")
    } finally {
      setLoading(false)
    }
  }

  // Load user data and check authentication
  function loadUserData() {
    const userData = localStorage.getItem("user")
    if (!userData) {
      // Redirect to login if no user data
      window.location.href = "login.html"
      return
    }

    // Check if 2FA is completed
    const twoFactorVerified = localStorage.getItem("twoFactorVerified")
    if (twoFactorVerified !== "true") {
      // Redirect to 2FA if not verified
      window.location.href = "two-factor-auth.html"
      return
    }

    try {
      const user = JSON.parse(userData)
      const welcomeUsername = document.getElementById("welcome-username")
      if (welcomeUsername && user.username) {
        welcomeUsername.textContent = user.username
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Logout function
  function logout() {
    // Clear all authentication data
    localStorage.removeItem("user")
    localStorage.removeItem("twoFactorVerified")
    localStorage.removeItem("costCenter")
    
    // Redirect to login
    window.location.href = "login.html"
  }

  // Make logout function globally available
  window.logout = logout

  // Initialize page
  function init() {
    // Check if user is logged in
    loadUserData()

    const form = document.getElementById("cost-center-form")
    if (form) {
      form.addEventListener("submit", handleSubmit)
    }

    // Initialize icons
    initIcons()

    // Re-initialize icons after a short delay
    setTimeout(initIcons, 100)
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
