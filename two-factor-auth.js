// Two Factor Authentication Page JavaScript
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
    const errorDiv = document.getElementById("two-factor-error")
    const errorMessage = document.getElementById("error-message")
    if (errorDiv && errorMessage) {
      errorMessage.textContent = message
      errorDiv.classList.remove("d-none")
    }
  }

  // Hide error message
  function hideError() {
    const errorDiv = document.getElementById("two-factor-error")
    if (errorDiv) {
      errorDiv.classList.add("d-none")
    }
  }

  // Set loading state
  function setLoading(loading = true) {
    const button = document.getElementById("verify-btn")
    const textSpan = document.getElementById("verify-btn-text")
    const loadingSpan = document.getElementById("verify-btn-loading")

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

  // Format verification code input
  function formatCodeInput() {
    const input = document.getElementById("verification-code")
    if (input) {
      // Only allow numbers
      input.addEventListener("input", function(e) {
        let value = e.target.value.replace(/\D/g, "") // Remove non-digits
        if (value.length > 6) {
          value = value.substring(0, 6)
        }
        e.target.value = value
      })

      // Auto-submit when 6 digits are entered
      input.addEventListener("input", function(e) {
        if (e.target.value.length === 6) {
          // Small delay to show the complete code
          setTimeout(() => {
            document.getElementById("two-factor-form").dispatchEvent(new Event("submit"))
          }, 300)
        }
      })

      // Handle paste
      input.addEventListener("paste", function(e) {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "")
        if (pastedData.length <= 6) {
          input.value = pastedData
          if (pastedData.length === 6) {
            setTimeout(() => {
              document.getElementById("two-factor-form").dispatchEvent(new Event("submit"))
            }, 300)
          }
        }
      })
    }
  }

  // Resend code functionality
  function setupResendCode() {
    const resendBtn = document.getElementById("resend-code-btn")
    const timerDiv = document.getElementById("resend-timer")
    const countdownSpan = document.getElementById("countdown")
    
    let countdown = 60
    let timer = null

    function startCountdown() {
      resendBtn.style.display = "none"
      timerDiv.classList.remove("d-none")
      countdown = 60
      countdownSpan.textContent = countdown

      timer = setInterval(() => {
        countdown--
        countdownSpan.textContent = countdown

        if (countdown <= 0) {
          clearInterval(timer)
          timerDiv.classList.add("d-none")
          resendBtn.style.display = "inline"
        }
      }, 1000)
    }

    if (resendBtn) {
      resendBtn.addEventListener("click", function() {
        // Simulate sending code
        showSuccessMessage("Código reenviado exitosamente")
        startCountdown()
      })
    }

    // Start countdown on page load
    startCountdown()
  }

  // Show success message
  function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement("div")
    successDiv.className = "alert alert-success d-flex align-items-center fade-in mb-4"
    successDiv.innerHTML = `
      <i data-lucide="check-circle" class="me-2" style="width: 1.25rem; height: 1.25rem"></i>
      <div>${message}</div>
    `
    
    const form = document.getElementById("two-factor-form")
    if (form) {
      form.insertBefore(successDiv, form.firstChild)
      
      // Remove after 3 seconds
      setTimeout(() => {
        successDiv.remove()
      }, 3000)
    }

    // Re-initialize icons for the new element
    initIcons()
  }

  // Generate mock verification code
  function generateMockCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    hideError()

    const code = document.getElementById("verification-code").value.trim()

    if (!code || code.length !== 6) {
      showError("Por favor ingresa un código de 6 dígitos")
      return
    }

    if (!/^\d{6}$/.test(code)) {
      showError("El código debe contener solo números")
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock verification - in real app, this would be an API call
      // For demo purposes, accept any 6-digit code
      if (code.length === 6) {
        // Save 2FA completion to localStorage
        localStorage.setItem("twoFactorVerified", "true")
        
        // Show success message
        showSuccessMessage("Código verificado correctamente")
        
        // Redirect to cost center selection after a short delay
        setTimeout(() => {
          window.location.href = "cost-center.html"
        }, 1500)
      } else {
        showError("Código de verificación incorrecto")
      }
    } catch (error) {
      showError("Error al verificar el código. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Set welcome username
  function setWelcomeUsername() {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        const userData = JSON.parse(user)
        const welcomeElement = document.getElementById("welcome-username")
        if (welcomeElement && userData.username) {
          welcomeElement.textContent = userData.username
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }

  // Check if user is logged in
  function checkAuth() {
    const user = localStorage.getItem("user")
    if (!user) {
      // Redirect to login if no user data
      window.location.href = "login.html"
      return
    }

    const twoFactorVerified = localStorage.getItem("twoFactorVerified")
    if (twoFactorVerified === "true") {
      // Already verified, redirect to cost center
      window.location.href = "cost-center.html"
      return
    }
  }

  // Initialize page
  function init() {
    // Check authentication
    checkAuth()

    // Set welcome username
    setWelcomeUsername()

    // Setup form
    const form = document.getElementById("two-factor-form")
    if (form) {
      form.addEventListener("submit", handleSubmit)
    }

    // Setup code input formatting
    formatCodeInput()

    // Setup resend code functionality
    setupResendCode()

    // Initialize icons
    initIcons()

    // Focus on code input
    const codeInput = document.getElementById("verification-code")
    if (codeInput) {
      codeInput.focus()
    }

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
