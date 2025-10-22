// Dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user || !user.loggedIn) {
    window.location.href = "login.html"
    return
  }

  // Display user info
  document.getElementById("user-name").textContent = user.username
  document.getElementById("user-initial").textContent = user.username.charAt(0).toUpperCase()
  document.getElementById("welcome-message").textContent = `¡Bienvenido, ${user.username}!`

  if (user.costCenter) {
    const costCenterNames = {
      "001": "Centro Principal - Bogotá",
      "002": "Centro Norte - Medellín",
      "003": "Centro Sur - Cali",
      "004": "Centro Costa - Barranquilla",
    }
    document.getElementById("user-cost-center").textContent = costCenterNames[user.costCenter] || "Centro Principal"
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("main-content")

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-collapsed")

    if (sidebar.classList.contains("sidebar-collapsed")) {
      mainContent.style.marginLeft = "5rem"
    } else {
      mainContent.style.marginLeft = "18rem"
    }
  })
})

// Logout function
function logout() {
  localStorage.removeItem("user")
  window.location.href = "login.html"
}
