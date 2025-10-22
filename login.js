// Login Page JavaScript
;(() => {
  // Declare lucide variable
  const lucide = window.lucide

  // Initialize Lucide icons
  function initIcons() {
    if (typeof lucide !== "undefined") {
      lucide.createIcons()
    }
  }

  // Show error message
  function showError(message) {
    const errorDiv = document.getElementById("login-error")
    const errorMessage = document.getElementById("error-message")
    if (errorDiv && errorMessage) {
      errorMessage.textContent = message
      errorDiv.classList.remove("d-none")
    }
  }

  // Hide error message
  function hideError() {
    const errorDiv = document.getElementById("login-error")
    if (errorDiv) {
      errorDiv.classList.add("d-none")
    }
  }

  // Set loading state
  function setLoading(loading = true) {
    const button = document.getElementById("login-btn")
    const textSpan = document.getElementById("login-btn-text")
    const loadingSpan = document.getElementById("login-btn-loading")

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
    hideError()

    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value.trim()

    if (!username || !password) {
      showError("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock authentication - in real app, this would be an API call
      if (username === "admin" && password === "admin") {
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify({ username }))
        // Clear any previous 2FA verification
        localStorage.removeItem("twoFactorVerified")
        // Redirect to two-factor authentication
        window.location.href = "two-factor-auth.html"
      } else {
        showError("Usuario o contraseña incorrectos")
      }
    } catch (error) {
      showError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Initialize page
  function init() {
    const form = document.getElementById("login-form")
    if (form) {
      form.addEventListener("submit", handleSubmit)
    }

    // Initialize icons
    initIcons()

    // Re-initialize icons after a short delay to ensure all elements are loaded
    setTimeout(initIcons, 100)
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
