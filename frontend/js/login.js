const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const messageElement = document.getElementById("message");

const showMessage = (message, isError = true) => {
  messageElement.textContent = message;
  messageElement.className = isError ? "message error-message" : "message success-message";
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const password = formData.get("password");

  window.AppHelpers.setButtonLoading(loginButton, true, "Logging in...");
  showMessage("Logging in...", false);

  try {
    const result = await window.AppHelpers.apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", result.data.token);
    localStorage.setItem("userName", result.data.user.name);

    showMessage("Login successful. Redirecting...", false);
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 800);
  } catch (error) {
    showMessage(error.message || "Unable to connect to the server");
  } finally {
    window.AppHelpers.setButtonLoading(loginButton, false, "Logging in...");
  }
});
