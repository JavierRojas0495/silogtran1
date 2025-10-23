// Forgot Password Page JavaScript
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
    const errorDiv = document.getElementById("forgot-password-error")
    const errorMessage = document.getElementById("error-message")
    const successDiv = document.getElementById("forgot-password-success")
    
    if (errorDiv && errorMessage) {
      errorMessage.textContent = message
      errorDiv.classList.remove("d-none")
      // Hide success message if showing
      if (successDiv) {
        successDiv.classList.add("d-none")
      }
    }
  }

  // Show success message
  function showSuccess(message) {
    const successDiv = document.getElementById("forgot-password-success")
    const successMessage = document.getElementById("success-message")
    const errorDiv = document.getElementById("forgot-password-error")
    
    if (successDiv && successMessage) {
      successMessage.textContent = message
      successDiv.classList.remove("d-none")
      // Hide error message if showing
      if (errorDiv) {
        errorDiv.classList.add("d-none")
      }
    }
  }

  // Hide all messages
  function hideMessages() {
    const errorDiv = document.getElementById("forgot-password-error")
    const successDiv = document.getElementById("forgot-password-success")
    
    if (errorDiv) {
      errorDiv.classList.add("d-none")
    }
    if (successDiv) {
      successDiv.classList.add("d-none")
    }
  }

  // Set loading state
  function setLoading(loading = true) {
    const button = document.getElementById("recover-btn")
    const textSpan = document.getElementById("recover-btn-text")
    const loadingSpan = document.getElementById("recover-btn-loading")

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

  // Validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate form data
  function validateForm(username, email) {
    if (!username || !email) {
      showError("Por favor completa todos los campos")
      return false
    }

    if (username.length < 3) {
      showError("El usuario debe tener al menos 3 caracteres")
      return false
    }

    if (!isValidEmail(email)) {
      showError("Por favor ingresa un correo electrónico válido")
      return false
    }

    return true
  }

  // Simulate email sending
  function simulateEmailSending(username, email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation - in real app, this would check against database
        if (username === "admin" && email === "admin@empresa.com") {
          resolve({
            success: true,
            message: "Instrucciones enviadas correctamente"
          })
        } else {
          reject({
            success: false,
            message: "Usuario o correo electrónico no encontrado en el sistema"
          })
        }
      }, 2000)
    })
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    hideMessages()

    const username = document.getElementById("username").value.trim()
    const email = document.getElementById("email").value.trim().toLowerCase()

    // Validate form
    if (!validateForm(username, email)) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call to send recovery email
      const result = await simulateEmailSending(username, email)
      
      if (result.success) {
        showSuccess(result.message)
        
        // Clear form
        document.getElementById("username").value = ""
        document.getElementById("email").value = ""
        
        // Show additional instructions
        setTimeout(() => {
          showSuccess("Revisa tu correo electrónico y sigue las instrucciones para restablecer tu contraseña. Si no recibes el correo en 5 minutos, revisa tu carpeta de spam.")
        }, 1000)
        
        // Optional: Redirect to login after showing success
        setTimeout(() => {
          if (confirm("¿Deseas volver al login?")) {
            window.location.href = "login.html"
          }
        }, 5000)
      }
    } catch (error) {
      showError(error.message || "Error al enviar las instrucciones. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Auto-focus on username field
  function setInitialFocus() {
    const usernameField = document.getElementById("username")
    if (usernameField) {
      usernameField.focus()
    }
  }

  // Handle Enter key in form fields
  function setupKeyboardNavigation() {
    const usernameField = document.getElementById("username")
    const emailField = document.getElementById("email")
    
    if (usernameField && emailField) {
      usernameField.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          e.preventDefault()
          emailField.focus()
        }
      })
      
      emailField.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          e.preventDefault()
          document.getElementById("forgot-password-form").dispatchEvent(new Event("submit"))
        }
      })
    }
  }

  // Initialize page
  function init() {
    // Setup form
    const form = document.getElementById("forgot-password-form")
    if (form) {
      form.addEventListener("submit", handleSubmit)
    }

    // Setup keyboard navigation
    setupKeyboardNavigation()

    // Set initial focus
    setInitialFocus()

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
