const loginForm = document.getElementById("loginForm");
const messageElement = document.getElementById("message");
const apiBaseUrl = window.APP_CONFIG?.API_BASE_URL || window.location.origin;

const showMessage = (message, isError = true) => {
  messageElement.textContent = message;
  messageElement.style.color = isError ? "#b42318" : "#1f6f5f";
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const password = formData.get("password");

  showMessage("Logging in...", false);

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || "Login failed");
      return;
    }

    localStorage.setItem("token", result.data.token);
    localStorage.setItem("userName", result.data.user.name);
    localStorage.setItem("apiBaseUrl", apiBaseUrl);

    showMessage("Login successful. Redirecting...", false);
    window.location.href = "/dashboard.html";
  } catch (error) {
    showMessage("Unable to connect to the server");
  }
});
