// Login functionality
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  const loginBtn = document.getElementById("login-btn")
  const loginBtnText = document.getElementById("login-btn-text")
  const loginBtnLoading = document.getElementById("login-btn-loading")
  const loginError = document.getElementById("login-error")
  const errorMessage = document.getElementById("error-message")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    // Hide error
    loginError.classList.add("d-none")

    // Show loading
    loginBtnText.classList.add("d-none")
    loginBtnLoading.classList.remove("d-none")
    loginBtn.disabled = true

    // Simulate API call
    setTimeout(() => {
      // Simple validation (in production, this would be a real API call)
      if (username && password) {
        // Store user data
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: username,
            loggedIn: true,
          }),
        )

        // Redirect to cost center selection
        window.location.href = "cost-center.html"
      } else {
        // Show error
        errorMessage.textContent = "Usuario o contraseña incorrectos"
        loginError.classList.remove("d-none")

        // Reset button
        loginBtnText.classList.remove("d-none")
        loginBtnLoading.classList.add("d-none")
        loginBtn.disabled = false
      }
    }, 1500)
  })
})
