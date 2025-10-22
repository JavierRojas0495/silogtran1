// Cost Center Selection functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user || !user.loggedIn) {
    window.location.href = "login.html"
    return
  }

  // Display username
  document.getElementById("welcome-username").textContent = user.username

  const costCenterForm = document.getElementById("cost-center-form")
  const costCenterBtn = document.getElementById("cost-center-btn")
  const costCenterBtnText = document.getElementById("cost-center-btn-text")
  const costCenterBtnLoading = document.getElementById("cost-center-btn-loading")

  costCenterForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const costCenter = document.getElementById("cost-center").value

    if (!costCenter) {
      alert("Por favor selecciona un centro de costo")
      return
    }

    // Show loading
    costCenterBtnText.classList.add("d-none")
    costCenterBtnLoading.classList.remove("d-none")
    costCenterBtn.disabled = true

    // Store cost center
    const userData = JSON.parse(localStorage.getItem("user"))
    userData.costCenter = costCenter
    localStorage.setItem("user", JSON.stringify(userData))

    // Simulate API call
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1000)
  })
})
