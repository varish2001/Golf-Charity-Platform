const registerForm = document.getElementById("registerForm");
const messageElement = document.getElementById("message");
const apiBaseUrl = window.APP_CONFIG?.API_BASE_URL || window.location.origin;

const showMessage = (message, isError = true) => {
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#b42318" : "#1f6f5f";
};

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  showMessage("Creating account...", false);

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Registration failed");
      return;
    }

    localStorage.setItem("token", result.data.token);
    localStorage.setItem("apiBaseUrl", apiBaseUrl);
    showMessage("Registration successful. Redirecting...", false);
    window.location.href = "/dashboard.html";
  } catch (error) {
    showMessage("Unable to connect to the server");
  }
});
